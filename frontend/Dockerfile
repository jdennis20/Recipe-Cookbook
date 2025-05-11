# Stage 1: Build the React app
FROM node:16-alpine AS build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Accept build arguments for environment variables
ARG REACT_APP_IP
ARG REACT_APP_PORT
ARG REACT_APP_API_PORT

# Set environment variables for the build process
ENV REACT_APP_IP=$REACT_APP_IP
ENV REACT_APP_PORT=$REACT_APP_PORT
ENV REACT_APP_API_PORT=$REACT_APP_API_PORT

# Copy the rest of the application code to the working directory
COPY . .

# Build the React app for production
RUN npm run build

# Stage 2: Serve the React app with Nginx
FROM nginx:alpine

# Copy the built React app from the previous stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy the custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose the port for the Nginx server
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]