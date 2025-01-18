# Define node alpine image version to build our App
FROM node:18.19.1-alpine AS build
# Define working directory /app
WORKDIR /app
# Copy all files to working directory /app
COPY . .
# Install all dependecies
RUN npm install
# Build all dependecies
RUN npm run build
# Serve Application using Nginx Server
# Define Nginx alpine image to serve our App
FROM nginx:alpine
# Copy default.conf file to Handle Requests
COPY default.conf /etc/nginx/conf.d/default.conf
# Copy our App files after building process to be served using nginx
COPY --from=build /app/dist/managing-contact-frontend/browser/ /usr/share/nginx/html/
# Expose port 80
EXPOSE 80
