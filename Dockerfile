# -------- Stage 1: Build the Vite React App --------
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy the entire project
COPY . .

# Build the app
RUN npm run build


# -------- Stage 2: Serve with NGINX --------
FROM nginx:alpine

# Replace default nginx website content with dist folder
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]
