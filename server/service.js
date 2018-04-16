const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const { Device } = require('./device');

const ServiceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    unique: true
  },
  password: {
    type: String,
    require: true,
    minlength: 6
  },
  devices: {
    type: [String]
  }
});


ServiceSchema.pre('save', function (next) {
  const service = this;

  if (service.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(service.password, salt, (err, hash) => {
        service.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

ServiceSchema.statics.findByCredentials = function (name, password) {
  var Service = this;

  return Service.findOne({ name }).then((service) => {
    if (!service) {
      return new Promise.reject();
    }

    return new Promise((resolve, reject) => {
      bcrypt.compare(password, service.password, function (err, res) {
        if (res) {
          resolve(service);
        } else {
          reject();
        }
      });
    });
  }).catch(() => {
    throw new Error('Error trying to login!');
  });
};

ServiceSchema.statics.addDeviceToService = function (nameService, nameDevice) {
  var Service = this;

  return Service.findOne({ 'name': nameService }).then((service) => {
    if (!service) {
      throw new Error('No service found');
    }
    return Device.findOne({ 'name': nameDevice }).then((device) => {
      if (!device) {
        throw new Error('No device found');
      }

      service.devices = service.devices.concat(nameDevice);
      service.save().then((service) => {
        return service;
      });
    });
  });
};

ServiceSchema.statics.removeDeviceFromService = function (nameService, nameDevice) {
  var Service = this;

  return Service.findOne({ 'name': nameService }).then((service) => {
    if (!service) {
      throw new Error('No service found');
    }

    return Device.findOne({ 'name': nameDevice }).then((device) => {
      if (!device) {
        throw new Error('No device found');
      }

      service.devices = service.devices.filter((name) => name !== nameDevice);
      service.save().then((service) => {
        return service;
      });
    });
  });
};

const Service = mongoose.model('Service', ServiceSchema);

module.exports = { Service };