import { expect } from 'chai';
import { User, UserRole } from '../../../src/models/User';
import '../../../src/utils/loadEnv';
import 'mocha';
import { connectToDb, disconnectDB } from '../../../src/helper';
import mongoose from 'mongoose';

describe('User Model Integration Tests', () => {
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

  it('should register a user successfully', async () => {
    const user = new User({
      username: 'testuser',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: 'password123',
      role: UserRole.Student,
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

  it('should create a user and compare password successfully', async () => {
    // First, register a user
    const user = new User({
      username: 'testuser',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: 'password123',
      role: UserRole.Student,
    });

    await user.save();

    // Then, find the user and compare passwords
    const foundUser = await User.findOne({ email: 'test@example.com' });

    expect(foundUser).to.not.be.null;

    if (foundUser) {
      const isMatch = await foundUser.comparePassword('password123');
      expect(isMatch).to.be.true;

      const isMatchWrong = await foundUser.comparePassword('wrongpassword');
      expect(isMatchWrong).to.be.false;
    }
  });

  it('should compare password successfully', async () => {
    const user = new User({
      username: 'testuser',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: 'password123',
      role: UserRole.Student,
    });

    await user.save();

    const foundUser = await User.findOne({ email: 'test@example.com' });

    expect(foundUser).to.not.be.null;

    if (foundUser) {
      const isMatch = await foundUser.comparePassword('password123');
      expect(isMatch).to.be.true;

      const isMatchWrong = await foundUser.comparePassword('wrongpassword');
      expect(isMatchWrong).to.be.false;
    }
  });
});
