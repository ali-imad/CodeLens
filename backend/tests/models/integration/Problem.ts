import { expect } from 'chai';
import Problem, { Difficulty } from '../../../src/models/Problem';
import '../../../src/utils/loadEnv';
import 'mocha';
import { connectToDb, disconnectDB } from '../../../src/helper';
import mongoose from 'mongoose';

describe('Problem Model Integration Tests', () => {
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

  it('should fetch all problems successfully', async () => {
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

    await problem.save();

    const allProblems = await Problem.find({});
    expect(allProblems).to.be.an('array');
    expect(allProblems.length).to.equal(1);
    expect(allProblems[0]).to.have.property('title', 'Test Problem');
  });

  it('should fetch a problem by ID successfully', async () => {
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
});
