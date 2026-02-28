# Dockerfile for Vue 3 + Vite + TypeScript project

FROM node:18-alpine

# Set working directory
WORKDIR /app

# copy package.json and package-lock (install deps first for caching)
COPY package*.json ./

# install dependencies
RUN npm ci

# copy rest of the project
COPY . .

# expose vite dev server port
EXPOSE 5173

# default command
CMD ["npm", "run", "dev"]
