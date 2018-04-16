const expect = require('expect');
const request = require('supertest');

const { Device } = require('./../device');
const { app, server } = require('./../app');

const { createDefaultDevice,
        createDefaultService,
        deviceData,
        serviceData } = require('./seed');

const ioClient = require('socket.io-client');

beforeEach(createDefaultDevice);
beforeEach(createDefaultService);

describe('Login service via websocket', () => {
  it('should connect', (done) => {
    const _socket = ioClient.connect('http://localhost:8080');
   
    _socket.on('connect', function(data){
      _socket.emit('authentication', { username: serviceData.name, 
                                      password: serviceData.password });

      _socket.on('authenticated', function() {
        done();
        _socket.disconnect();
      });
  
    });
  });

  it('should fail service user auth', (done) => {
    const _socket = ioClient.connect('http://localhost:8080');
   
    _socket.on('connect', function(data){
      _socket.emit('authentication', { username: serviceData.name, 
                                      password: 'fakepassword' });
    
      _socket.on('unauthorized', function(err){
        done();
        _socket.disconnect();
      });
  
    });
  });

  it('should fail due no service in database', (done) => {
    const _socket = ioClient.connect('http://localhost:8080');
   
    _socket.on('connect', function(data){
      _socket.emit('authentication', { username: 'fakeservice', 
                                      password: serviceData.password });
    
      _socket.on('unauthorized', function(err){
        done();
        _socket.disconnect();
      });
  
    });
  });

});

describe('Listening to devices', () => {
  it('should listen to device', (done) => {
    const _socket = ioClient.connect('http://localhost:8080');
   
    _socket.on('connect', function(data){
      _socket.emit('authentication', { username: serviceData.name, 
        password: serviceData.password });

      _socket.on('authenticated', function() {
        _socket.emit('join', { name: deviceData.name }, function (e) {
          if (e) {
            done(`Join wasn't successful`);
            _socket.disconnect();
          } else {
            done();
            _socket.disconnect();
          }

        });
      });
  
    });
  });

  it('should fail listening due no device in database', (done) => {
    const _socket = ioClient.connect('http://localhost:8080');
   
    _socket.on('connect', function(data){
      _socket.emit('authentication', { username: serviceData.name, 
        password: serviceData.password });
        
        _socket.on('authenticated', function() {
          _socket.emit('join', 'fakedevice', function (e) {
            if (e) {
              done();
              _socket.disconnect();
            } else {
              done(`Join was successful`);
              _socket.disconnect();
            }
          });
      });
  
    });
  });

});

describe('Stop listening to devices', () => {
  it('should stop listen to device', (done) => {
    const _socket = ioClient.connect('http://localhost:8080');
   
    _socket.on('connect', function(data){
      _socket.emit('authentication', { username: serviceData.name, 
        password: serviceData.password });

      _socket.on('authenticated', function() {
        _socket.emit('leave', { name: deviceData.name }, function (e) {
          if (e) {
            done(`Leave wasn't successful`);
            _socket.disconnect();
          } else {
            done();
            _socket.disconnect();
          }

        });
      });
  
    });
  });

  it('should fail stop listening due no device in database', (done) => {
    const _socket = ioClient.connect('http://localhost:8080');
   
    _socket.on('connect', function(data) {
      _socket.emit('authentication', { username: serviceData.name, 
        password: serviceData.password });
        
        _socket.on('authenticated', function() {
          _socket.emit('join', 'fakedevice', function (e) {
            if (e) {
              done();
              _socket.disconnect();
            } else {
              done(`Join was successful`);
              _socket.disconnect();
            }
          });
      });
  
    });
  });

});