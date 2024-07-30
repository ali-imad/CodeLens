import { IUser, User } from '../../../src/models/User';
import sinon, { SinonSandbox } from 'sinon';
import { expect } from 'chai';
import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';

// const JWT_SECRET_KEY = 'somesecretkey';

describe('Login Route Unit Tests', () => {
  let sandbox: SinonSandbox;
  let user: IUser;

  beforeEach(async () => {
    sandbox = sinon.createSandbox();
    user = new User({
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

  it('testing findOne - return: user', async () => {
    const findOneStub = sandbox.stub(User, 'findOne').resolves(user);

    const result = await User.findOne({ email: user.email });

    expect(result).to.be.not.null;
    expect(findOneStub.calledOnce).to.be.true;
    expect(findOneStub.calledWith({ email: user.email })).to.be.true;
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

  it('testing bcrypt.compare - return true', async () => {
    const bcryptStub = sandbox.stub(bcrypt, 'compare').resolves(true);
    const result = await bcrypt.compare('valid-user-password', user.password);

    expect(bcryptStub.calledOnce).to.be.true;
    expect(result).to.be.true;
    expect(bcryptStub.calledWith('valid-user-password', user.password)).to.be
      .true;
  });

  it('testing bcrypt.compare - return false', async () => {
    const bcryptStub = sandbox.stub(bcrypt, 'compare').resolves(false);

    const result = await bcrypt.compare('invalid-user-password', user.password);
    expect(result).to.be.false;
    expect(bcryptStub.calledOnce).to.be.true;
    expect(bcryptStub.calledWith('invalid-user-password', user.password)).to.be
      .true;
  });

  // it('testing jwt.sign to create token - return token', () => {
  //   const jwtTokenStub = sandbox.stub(jwt, 'sign').returns('token');
  //   const payload = { email: user.email, password: user.password };
  //   const options = { expiresIn: 10 };

  //   const result = jwt.sign(payload, JWT_SECRET_KEY, options);

  //   expect(result).to.equal('token');
  //   expect(jwtTokenStub.calledOnce).to.be.true;

  //   expect(jwtTokenStub.getCall(0).args[0]).to.deep.equal(payload);
  //   expect(jwtTokenStub.getCall(0).args[1]).to.deep.equal(JWT_SECRET_KEY);
  //   expect(jwtTokenStub.getCall(0).args[2]).to.deep.equal(options);
  // });
});
