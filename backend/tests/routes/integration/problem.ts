import { use, expect } from 'chai';
// @ts-ignore
import chaiHttp from 'chai-http';
import mongoose from 'mongoose';
import Problem, { IProblem, ITestCase } from '../../../src/models/Problem';
import { User } from '../../../src/models/User';
import '../../../src/utils/loadEnv';
import app from '../../../src/index';
import { connectToDb, disconnectDB } from '../../../src/helper';

const chai = use(chaiHttp);

// the ID are 24 hexits: if doing manual modifications
const SID = new mongoose.Types.ObjectId('f1f799477bcf86cd50739011');
const invalidSID = new mongoose.Types.ObjectId('cf86cdf1f799477b50739011');

const instructorID = new mongoose.Types.ObjectId('9011507f86cd799431f77bcf');

const problem1 = {
  _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439011'),
  title: 'test-problem-1',
  difficulty: 'Hard',
  functionBody: 'function add(a, b) {return a + b}',
  testCases: [
    { input: [1, 2], expectedOutput: 3 },
    { input: [-4, 2], expectedOutput: -2 },
  ],
};

const problem2 = {
  _id: new mongoose.Types.ObjectId('86cd799439011507f1f77bcf'),
  title: 'test-problem-2',
  difficulty: 'Easy',
  functionBody: 'function sub(a, b) {return a - b}',
  testCases: [
    { input: [1, 2], expectedOutput: -1 },
    { input: [-4, 2], expectedOutput: -6 },
    { input: [4, 1], expectedOutput: 3 },
  ],
};

// valid student has attempted 2 and completed 1 problem
const student = {
  _id: SID,
  username: 'newStudent',
  firstName: 'new',
  lastName: 'student',
  email: 'new-student@gmail.com',
  password: 'new-student',
  role: 'Student',
  attemptedProblems: [problem1, problem2],
  completedProblems: [problem2],
};

const instructor = {
  _id: instructorID,
  username: 'newInstructor',
  firstName: 'new',
  lastName: 'instructor',
  email: 'new-instructor@gmail.com',
  password: 'new-instructor',
  role: 'Instructor',
};

