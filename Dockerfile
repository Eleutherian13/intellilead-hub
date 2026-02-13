# ==========================================
# Multi-stage Dockerfile for IntelliLead Hub
# ==========================================

# Stage 1: Build Client
FROM node:18-alpine AS client-builder
WORKDIR /app/client

# Copy client package files
COPY client/package*.json ./
RUN npm ci --only=production

# Copy client source
COPY client/ ./

# Build client for production
RUN npm run build

# Stage 2: Build Server
FROM node:18-alpine AS server-builder
WORKDIR /app/server

# Copy server package files
COPY server/package*.json ./
RUN npm ci --only=production

# Copy server source
COPY server/ ./

# Stage 3: Production Image
FROM node:18-alpine
WORKDIR /app

# Install production dependencies
RUN apk add --no-cache curl

# Copy server files and dependencies
COPY --from=server-builder /app/server /app/server

# Copy built client files
COPY --from=client-builder /app/client/dist /app/client/dist

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001
USER nodejs

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:5000/api/health || exit 1

# Set working directory to server
WORKDIR /app/server

# Start the application
CMD ["node", "src/index.js"]
