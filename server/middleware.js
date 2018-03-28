const { user } = require('./user');
const { Device } = require('./device');

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
  Device.findByToken(token).then((device) => {
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