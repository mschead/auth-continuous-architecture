const expect = require('expect');
const request = require('supertest');

const { app } = require('./app');

describe('POST /user/login', () => {
  it('should login user and return auth token', (done) => {
    request(app)
      .post('/user/login')
      .send({
        username: 'first',
        password: 'teste122'
      })
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeTruthy();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        done();
/*         User.findById(users[1]._id).then((user) => {
          expect(user.toObject().tokens[1]).toMatchObject({
            access: 'auth',
            token: res.headers['x-auth']
          });
          done();
        }).catch((e) => done(e)); */
      });
  });
});