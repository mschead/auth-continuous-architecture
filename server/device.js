const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// device = {
//  name: 'reconhecedor_facial',
//  token: 'fsflkjsfqwroiurwjfke'
// }

const JWT_SECRET = 'lalala765';

let devices = [];

const hashPassword = (device) => {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(device.password, salt, (err, hash) => {
      device.password = hash
    });
  });
}

const addDevice = (device) => {
  hashPassword(device);
  device.tokens = []
  devices.push(device);
};

const findDevice = (name, password) => {
  return devices.find((device) => device.name === name && device.password === password);
};

const findDeviceByToken = (token) => {
  return devices.find((device) => device.token === token);
}

const compareDeviceCredentials = (name, password) => {

  return findOne(name).then((device) => {
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
  }).catch((e) => console.log(e));

}

const findOne = (name) => {
  return new Promise((resolve, reject) => {
    let device = devices.find((device) => device.name === name);
    if (!device) {
      reject();
    } else {
      resolve(device);
    }
  })
};

const save = (device) => {
  devices = devices.map((newDevice) => {
    if (device.name === newDevice.name) {
      return device;
    }
    return newDevice;
  });

};

const generateDeviceAuthToken = (device) => {
  var access = 'auth';
  var token = jwt.sign({ _id: device.name, access }, JWT_SECRET).toString();

  device.tokens = device.tokens.concat([{ access, token }]);

  save(device);
  return device;
};

module.exports = {
  addDevice,
  findDevice,
  compareDeviceCredentials,
  generateDeviceAuthToken
}

