const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'lalala765';
const PASSWORD_NOT_HASHED = '123abc';

let user = {
  _id: '2018yes',
  // email: 'marcos@gmail.com',
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

const generateAuthToken = () => {
  var access = 'auth';
  var token = jwt.sign({ _id: user._id, access }, JWT_SECRET);
  user.tokenData = { access, token };
  return token;
};

module.exports = {
  user,
  compareCredentials,
  generateAuthToken
};