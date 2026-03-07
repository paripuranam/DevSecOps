# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci --only=production && \
    npm cache clean --force

COPY . .

RUN npm run build

# Production stage
FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/dist /usr/share/nginx/html

RUN addgroup -S appgroup -g 1001 && \
    adduser -S appuser -u 1001 -G appgroup

RUN chown -R appuser:appgroup /usr/share/nginx/html/

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]