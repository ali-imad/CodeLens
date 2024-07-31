import { expect } from 'chai';
import sinon from 'sinon';
import axios from 'axios';
import {
  callLLM,
  pingLLM,
  ANNOTATE_TAG,
  CODEGEN_TAG,
  LLMContext,
  OLLAMA_ROUTE,
  MODEL_NAME,
  LLMChatResponse,
  addUserPrompt,
  addBotHistory,
} from '../../src/services/llmService'; // Adjust the path as needed
import logger from '../../src/utils/logger'; // Adjust the path as needed
import 'mocha';

describe('LLM Service Integration Tests', () => {
  let axiosPostStub: sinon.SinonStub;
  let axiosGetStub: sinon.SinonStub;
  let loggerInfoStub: sinon.SinonStub;
  let loggerDebugStub: sinon.SinonStub;
  let loggerErrorStub: sinon.SinonStub;
  let loggerHttpStub: sinon.SinonStub;
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    axiosPostStub = sinon.stub(axios, 'post');
    axiosGetStub = sinon.stub(axios, 'get');
    loggerInfoStub = sinon.stub(logger, 'info');
    loggerDebugStub = sinon.stub(logger, 'debug');
    loggerErrorStub = sinon.stub(logger, 'error');
    loggerHttpStub = sinon.stub(logger, 'http');
    originalEnv = process.env;
    process.env = { ...originalEnv }; // Clone the original environment variables
  });

  afterEach(() => {
    axiosPostStub.restore();
    axiosGetStub.restore();
    loggerInfoStub.restore();
    loggerDebugStub.restore();
    loggerErrorStub.restore();
    loggerHttpStub.restore();
    process.env = originalEnv; // Restore the original environment variables
  });

  describe('Environment Variable Tests', () => {
    it('should log using docker route and set OLLAMA_ROUTE correctly', async () => {
      process.env['DOCKER'] = 'true';
      delete require.cache[require.resolve('../../src/services/llmService')]; // Clear the require cache
      const llmService = require('../../src/services/llmService'); // Re-import the module

      expect(loggerInfoStub.calledWith('Using docker route')).to.be.true;
      expect(llmService.OLLAMA_ROUTE).to.equal('http://ollama:11434');
    });

    it('should log using model name from environment variables', async () => {
      process.env['MODEL_NAME'] = 'custom-model';
      delete require.cache[require.resolve('../../src/services/llmService')]; // Clear the require cache
      const llmService = require('../../src/services/llmService'); // Re-import the module

      expect(loggerInfoStub.calledWith('Using model name: ' + 'custom-model'))
        .to.be.true;
      expect(llmService.MODEL_NAME).to.equal('custom-model');
    });
  });

  describe('addUserPrompt and addBotHistory', () => {
    it('should return the correct user prompt context', () => {
      const prompt = 'User prompt';
      const context = addUserPrompt(prompt);

      expect(context).to.deep.equal([{ role: 'user', content: prompt }]);
    });

    it('should return the correct bot prompt context', () => {
      const prompt = 'Bot prompt';
      const context = addBotHistory(prompt);

      expect(context).to.deep.equal([{ role: 'assistant', content: prompt }]);
    });
  });

  describe('pingLLM', () => {
    it('should return true if LLM is reachable and log pre-loaded models', async () => {
      process.env['DOCKER'] = 'true';
      process.env['MODEL_NAME'] = 'codegeneval-llama3';
      delete require.cache[require.resolve('../../src/services/llmService')]; // Clear the require cache
      const llmService = require('../../src/services/llmService'); // Re-import the module

      axiosGetStub.resolves({
        status: 200,
        config: { url: llmService.OLLAMA_ROUTE },
      });

      axiosPostStub.resolves({ status: 200 });

      const result = await llmService.pingLLM();

      await new Promise(resolve => setTimeout(resolve, 1000));

      expect(result).to.be.true;
      expect(axiosGetStub.calledOnce).to.be.true;
      expect(axiosPostStub.calledTwice).to.be.true;

      expect(loggerInfoStub.calledWith(`${llmService.MODEL_NAME} pre-loaded`))
        .to.be.true;
      expect(loggerHttpStub.calledWith(`${200} ${llmService.OLLAMA_ROUTE}`)).to
        .be.true;
    });

    it('should return false if LLM is not reachable', async () => {
      axiosGetStub.rejects(new Error('Network Error'));

      const result = await pingLLM();
      expect(result).to.be.false;
      expect(axiosGetStub.calledOnce).to.be.true;
    });

    it('should log error and throw error if preloading LLM engine fails', async () => {
      process.env['DOCKER'] = 'true';
      process.env['MODEL_NAME'] = 'codegeneval-llama3';
      delete require.cache[require.resolve('../../src/services/llmService')]; // Clear the require cache
      const llmService = require('../../src/services/llmService'); // Re-import the module

      const error = new Error('Network Error');
      axiosGetStub.resolves({ status: 200 });
      axiosPostStub.rejects(error);

      try {
        await llmService.pingLLM();
      } catch (err) {
        const typedErr = err as Error;
        expect(typedErr.message).to.equal('Error preloading LLM engine');
        expect(loggerInfoStub.calledWith(error.message)).to.be.true;
      }
    });
  });

  describe('callLLM', () => {
    it('should return code generation response for valid CODEGEN_TAG prompt', async () => {
      const prompt = `Generate code ${CODEGEN_TAG}`;
      const context: LLMContext[] = [{ role: 'user', content: prompt }];
      const response: LLMChatResponse = { response: 'Generated code', context };

      axiosPostStub.resolves({
        status: 200,
        data: { done: true, response: 'Generated code' },
      });

      const result = await callLLM(prompt, context);
      expect(result).to.deep.equal(response);
      expect(axiosPostStub.calledOnce).to.be.true;
    });

    it('should return annotation response for valid ANNOTATE_TAG prompt', async () => {
      const prompt = `Annotate this ${ANNOTATE_TAG}`;
      const context: LLMContext[] = [{ role: 'user', content: prompt }];
      const response: LLMChatResponse = {
        response: 'Annotated content',
        context,
      };

      axiosPostStub.resolves({
        status: 200,
        data: { done: true, message: { content: 'Annotated content' } },
      });

      const result = await callLLM(prompt, context);
      expect(result).to.deep.equal(response);
      expect(axiosPostStub.calledOnce).to.be.true;
    });

    it('should log error and return null response for invalid prompt', async () => {
      const prompt = 'Invalid prompt';
      const context: LLMContext[] = [{ role: 'user', content: prompt }];

      const result = await callLLM(prompt, context);
      expect(result).to.deep.equal({ response: null, context });
      expect(loggerErrorStub.calledOnce).to.be.true;
      expect(
        loggerErrorStub.calledWith('Invalid prompt, must include a valid tag'),
      ).to.be.true;
    });

    it('should throw an error if the LLM API call fails', async () => {
      const prompt = `Generate code ${CODEGEN_TAG}`;
      const context: LLMContext[] = [{ role: 'user', content: prompt }];
      const error = new Error("LLM didn't respond with a valid response");

      axiosPostStub.rejects(error);

      try {
        await callLLM(prompt, context);
      } catch (err) {
        const typedErr = err as Error;
        expect(typedErr).to.equal(error);
        expect(loggerErrorStub.calledOnce).to.be.true;
        expect(
          loggerErrorStub.calledWith(`Error calling LLM: ${typedErr.message}`),
        ).to.be.true;
      }
    });

    it('should throw an error if LLM API response does not contain valid data', async () => {
      const prompt = `Generate code ${CODEGEN_TAG}`;
      const context: LLMContext[] = [{ role: 'user', content: prompt }];
      const invalidResponse = { status: 200, data: {} };

      axiosPostStub.resolves(invalidResponse);

      try {
        await callLLM(prompt, context);
      } catch (err) {
        const typedErr = err as Error;
        expect(typedErr.message).to.equal(
          "LLM didn't respond with a valid response",
        );
        expect(loggerErrorStub.calledOnce).to.be.true;
        expect(
          loggerErrorStub.calledWith(`Error calling LLM: ${typedErr.message}`),
        ).to.be.true;
      }
    });
  });
});
