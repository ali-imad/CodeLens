import { expect, use } from 'chai';
// @ts-ignore
import chaiHttp from 'chai-http';
import 'mocha';
import { connectToDb, disconnectDB } from '../src/helper';
const chai = use(chaiHttp);
import app from '../src/index';
import mongoose from 'mongoose';
import { User } from '../src/models/User';

const existingUser = {
  username: 'existing-user',
  firstName: 'existing',
  lastName: 'user',
  email: 'existing-user@gmail.com',
  password: 'existing-user',
  role: 'Student',
};

describe('Server file integration testing', () => {
  before(async () => {
    await connectToDb();
    await mongoose.connection.dropDatabase();
    await User.create(existingUser);
  });

  after(async () => {
    await mongoose.connection.dropDatabase();
    await disconnectDB();
  });

  describe('Sanity check /GET route', async () => {
    it('Should return 200 OK', done => {
      chai
        .request(app)
        .get('/')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.exist;
          expect(res).to.have.status(200);
          expect(res.text).to.include('Welcome to CodeLens API');
          done();
        });
    });
  });

  describe('GET /email/:email', () => {
    it('Should return user if email exists - user exists - return 200', done => {
      chai
        .request(app)
        .get(`/email/${existingUser.email}`)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.exist;
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('username', existingUser.username);
          expect(res.body).to.have.property(
            'firstName',
            existingUser.firstName,
          );
          expect(res.body).to.have.property('lastName', existingUser.lastName);
          expect(res.body).to.have.property('email', existingUser.email);
          expect(res.body).to.have.property('role', existingUser.role);
          done();
        });
    });

    it('Should not return user - no user email in DB - return 404', done => {
      const fakeEmail = 'invalid-email@gmail.com';
      chai
        .request(app)
        .get(`/email/${fakeEmail}`)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.exist;
          expect(res).to.have.status(404);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message', 'User not found');
          done();
        });
    });
  });
});
