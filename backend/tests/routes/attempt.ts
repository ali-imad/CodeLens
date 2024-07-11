import { expect, should, use } from 'chai';
// @ts-ignore
import chaiHttp from 'chai-http';
import 'mocha';
import { cleanGenCode, END_TOKEN, START_TOKEN } from '../../src/routes/attempt';

const chai = use(chaiHttp);

describe('GET / (sanity)', () => {
  it('should return 200 OK', (done) => {
    chai.request('http://localhost:3000')
      .get('/')
      .end((err, res) => {
        should().not.exist(err)
        should().exist(res);
        res.should.have.status(200);
        done()
      });
  });

  it('should not return 404 Not Found', (done) => {
    chai.request('http://localhost:3000')
      .get('/')
      .end((err, res) => {
        should().not.exist(err)
        should().exist(res);
        res.should.not.have.status(404);
        done()
      });
  });
});

describe('Clean generated code', () => {
  it('should strip start and stop tokens from generated code', () => {
    const generatedFunction = '[[[START]]] ' +
      'function hello() { return "Hello, World!"; }' +
      ' [[[END]]]';
    const cleanedFunction = cleanGenCode(generatedFunction, START_TOKEN, END_TOKEN);
    should().exist(cleanedFunction)
    expect(cleanedFunction).to.equal('function hello() { return "Hello, World!"; }');
  })
})