# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about the recommended Project Setup and IDE Support in the [Vue Docs TypeScript Guide](https://vuejs.org/guide/typescript/overview.html#project-setup).

## Docker Development Environment

This project includes a `Dockerfile` and `docker-compose.yml` to run the dev server inside a container.

1. Build and start the container:
   ```sh
   docker-compose up --build
   ```
2. Access the app at [http://localhost:5173](http://localhost:5173).
3. Sources are mounted as a volume; changes will trigger Vite hot reload.

The container uses Node 18-alpine and installs dependencies with `npm ci`.
