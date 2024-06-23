# Use a supported Node.js LTS version as a base image
FROM node

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install nodemon globally (if not already installed)
RUN npm install -g nodemon

# Ensure ts-node and typescript are installed globally or locally as needed
RUN npm install -g ts-node typescript

# Install dependencies including devDependencies (needed for building native modules)
# Use --unsafe-perm=true --allow-root to avoid permission issues during npm install
RUN npm install --unsafe-perm=true --allow-root

# Copy the rest of the application code
COPY . .

# Expose the port on which the Node.js application will run
EXPOSE 3000

# Command to run the Node.js application with nodemon
CMD ["npm", "start"]
