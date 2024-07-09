# Start from the official Ollama image
FROM ollama/ollama:latest

# working directory inside the container
RUN mkdir -p /llm
WORKDIR /llm

# Get script to copy/pull llama3-7B model
#COPY ./setup_models.sh /llm/setup_models.sh
#RUN chmod +x /llm/setup_models.sh

# Get script to finetune the model
COPY ./make_model.sh ./make_model.sh
COPY ./LLMEngine.txt ./LLMEngine.txt
RUN chmod +x ./make_model.sh

# Expose port 11434
EXPOSE 11434

# Run the Ollama server
ENTRYPOINT ["/bin/ollama"]
CMD ["serve", "&"]

# Run the script to copy/pull/make/update the model
ENTRYPOINT ["/bin/sh"]
CMD ["./make_model.sh"]


