import { expect, use } from 'chai';
import chaiHttp from 'chai-http';
import 'mocha';
import mongoose, { ObjectId } from 'mongoose';
import Problem, { ITestCase } from '../../../src/models/Problem';
import { User } from '../../../src/models/User';
import '../../../src/utils/loadEnv';
import Attempt from '../../../src/models/Attempt';
import app from '../../../src/index';
import { connectToDb, disconnectDB } from '../../../src/helper';
// import {
//   cleanGenCodeWithToken,
//   END_TOKEN,
//   START_TOKEN,
// } from '../../src/utils/codeGen';
// const app = 'http://localhost:3000';
const chai = use(chaiHttp);

const problem1 = {
  _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439001'),
  title: 'test-problem-1',
  difficulty: 'Hard',
  functionBody:
    'function isPalindrome(str) { str = str.toLowerCase().replace(/[^a-z0-9]/g, ""); return str === str.split("").reverse().join(""); }',
  testCases: [{ input: ['racecar'], expectedOutput: true }],
};

const problem2 = {
  _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439002'),
  title: 'test-problem-2',
  difficulty: 'Hard',
  functionBody: 'function add(a, b) { return a + b; }',
  testCases: [{ input: [3, 6], expectedOutput: 9 }],
};

const student = {
  _id: new mongoose.Types.ObjectId('f1f799477bcf86cd50739011'),
  username: 'newStudent',
  firstName: 'new',
  lastName: 'student',
  email: 'new-student@gmail.com',
  password: 'new-student',
  role: 'Student',
  assignedProblems: [problem1._id, problem2._id],
  attemptedProblems: [problem2._id],
  completedProblems: [problem1._id],
};

// This attempt is directly put in the DB so description and actual values have no problem
const existingAttempt = {
  _id: new mongoose.Types.ObjectId('ea9ec9c4c8b37726e2f2b9c1'),
  problemId: problem1._id,
  userId: student._id,
  description: 'invalid',
  generatedCode: 'invalid',
  feedback: [
    {
      input: ['racecar'],
      expectedOutput: true,
      actualOutput: false,
      passed: 'Failed',
    },
  ],
  isPassed: 'Failed',
};

//  This attempt will be created in DB using route so ollama related stuff: don't verify in testing
const newAttempt = {
  problemId: problem2._id,
  userId: student._id,
  description:
    'The function takes two parameters a, b; and return their addition a + b.',
  generatedCode: '',
  feedback: [
    {
      input: [3, 6],
      expectedOutput: 9,
      actualOutput: '',
      passed: '',
    },
  ],
  isPassed: '',
};

