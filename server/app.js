const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const { authenticate } = require('./middleware');
const { compareCredentials, generateAuthToken } = require('./user');
const { addDevice } = require('./device');

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

// make this post, just to add a device. isolate the socket creation
app.post('/device', authenticate, (req, res) => {
  const name = req.body.name;
  addDevice({ name });

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
    socket.on('confirm', (data) => {
      console.log(`Connected`);
    });
  });

  res.send('feito');
  
});

server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});