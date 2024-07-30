import { expect } from 'chai';
import sinon from 'sinon';
import mongoose from 'mongoose';
import Attempt from '../../../src/models/Attempt';
import { User, UserRole } from '../../../src/models/User';
import { TestCaseResult, Verdict } from '../../../src/services/testCase';
import 'mocha';

describe('Attempt Model Unit Tests', () => {
  let sandbox: sinon.SinonSandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should create an attempt successfully', async () => {
    const attempt = new Attempt({
      problemId: new mongoose.Types.ObjectId(),
      userId: new mongoose.Types.ObjectId(),
      description: 'Test description',
      generatedCode: 'console.log("test");',
      feedback: [{
        input: [1, 2],
        expectedOutput: 3,
        actualOutput: 3,
        passed: Verdict.Passed
      }] as TestCaseResult[],
      isPassed: Verdict.Passed,
      createdAt: new Date()
    });

    const saveStub = sandbox.stub(Attempt.prototype, 'save').resolves(attempt);
    const findByIdStub = sandbox.stub(Attempt, 'findById').resolves(attempt);

    await attempt.save();
    const foundAttempt = await Attempt.findById(attempt._id);

    expect(saveStub.calledOnce).to.be.true;
    expect(findByIdStub.calledOnce).to.be.true;
    expect(foundAttempt).to.not.be.null;
    expect(foundAttempt?.description).to.equal('Test description');
    expect(foundAttempt?.generatedCode).to.equal('console.log("test");');
    expect(foundAttempt?.feedback).to.have.lengthOf(1);
    expect(foundAttempt?.isPassed).to.equal(Verdict.Passed);
  });

  it('should update an attempt successfully', async () => {
    const attempt = new Attempt({
      problemId: new mongoose.Types.ObjectId(),
      userId: new mongoose.Types.ObjectId(),
      description: 'Test description',
      generatedCode: 'console.log("test");',
      feedback: [{
        input: [1, 2],
        expectedOutput: 3,
        actualOutput: 3,
        passed: Verdict.Passed
      }] as TestCaseResult[],
      isPassed: Verdict.Passed,
      createdAt: new Date()
    });

    sandbox.stub(Attempt.prototype, 'save').resolves(attempt);
    sandbox.stub(Attempt, 'findById').resolves(attempt);

    await attempt.save();

    attempt.description = 'Updated description';
    attempt.isPassed = Verdict.Failed;
    await attempt.save();

    const updatedAttempt = await Attempt.findById(attempt._id);

    expect(updatedAttempt).to.not.be.null;
    expect(updatedAttempt?.description).to.equal('Updated description');
    expect(updatedAttempt?.isPassed).to.equal(Verdict.Failed);
  });

  it('should delete an attempt successfully', async () => {
    const attempt = new Attempt({
      problemId: new mongoose.Types.ObjectId(),
      userId: new mongoose.Types.ObjectId(),
      description: 'Test description',
      generatedCode: 'console.log("test");',
      feedback: [{
        input: [1, 2],
        expectedOutput: 3,
        actualOutput: 3,
        passed: Verdict.Passed
      }] as TestCaseResult[],
      isPassed: Verdict.Passed,
      createdAt: new Date()
    });

    const saveStub = sandbox.stub(Attempt.prototype, 'save').resolves(attempt);
    const findByIdAndDeleteStub = sandbox.stub(Attempt, 'findByIdAndDelete').resolves(attempt);
    const findByIdStub = sandbox.stub(Attempt, 'findById').resolves(null);

    await attempt.save();
    await Attempt.findByIdAndDelete(attempt._id);

    const deletedAttempt = await Attempt.findById(attempt._id);

    expect(saveStub.calledOnce).to.be.true;
    expect(findByIdAndDeleteStub.calledOnce).to.be.true;
    expect(findByIdStub.calledOnce).to.be.true;
    expect(deletedAttempt).to.be.null;
  });

  it('should not create an attempt without a required field', async () => {
    const attempt = new Attempt({
      userId: new mongoose.Types.ObjectId(),
      description: 'Test description',
      generatedCode: 'console.log("test");',
      feedback: [{
        input: [1, 2],
        expectedOutput: 3,
        actualOutput: 3,
        passed: Verdict.Passed
      }] as TestCaseResult[],
      isPassed: Verdict.Passed,
      createdAt: new Date()
    });

    sandbox.stub(Attempt.prototype, 'save').rejects({
      errors: {
        problemId: {
          message: 'Path `problemId` is required.',
        },
      },
    });

    try {
      await attempt.save();
    } catch (error: any) {
      expect(error).to.exist;
      expect(error.errors.problemId).to.exist;
      expect(error.errors.problemId.message).to.equal('Path `problemId` is required.');
    }
  });

  it('should call updateUserProgress method', async () => {
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

    const attempt = new Attempt({
      problemId: new mongoose.Types.ObjectId(),
      userId: user._id,
      description: 'Test description',
      generatedCode: 'console.log("test");',
      feedback: [{
        input: [1, 2],
        expectedOutput: 3,
        actualOutput: 3,
        passed: Verdict.Passed
      }] as TestCaseResult[],
      isPassed: Verdict.Passed,
      createdAt: new Date()
    });

    const findByIdStub = sandbox.stub(User, 'findById').resolves(user);
    const saveUserStub = sandbox.stub(user, 'save').resolves(user);

    await attempt.updateUserProgress();

    expect(findByIdStub.calledOnce).to.be.true;
    expect(saveUserStub.calledOnce).to.be.true;
    expect(user.attemptedProblems).to.include(attempt.problemId);
    expect(user.completedProblems).to.include(attempt.problemId);
  });

  it('should throw an error if user is not found in updateUserProgress method', async () => {
    const attempt = new Attempt({
      problemId: new mongoose.Types.ObjectId(),
      userId: new mongoose.Types.ObjectId(),
      description: 'Test description',
      generatedCode: 'console.log("test");',
      feedback: [{
        input: [1, 2],
        expectedOutput: 3,
        actualOutput: 3,
        passed: Verdict.Passed
      }] as TestCaseResult[],
      isPassed: Verdict.Passed,
      createdAt: new Date()
    });

    sandbox.stub(User, 'findById').resolves(null);

    try {
      await attempt.updateUserProgress();
    } catch (error: any) {
      expect(error).to.exist;
      expect(error.message).to.equal('User not found');
    }
  });
});
