const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const { authenticate } = require('./middleware');
const { compareCredentials, generateAuthToken } = require('./user');

const publicPath = path.join(__dirname, 'public');
const port = process.env.PORT || 3000;
const app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(bodyParser.json());
app.use(express.static(publicPath));


app.post('/user/login', (req, res) => {

  compareCredentials(req.body.email, req.body.password).then(() => {
      const token = generateAuthToken();
      res.header('x-auth', token).send();
       
      io.on('connection', (socket) => {
        socket.on('confirm', () => {
          console.log('got it!');
        });
      });

  }).catch((e) => {
    res.status(400).send(e);
  });

});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});