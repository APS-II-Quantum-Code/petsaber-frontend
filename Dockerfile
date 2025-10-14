# Multi-stage Dockerfile for Vite + React app

# 1) Build stage
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies using lockfile for reproducible builds
# Copy only the manifests first to leverage Docker layer cache
COPY package.json package-lock.json* ./

# If package-lock.json exists, use npm ci; fallback to npm install
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Copy the rest of the source code
COPY . .

# Build the production assets
RUN npm run build

# 2) Runtime stage using Nginx
FROM nginx:alpine AS runner

# Remove default config and create a SPA-friendly one for React Router
RUN rm -f /etc/nginx/conf.d/default.conf && \
    printf 'server {\n  listen 80;\n  server_name _;\n  root /usr/share/nginx/html;\n  index index.html;\n\n  # Serve built assets directly\n  location /assets/ {\n    try_files $uri =404;\n  }\n\n  # Let React Router handle other routes\n  location / {\n    try_files $uri /index.html;\n  }\n}\n' > /etc/nginx/conf.d/default.conf

# Copy built files from builder
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
