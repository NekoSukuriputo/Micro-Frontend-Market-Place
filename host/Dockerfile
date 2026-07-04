# Tahap 1: Build
FROM node:22-alpine AS builder
WORKDIR /app

# Copy package.json dan install dependencies
COPY package*.json ./
RUN npm install

# Copy seluruh source code
COPY . .

# Jalankan proses build
RUN npm run build

# Tahap 2: Production Server (Nginx)
FROM nginx:alpine
# Copy hasil build ke folder Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx.conf untuk menangani routing SPA (Single Page Application)
RUN echo -e 'server {\n\
    listen 80;\n\
    location ~* ^/(index\.html)$ {\n\
        root /usr/share/nginx/html;\n\
        add_header Cache-Control "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0";\n\
    }\n\
    location / {\n\
        root /usr/share/nginx/html;\n\
        index index.html index.htm;\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
