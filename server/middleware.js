const { findByToken } = require('./user');
const { Device } = require('./device');

const authenticateUser = (req, res, next) => {
  const token = req.header('x-auth');
  findByToken(token).then((user) => {
    if (!user) {
      return Promise.reject();
    }

    req.user = user;
    req.token = token;
    next();
  }).catch((e) => {
    res.status(401).send(e.message);
  });
};

const authenticateDevice = (req, res, next) => {
  const token = req.header('x-auth');
  Device.findByToken(token).then((device) => {
    if (!device) {
      return Promise.reject();
    }

    req.device = device;
    req.token = token;
    next();
  }).catch((e) => {
    res.status(401).send(e);
  });
}

module.exports = { authenticateUser, authenticateDevice };