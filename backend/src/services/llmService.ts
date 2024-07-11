import axios from 'axios';

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

const addUserPrompt = (
  prompt: string,
  context?: LLMContext[],
): LLMContext[] => {
  // TODO: replace with debug print
  // console.log(`Adding user history with prompt: ${prompt}`);
  // console.log(`Current context: ${context}`);
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
  // TODO: replace with debug print
  // console.log(`Adding bot history with prompt: ${prompt}`);
  // console.log(`Current context: ${context}`);
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
    model: 'codegeneval-llama3',
    prompt: prompt,
    stream: false,
  };

  // TODO: replace with debug print
  // console.log('Requesting LLM with:\n', req);

  const response = await axios.post('http://ollama:11434/api/generate', req);

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
    model: 'codegeneval-llama3',
    messages: context,
    stream: false,
  };

  // TODO: replace with debug print
  // console.log('Requesting LLM with:\n', req);

  const response = await axios.post('http://ollama:11434/api/chat', req);

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

export async function pingLLM(): Promise<boolean> {
  try {
    const response = await axios.get('http://ollama:11434/');
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
      console.error('Invalid prompt, must include a valid tag');
      return { response: null, context };
    }
  } catch (error: any) {
    console.error('Error calling LLM:', error.message);
    throw error;
  }
}
