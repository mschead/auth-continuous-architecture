const { user } = require('./user');
const { device } = require('./device');

var authenticateUser = (req, res, next) => {
  var token = req.header('x-auth');

  if (user.tokenData.token === token) {
    req.user = user;
    req.token = token;
    next();
  } else {
    res.status(401).send();
  }
};

var authenticateDevice = (req, res, next) => {
  var token = req.header('x-auth');

  if (device.findDeviceByToken(token)) {
    req.device = device;
    req.token = token;
    next();
  } else {
    res.status(401).send();
  }
}

module.exports = { authenticateUser, authenticateDevice };