describe('Attempt Route Integration Tests', function () {
  let attemptIdForAttonation: ObjectId;
  before(async () => {
    await connectToDb();
    await mongoose.connection.dropDatabase();
    await Problem.create(problem1);
    await Problem.create(problem2);
    await User.create(student);
    await Attempt.create(existingAttempt);
  });

  after(async () => {
    await mongoose.connection.dropDatabase();
    await disconnectDB();
  });

  describe('/POST route testing', async () => {
    it('Should not create an attempt - invalid problemID {ObjectId} - return 400', done => {
      const attemptForInvalidProblemIdFormat = {
        problemId: 'invalid pid format',
        userId: student._id,
        description: 'Attempting the problem',
      };
      chai
        .request(app)
        .post('/attempts')
        .send(attemptForInvalidProblemIdFormat)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(400);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property(
            'message',
            'Invalid ObjectId format',
          );
          done();
        });
    });

    it('Should not create an attempt - invalid userID {ObjectId} - return 400', done => {
      const attemptForInvalidUserIdFormat = {
        problemId: problem1._id,
        userId: 'invalid sid format',
        description: 'for this attempt the userID is invalid format',
        generatedCode: 'this is the genereated code',
      };
      chai
        .request(app)
        .post('/attempts')
        .send(attemptForInvalidUserIdFormat)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(400);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property(
            'message',
            'Invalid ObjectId format',
          );
          done();
        });
    });

    it('Should not create an attempt - problemId not in DB - return 404', done => {
      const attemptForProblemIdNotInDb = {
        problemId: new mongoose.Types.ObjectId('507f1f77bcf86cd799439012'),
        userId: student._id,
        description: 'for this attempt the problemId is invalid format',
      };
      chai
        .request(app)
        .post('/attempts')
        .send(attemptForProblemIdNotInDb)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(404);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message', 'Problem not found');
          done();
        });
    });

    it('Should not annotate attempt - invalid attemptId format - return 400', done => {
      const invalidFormatAttemptId = 'invalid-format';
      chai
        .request(app)
        .post(`/attempts/${invalidFormatAttemptId}/annotate`)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(400);
          expect(res.body).to.have.property(
            'message',
            'Invalid attempt id format',
          );
          done();
        });
    });

    it('Should not annotate an attempt - attemptId not in DB - return 404', done => {
      const attemptIdNotInDb = new mongoose.Types.ObjectId(
        '758ec9c4c8b37726e2f2b9c3',
      );
      chai
        .request(app)
        .post(`/attempts/${attemptIdNotInDb}/annotate`)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(404);
          expect(res.body).to.have.property('message', 'Attempt not found');
          done();
        });
    });
  });
  describe('Annotation testing', async () => {
    describe('Creating an attempt', async () => {
      it('Should create an attempt - return 201', done => {
        chai
          .request(app)
          .post('/attempts')
          .send(newAttempt)
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(201);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('attempt');

            // we will attemptIdForAttonation use it for annotation later
            expect(res.body.attempt).to.have.property('_id');
            attemptIdForAttonation = res.body.attempt._id;

            expect(res.body.attempt).to.have.property(
              'problemId',
              newAttempt.problemId.toString(),
            );
            expect(res.body.attempt).to.have.property(
              'userId',
              newAttempt.userId.toString(),
            );
            expect(res.body.attempt).to.have.property(
              'description',
              newAttempt.description,
            );
            expect(res.body.attempt)
              .to.have.property('feedback')
              .that.is.an('array');
            res.body.attempt.feedback.forEach(
              (feed: ITestCase, index: number) => {
                if (newAttempt.feedback[index]) {
                  expect(feed)
                    .to.have.property('input')
                    .that.deep.equals(newAttempt.feedback[index].input);
                  expect(feed)
                    .to.have.property('expectedOutput')
                    .that.deep.equals(
                      newAttempt.feedback[index].expectedOutput,
                    );
                  expect(feed).to.have.property('actualOutput', 9);
                  expect(feed).to.have.property('passed', 'Passed');
                }
              },
            );
            expect(res.body.attempt).to.have.property('isPassed', 'Passed');
            done();
          });
      });
    });

    describe('Creating annotation for attempt', async () => {
      it('Should annotate an attempt - return 200', done => {
        chai
          .request(app)
          .post(`/attempts/${attemptIdForAttonation}/annotate`)
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('response');
            done();
          });
      });
    });
  });

  describe('/GET route testing', () => {
    it('Should retrieve all attempts - one in DB - return 200', done => {
      chai
        .request(app)
        .get('/attempts')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.body).to.be.an('array');
          expect(res.body.length).to.equals(2);
          const extAtmpt = res.body.find(
            (attempt: any) =>
              attempt.problemId.toString() ===
              existingAttempt.problemId.toString(),
          );

          expect(extAtmpt)
            .to.have.property('userId')
            .that.equals(existingAttempt.userId.toString());
          expect(extAtmpt)
            .to.have.property('generatedCode')
            .that.equals(existingAttempt.generatedCode);
          expect(extAtmpt).to.have.property('feedback').that.is.an('array');
          expect(extAtmpt).to.have.property('isPassed', 'Failed');

          const newAtmpt = res.body.find(
            (attempt: any) =>
              attempt.problemId.toString() === newAttempt.problemId.toString(),
          );

          expect(newAtmpt)
            .to.have.property('userId')
            .that.equals(newAttempt.userId.toString());
          expect(newAtmpt).to.have.property('feedback').that.is.an('array');
          expect(newAtmpt).to.have.property('isPassed', 'Passed');
          done();
        });
    });
  });
  describe('User Attempts Route Integration Tests', function () {
    describe('GET /attempts/:userID', () => {
      it('Should retrieve all attempts for a valid user - return 200', done => {
        chai
          .request(app)
          .get(`/attempts/${student._id}`)
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            expect(res.body.length).to.equal(2);

            res.body.forEach((attempt: any) => {
              expect(attempt.userId.toString()).to.equal(
                student._id.toString(),
              );
            });

            done();
          });
      });

      it('Should return 400 for invalid user ID format', done => {
        const invalidUserId = 'invalid-user-id';
        chai
          .request(app)
          .get(`/attempts/${invalidUserId}`)
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(400);
            expect(res.body).to.have.property(
              'message',
              'Invalid ObjectId format',
            );
            done();
          });
      });

      it('Should return 404 for non-existent user', done => {
        const idNotInDb = new mongoose.Types.ObjectId(
          '758ec9c4c8b37726e2f2b9c3',
        );
        chai
          .request(app)
          .get(`/attempts/${idNotInDb}`)
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(404);
            expect(res.body).to.have.property('message', 'User not found');
            done();
          });
      });

      it('Should return an empty array for a user with no attempts', async () => {
        // Create a new user with no attempts
        const newUserWithNoAttempts = await User.create({
          ...student,
          _id: new mongoose.Types.ObjectId(),
          email: 'no-attempts@example.com',
          username: 'no-attempts-user',
        });

        const res = await chai
          .request(app)
          .get(`/attempts/${newUserWithNoAttempts._id}`);

        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        expect(res.body.length).to.equal(0);
      });
    });
  });

  // describe('GET /attempts', () => {
  //   it('should return 200 OK and return all attempts', done => {
  //     chai
  //       .request(app)
  //       .post(`/attempts/${attemptID}/annotate`)
  //       .end((err, res) => {
  //         console.log(res.body);
  //         expect(err).to.be.null;
  //         expect(res).to.have.status(200);
  //         expect(res.body).to.be.an('object');
  //         expect(res.body).to.have.property('response');
  //         done();
  //       });
  //   });
  // });

  // describe('POST /:id/annotate', () => {
  //   it('should return 404 Not Found when inputting a missing attempt id', done => {
  //     chai
  //       .request('http://localhost:3000')
  //       .post(`/attempts/${realUID}/annotate`) // UID not PID
  //       .send({
  //         attempt: {
  //           userId: realUID,
  //           problemId: realUID,
  //           description: 'This is a test description',
  //         },
  //         history: [{ content: 'This is a test prompt', role: 'user' }],
  //       })
  //       .end((err, res) => {
  //         should().not.exist(err);
  //         should().exist(res);
  //         res.should.have.status(404);
  //         done();
  //       });
  //   });
  // });

  // describe('Clean generated code', () => {
  //   it('should strip start and stop tokens from generated code', () => {
  //     const generatedFunction =
  //       '[[[START]]] ' +
  //       'function hello() { return "Hello, World!"; }' +
  //       ' [[[END]]]';
  //     const cleanedFunction = cleanGenCodeWithToken(
  //       generatedFunction,
  //       START_TOKEN,
  //       END_TOKEN,
  //     );
  //     should().exist(cleanedFunction);
  //     expect(cleanedFunction.indexOf(START_TOKEN)).to.equal(-1);
  //     expect(cleanedFunction.indexOf(END_TOKEN)).to.equal(-1);
});
