#!/bin/zsh
model_name="llama3"
custom_model_name="codegeneval-llama3"
ollama pull $model_name
ollama create $custom_model_name -f ./LLMEngine.txt
#ollama serve
