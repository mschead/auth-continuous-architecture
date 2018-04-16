const expect = require('expect');
const request = require('supertest');

const { Device } = require('./../device');
const { app } = require('./../app');

const { createDefaultDevice,
        createDefaultService,
        deviceData,
        serviceData } = require('./seed');

const ioClient = require('socket.io-client');

beforeEach(createDefaultDevice);
beforeEach(createDefaultService);

describe('POST /device/login', () => {
  it('should login device and return auth token', (done) => {
    request(app)
      .post('/device/login')
      .send({
        name: deviceData.name,
        password: deviceData.password
      })
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeTruthy();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Device.findOne({ name: deviceData.name }).then((device) => {
          expect(device.toObject().tokens[1]).toMatchObject({
            access: 'auth',
            token: res.headers['x-auth']
          });
          done();
        }).catch((e) => done(e));
      });
  });

   it('should fail device user auth', (done) => {
    request(app)
      .post('/device/login')
      .send({
        name: deviceData.name,
        password: 'fklsdjfosjfosjof'
      })
      .expect(400)
      .expect((res) => {
        expect(res.text).toBe(`Password incorrect`);
        expect(res.headers['x-auth']).toBeFalsy();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Device.findById(deviceData._id).then((device) => {
          expect(device.toObject().tokens).toMatchObject(deviceData.tokens);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should fail due no device in database', (done) => {
    request(app)
      .post('/device/login')
      .send({
        name: 'fakedevice',
        password: 'jf384jgerkv'
      })
      .expect(400)
      .expect((res) => {
        expect(res.text).toBe(`Device doesn't exists`);
        expect(res.headers['x-auth']).toBeFalsy();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        done();
      });
  });

});

describe('DELETE /device/logout', () => {
  it('should logout device and remove the auth token', (done) => {
    request(app)
      .delete('/device/logout')
      .set('x-auth', deviceData.tokens[0].token)
      .send({})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeFalsy();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Device.findById(deviceData._id).then((user) => {
          expect(user.toObject().tokens.find((token) => token.access === 'auth')).toBeFalsy();
          done();
        }).catch((e) => done(e));
      });
  });

});

describe('POST /device/send', () => {

  it('should send data to service', (done) => {
      const _socket = ioClient.connect('http://localhost:8080');
      
      _socket.on('connect', function(data) {
        
        _socket.emit('authentication', { username: serviceData.name, 
                                        password: serviceData.password });

        _socket.on('authenticated', function() {
            _socket.emit('join', { name: deviceData.name }, function (e) {
                if (e) {
                  done(e);
                } else {
                  request(app)
                    .post('/device/send')
                    .set('x-auth', deviceData.tokens[0].token)
                    .send({ value: '30' })
                    .expect(200)
                    .expect((res) => {
                      expect(res.text).toBe('Success!');
                    })
                    .end((err, res) => {
                      if (err) {
                        return done(err);
                      }
                    });
                }
              });

            _socket.on('newValue', (data) => {
              if (data.value === '30' && data.device === deviceData.name) {
                  done();
                } else {
                  done('Incorrect data received!');
                }
              });
        });
      });

  });

});