// import { expect, should } from 'chai';
import { expect } from 'chai';
import mongoose from 'mongoose';
import Attempt from '../../src/models/Attempt';
import Problem from '../../src/models/Problem';
import { User } from '../../src/models/User';
import dotenv from 'dotenv';
dotenv.config()

const DB_URI = process.env['MONGOTESTDB_URI'];
describe('Attempt Model', () => {
  before(async () => {
    // @ts-ignore
    if (this && this.enableTimeouts) {
      // @ts-ignore
      this.enableTimeouts(false)
    }
    // Connect to the database
    if (!DB_URI) {
      throw new Error('MONGODBTEST_URI must be set');
    }
    let connection: mongoose.Connection = mongoose.connection;
    await mongoose.connect(DB_URI);

    connection.once('open', async () => {
      console.log("Boom!")
        // Create a test user and problem
        await User.create({ username: 'testUser', password: 'testPassword' });
        await Problem.create({ title: 'Test Problem', difficulty: 'Easy' });
      },
    );
  });

  after(async () => {
    // Clean up the database
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  });

  // it('should create an Attempt document with valid data', async () => {
  //   const user = await User.findOne({ username: 'testUser' });
  //   const problem = await Problem.findOne({ title: 'Test Problem' });
  //
  //   should().exist(user);
  //   should().exist(problem);
  //
  //   const attempt = new Attempt({
  //     // @ts-ignore
  //     problemId: problem._id,
  //     // @ts-ignore
  //     userId: user._id,
  //     description: 'Test Attempt',
  //     generatedCode: 'function test() { return true; }',
  //     feedback: [],
  //     isPassed: false,
  //   });
  //
  //   const savedAttempt = await attempt.save();
  //
  //   expect(savedAttempt).to.have.property('_id');
  //   expect(savedAttempt).to.have.property('description', 'Test Attempt');
  // });

  it('should not create an Attempt document with invalid data', async () => {
    const attempt = new Attempt({
      description: 'Test Attempt',
      generatedCode: 'function test() { return true; }',
      feedback: [],
      isPassed: false,
    });

    let error;
    try {
      await attempt.save();
    } catch (e) {
      error = e;
    }

    expect(error).to.exist;
    // @ts-ignore
    expect(error.errors.problemId).to.exist;
    // @ts-ignore
    expect(error.errors.userId).to.exist;
  });

  // it('should update user progress', async () => {
  //   const user = await User.findOne({ username: 'testUser' });
  //   const problem = await Problem.findOne({ title: 'Test Problem' });
  //
  //   should().exist(user);
  //   should().exist(problem);
  //
  //   const attempt = new Attempt({
  //     // @ts-ignore
  //     problemId: problem._id,
  //     // @ts-ignore
  //     userId: user._id,
  //     description: 'Test Attempt',
  //     generatedCode: 'function test() { return true; }',
  //     feedback: [],
  //     isPassed: true,
  //   });
  //
  //   const savedAttempt = await attempt.save();
  //   await savedAttempt.updateUserProgress();
  //
  //   // @ts-ignore
  //   const updatedUser = await User.findById(user._id);
  //
  //   // @ts-ignore
  //   expect(updatedUser.attemptedProblems).to.include(savedAttempt.problemId);
  //   // @ts-ignore
  //   expect(updatedUser.completedProblems).to.include(savedAttempt.problemId);
  // });
});