import { use } from 'chai';
// @ts-ignore
import chaiHttp from 'chai-http';
import { Difficulty } from '../../src/models/Problem';

const chai = use(chaiHttp);
const expect = chai.expect;
const realPID = '66737f4f5decb739513a3857';
const realUID = '6685db27d14d869aa09b7a06';
const realIID = '66881860b363503aafbff6c5';
const app = 'http://localhost:3000'; // TODO: replace with actual app import

describe('Problems Route: GET', () => {
  it('should retrieve all problems', done => {
    chai
      .request(app)
      .get('/problems')
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });

  it('should retrieve a random problem', done => {
    chai
      .request(app)
      .get('/problems/random')
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        done();
      });
  });

  it('should retrieve a specific problem by ID', done => {
    chai
      .request(app)
      .get(`/problems/${realPID}`)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        done();
      });
  });

  it('should return 404 Not Found when provided an correctly formatted but incorrect problem ID', done => {
    chai
      .request(app)
      .get(`/problems/${realUID}`)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(404);
        expect(res.body).to.have.property('message', 'Problem not found');
        done();
      });
  });

  it('should return 500 Bad Request when provided a malformed problem ID', done => {
    chai
      .request(app)
      .get(`/problems/invalidId`)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(500);
        done();
      });
  });

  it('should get all problem statuses for a user', done => {
    chai
      .request(app)
      .get(`/problems/status/${realUID}`)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });
  it('should get all assigned problems for a user', done => {
    chai
      .request(app)
      .get(`/problems/assigned/${realUID}`)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('count');
        expect(res.body).to.have.property('problems').that.is.an('array');
        done();
      });
  });

  it('should get all attempted problems for a user', done => {
    chai
      .request(app)
      .get(`/problems/attempted/${realUID}`)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('count');
        expect(res.body).to.have.property('problems').that.is.an('array');
        done();
      });
  });

  it('should get all completed problems for a user', done => {
    chai
      .request(app)
      .get(`/problems/completed/${realUID}`)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('count');
        expect(res.body).to.have.property('problems').that.is.an('array');
        done();
      });
  });
});

describe('Problems Route: POST', () => {
  // Test for POST /assign
  it('should assign problems to a student', done => {
    const payload = {
      instructorId: realIID,
      studentId: realUID,
      problemIds: [realPID], // replace with valid problem IDs
    };
    chai
      .request(app)
      .post('/problems/assign')
      .send(payload)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        done();
      });
  });

  // Test for POST /
  it('should return error code 500 when sending a malformed problem', done => {
    const newProblem = {
      title: 'Bad Problem',
      difficulty: 'NotADifficulty',
      functionBody: null,
      testCases: [null],
    };
    chai
      .request(app)
      .post('/problems')
      .send(newProblem)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(500);
        done();
      });
  });

  it('should create a new problem', done => {
    const newProblem = {
      title: 'Test Problem',
      difficulty: Difficulty.Easy,
      functionBody: 'function test(a) { return true; }',
      testCases: [{ input: '', expectedOutput: true }],
    };
    chai
      .request(app)
      .post('/problems')
      .send(newProblem)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(201);
        done();
      });
  });
});
