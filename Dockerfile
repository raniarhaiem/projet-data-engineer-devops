# Use an official Node.js runtime as a base image
FROM node:14

# Set the working directory
WORKDIR /usr/src/app

# Install app dependencies
RUN npm install axios config mysql2 express chart.js

# Copy the rest of the application files to the working directory
COPY . .

# Copy the wait-for script
COPY wait-for-it.sh /usr/src/app/wait-for-it.sh

# Command to run your application
CMD ["node", "script.js"]

