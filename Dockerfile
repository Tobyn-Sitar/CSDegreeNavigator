# Stage 1: Build the Next.js application
FROM node:lts-alpine as build-stage

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all project files into the container
COPY . .

# Build the Next.js application
RUN npm run build

# Stage 2: Create a lightweight production image
FROM node:lts-alpine

# Set the working directory
WORKDIR /graphical-degree-progress

# Copy only the built application from the previous stage
COPY --from=build-stage /app ./

# Install a lightweight web server for serving static files (optional, but good for performance)
RUN npm install -g serve

# Expose the port Next.js runs on
EXPOSE 3000

# Command to start the Next.js app
CMD ["npm", "run", "start"]
