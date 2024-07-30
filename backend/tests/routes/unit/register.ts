import sinon, { SinonSandbox } from 'sinon';
import { expect } from 'chai';
import { User, IUser } from '../../../src/models/User';

describe('Registration Route Unit Testing', async () => {
  let sandbox: SinonSandbox;
  let validUser: IUser;

  beforeEach(async () => {
    sandbox = sinon.createSandbox();
    validUser = new User({
      username: 'valid-user',
      firstName: 'valid',
      lastName: 'user',
      email: 'valid-user@gmail.com',
      password: 'valid-user-password',
      role: 'Student',
    });
  });

  afterEach(async () => {
    sandbox.restore();
  });

  it('testing findOne in registration', async () => {
    const findOneStub = sandbox.stub(User, 'findOne').resolves(validUser);
    const result = await User.findOne({ email: validUser.email });
    expect(result).to.be.not.null;
    expect(findOneStub.calledOnce).to.be.true;
    expect(findOneStub.calledWith({ email: validUser.email })).to.be.true;
    expect(result).to.have.property('username', 'valid-user');
    expect(result).to.have.property('firstName', 'valid');
    expect(result).to.have.property('lastName', 'user');
    expect(result).to.have.property('email', 'valid-user@gmail.com');
    expect(result).to.have.property('role', 'Student');
  });

  it('testing findOne - return: null', async () => {
    const findOneStub = sandbox.stub(User, 'findOne').resolves(null);

    const result = await User.findOne({ email: 'invalid-email@gmail.com' });

    expect(result).to.be.null;
    expect(findOneStub.calledOnce).to.be.true;
    expect(findOneStub.calledWith({ email: 'invalid-email@gmail.com' })).to.be
      .true;
  });

  it('testing user.save in registration', async () => {
    const saveStub = sandbox.stub(validUser, 'save').resolves(validUser);
    const result = await validUser.save();

    expect(result).to.be.not.null;
    expect(saveStub.calledOnce).to.be.true;
    expect(result).to.have.property('username', 'valid-user');
    expect(result).to.have.property('firstName', 'valid');
    expect(result).to.have.property('lastName', 'user');
    expect(result).to.have.property('email', 'valid-user@gmail.com');
    expect(result).to.have.property('role', 'Student');
  });
});
