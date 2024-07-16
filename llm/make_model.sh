#!/bin/bash
model_name=${BASE_MODEL_NAME:-'llama3'}
custom_model_name=${MODEL_NAME:-'codegeneval-llama3'}
filename=${MODEL_FILE:-'LLMEngine.txt'}

# If DOCKER is true, use /bin/ollama as binpath
if [ "$DOCKER" = "true" ]; then
	binpath=/bin/ollama
else
	binpath=ollama
fi

# Start Ollama in the background.
echo "Starting Ollama..."
eval $binpath serve &

# Record Process ID.
pid=$!

# Pause for Ollama to start.
sleep 5

# Update and create model
echo "Pulling $model_name..."
eval $binpath pull $model_name
echo "Creating $custom_model_name..."
eval $binpath create $custom_model_name -f ./$filename

# kill Ollama
wait $pid

eval $binpath serve
