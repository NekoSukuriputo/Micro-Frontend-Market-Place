# Tahap 1: Build
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Tahap 2: Production Server (Nginx)
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html

RUN echo -e 'server {\n\
    listen 80;\n\
    location / {\n\
        root /usr/share/nginx/html;\n\
        index index.html index.htm;\n\
        try_files $uri $uri/ /index.html;\n\
        \n\
        # Konfigurasi CORS untuk MicroFE\n\
        add_header Access-Control-Allow-Origin *;\n\
        add_header Access-Control-Allow-Methods "GET, OPTIONS";\n\
        add_header Access-Control-Allow-Headers "*";\n\
    }\n\
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
