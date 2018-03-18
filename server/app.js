const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const { authenticateUser, authenticateDevice } = require('./middleware');
const { compareCredentials, generateAuthToken } = require('./user');
const { addDevice, findDevice,
        compareDeviceCredentials, generateDeviceAuthToken } = require('./device');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
const app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(bodyParser.json());
app.use(express.static(publicPath));


app.post('/user/login', (req, res) => {

  compareCredentials(req.body.email, req.body.password).then(() => {
    const token = generateAuthToken();
    res.header('x-auth', token).send();
  }).catch((e) => {
    res.status(400).send(e);
  });

});

app.post('/device', authenticateUser, (req, res) => {
  const name = req.body.name;
  const password = req.body.password;

  addDevice({ name, password });

  res.send('feito');
});

app.post('/device/login', (req, res) => {
  debugger;
  compareDeviceCredentials(req.body.name, req.body.password).then((device) => {
    debugger;
    const token = generateDeviceAuthToken(device);
    res.header('x-auth', token).send();
  }).catch((e) => {
    res.status(400).send(e);
  });
  
});

//app.post('/device/send', authenticateDevice, (req, req) => {
//  // refresh value
//});

app.get('/sockets', (req, res) => {
  console.log(io.sockets.sockets);
  res.send();
});

require('socketio-auth')(io, {
  authenticate: function (socket, data, callback) {
    const device = findDevice(data.username, data.password);

    if (!device)  {
      return callback(new Error("User not found"));
    }
    return callback(null, true);
  }
});

io.on('connection', (socket) => {

  socket.on('join', (params, callback) => {

    // generate a id for each device
    socket.join(params.name);

    callback();
  });

  socket.on('createValue', (data) => {
    socket.broadcast.emit('newValue', data);
    console.log(`Got ${data.value} from device!`);
  });

});

server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});