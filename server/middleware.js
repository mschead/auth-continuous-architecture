const { user } = require('./user');
const { Device, findDeviceByToken } = require('./device');

const authenticateUser = (req, res, next) => {
  const token = req.header('x-auth');

  if (user.tokenData.token === token) {
    req.user = user;
    req.token = token;
    next();
  } else {
    res.status(401).send();
  }
};

const authenticateDevice = (req, res, next) => {
  const token = req.header('x-auth');
  debugger;
  Device.findByToken(token).then((device) => {
    debugger;
    if (!device) {
      return Promise.reject();
    }

    req.device = device;
    req.token = token;
    next();
  }).catch((e) => {
    res.status(401).send();
  });
}

module.exports = { authenticateUser, authenticateDevice };