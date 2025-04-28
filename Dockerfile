# Base image with Node.js 22
FROM node:22-slim AS builder

# Set working directory
WORKDIR /app

# Copy dependency definitions first (for caching)
COPY package.json yarn.lock ./

# Install dependencies only (using cache if no change)
RUN yarn install --frozen-lockfile

# Copy the full project (after dependencies)
COPY . .

# Optional: Run lint and tests here
# RUN yarn lint
RUN npx tsc
# RUN yarn test

# Build the app (NestJS to JS in dist/)
RUN yarn build


# Production image
FROM node:22-slim AS production

WORKDIR /app

# Copy only what's needed for production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# Expose app port (change if needed)
EXPOSE 3000

# Default command to run the app
CMD ["node", "dist/main.js"]
