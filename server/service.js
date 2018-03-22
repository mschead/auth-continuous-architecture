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

const addService = (newService) => {

  return findOne(newService.name).then((service) => {

    if (service) {
      return Promise.reject('Service already exists!');
    }

    hashPassword(newService);
    newService.tokens = []
    newService.devices = ['laser']
  
    services.push(newService);

  });
  
};

const addDeviceToService = (nameService, nameDevice) => {
  findOne(nameService).then((service) => {
    if (!service) {
      throw new Error('No service found');
    }

    service.devices.push(nameDevice);
    save(service);
  });
}

const removeDeviceFromService = (nameService, nameDevice) => {
  findOne(nameService).then((service) => {
    if (!service) {
      throw new Error('No service found');
    }

    service.devices.filter((name) => name !== nameDevice);
    save(service);
  });
}

const findServiceByToken = (token) => {
  return services.find((service) => {
    return service.tokens.find((tokenObject) => tokenObject.token === token);
  });
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
    resolve(service);
  });
};

const save = (service) => {
  services = services.map((newService) => {
    if (service.name === newService.name) {
      return service;
    }
    return newService;
  });

};

module.exports = {
  addService,
  compareServiceCredentials,
  addDeviceToService,
  removeDeviceFromService
}