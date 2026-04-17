# Use Node 20 (Lightweight Alpine version)
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install Javascript tools
RUN npm install

# Copy all your Next.js code
COPY . .

# Build the Next.js app for production
RUN npm run build

# Expose the port Next.js uses
EXPOSE 3000

# The command to start your Next.js frontend
CMD ["npm", "start"]