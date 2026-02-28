# Dockerfile for Vue 3 + Vite + TypeScript project

FROM node:20.19-alpine

# Set working directory
WORKDIR /app

# copy package.json and package-lock (install deps first for caching)
COPY package*.json ./

# install dependencies
RUN npm ci

# copy rest of the project
COPY . .

# expose HTTP port (serve on port 80 inside container)
EXPOSE 80

# default command
CMD ["npm", "run", "dev"]
