# 單一 Dockerfile - 整合後端和前端
# 使用 Nginx 為統一入口點，前端和後端運行在同一容器中

# ==================== 階段 1：構建前端 ====================
FROM node:18-alpine AS frontend-builder

WORKDIR /app

# 複製前端 package.json 和 package-lock.json
COPY frontend/package*.json ./

# 安裝前端依賴（使用 npm ci 更快）
RUN npm ci

# 複製前端源代碼
COPY frontend/ ./

# 構建 React 應用
RUN npm run build

# 驗證構建輸出
RUN ls -la /app/build/ && \
    test -f /app/build/index.html && echo "✓ Frontend build successful" || (echo "✗ Frontend build failed" && exit 1)

# ==================== 階段 2：準備後端 ====================
FROM node:18-alpine AS backend-prep

WORKDIR /app

# 複製後端 package.json 和 package-lock.json
COPY backend/package*.json ./

# 安裝後端依賴（使用 npm ci 更快）
RUN npm ci --only=production

# 複製後端源代碼
COPY backend/ ./

# 驗證後端文件
RUN test -f /app/index.js && echo "✓ Backend files ready" || (echo "✗ Backend files missing" && exit 1)

# ==================== 最終階段：整合前端和後端 ====================
FROM node:18-alpine

WORKDIR /app

# 安裝必要套件
RUN apk add --no-cache dumb-init nginx gettext curl

# 設置 NODE_ENV 為 production
ENV NODE_ENV=production

# 複製前端與後端
COPY --from=frontend-builder /app/build /app/build
COPY --from=backend-prep /app /app

# 驗證文件複製
RUN ls -la /app/build/ && \
    test -f /app/build/index.html && echo "✓ Frontend build copied" || (echo "✗ Frontend build copy failed" && exit 1)

# 複製 nginx config（使用正確的 root 路徑）
RUN echo 'server {\
    listen 80;\
    server_name _;\
    \
    root /app/build;\
    index index.html index.htm;\
    \
    gzip on;\
    gzip_vary on;\
    gzip_min_length 1024;\
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;\
    \
    location /api {\
        proxy_pass http://127.0.0.1:3000;\
        proxy_http_version 1.1;\
        proxy_set_header Upgrade $http_upgrade;\
        proxy_set_header Connection "upgrade";\
        proxy_set_header Host $host;\
        proxy_cache_bypass $http_upgrade;\
        proxy_set_header X-Real-IP $remote_addr;\
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\
        proxy_set_header X-Forwarded-Proto $scheme;\
    }\
    \
    location /admin-api {\
        proxy_pass http://127.0.0.1:3000;\
        proxy_http_version 1.1;\
        proxy_set_header Upgrade $http_upgrade;\
        proxy_set_header Connection "upgrade";\
        proxy_set_header Host $host;\
        proxy_cache_bypass $http_upgrade;\
        proxy_set_header X-Real-IP $remote_addr;\
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\
        proxy_set_header X-Forwarded-Proto $scheme;\
    }\
    \
    location / {\
        try_files $uri $uri/ /index.html =404;\
        \
        location ~* \\.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot|html|htm|json|xml)$ {\
            expires 1y;\
            add_header Cache-Control "public, immutable";\
            try_files $uri =404;\
        }\
        \
        add_header X-Frame-Options "SAMEORIGIN" always;\
        add_header X-Content-Type-Options "nosniff" always;\
        add_header X-XSS-Protection "1; mode=block" always;\
    }\
    \
    error_page 404 /index.html;\
    \
    access_log /dev/stdout;\
    error_log /dev/stdout;\
}' > /etc/nginx/conf.d/default.conf

# 複製啟動腳本
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

# 暴露端口（Nginx 端口）
EXPOSE 80

# 使用 dumb-init 來正確處理信號
ENTRYPOINT ["dumb-init", "--"]
CMD ["/app/start.sh"]
