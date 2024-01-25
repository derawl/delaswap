# Step 1: Use an official Node base image
FROM node:16

# Set the working directory in the Docker container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or yarn.lock) to the container
COPY package*.json ./

# Install dependencies in the container
RUN npm install

# Copy the rest of your app's source code from your host to your image filesystem.
COPY . .

# Your app binds to port 3000, so you'll use the EXPOSE instruction to have it mapped by the docker daemon
EXPOSE 3000

# Define the command to run your app using CMD which defines your runtime
CMD ["yarn", "workspace", "@my-app/react-app", "start"]