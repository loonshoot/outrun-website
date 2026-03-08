# Build stage
FROM oven/bun:1 AS builder

WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install
COPY . .
RUN bun run build

# SDK CDN upload — runs only when build args are provided (Skyforge prod builds).
# ARGs declared after `bun run build` so credential changes don't bust the build cache.
# Credentials stay in the builder stage and never reach the final nginx image.
ARG SDK_S3_ENDPOINT
ARG SDK_S3_BUCKET
ARG SDK_AWS_ACCESS_KEY_ID
ARG SDK_AWS_SECRET_ACCESS_KEY

RUN if [ -n "$SDK_AWS_ACCESS_KEY_ID" ]; then \
      NODE_TLS_REJECT_UNAUTHORIZED=0 \
      SDK_S3_ENDPOINT="$SDK_S3_ENDPOINT" \
      SDK_S3_BUCKET="$SDK_S3_BUCKET" \
      SDK_AWS_ACCESS_KEY_ID="$SDK_AWS_ACCESS_KEY_ID" \
      SDK_AWS_SECRET_ACCESS_KEY="$SDK_AWS_SECRET_ACCESS_KEY" \
      bun run upload-sdk.mjs || echo "[sdk-upload] failed — continuing build"; \
    fi

# Production stage - unprivileged nginx runs as uid 101, listens on 8080
FROM nginxinc/nginx-unprivileged:alpine AS production

# Copy the built static files (_site is 11ty default output)
COPY --from=builder /app/_site /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080
