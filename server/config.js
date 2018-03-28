const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const bodyParser = require('body-parser');

const publicPath = path.join(__dirname, '../public');

const app = express();
app.use(bodyParser.json());
app.use(express.static(publicPath));

let server;
if (process.env.NODE_ENV === 'production') {
	const fs = require('fs');
	
	const options = {};
	options.key = fs.readFileSync('private-key.pem');
	options.cert = fs.readFileSync('labsec.crt');
	options.ca = fs.readFileSync('cert-chain.crt');
	
	server = require('https').createServer(options, app);
} else {
	server = require('http').createServer(app);
}

const io = socketIO(server);

module.exports = { app, io, server }; 

