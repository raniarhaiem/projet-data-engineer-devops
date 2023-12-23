# Use an official Node.js runtime as a base image
FROM node:14

# Set the working directory
WORKDIR /usr/src/app

# Copy the application files to the working directory
COPY . .

# Install app dependencies
RUN npm install 

# Command to run your application
CMD ["node", "script.js"]

