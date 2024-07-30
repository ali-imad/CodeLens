import { use, expect } from 'chai';
import chaiHttp from 'chai-http';
import 'mocha';
import { User } from '../../../src/models/User';
import '../../../src/utils/loadEnv';
import app from '../../../src/index';
import { connectToDb, disconnectDB } from '../../../src/helper';
import mongoose from 'mongoose';

const chai = use(chaiHttp);

const validUser = {
  username: 'valid-user',
  firstName: 'valid',
  lastName: 'user',
  email: 'valid-user@gmail.com',
  password: 'valid-user-password',
  role: 'Student',
};

describe('Login Route Integration testing', async () => {
  describe('/GET login route testing - sanity check', () => {
    it('Should return 200 - OK', done => {
      chai
        .request(app)
        .get('/')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.be.an('object').to.have.status(200);
          done();
        });
    });
  });

  describe('/POST login route testing', function () {
    before(async function () {
      await connectToDb();
      await mongoose.connection.dropDatabase();
      await User.create(validUser);
    });

    after(async () => {
      await mongoose.connection.dropDatabase();
      await disconnectDB();
    });

    it('Should allow user login - valid user - return return 200', done => {
      chai
        .request(app)
        .post('/login')
        .send({
          email: 'valid-user@gmail.com',
          password: 'valid-user-password',
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message', 'Login successful.');
          expect(res.body).to.have.property('token').that.is.a('string');
          expect(res.body).to.have.property('username', validUser.username);
          expect(res.body).to.have.property('firstName', validUser.firstName);
          expect(res.body).to.have.property('lastName', validUser.lastName);
          expect(res.body).to.have.property('email', validUser.email);
          expect(res.body).to.have.property('role', validUser.role);
          done();
        });
    });

    it('Should fail user login - invalid user email - return 400', done => {
      chai
        .request(app)
        .post('/login')
        .send({
          email: 'invalid-email@gmail.com',
          password: 'valid-user-password',
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(400);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property(
            'error',
            'Invalid email or password.',
          );
          done();
        });
    });

    it('Should fail user login - invalid user password - return 400 ', done => {
      chai
        .request(app)
        .post('/login')
        .send({
          email: 'valid-user@gmail.com',
          password: 'invalid-user-password',
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(400);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property(
            'error',
            'Invalid email or password.',
          );
          done();
        });
    });

    it('Should fail user login - user email missing - return 400', done => {
      chai
        .request(app)
        .post('/login')
        .send({ email: '', password: 'valid-user-password' })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(400);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property(
            'error',
            'Email and password are required.',
          );
          done();
        });
    });

    it('Should fail user login - missing user password - return 400', done => {
      chai
        .request(app)
        .post('/login')
        .send({ email: 'valid-user@gmail.com', password: '' })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(400);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property(
            'error',
            'Email and password are required.',
          );
          done();
        });
    });
  });
});
