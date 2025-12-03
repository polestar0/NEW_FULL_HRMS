# Multi-stage build for production
FROM node:18-alpine as builder

WORKDIR /app

# Copy package files
COPY package.json ./

# Use npm install instead of npm ci
RUN npm install --only=production

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets from builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Copy nginx config if you have one
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]