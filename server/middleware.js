const { user } = require('./user');
const { device, findDeviceByToken } = require('./device');

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
  const device = findDeviceByToken(token);

  if (device) {
    req.device = device;
    req.token = token;
    next();
  } else {
    res.status(401).send();
  }
}

module.exports = { authenticateUser, authenticateDevice };