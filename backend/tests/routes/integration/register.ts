import { expect, use } from 'chai';
import chaiHttp from 'chai-http';
import 'mocha';
import { User } from '../../../src/models/User';
import '../../../src/utils/loadEnv';
import app from '../../../src/index';
import { connectToDb, disconnectDB } from '../../../src/helper';
import mongoose from 'mongoose';

const chai = use(chaiHttp);

const existingUser = {
  username: 'existing-user',
  firstName: 'existing',
  lastName: 'user',
  email: 'existing-user@gmail.com',
  password: 'existing-user',
  role: 'Student',
};

describe('Registration Route Integration Tests- POST', function () {
  before(async function () {
    await connectToDb();
    await mongoose.connection.dropDatabase();
    await User.create(existingUser);
  });

  after(async () => {
    await mongoose.connection.dropDatabase();
    await disconnectDB();
  });

  it('Should allow user registration - new valid user - return 201', done => {
    const newValidUser = {
      username: 'new-registration',
      firstName: 'new',
      lastName: 'registration',
      email: 'new-registration@gmail.com',
      password: 'new-registration',
      role: 'Student',
    };

    chai
      .request(app)
      .post('/register')
      .send(newValidUser)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(201);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property(
          'message',
          'New User Registered Successfully.',
        );
        expect(res.body).to.have.property('username', newValidUser.username);
        expect(res.body).to.have.property('firstName', newValidUser.firstName);
        expect(res.body).to.have.property('lastName', newValidUser.lastName);
        expect(res.body).to.have.property('email', newValidUser.email);
        expect(res.body).to.have.property('role', newValidUser.role);
        done();
      });
  });

  it('Should fail user registration - existing user - return 400', done => {
    chai
      .request(app)
      .post('/register')
      .send(existingUser)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property(
          'error',
          'User already exists with this email.',
        );
        done();
      });
  });

  it('Should fail user registration - invalid user role - return 400', done => {
    const invalidUserRole = {
      username: 'valid-user',
      firstName: 'valid',
      lastName: 'user',
      email: 'valid-user@gmail.com',
      password: 'valid-user',
      role: 'Crocodile',
    };

    chai
      .request(app)
      .post('/register')
      .send(invalidUserRole)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body).has.property('error', 'Invalid user role.');
        done();
      });
  });
});
