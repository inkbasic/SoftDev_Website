# ---- Base Stage ----
FROM node:20-alpine AS base
WORKDIR /app

# Install dependencies only when needed
COPY package*.json ./
RUN npm ci

# ---- Build Stage ----
FROM base AS build
WORKDIR /app
COPY . .
RUN npm run build

# ---- Production Stage ----
FROM node:20-alpine AS prod
WORKDIR /app

# Install serve globally
RUN npm install -g serve

# Copy only the built files
COPY --from=build /app/dist ./dist

# Expose port
EXPOSE 5173

# Serve the built files
CMD ["serve", "-s", "dist", "-l", "5173"]