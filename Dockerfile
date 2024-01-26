# Stage 1: Building the code
FROM node:latest as builder

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies including devDependencies
RUN npm install

# Copy the rest of the code
COPY . .

# Build the project (TypeScript compilation)
RUN npm run build

# Stage 2: Running the code
FROM node:latest

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install only production dependencies
RUN npm install --production

# Copy built assets (JavaScript files, .next directory, etc.) from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
# If you have other directories or files to copy, add them here

# Expose the port the app runs on
EXPOSE 3001

# Start the application
CMD ["npm", "start"]
