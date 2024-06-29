# LLM Service for CodeLens

## How to run

LLMEngine.txt contains Ollama Modelfile information to compile the custom model.
Make sure you have Ollama, and "make_model.sh" has executable permissions, then
run "make_model.sh" and the custom model will be built + deployed at
localhost:11434

## Usage

The model will produce code snippet outputs if prompts are prepended by
"[CODEGEN]". If a prompt contains strictly "[ANNOTATE]", it will produce and
annotate the previously generated code snippet with
