FROM node:18 AS build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build --prod

FROM nginx:alpine
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

RUN echo 'server { \
  listen 80; \
    server_name localhost; \
    location / { \
      root   /usr/share/nginx/html; \
      index  index.html index.htm; \
      try_files $uri $uri/ /index.html; \
    } \
    error_page 404 /index.html; \
    error_page 500 502 503 504 /index.html; \
    location = /index.html { \
      root /usr/share/nginx/html; \
      internal; \
    } \
  }' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]