#!/bin/bash
model_name=llama3
custom_model_name=codegeneval-llama3

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
eval $binpath create $custom_model_name -f ./LLMEngine.txt

# kill Ollama
wait $pid

eval $binpath serve
