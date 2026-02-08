# Production Dockerfile for NestJS backend (build with Nx)
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --production=false
COPY . ./
# Build step (expects Nx + Nest app to exist)
RUN npx nx build backend --configuration=production

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist/apps/backend ./dist
COPY package.json package-lock.json ./
RUN npm ci --production=true
EXPOSE 3000
CMD ["node", "dist/main.js"]
