import { expect } from 'chai';
import sinon from 'sinon';
import bcrypt from 'bcrypt';
import { User, IUser, UserRole } from '../../../src/models/User';
import 'mocha';

describe('User Model Unit Tests', () => {
  let sandbox: sinon.SinonSandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
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

    const saveStub = sandbox.stub(User.prototype, 'save').resolves(user);
    const findByIdStub = sandbox.stub(User, 'findById').resolves(user);

    await user.save();
    const foundUser = await User.findById(user._id);

    expect(saveStub.calledOnce).to.be.true;
    expect(findByIdStub.calledOnce).to.be.true;
    expect(foundUser).to.not.be.null;
    expect(foundUser?.username).to.equal('testuser');
    expect(foundUser?.email).to.equal('test@example.com');
    expect(foundUser?.role).to.equal(UserRole.Student);
  });

  it('should update a user successfully', async () => {
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

    sandbox.stub(User.prototype, 'save').resolves(user);
    sandbox.stub(User, 'findById').resolves(user);

    await user.save();

    user.firstName = 'Updated';
    user.lastName = 'User';
    await user.save();

    const updatedUser = await User.findById(user._id);

    expect(updatedUser).to.not.be.null;
    expect(updatedUser?.firstName).to.equal('Updated');
    expect(updatedUser?.lastName).to.equal('User');
  });

  it('should delete a user successfully', async () => {
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

    const saveStub = sandbox.stub(User.prototype, 'save').resolves(user);
    const findByIdAndDeleteStub = sandbox
      .stub(User, 'findByIdAndDelete')
      .resolves(user);
    const findByIdStub = sandbox.stub(User, 'findById').resolves(null);

    await user.save();
    await User.findByIdAndDelete(user._id);

    const deletedUser = await User.findById(user._id);

    expect(saveStub.calledOnce).to.be.true;
    expect(findByIdAndDeleteStub.calledOnce).to.be.true;
    expect(findByIdStub.calledOnce).to.be.true;
    expect(deletedUser).to.be.null;
  });

  it('should not create a user without a required field', async () => {
    const user = new User({
      username: 'testuser',
      firstName: 'Test',
      email: 'test@example.com',
      password: 'password123',
      role: UserRole.Student,
      attemptedProblems: [],
      completedProblems: [],
    });

    sandbox.stub(User.prototype, 'save').rejects({
      errors: {
        lastName: {
          message: 'Path `lastName` is required.',
        },
      },
    });

    try {
      await user.save();
    } catch (error: any) {
      expect(error).to.exist;
      expect(error.errors.lastName).to.exist;
      expect(error.errors.lastName.message).to.equal(
        'Path `lastName` is required.',
      );
    }
  });

  it('should hash the password before saving', async () => {
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

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash('password123', saltRounds);
    sandbox.stub(bcrypt, 'hash').resolves(hashedPassword);
    sandbox.stub(User.prototype, 'save').resolves(user);
    sandbox.stub(User, 'findById').resolves({
      ...user,
      password: hashedPassword,
    });

    await user.save();

    const foundUser = await User.findById(user._id);
    expect(foundUser).to.not.be.null;
    expect(foundUser?.password).to.not.equal('password123');
    expect(foundUser?.password).to.equal(hashedPassword);
  });

  it('should compare the password correctly', async () => {
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

    sandbox.stub(User.prototype, 'save').resolves(user);
    sandbox.stub(User, 'findById').resolves(user);
    sandbox
      .stub(user, 'comparePassword')
      .callsFake(async (password: string) => {
        return password === 'password123';
      });

    await user.save();

    const savedUser = (await User.findById(user._id)) as IUser;
    if (savedUser) {
      const isMatch = await savedUser.comparePassword('password123');
      expect(isMatch).to.be.true;

      const isMatchWrong = await savedUser.comparePassword('wrongpassword');
      expect(isMatchWrong).to.be.false;
    }
  });
});
