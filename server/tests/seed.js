const jwt = require('jsonwebtoken');

const { User, JWT_SECRET_USER } = require('./../user');
const { Device, JWT_SECRET_DEVICE } = require('./../device');
const { Service } = require('./../service');

const { ObjectID } = require('mongodb');

const userId = new ObjectID();
const userData = {
  _id: userId,
  username: 'usertest',
  password: 'lkdf59083589',
  tokens: [{
    access: 'auth',
    token: jwt.sign({ _id: userId, access: 'auth'}, JWT_SECRET_USER).toString()
  }]
};

const deviceId = new ObjectID();
const deviceData = {
  _id: deviceId,
  name: 'device_001',
  password: 'jfsdkiw9843fjk',
  tokens: [{
    access: 'auth',
    token: jwt.sign({ _id: deviceId, access: 'auth'}, JWT_SECRET_DEVICE).toString()
  }]  
}

const serviceId = new ObjectID();
const serviceData = {
  _id: serviceId,
  name: 'service_001',
  password: 'fkjsfk9839832'  
}

const createDefaultUser = (done) => {
  User.remove({}).then(() => {
    const user = new User(userData);
    return user.save();
  }).then(() => done());
};

const createDefaultDevice = (done) => {
  Device.remove({}).then(() => {
    const device = new Device(deviceData);
    return device.save();
  }).then(() => done());
};

const createDefaultService = (done) => {
  Service.remove({}).then(() => {
    const service = new Service(serviceData);
    return service.save();
  }).then(() => done());
};

module.exports = { createDefaultUser, createDefaultDevice, 
  createDefaultService, userData, deviceData, serviceData };