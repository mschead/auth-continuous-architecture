require('./config');
const { mongoose } = require('./mongoose');

const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const bodyParser = require('body-parser');

const { authenticateUser, authenticateDevice, authenticateService } = require('./middleware');
const { compareCredentials, generateAuthToken } = require('./user');

const { Device } = require('./device');

const { addDeviceToService,
        removeDeviceFromService,
        compareServiceCredentials,
        Service } = require('./service');

const { NDC } = require('./ndc');

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

  const device = new Device({ name, password });
  device.save().then((device) => {
    res.send('Success!');
  }).catch((e) => {
    res.status(400).send(e);
  });

});

app.post('/service', authenticateUser, (req, res) => {
  const name = req.body.name;
  const password = req.body.password;

  const service = new Service({ name, password });
  service.save().then((service) => {
    res.send('Success!');
  }).catch((e) => {
    res.status(400).send(e);
  });

});

app.post('/device/login', async (req, res) => {
  try {
    const device = await Device.findByCredentials(req.body.name, req.body.password);
    const token = await device.generateAuthToken();
    res.header('x-auth', token).send('Success!');
  } catch (e) {
    res.status(400).send(e);
  }
});


require('socketio-auth')(io, {

  authenticate: function (socket, data, callback) {
    Service.findByCredentials(data.username, data.password).then((service) => {
      socket.name = service.name;
      service.devices.forEach((deviceName) => socket.join(deviceName));
      return callback(null, true);
    }).catch((e) => {
      return callback(new Error("User not found"));
    });
  }
});

io.on('connection', (socket) => {

  socket.on('join', (params, callback) => {
    Service.addDeviceToService(socket.name, params.name).then((service) => {
      socket.join(params.name);
      callback();
    }).catch((e) => {
      callback(e.message);
    });
  });

  socket.on('leave', (params, callback) => {
    Service.removeDeviceFromService(socket.name, params.name).then((service) => {
      socket.leave(params.name);
      callback();
    }).catch((e) => {
      callback(e.message);
    });
  });

});

app.post('/device/send', authenticateDevice, (req, res) => {
  const device = req.device;
  const value = req.body.value

  const newNDC = new NDC({
    deviceName: device.name,
    data: value
  });

  newNDC.save((ndc) => {
    io.to(req.device.name).emit('newValue', value);
  });

});

server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});