import { should, use } from 'chai';
// @ts-ignore
import chaiHttp from 'chai-http';
import 'mocha';

const chai = use(chaiHttp);
const realEmail = 'student@mail.com';
const realPassword = '1234';
const emptyPassword = '';
const emptyEmail = '';
const wrongPassword = '123';
const wrongEmail = 'safasf@gmail.com';

describe('GET / (sanity)', () => {
  it('should return 200 OK', done => {
    chai
      .request('http://localhost:3000')
      .get('/')
      .end((err, res) => {
        should().not.exist(err);
        should().exist(res);
        res.should.have.status(200);
        done();
      });
  });
});

describe('POST /login', () => {
  it('should return 400 Invalid if email is missing', done => {
    chai
      .request('http://localhost:3000')
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
      .request('http://localhost:3000')
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
      .request('http://localhost:3000')
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
      .request('http://localhost:3000')
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
      .request('http://localhost:3000')
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
