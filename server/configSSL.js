const fs = require('fs');

const options = {};

if (process.env.NODE_ENV === 'production') {
  	options.key = fs.readFileSync('private-key.pem');
  	options.cert = fs.readFileSync('labsec.crt');
  	options.ca = fs.readFileSync('cert-chain.crt');
}

module.exports = { options }; 

