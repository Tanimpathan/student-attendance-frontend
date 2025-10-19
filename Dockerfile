# Step 1: Build the Angular app
FROM node:20-alpine AS build

WORKDIR /app

# Copy package.json and package-lock.json (if present)
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy all source files
COPY . .

# Build the Angular app for production
RUN npm run build

# Step 2: Serve using Nginx
FROM nginx:alpine

# Copy built files from the previous stage
COPY --from=build /app/dist/duar-code-test-frontend/browser /usr/share/nginx/html

# Copy custom nginx config (optional)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
