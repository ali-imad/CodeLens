# Use a supported Node.js LTS version as a base image
FROM node

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port 8080 (adjust as needed for your application)
EXPOSE 5173

# Command to run the application
CMD ["npm", "run", "dev"]
