const { user } = require('./user');

var authenticate = (req, res, next) => {
  var token = req.header('x-auth');

  if (user.tokenData.token === token) {
    req.user = user;
    req.token = token;
    next();
  } else {
    res.status(401).send();
  }
};

module.exports = { authenticate };