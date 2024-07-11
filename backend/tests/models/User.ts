import { should, use } from 'chai';
// @ts-ignore
import chaiHttp from 'chai-http';
import 'mocha';

const chai = use(chaiHttp);
const baseURL = 'http://localhost:3000';
const realEmail = 'student@mail.com';
const realPassword = '1234';
const emptyPassword = '';
const emptyEmail = '';
const wrongPassword = '123';
const wrongEmail = 'wrongemail@example.com';

describe('User API', () => {
  it('should return 400 Invalid if email is missing', done => {
    chai
      .request(baseURL)
      .post('/login')
      .send({
        email: emptyEmail,
        password: realPassword,
      })
      .end((err, res) => {
        should().not.exist(err);
        should().exist(res);
        res.should.have.status(400);
        done();
      });
  });

  it('should return 400 Invalid if password is missing', done => {
    chai
      .request(baseURL)
      .post('/login')
      .send({
        email: realEmail,
        password: emptyPassword,
      })
      .end((err, res) => {
        should().not.exist(err);
        should().exist(res);
        res.should.have.status(400);
        done();
      });
  });

  it('should return 400 Invalid if invalid User', done => {
    chai
      .request(baseURL)
      .post('/login')
      .send({
        email: wrongEmail,
        password: realPassword,
      })
      .end((err, res) => {
        should().not.exist(err);
        should().exist(res);
        res.should.have.status(400);
        done();
      });
  });

  it('should return 400 Invalid if invalid Password', done => {
    chai
      .request(baseURL)
      .post('/login')
      .send({
        email: realEmail,
        password: wrongPassword,
      })
      .end((err, res) => {
        should().not.exist(err);
        should().exist(res);
        res.should.have.status(400);
        done();
      });
  });

  it('should return 200 Success if good Password', done => {
    chai
      .request(baseURL)
      .post('/login')
      .send({
        email: realEmail,
        password: realPassword,
      })
      .end((err, res) => {
        should().not.exist(err);
        should().exist(res);
        res.should.have.status(200);
        done();
      });
  });
});
