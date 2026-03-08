# -------- BUILD STAGE --------
FROM node:20 AS build

# Declare build args (passed from docker-compose or CLI)
ARG VITE_APP_NAME
ARG VITE_BASE_URL
ARG VITE_FASTAPI_BASE_URL
ARG VITE_CASHFREE_ENVIRONMENT
ARG VITE_GOOGLE_CLIENT_ID

# Expose as env vars so Vite picks them up at build time
ENV VITE_APP_NAME=$VITE_APP_NAME
ENV VITE_BASE_URL=$VITE_BASE_URL
ENV VITE_FASTAPI_BASE_URL=$VITE_FASTAPI_BASE_URL
ENV VITE_CASHFREE_ENVIRONMENT=$VITE_CASHFREE_ENVIRONMENT
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy project
COPY . .

# Build Vite app
RUN npm run build

# -------- PRODUCTION STAGE --------
FROM nginx:alpine

# Remove default nginx config
RUN rm -rf /etc/nginx/conf.d/default.conf

# Copy custom config (optional)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build files
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]