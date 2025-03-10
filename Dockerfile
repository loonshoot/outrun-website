# Build stage
FROM node:18 AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run prod

# Production stage
FROM nginx:alpine AS production

# Create necessary directories with proper permissions
RUN mkdir -p /var/log/nginx && \
    chown -R nginx:nginx /var/log/nginx

# Copy the built static files
COPY --from=builder /app/_site /usr/share/nginx/html
RUN chown -R nginx:nginx /usr/share/nginx/html

# Copy our nginx config
COPY nginx.conf /etc/nginx/nginx.conf
RUN chown nginx:nginx /etc/nginx/nginx.conf && \
    chmod 644 /etc/nginx/nginx.conf && \
    nginx -t

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --quiet --tries=1 --spider http://localhost:80/ || exit 1

# Expose port 80
EXPOSE 80

# Switch to nginx user for better security
USER nginx

CMD ["nginx", "-g", "daemon off;"] 