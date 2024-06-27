import axios from 'axios';

interface LLMResponse {
  response: string|null;
}

export async function callLLM(prompt: string): Promise<LLMResponse> {
  // TODO: Implement case switching with the prompt based on the prepending
  //  '[XYZ]' tag
  try {
    const req = {
      model: 'codegeneval-llama3',
      prompt: prompt,
      stream: false,
      // format: 'json', // breaks the response
    }

    // TODO: replace with debug print
    //console.log("Requesting LLM with:\n", req)

    const response = await axios.post('http://localhost:11434/api/generate', req);

    if (response.status === 200 && response.data && response.data.done && response.data.response) {
      return {
        response: response.data.response,
      }
    } else {
      return {
        response: null
      }
    }
  } catch (error: any) {
    console.error('Error calling LLM:', error.message);
    throw error;
  }
}
