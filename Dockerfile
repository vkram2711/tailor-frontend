# Stage 1: Build React frontend
FROM node:20-alpine AS frontend-build

WORKDIR /app/frontend

COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

COPY frontend/ .

# Empty baseURL means axios will use relative paths, proxied by nginx
ARG REACT_APP_BACKEND_BASE_URL=""
ENV REACT_APP_BACKEND_BASE_URL=$REACT_APP_BACKEND_BASE_URL

RUN npm run build

# Stage 2: Combined runtime image
FROM python:3.10-slim-bookworm

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    nginx \
    supervisor \
    gcc \
    libffi-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source
COPY backend/ ./backend/

# Copy built frontend to nginx web root
COPY --from=frontend-build /app/frontend/build /usr/share/nginx/html

# Copy configs
COPY nginx.conf /etc/nginx/conf.d/default.conf.template
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Entrypoint substitutes $PORT into nginx config then starts supervisord
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 10000

CMD ["/entrypoint.sh"]
