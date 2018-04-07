const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const generateRandomNumber = (length) => {
  return crypto.randomBytes(Math.ceil(length/2)).toString('hex').slice(0, length);
}

const JWT_SECRET_SIZE = 1024;
const JWT_SECRET_TIME = 60 * 1000;
let JWT_SECRET = generateRandomNumber(JWT_SECRET_SIZE);
setInterval(() => {
  JWT_SECRET = crypto.randomBytes(Math.ceil(JWT_SECRET_SIZE/2)).toString('hex').slice(0, JWT_SECRET_SIZE);
}, JWT_SECRET_TIME);

const DeviceSchema = new mongoose.Schema({
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
  const token = jwt.sign({ _id: device._id.toHexString(), access },
                          JWT_SECRET,
                          { expiresIn: '12h'}).toString();

  device.tokens = device.tokens.concat([{ access, token }]);

  return device.save().then(() => {
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

DeviceSchema.methods.removeToken = function (token) {
  const device = this;

  return device.update({
    $pull: {
      tokens: {
        token
      }
    }
  });
};

const Device = mongoose.model('Device', DeviceSchema);

module.exports = { Device };

