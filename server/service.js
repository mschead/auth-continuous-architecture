const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// service = {
//  name: 'reconhecedor_facial',
//  password: 'fsflkjsfqwroiurwjfke'
// }

const JWT_SECRET = 'lalala765';

let services = [];

const hashPassword = (service) => {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(service.password, salt, (err, hash) => {
      service.password = hash
    });
  });
}

const addService = (service) => {
  hashPassword(service);
  service.tokens = []
  services.push(service);
};

const findServiceByToken = (token) => {
  return services.find((service) => service.token === token);
}

const compareServiceCredentials = (name, password) => {

  return findOne(name).then((service) => {
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
  }).catch((e) => {
    throw new Error('error');
  });

}

const findOne = (name) => {
  return new Promise((resolve, reject) => {
    let service = services.find((service) => service.name === name);
    if (!service) {
      reject();
    } else {
      resolve(service);
    }
  })
};

/* const findOne = (name) => {
  return new Promise((resolve, reject) => {
    let device = devices.find((device) => device.name === name);
    if (!device) {
      reject();
    }
    resolve(device);
  })
}; */

const save = (service) => {
  services = services.map((newService) => {
    if (service.name === newService.name) {
      return service;
    }
    return newService;
  });

};

/* const generateServiceAuthToken = (service) => {
  var access = 'auth';
  var token = jwt.sign({ _id: service.name, access }, JWT_SECRET).toString();

  service.tokens = service.tokens.concat([{ access, token }]);

  save(service);
  return service;
}; */

module.exports = {
  addService,
  compareServiceCredentials
}