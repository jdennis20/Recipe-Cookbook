# Use the official Node.js image as the base image
FROM node:20

# Set the working directory inside the container
WORKDIR /usr/src/app

# Install system dependencies for bcrypt and node-gyp
RUN apt-get update && apt-get install -y python3 build-essential && apt-get clean

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Define build arguments for environment variables
ARG DB_USER
ARG DB_PASSWORD
ARG DB_HOST
ARG DB_PORT
ARG DB_NAME
ARG SPOONACULAR_API
ARG JWT_SECRET

# Set environment variables from build arguments
ENV DB_USER=$DB_USER \
    DB_PASSWORD=$DB_PASSWORD \
    DB_HOST=$DB_HOST \
    DB_PORT=$DB_PORT \
    DB_NAME=$DB_NAME \
    SPOONACULAR_API=$SPOONACULAR_API \
    JWT_SECRET=$JWT_SECRET

# Expose the port your app runs on
EXPOSE 5000

# Start the application
CMD ["node", "index.js"]