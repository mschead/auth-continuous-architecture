const expect = require('expect');
const request = require('supertest');

const { User } = require('./user');
const { app } = require('./app');

const { ObjectID } = require('mongodb');

const userData = {
  _id: new ObjectID(),
  username: 'usertest',
  password: 'lkdf59083589'
}

const populateUser = (done) => {
  User.remove({}).then(() => {
    const user = new User(userData);
    return user.save();
  }).then(() => done());
};


beforeEach(populateUser);

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
          expect(user.toObject().tokens[0]).toMatchObject({
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
        expect(res.headers['x-auth']).toBeFalsy();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(userData._id).then((user) => {
          expect(user.toObject().tokens).toMatchObject([]);
          done();
        }).catch((e) => done(e));
      });
  });
});