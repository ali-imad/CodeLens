import { should, use } from 'chai';
// @ts-ignore
import chaiHttp from 'chai-http';
import 'mocha';

const chai = use(chaiHttp);

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

  it('should not return 404 Not Found', done => {
    chai
      .request('http://localhost:3000')
      .get('/')
      .end((err, res) => {
        should().not.exist(err);
        should().exist(res);
        res.should.not.have.status(404);
        done();
      });
  });
});

const realEmail = 'student@foo.com';
const fakeEmail = 'AWOOOOOOOOOOOGA@BadEmail.com';
describe('GET /email/:email', () => {
  it('should return 200 OK and the user object if the email exists', done => {
    chai
      .request('http://localhost:3000')
      .get(`/email/${realEmail}`)
      .end((err, res) => {
        should().not.exist(err);
        should().exist(res);
        res.should.have.status(200);
        done();
      });
  });

  it('should return 404 Not Found if the email does not exist', done => {
    chai
      .request('http://localhost:3000')
      .get(`/email/${fakeEmail}`)
      .end((err, res) => {
        should().not.exist(err);
        should().exist(res);
        res.should.have.status(404);
        done();
      });
  });
});
