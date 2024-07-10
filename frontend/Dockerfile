# Use the Node.js version 20.0 image version as a base image
FROM node:20

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port 5173
EXPOSE 5173

# Command to run the application
CMD ["npm", "run", "dev"]
