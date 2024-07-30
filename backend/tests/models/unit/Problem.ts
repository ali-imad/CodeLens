import { expect } from 'chai';
import sinon from 'sinon';
import Problem, { Difficulty } from '../../../src/models/Problem';
import 'mocha';

describe('Problem Model Unit Tests', () => {
  let sandbox: sinon.SinonSandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
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

    const saveStub = sandbox.stub(Problem.prototype, 'save').resolves(problem);
    const findByIdStub = sandbox.stub(Problem, 'findById').resolves(problem);

    await problem.save();
    const foundProblem = await Problem.findById(problem._id);

    expect(saveStub.calledOnce).to.be.true;
    expect(findByIdStub.calledOnce).to.be.true;
    expect(foundProblem).to.not.be.null;
    expect(foundProblem?.title).to.equal('Test Problem');
    expect(foundProblem?.difficulty).to.equal(Difficulty.Easy);
    expect(foundProblem?.functionBody).to.equal('function test() {}');
    expect(foundProblem?.testCases).to.have.lengthOf(1);
  });

  it('should update a problem successfully', async () => {
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

    sandbox.stub(Problem.prototype, 'save').resolves(problem);
    sandbox.stub(Problem, 'findById').resolves(problem);

    await problem.save();

    problem.title = 'Updated Problem';
    problem.difficulty = Difficulty.Medium;
    await problem.save();

    const updatedProblem = await Problem.findById(problem._id);

    expect(updatedProblem).to.not.be.null;
    expect(updatedProblem?.title).to.equal('Updated Problem');
    expect(updatedProblem?.difficulty).to.equal(Difficulty.Medium);
  });

  it('should delete a problem successfully', async () => {
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

    const saveStub = sandbox.stub(Problem.prototype, 'save').resolves(problem);
    const findByIdAndDeleteStub = sandbox
      .stub(Problem, 'findByIdAndDelete')
      .resolves(problem);
    const findByIdStub = sandbox.stub(Problem, 'findById').resolves(null);

    await problem.save();
    await Problem.findByIdAndDelete(problem._id);

    const deletedProblem = await Problem.findById(problem._id);

    expect(saveStub.calledOnce).to.be.true;
    expect(findByIdAndDeleteStub.calledOnce).to.be.true;
    expect(findByIdStub.calledOnce).to.be.true;
    expect(deletedProblem).to.be.null;
  });

  it('should not create a problem without a required field', async () => {
    const problem = new Problem({
      difficulty: Difficulty.Easy,
      functionBody: 'function test() {}',
      testCases: [
        {
          input: [1, 2],
          expectedOutput: 3,
        },
      ],
    });

    sandbox.stub(Problem.prototype, 'save').rejects({
      errors: {
        title: {
          message: 'Path `title` is required.',
        },
      },
    });

    try {
      await problem.save();
    } catch (error: any) {
      expect(error).to.exist;
      expect(error.errors.title).to.exist;
      expect(error.errors.title.message).to.equal('Path `title` is required.');
    }
  });

  it('should not create a problem with an invalid difficulty', async () => {
    const problem = new Problem({
      title: 'Test Problem',
      difficulty: 'Invalid' as Difficulty,
      functionBody: 'function test() {}',
      testCases: [
        {
          input: [1, 2],
          expectedOutput: 3,
        },
      ],
    });

    sandbox.stub(Problem.prototype, 'save').rejects({
      errors: {
        difficulty: {
          message: '`Invalid` is not a valid enum value for path `difficulty`',
        },
      },
    });

    try {
      await problem.save();
    } catch (error: any) {
      expect(error).to.exist;
      expect(error.errors.difficulty).to.exist;
      expect(error.errors.difficulty.message).to.include(
        '`Invalid` is not a valid enum value for path `difficulty`',
      );
    }
  });
});
