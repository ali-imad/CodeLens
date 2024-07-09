#!/bin/bash
model_name=llama3
custom_model_name=codegeneval-llama3

# Start Ollama in the background.
echo "Starting Ollama..."
/bin/ollama serve &

# Record Process ID.
pid=$!

# Pause for Ollama to start.
sleep 5

# Update and create model
echo "Pulling $model_name..."
/bin/ollama pull $model_name
echo "Creating $custom_model_name..."
/bin/ollama create $custom_model_name -f ./LLMEngine.txt

# kill Ollama
wait $pid

/bin/ollama serve
