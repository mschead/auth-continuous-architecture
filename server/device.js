const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const mongoose = require('mongoose');

const DeviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    unique: true
    // validate: {
    //   validator: validator.isEmail,
    //   message: '{VALUE} is not a valid email'
    // }
  },
  password: {
    type: String,
    require: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      require: true
    },
    token: {
      type: String,
      require: true
    }
  }]
});


const JWT_SECRET = 'lalala765';


DeviceSchema.pre('save', function (next) {
  const device = this;

  if (device.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(device.password, salt, (err, hash) => {
        device.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

DeviceSchema.statics.findByCredentials = function (name, password) {
  var Device = this;

  return Device.findOne({ name }).then((device) => {
    if (!device) {
      return new Promise.reject();
    }

    return new Promise((resolve, reject) => {
      bcrypt.compare(password, device.password, function (err, res) {
        if (res) {
          resolve(device);
        } else {
          reject();
        }
      });
    });
  });
};

DeviceSchema.methods.generateAuthToken = function () {
  var device = this;

  const access = 'auth';
  const token = jwt.sign({ _id: device._id.toHexString(), access }, JWT_SECRET).toString();

  device.tokens = device.tokens.concat([{ access, token }]);

  return device.save().then((device) => {
    return token;
  });
};

DeviceSchema.statics.findByToken = function (token) {
  var Device = this;
  var decoded;

  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (e) {
    return Promise.reject();
  }

  return Device.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
};

const Device = mongoose.model('Device', DeviceSchema);

module.exports = { Device };

