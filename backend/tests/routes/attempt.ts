import { expect, should, use } from 'chai';
// @ts-ignore
import chaiHttp from 'chai-http';
import 'mocha';
import { cleanGenCodeWithToken, END_TOKEN, START_TOKEN } from '../../src/utils/codeGen';

const chai = use(chaiHttp);
const realPID = '66737f4f5decb739513a3857';
const realUID = '668ea285cf364cd807952bd2';

describe('POST /attempt', () => {
  it('should return 400 Invalid when inputting an object with an invalid problemId', done => {
    chai
      .request('http://localhost:3000')
      .post('/attempts')
      .send({
        problemId: 'invalidId',
        userId: realUID,
        description: 'This is a test description',
      })
      .end((err, res) => {
        should().not.exist(err);
        should().exist(res);
        res.should.have.status(400);
        done();
      });
  });

  it('should return 400 Invalid when inputting an object with an invalid userId', done => {
    chai
      .request('http://localhost:3000')
      .post('/attempts')
      .send({
        problemId: realPID,
        userId: 'invalidUid',
        description: 'This is a test description',
      })
      .end((err, res) => {
        should().not.exist(err);
        should().exist(res);
        res.should.have.status(400);
        done();
      });
  });

  it('should return 201 OK when inputting an object with a valid problemId and userId', done => {
    chai
      .request('http://localhost:3000')
      .post('/attempts')
      .send({
        problemId: realPID,
        userId: realUID,
        description: 'This is a test description',
      })
      .end((err, res) => {
        should().not.exist(err);
        should().exist(res);
        res.should.have.status(201);
        done();
      });
  });
});

describe('GET /attempts', () => {
  it('should return 200 OK and return all attempts', done => {
    chai
      .request('http://localhost:3000')
      .get('/attempts')
      .end((err, res) => {
        should().not.exist(err);
        should().exist(res);
        should().exist(res.body);
        res.should.be.a.json;
        res.should.have.status(200);
        done();
      });
  });
});

describe('POST /:id/annotate', () => {
  it('should return 404 Not Found when inputting a missing attempt id', done => {
    chai
      .request('http://localhost:3000')
      .post(`/attempts/${realUID}/annotate`) // UID not PID
      .send({
        attempt: {
          userId: realUID,
          problemId: realUID,
          description: 'This is a test description',
        },
        history: [{ content: 'This is a test prompt', role: 'user' }],
      })
      .end((err, res) => {
        should().not.exist(err);
        should().exist(res);
        res.should.have.status(404);
        done();
      });
  });
});

describe('Clean generated code', () => {
  it('should strip start and stop tokens from generated code', () => {
    const generatedFunction =
      '[[[START]]] ' +
      'function hello() { return "Hello, World!"; }' +
      ' [[[END]]]';
    const cleanedFunction = cleanGenCodeWithToken(
      generatedFunction,
      START_TOKEN,
      END_TOKEN,
    );
    should().exist(cleanedFunction);
    expect(cleanedFunction.indexOf(START_TOKEN)).to.equal(-1);
    expect(cleanedFunction.indexOf(END_TOKEN)).to.equal(-1);
  });
});
