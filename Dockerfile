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
RUN mkdir -p /var/log/nginx /var/cache/nginx /var/run /etc/nginx/conf.d && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/run

# Remove any existing config files
RUN rm -f /etc/nginx/conf.d/default.conf

# Copy the built static files
COPY --from=builder /app/_site /usr/share/nginx/html
RUN chown -R nginx:nginx /usr/share/nginx/html

# Copy our nginx config
COPY nginx.conf /etc/nginx/nginx.conf
RUN chown nginx:nginx /etc/nginx/nginx.conf && \
    chmod 644 /etc/nginx/nginx.conf

# Create an empty default.conf to prevent the entrypoint script from creating one
RUN touch /etc/nginx/conf.d/default.conf && \
    chown nginx:nginx /etc/nginx/conf.d/default.conf && \
    chmod 644 /etc/nginx/conf.d/default.conf

# Verify the configuration
RUN nginx -t

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --quiet --tries=1 --spider http://localhost:80/ || exit 1

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"] 