import { expect, use } from 'chai';
import chaiHttp from 'chai-http';
import 'mocha';
import jwt from 'jsonwebtoken';
import '../../../src/utils/loadEnv';
import { User } from '../../../src/models/User';
import app from '../../../src/index';
import { connectToDb, disconnectDB } from '../../../src/helper';
import { JWT_SECRET_KEY } from '../../../src/routes/authToken';
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

describe('AuthToken Route Integratoin Tests', function () {
  before(async () => {
    await connectToDb();
    await mongoose.connection.dropDatabase();
    await User.create(validUser);
  });

  after(async () => {
    await mongoose.connection.dropDatabase();
    await disconnectDB();
  });

  it('Should pass token verification - valid user - return 200 ', done => {
    const validToken = jwt.sign(
      { email: 'valid-user@gmail.com', password: 'valid-user-password' },
      JWT_SECRET_KEY,
      { expiresIn: 3 * 24 * 60 * 60 }, // 3 days
    );

    chai
      .request(app)
      .post('/authToken')
      .send({ token: validToken })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message', 'Valid user');
        expect(res.body).has.property('email', 'valid-user@gmail.com');
        expect(res.body).has.property('password', 'valid-user-password');
        done();
      });
  });

  it('Should fail token verification - invalid password - return 400', done => {
    const invalidPasswrodToken = jwt.sign(
      { email: 'valid-user@gmail.com', password: 'invalid-user-password' },
      JWT_SECRET_KEY,
      { expiresIn: 3 * 24 * 60 * 60 },
    );

    chai
      .request(app)
      .post('/authToken')
      .send({ token: invalidPasswrodToken })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body)
          .to.have.property('message')
          .that.is.a('string')
          .that.equals('Invalid user');
        done();
      });
  });

  it('Should fail token verification - invalid user email - return 400', done => {
    const invalidUserEmail = jwt.sign(
      {
        email: 'invalid-user-email@gmail.com',
        password: 'valid-user-password',
      },
      JWT_SECRET_KEY,
      { expiresIn: 3 * 24 * 60 * 60 },
    );

    chai
      .request(app)
      .post('/authToken')
      .send({ token: invalidUserEmail })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message', 'User does not exist');
        done();
      });
  });

  it('Should fail token verification - empty token - return 500', done => {
    chai
      .request(app)
      .post('/authToken')
      .send({ token: '' })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(500);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property(
          'message',
          'Token verification failed',
        );
        done();
      });
  });

  it('Should fail token verification - no token - return 500', done => {
    chai
      .request(app)
      .post('/authToken')
      .send({})
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(500);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property(
          'message',
          'Token verification failed',
        );
        done();
      });
  });

  it('Should fail token verification - expired token - return 500', done => {
    const expiredToken = jwt.sign(
      { email: 'valid-user@gmail.com', password: 'valid-user-password' },
      JWT_SECRET_KEY,
      { expiresIn: -10 }, // Token already expired
    );

    chai
      .request(app)
      .post('/authToken')
      .send({ token: expiredToken })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(500);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property(
          'message',
          'Token verification failed',
        );
        done();
      });
  });

  it('Should fail token verification - wrong fields in token - return 500', done => {
    const malformedToken = jwt.sign(
      {
        email: 'valid-user@gmail.com',
        invalid_format_password: 'valid-user-password',
      },
      JWT_SECRET_KEY,
      { expiresIn: 3 * 24 * 60 * 60 },
    );

    chai
      .request(app)
      .post('/authToken')
      .send({ token: malformedToken })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(500);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property(
          'message',
          'Token verification failed',
        );
        done();
      });
  });

  it('Should fail token verification - invalid format of token - return 500', done => {
    const invalidFormatToken = {
      invalid_format_email: 'valid-user@gmail.com',
      invalid_format_password: 'valid-user-password',
      JWT_SECRET_KEY,
    };

    chai
      .request(app)
      .post('/authToken')
      .send({ token: invalidFormatToken })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(500);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property(
          'message',
          'Token verification failed',
        );
        done();
      });
  });
});
