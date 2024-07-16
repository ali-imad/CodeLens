import { expect, should } from 'chai';
import 'mocha';
import { callLLM } from '../../src/services/llmService';

describe('Switch/case on prompts', () => {
  it('should return null response if the prompt does not contain a valid tag', done => {
    callLLM('This is a test prompt').then(res => {
      should().not.exist(res.response);
      should().exist(res.context);
      expect(res.context).to.be.an('array');
      expect(res.context).to.have.length(1);
      done();
    });
  });
});
