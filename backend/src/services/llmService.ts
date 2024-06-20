import axios from "axios";

// TODO: Implement this function CORRECTLY
export async function callLLM(prompt: string): Promise<string> {
  try {
    const response = await axios.post("http://localhost:11434/api/generate", {
      model: "llama3",
      prompt: prompt,
      format: "json",
      stream: false,
    });

    if (
      response.status === 200 &&
      response.data &&
      response.data.generatedFunction
    ) {
      return response.data.generatedFunction;
    } else {
      throw new Error("Failed to generate function");
    }
  } catch (error: any) {
    console.error("Error calling LLM:", error.message);
    throw error;
  }
}
