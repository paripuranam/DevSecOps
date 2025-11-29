# Buld the app
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build

# Serve with NGINX

FROM alpine:3.20

RUN apk update && apk add --no-cache nginx

# COPY --from=build /app/dist /usr/share/nginx/html

COPY --from=build /app/dist /var/www/localhost/htdocs/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
