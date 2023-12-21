# Use an official Node.js runtime as a base image
FROM node:14

# Set the working directory
WORKDIR /usr/src/app

# Install app dependencies
RUN npm install axios mysql2 express cors chart.js

# Copy the rest of the application files to the working directory
COPY . .

# Command to run your application
CMD ["node", "script.js"]
