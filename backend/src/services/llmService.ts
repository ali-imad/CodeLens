import axios from 'axios';
import '../../src/utils/loadEnv';
import logger from '../utils/logger'; // Load environment variables

export const ANNOTATE_TAG = '[ANNOTATE]';
export const CODEGEN_TAG = '[CODEGEN]';

type LLMRole = 'user' | 'assistant';

export interface LLMContext {
  role: LLMRole;
  content: string;
}

export interface LLMChatResponse {
  response: string | null; // most recent response
  context?: LLMContext[] | undefined; // chat context
}

let OLLAMA_ROUTE = 'http://localhost:11434';
if (process.env['DOCKER'] === 'true') {
  logger.info(`Using docker route`);
  OLLAMA_ROUTE = 'http://ollama:11434';
}

let MODEL_NAME = 'codegeneval-llama3';
if (process.env['MODEL_NAME']) {
  logger.info('Using model name:', process.env['MODEL_NAME']);
  MODEL_NAME = process.env['MODEL_NAME'];
}

const addUserPrompt = (
  prompt: string,
  context?: LLMContext[],
): LLMContext[] => {
  logger.debug(`Adding user history with prompt: ${prompt}`);
  logger.debug(`Current context: ${context}`);
  if (!context) {
    return [{ role: 'user', content: prompt }];
  }

  context.push({ role: 'user', content: prompt });
  return context;
};

const addBotHistory = (
  prompt: string,
  context?: LLMContext[],
): LLMContext[] => {
  logger.debug(`Adding bot history with prompt: ${prompt}`);
  logger.debug(`Current context: ${context}`);
  if (!context) {
    return [{ role: 'assistant', content: prompt }];
  }

  context.push({ role: 'assistant', content: prompt });
  return context;
};

async function getCodeGenResp(
  prompt: string,
  context: LLMContext[] | undefined,
) {
  const req = {
    model: MODEL_NAME,
    prompt: prompt,
    stream: false,
  };

  logger.debug('Requesting LLM with:\n', req);

  const response = await axios.post(`${OLLAMA_ROUTE}/api/generate`, req);

  if (
    response.status === 200 &&
    response.data &&
    response.data.done &&
    response.data.response
  ) {
    context = addBotHistory(response.data.response, context);
    return {
      response: response.data.response,
      context,
    };
  } else {
    throw new Error("LLM didn't respond with a valid response");
  }
}

async function getAnnotateResp(context: LLMContext[]) {
  const req = {
    model: MODEL_NAME,
    messages: context,
    stream: false,
  };

  logger.debug('Requesting LLM with:\n', req);

  const response = await axios.post(`${OLLAMA_ROUTE}/api/chat`, req);

  if (
    response.status === 200 &&
    response.data &&
    response.data.done &&
    response.data.message.content
  ) {
    context = addBotHistory(response.data.message.content, context);
    return {
      response: response.data.message.content,
      context,
    };
  } else {
    throw new Error("LLM didn't respond with a valid response");
  }
}

const CODEGEN_ROUTE = `${OLLAMA_ROUTE}/api/generate`;
const CONTEXT_ROUTE = `${OLLAMA_ROUTE}/api/chat`;

export async function pingLLM(): Promise<boolean> {
  try {
    const response = await axios.get(OLLAMA_ROUTE);

    // Preload model for chat/prompts
    const preloadReq = { model: MODEL_NAME };
    Promise.all([
      axios.post(CODEGEN_ROUTE, preloadReq),
      axios.post(CONTEXT_ROUTE, preloadReq),
    ])
      .then((res: Awaited<axios.AxiosResponse<any>>[]) => {
        res.map((r: axios.AxiosResponse<any>) =>
          logger.http(`${r.status} ${r.config.url || ''}`),
        );
        logger.info(`${MODEL_NAME} pre-loaded`);
      })
      .catch((err: any) => {
        logger.info(err.message);
        throw new Error('Error preloading LLM engine');
      });
    logger.http(`${response.status} ${response.config.url}`);
    return response.status === 200;
  } catch (error: any) {
    return false;
  }
}

export async function callLLM(
  prompt: string,
  context?: LLMContext[],
): Promise<LLMChatResponse> {
  context = addUserPrompt(prompt, context);
  try {
    if (prompt.includes(CODEGEN_TAG)) {
      return await getCodeGenResp(prompt, context);
    } else if (prompt.includes(ANNOTATE_TAG)) {
      return await getAnnotateResp(context);
    } else {
      logger.error('Invalid prompt, must include a valid tag');
      return { response: null, context };
    }
  } catch (error: any) {
    logger.error(`Error calling LLM: ${error.message}`);
    throw error;
  }
}
