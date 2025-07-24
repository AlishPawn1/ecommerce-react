# Use official Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the application
COPY . .

# Build the React app
RUN npm run build

# Use Nginx to serve the build files
FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html

# Expose port (change if your admin runs on a different port)
EXPOSE 5174

# Start Nginx
CMD ["nginx", "-g", "daemon off;"] 