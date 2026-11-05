# ─── Base: build tools for native modules (better-sqlite3, bcrypt) ───
FROM node:22-slim AS base
WORKDIR /app
RUN apt-get update \
    && apt-get install -y --no-install-recommends python3 make g++ \
    && rm -rf /var/lib/apt/lists/*
COPY package*.json ./

# ─── Development: hot reload via nest --watch ───
FROM base AS development
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "start:dev"]

# ─── Build: compile TypeScript ───
FROM base AS build
RUN npm install
COPY . .
RUN npm run build

# ─── Production: slim runtime, only prod deps ───
FROM node:22-slim AS production
WORKDIR /app
RUN apt-get update \
    && apt-get install -y --no-install-recommends python3 make g++ \
    && rm -rf /var/lib/apt/lists/*
COPY package*.json ./
RUN npm install --omit=dev
COPY --from=build /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/main.js"]
