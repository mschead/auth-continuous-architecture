const expect = require('expect');
const request = require('supertest');

const { User } = require('./../user');
const { Device } = require('./../device');
const { Service } = require('./../service');
const { app } = require('./../app');
const { createDefaultUser, 
        createDefaultDevice, 
        createDefaultService,
        userData,
        deviceData,
        serviceData } = require('./seed');

beforeEach(createDefaultUser);
beforeEach(createDefaultDevice);
beforeEach(createDefaultService);

describe('POST /user/login', () => {
  it('should login user and return auth token', (done) => {
    request(app)
      .post('/user/login')
      .send({
        username: userData.username,
        password: userData.password
      })
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeTruthy();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(userData._id).then((user) => {
          expect(user.toObject().tokens[1]).toMatchObject({
            access: 'auth',
            token: res.headers['x-auth']
          });
          done();
        }).catch((e) => done(e));
      });
  });

  it('should fail login user auth', (done) => {
    request(app)
      .post('/user/login')
      .send({
        username: userData.username,
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

        User.findById(userData._id).then((user) => {
          expect(user.toObject().tokens).toMatchObject(userData.tokens);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should fail due no user in database', (done) => {
    request(app)
      .post('/user/login')
      .send({
        username: 'fakeuser',
        password: 'fklsdjfosjfosjof'
      })
      .expect(400)
      .expect((res) => {
        expect(res.text).toBe(`User doesn't exists`);
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

describe('DELETE /user/logout', () => {
  it('should logout user and remove the auth token', (done) => {
    request(app)
      .delete('/user/logout')
      .set('x-auth', userData.tokens[0].token)
      .send({})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeFalsy();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(userData._id).then((user) => {
          expect(user.toObject().tokens.find((token) => token.access === 'auth')).toBeFalsy();
          done();
        }).catch((e) => done(e));
      });
  });

});

describe('POST /device', () => {
  it('should create a device for user', (done) => {
    const newDeviceData = {
      name: 'device_002',
      password: 'fjsdfksjoirehr'
    };

    request(app)
      .post('/device')
      .set('x-auth', userData.tokens[0].token)
      .send(newDeviceData)
      .expect(200)
      .expect((res) => {
        expect(res.text).toBe('Success!');
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Device.findByCredentials(newDeviceData.name, newDeviceData.password).then((device) => {
          if (!device) {
            done(`Device doesn't exist!`)
          }
          done();
        }).catch((e) => done(e));
      });
  });

  it('should not create a device due duplicated name', (done) => {
    request(app)
      .post('/device')
      .set('x-auth', userData.tokens[0].token)
      .send(deviceData)
      .expect(400)
      .end(done)
  });

});

describe('POST /service', () => {
  it('should create a service for user', (done) => {
    const newServiceData = {
      name: 'service_002',
      password: 'fjsdfksjoirehr'
    };

    request(app)
      .post('/service')
      .set('x-auth', userData.tokens[0].token)
      .send(newServiceData)
      .expect(200)
      .expect((res) => {
        expect(res.text).toBe('Success!');
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Service.findByCredentials(newServiceData.name, newServiceData.password).then((service) => {
          if (!service) {
            done(`Service doesn't exist!`)
          }
          done();
        }).catch((e) => done(e));
      });
  });

  it('should not create a service due duplicated name', (done) => {
    request(app)
      .post('/service')
      .set('x-auth', userData.tokens[0].token)
      .send(serviceData)
      .expect(400)
      .end(done)
  });

});

describe('POST /user/newpassword', () => {

  it('should not update user password', (done) => {
    request(app)
      .post('/user/newpassword')
      .set('x-auth', userData.tokens[0].token)
      .send({ newPassword: 'newPassword'})
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findByCredentials(userData.username, 'newPassword').then((user) => {
          if (!user) {
            done(`Password was not updated!`)
          }
          done();
        }).catch((e) => done(e));

      });
  });

});