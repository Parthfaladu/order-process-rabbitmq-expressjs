# Dockerfile for service-one-ts
FROM node:18-alpine

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app's source code and compile TypeScript
COPY . .

# Compile TypeScript files
#RUN npm run build

# Expose the app on port 3000
EXPOSE 3004

# Start the app using the built JavaScript files
CMD ["npm", "run", "start:dev"]
