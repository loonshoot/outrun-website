# Build stage
FROM node:18 AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run prod

# Production stage
FROM nginx:alpine AS production

# Copy the built static files
COPY --from=builder /app/_site /usr/share/nginx/html

# Copy our nginx configs
COPY nginx.conf /etc/nginx/nginx.conf

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --quiet --tries=1 --spider http://localhost:80/ || exit 1

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"] 