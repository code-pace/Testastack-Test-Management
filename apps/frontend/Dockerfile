# Production Dockerfile for Angular frontend (build with Nx)
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --production=false
COPY . ./
# Build step (expects Nx + Angular app to exist)
RUN npx nx build frontend --configuration=production

FROM nginx:stable-alpine
COPY --from=builder /app/dist/apps/frontend /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