describe('Problem Route Integration Tests', function () {
  before(async () => {
    await connectToDb();
    await mongoose.connection.dropDatabase();
    await Problem.create(problem1);
    await Problem.create(problem2);
    await User.create(student);
    await User.create(instructor);
  });

  after(async () => {
    await mongoose.connection.dropDatabase();
    await disconnectDB();
  });

  it('Should retrieve all probelms - two PID exists in DB (by before hook) - return 200', done => {
    chai
      .request(app)
      .get('/problems')
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');

        const allProblemsArray = res.body.map(
          (problem: { _id: string }) => problem._id,
        );
        expect(allProblemsArray).to.include(problem1._id.toString());
        expect(allProblemsArray).to.include(problem2._id.toString());

        const prob1 = res.body.find(
          (prob: any) => prob._id === problem1._id.toString(),
        );
        expect(prob1).to.be.an('object');
        expect(prob1).to.have.property('_id', problem1._id.toString());
        expect(prob1).to.have.property('title', problem1.title);
        expect(prob1).to.have.property('difficulty', problem1.difficulty);
        expect(prob1).to.have.property('functionBody', problem1.functionBody);
        expect(prob1).to.have.property('testCases').that.is.an('array');
        expect(prob1.testCases).to.have.lengthOf(problem1.testCases.length);

        prob1.testCases.forEach((element: ITestCase, index: number) => {
          if (problem1.testCases[index]) {
            expect(element.input).to.deep.equal(
              problem1.testCases[index].input,
            );
            expect(element.expectedOutput).to.deep.equal(
              problem1.testCases[index].expectedOutput,
            );
          }
        });

        const prob2 = res.body.find(
          (prob: any) => prob._id === problem2._id.toString(),
        );
        expect(prob2).to.be.an('object');
        expect(prob2).to.have.property('_id', problem2._id.toString());
        expect(prob2).to.have.property('title', problem2.title);
        expect(prob2).to.have.property('difficulty', problem2.difficulty);
        expect(prob2).to.have.property('functionBody', problem2.functionBody);
        expect(prob2).have.property('testCases').that.is.an('array');
        expect(prob2.testCases).to.have.lengthOf(problem2.testCases.length);
        prob2.testCases.forEach((element: ITestCase, index: number) => {
          if (problem2.testCases[index]) {
            expect(element.input).to.deep.equal(
              problem2.testCases[index].input,
            );
            expect(element.expectedOutput).to.deep.equal(
              problem2.testCases[index].expectedOutput,
            );
          }
        });
        done();
      });
  });

  it('Should retrieve one random problem - two PID in DB - return 200', done => {
    chai
      .request(app)
      .get('/problems/random')
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('_id').that.is.an('string');
        expect(res.body).to.have.property('title').that.is.a('string');
        expect(res.body).to.have.property('difficulty').that.is.a('string');
        expect(res.body).to.have.property('functionBody').that.is.a('string');
        expect(res.body).to.have.property('testCases').that.is.an('array');
        done();
      });
  });

  it('Should fail to retrieve a random problem - DB empty - return 404', async () => {
    await Problem.deleteMany({});
    const response = await chai.request(app).get('/problems/random');

    expect(response).to.have.status(404);
    expect(response.body).to.be.an('object');
    expect(response.body).to.have.property('message', 'No problems found');
    await Problem.create(problem1);
    await Problem.create(problem2);
  });

  it('Should retrieve a problem by PID - PID exists in DB - return 200', done => {
    chai
      .request(app)
      .get(`/problems/${problem1._id.toString()}`)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');

        expect(res.body).to.have.property('_id', problem1._id.toString());
        expect(res.body).to.have.property('title', problem1.title);
        expect(res.body).to.have.property('difficulty', problem1.difficulty);
        expect(res.body).to.have.property(
          'functionBody',
          problem1.functionBody,
        );

        // deep equals for the arrays at element level using forEach loop
        expect(res.body).to.have.property('testCases').that.is.an('array');
        expect(res.body.testCases).to.have.lengthOf(problem1.testCases.length);

        res.body.testCases.forEach((element: ITestCase, index: number) => {
          if (problem1.testCases[index]) {
            expect(element.input).to.deep.equal(
              problem1.testCases[index].input,
            );
            expect(element.expectedOutput).to.equal(
              problem1.testCases[index].expectedOutput,
            );
          }
        });
        done();
      });
  });

  it('Should fail to retrive a problem - PID does not exist in DB - return 404 ', done => {
    const problemNotInDb = new mongoose.Types.ObjectId(
      'dead12345beef12345dead12',
    );
    chai
      .request(app)
      .get(`/problems/${problemNotInDb}`)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.be.an('object');
        expect(res).to.have.status(404);
        expect(res.body).to.have.property('message', 'Problem not found');
        expect(res).not.to.have.property('_id');
        done();
      });
  });

  it('Should retrieve problem status by userID - return 200', done => {
    chai
      .request(app)
      .get(`/problems/status/${SID}`)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');

        const probAttempted = res.body.find(
          (element: any) => element._id === problem1._id.toString(),
        );
        expect(probAttempted).to.have.property('title', problem1.title);
        expect(probAttempted).to.have.property(
          'difficulty',
          problem1.difficulty,
        );
        expect(probAttempted).to.have.property('status', 'Attempted');

        const probCompleted = res.body.find(
          (element: any) => element._id === problem2._id.toString(),
        );
        expect(probCompleted).to.have.property('title', problem2.title);
        expect(probCompleted).to.have.property(
          'difficulty',
          problem2.difficulty,
        );
        expect(probCompleted).to.have.property('status', 'Completed');
        done();
      });
  });

  it('Should fail to retrieve problem status by UserID - user not in DB - return 404', done => {
    chai
      .request(app)
      .get(`/problems/status/${invalidSID}`)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(404);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message', 'User not found');
        done();
      });
  });

  it('Should fail to assign problem to student - user (student) not permitted - return 403', done => {
    chai
      .request(app)
      .post('/problems/assign')
      .send({
        instructorId: SID,
        SID: SID,
        problemIds: [problem1._id, problem1._id],
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(403);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property(
          'message',
          'Not authorized to assign problems',
        );
        done();
      });
  });

  it('Should fail to assign problem to student - student not in DB - return 404', done => {
    chai
      .request(app)
      .post('/problems/assign')
      .send({
        instructorId: instructorID,
        studentId: invalidSID,
        problemIds: [problem1._id, problem2._id],
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(404);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message', 'Student not found');
        done();
      });
  });

  it('Should assign problem to student - assign 2 problems to student - return 200', done => {
    // Assign 2 problems to student
    const assignProblemsData = {
      instructorId: instructorID,
      studentId: SID,
      problemIds: [problem1._id, problem2._id],
    };
    chai
      .request(app)
      .post('/problems/assign')
      .send(assignProblemsData)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property(
          'message',
          'Problems assigned successfully',
        );
        done();
      });
  });

  it('Should retrieve assigned problems (to student) by userID/studentID - return 200', done => {
    chai
      .request(app)
      .get(`/problems/assigned/${SID.toString()}`)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('count').that.equals(2);
        expect(res.body).to.have.property('problems').that.is.an('array');

        const problemsArray = res.body.problems.map(
          (problem: { _id: string }) => problem._id.toString(),
        );
        expect(problemsArray).to.include(problem1._id.toString());
        expect(problemsArray).to.include(problem2._id.toString());
        done();
      });
  });

  it('Should fail to retrieve assigned problems (to student) by userID/studentID - user not in DB - return 404', done => {
    chai
      .request(app)
      .get(`/problems/assigned/${invalidSID.toString()}`)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(404);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message', 'User not found');
        done();
      });
  });

  it('Should retrieve attempted problems for users by their userID - return 200', done => {
    chai
      .request(app)
      .get(`/problems/attempted/${SID}`)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('count').that.equals(2);
        expect(res.body)
          .to.have.property('problems')
          .that.is.an('array')
          .to.have.lengthOf(2);

        const prob1 = res.body.problems.find(
          (element: any) => element._id === problem1._id.toString(),
        );
        expect(prob1).to.have.property('title', problem1.title);
        expect(prob1).to.have.property('difficulty', problem1.difficulty);
        expect(prob1).to.have.property('functionBody', problem1.functionBody);

        expect(prob1.testCases[0])
          .to.have.property('input')
          .that.deep.equals([1, 2]);
        expect(prob1.testCases[0])
          .to.have.property('expectedOutput')
          .that.deep.equals(3);
        expect(prob1.testCases[1])
          .to.have.property('input')
          .that.deep.equals([-4, 2]);
        expect(prob1.testCases[1])
          .to.have.property('expectedOutput')
          .that.deep.equals(-2);

        const prob2 = res.body.problems.find(
          (element: any) => element._id === problem2._id.toString(),
        );
        expect(prob2).to.have.property('title', problem2.title);
        expect(prob2).to.have.property('difficulty', problem2.difficulty);
        expect(prob2).to.have.property('functionBody', problem2.functionBody);

        expect(prob2.testCases[0])
          .to.have.property('input')
          .that.deep.equals([1, 2]);
        expect(prob2.testCases[0])
          .to.have.property('expectedOutput')
          .that.deep.equals(-1);
        expect(prob2.testCases[1])
          .to.have.property('input')
          .that.deep.equals([-4, 2]);
        expect(prob2.testCases[1])
          .to.have.property('expectedOutput')
          .that.deep.equals(-6);
        expect(prob2.testCases[2])
          .to.have.property('input')
          .that.deep.equals([4, 1]);
        expect(prob2.testCases[2])
          .to.have.property('expectedOutput')
          .that.deep.equals(3);
        done();
      });
  });

  it('Should fail to retrieve attempted problems for users by their userID - userID not in DB - return 404', done => {
    chai
      .request(app)
      .get(`/problems/attempted/${invalidSID}`)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message', 'User not found');
        done();
      });
  });

  it('Should retrieve completed problems for users by their userID - return 200', done => {
    chai
      .request(app)
      .get(`/problems/completed/${SID}`)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('count').that.equals(1);
        expect(res.body)
          .to.have.property('problems')
          .that.is.an('array')
          .to.have.lengthOf(1);

        const problemsArray = res.body.problems.map(
          (problem: { _id: string }) => problem._id,
        );
        expect(problemsArray).to.include(problem2._id.toString());
        done();
      });
  });

  it('Should fail to retrieve completed problems for users by their userID - userID not in DB - return 404', done => {
    chai
      .request(app)
      .get(`/problems/completed/${invalidSID}`)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message', 'User not found');
        done();
      });
  });

  it('Should create a new problem in DB - return 201', done => {
    const problem3 = {
      title: 'test-problem-3',
      difficulty: 'Easy',
      functionBody: 'function multiply(a, b) {return a * b}',
      testCases: [
        { input: [1, 2], expectedOutput: 2 },
        { input: [-4, 2], expectedOutput: -8 },
        { input: [4, 1], expectedOutput: 4 },
      ],
    };
    chai
      .request(app)
      .post('/problems')
      .send(problem3)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.be.an('object');
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('_id').that.is.a('string');
        expect(res.body).to.have.property('title', problem3.title);
        expect(res.body).to.have.property('difficulty', problem3.difficulty);
        expect(res.body).to.have.property(
          'functionBody',
          problem3.functionBody,
        );
        expect(res.body.testCases).to.have.lengthOf(3);

        res.body.testCases.forEach((element: ITestCase, index: number) => {
          if (problem3.testCases[index]) {
            expect(element.input).to.deep.equal(
              problem3.testCases[index].input,
            );
            expect(element.expectedOutput).to.deep.equal(
              problem3.testCases[index].expectedOutput,
            );
          }
        });
        done();
      });
  });
});
