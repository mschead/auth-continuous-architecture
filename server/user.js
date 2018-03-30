const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'lalala765';
const PASSWORD_NOT_HASHED = '123abc';

let user = {
  _id: 'flksdi23u48kjsdfsn0',
  password: undefined,
  tokenData: {}
};

bcrypt.genSalt(10, (err, salt) => {
  bcrypt.hash(PASSWORD_NOT_HASHED, salt, (err, hash) => {
    user.password = hash
  });
});

const compareCredentials = (email, password) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, user.password, function (err, res) {
      if (res) {
        resolve();
      } else {
        reject();
      }
    });
  });
}

const findByToken = (token) => {
  var decoded;

  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (e) {
    return Promise.reject();
  }

  return new Promise((resolve, reject) => {
    if (user._id === decoded._id && user.tokenData.token === token && user.tokenData.access === 'auth') {
      resolve(user);
    } else {
      resolve();
    }
  });

};

const generateAuthToken = () => {
  var access = 'auth';
  var token = jwt.sign({ _id: user._id, access }, JWT_SECRET).toString();
  user.tokenData = { access, token };
  return token;
};

const removeToken = () => {
  user.tokenData = {}
};

module.exports = {
  findByToken,
  compareCredentials,
  generateAuthToken,
  removeToken
};