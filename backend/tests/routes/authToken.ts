import { should, use } from 'chai';
// @ts-ignore
import chaiHttp from 'chai-http';
import 'mocha';
// @ts-ignore
import jwt from 'jsonwebtoken';
import '../../src/utils/loadEnv'; // Load environment variables
const chai = use(chaiHttp);

const JWT_SECRET_KEY: string =
  process.env['JWT_SECRET'] || 'default_secret_key';

const realEmail = 'malkeet@gmail.com';
const realPassword = 'malkeet';
const invalidEmail = 'invalidemail@gmail.com';
const invalidPassword = 'malkeet86';

describe('testing authToken', () => {
  it('Should return 200 if user credenntial token is valid', done => {
    const token = jwt.sign(
      { email: realEmail, password: realPassword },
      JWT_SECRET_KEY,
    );
    chai
      .request('http://localhost:3000')
      .post('/authToken')
      .send({
        token,
      })
      .end((err, res) => {
        should().not.exist(err);
        should().exist(res);
        res.should.have.status(200);
        done();
      });
  });

  it('Should return 400 if user is invalid', done => {
    const token = jwt.sign(
      { email: realEmail, password: invalidPassword },
      JWT_SECRET_KEY,
    );
    chai
      .request('http://localhost:3000')
      .post('/authToken')
      .send({
        token,
      })
      .end((err, res) => {
        should().not.exist(err);
        should().exist(res);
        res.should.have.status(400);
        done();
      });
  });

  it('Should return 400 if user does not exist', done => {
    const token = jwt.sign(
      { email: invalidEmail, password: realPassword },
      JWT_SECRET_KEY,
    );
    chai
      .request('http://localhost:3000')
      .post('/authToken')
      .send({
        token,
      })
      .end((err, res) => {
        should().not.exist(err);
        should().exist(res);
        res.should.have.status(400);
        done();
      });
  });

  it('Should return 500 if credentials toke varification fail', done => {
    const token = jwt.sign({ email: realEmail }, JWT_SECRET_KEY);
    chai
      .request('http://localhost:3000')
      .post('/authToken')
      .send({
        token,
      })
      .end((err, res) => {
        should().not.exist(err);
        should().exist(res);
        res.should.have.status(500);
        done();
      });
  });
});
