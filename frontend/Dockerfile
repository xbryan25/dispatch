# Use Node.js LTS image
FROM node:20-alpine

# Set working directory inside container
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package files for dependency install (for caching)
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy app source
COPY . .

# Build the Next.js app
RUN pnpm build

# Expose Next.js default port
EXPOSE 3000

# Start the app
CMD ["pnpm", "start"]