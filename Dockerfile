# Build stage
FROM node:26-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci 

COPY . .

RUN npm run build

# Production stage
FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/dist /usr/share/nginx/html

RUN addgroup -S appgroup -g 1001 && \
    adduser -S appuser -u 1001 -G appgroup

RUN chown -R appuser:appgroup /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]