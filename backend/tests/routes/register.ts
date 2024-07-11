import { should, use } from 'chai';
import chaiHttp from 'chai-http';
import 'mocha';
import { v4 as uuidv4 } from 'uuid';

const chai = use(chaiHttp);

const existingUser = {
  username: 'malkeet',
  firstName: 'Malkeet',
  lastName: 'Singh',
  email: 'malkeet@gmail.com',
  password: 'malkeet',
  role: 'Student',
};

const newUserInvalidRole = {
  username: 'z',
  firstName: 'z',
  lastName: 'z',
  email: 'z@gmail.com',
  password: 'z',
  role: 'Crocodile',
};

const newValidUser = {
  username: `newValidUser-${uuidv4()}`,
  firstName: 'newValidUser',
  lastName: 'newValidUser',
  email: `newValidUser-${uuidv4()}@gmail.com`,
  password: 'ilearntsometingnew',
  role: 'Student',
};

describe('Testing Registration', () => {
  it('Should return 400 if user already exists with this email', done => {
    chai
      .request('http://localhost:3000')
      .post('/register')
      .send(existingUser)
      .end((err, res) => {
        should().not.exist(err);
        should().exist(res);
        res.should.have.status(400);
        done();
      });
  });

  it('Should return 400 if user role is invalid', done => {
    chai
      .request('http://localhost:3000')
      .post('/register')
      .send(newUserInvalidRole)
      .end((err, res) => {
        should().not.exist(err);
        should().exist(res);
        res.should.have.status(400);
        done();
      });
  });
  it('Should return 201 if the user is new and valid', done => {
    chai
      .request('http://localhost:3000')
      .post('/register')
      .send(newValidUser)
      .end((err, res) => {
        should().not.exist(err);
        should().exist(res);
        res.should.have.status(201);
        done();
      });
  });
});
