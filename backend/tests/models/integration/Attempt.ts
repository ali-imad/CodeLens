import { expect } from 'chai';
import { User, UserRole } from '../../../src/models/User';
import Problem, { Difficulty } from '../../../src/models/Problem';
import Attempt from '../../../src/models/Attempt';
import { Verdict, TestCaseResult } from '../../../src/services/testCase';
import '../../../src/utils/loadEnv';
import 'mocha';
import { connectToDb, disconnectDB } from '../../../src/helper';
import mongoose from 'mongoose';

describe('Attempt Model Integration Tests', () => {
  before(async () => {
    await connectToDb();
    await mongoose.connection.dropDatabase();
  });

  after(async () => {
    await mongoose.connection.dropDatabase();
    await disconnectDB();
  });

  beforeEach(async () => {
    await mongoose.connection.dropDatabase();
  });

  it('should create a user successfully', async () => {
    const user = new User({
      username: 'testuser',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: 'password123',
      role: UserRole.Student,
      attemptedProblems: [],
      completedProblems: [],
    });

    const savedUser = await user.save();
    const foundUser = await User.findById(savedUser._id);

    expect(foundUser).to.not.be.null;
    expect(foundUser?.username).to.equal('testuser');
    expect(foundUser?.firstName).to.equal('Test');
    expect(foundUser?.lastName).to.equal('User');
    expect(foundUser?.email).to.equal('test@example.com');
    expect(foundUser?.role).to.equal(UserRole.Student);
  });

  it('should create a problem successfully', async () => {
    const problem = new Problem({
      title: 'Test Problem',
      difficulty: Difficulty.Easy,
      functionBody: 'function test() {}',
      testCases: [
        {
          input: [1, 2],
          expectedOutput: 3,
        },
      ],
    });

    const savedProblem = await problem.save();
    const foundProblem = await Problem.findById(savedProblem._id);

    expect(foundProblem).to.not.be.null;
    expect(foundProblem?.title).to.equal('Test Problem');
    expect(foundProblem?.difficulty).to.equal(Difficulty.Easy);
    expect(foundProblem?.functionBody).to.equal('function test() {}');
    expect(foundProblem?.testCases).to.have.lengthOf(1);
  });

  it('should create an attempt successfully with verdicts', async () => {
    const user = new User({
      username: 'testuser',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: 'password123',
      role: UserRole.Student,
      attemptedProblems: [],
      completedProblems: [],
    });

    const savedUser = await user.save();

    const problem = new Problem({
      title: 'Test Problem',
      difficulty: Difficulty.Easy,
      functionBody: 'function test() {}',
      testCases: [
        {
          input: [1, 2],
          expectedOutput: 3,
        },
      ],
    });

    const savedProblem = await problem.save();

    const attempt = new Attempt({
      problemId: savedProblem._id,
      userId: savedUser._id,
      description: 'Test Description',
      generatedCode: 'console.log("test");',
      feedback: [
        {
          input: [1, 2],
          expectedOutput: 3,
          actualOutput: 3,
          passed: Verdict.Passed,
        },
      ] as TestCaseResult[],
      isPassed: Verdict.Passed,
      createdAt: new Date(),
    });

    const savedAttempt = await attempt.save();
    const foundAttempt = await Attempt.findById(savedAttempt._id);

    expect(foundAttempt).to.not.be.null;
    expect(foundAttempt?.description).to.equal('Test Description');
    expect(foundAttempt?.problemId).to.deep.equal(savedProblem._id);
    expect(foundAttempt?.userId).to.deep.equal(savedUser._id);
    expect(foundAttempt?.generatedCode).to.equal('console.log("test");');
    expect(foundAttempt?.feedback).to.have.lengthOf(1);
    expect(foundAttempt?.isPassed).to.equal(Verdict.Passed);
  });

  it('should not create an attempt - problemId not in DB', async () => {
    const invalidProblemId = new mongoose.Types.ObjectId(
      'dead12345beef12345dead12',
    );

    const user = new User({
      username: 'testuser',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: 'password123',
      role: UserRole.Student,
      attemptedProblems: [],
      completedProblems: [],
    });

    const savedUser = await user.save();

    const attempt = new Attempt({
      problemId: invalidProblemId,
      userId: savedUser._id,
      description: 'Test Description',
      generatedCode: 'console.log("test");',
      feedback: [
        {
          input: [1, 2],
          expectedOutput: 3,
          actualOutput: 3,
          passed: Verdict.Passed,
        },
      ] as TestCaseResult[],
      isPassed: Verdict.Passed,
      createdAt: new Date(),
    });

    try {
      await attempt.save();
    } catch (error: any) {
      expect(error.message).to.equal(
        'Invalid problemId: problem does not exist',
      );
    }
  });

  it('should not create an attempt - userID not in DB', async () => {
    const invalidUser = new mongoose.Types.ObjectId('123456789123456789123456');

    const problem = new Problem({
      title: 'Test Problem',
      difficulty: Difficulty.Easy,
      functionBody: 'function test() {}',
      testCases: [
        {
          input: [1, 2],
          expectedOutput: 3,
        },
      ],
    });

    const savedProblem = await problem.save();

    const attempt = new Attempt({
      problemId: savedProblem._id,
      userId: invalidUser,
      description: 'Test Description',
      generatedCode: 'console.log("test");',
      feedback: [
        {
          input: [1, 2],
          expectedOutput: 3,
          actualOutput: 3,
          passed: Verdict.Passed,
        },
      ] as TestCaseResult[],
      isPassed: Verdict.Passed,
      createdAt: new Date(),
    });

    try {
      await attempt.save();
    } catch (error: any) {
      expect(error.message).to.equal('Invalid userId: user does not exist');
    }
  });
});
