# 單一 Dockerfile - 整合後端和前端
# 使用 Nginx 為統一入口點，前端和後端運行在同一容器中

# ==================== 階段 1：構建前端 ====================
FROM node:18-alpine AS frontend-builder

WORKDIR /app

# 複製前端 package.json
COPY frontend/package*.json ./

# 安裝前端依賴（使用 npm install 兼容性更好）
RUN npm install

# 複製前端源代碼
COPY frontend/ ./

# 構建 React 應用
RUN npm run build

# ==================== 階段 2：準備後端 ====================
FROM node:18-alpine AS backend-prep

WORKDIR /app

# 複製後端 package.json
COPY backend/package*.json ./

# 安裝後端依賴（只安裝生產依賴）
RUN npm install --only=production

# 複製後端源代碼
COPY backend/ ./

# ==================== 最終階段：整合前端和後端 ====================
FROM node:18-alpine

# 安裝必要的工具和 nginx
RUN apk add --no-cache dumb-init nginx

# 創建應用目錄
WORKDIR /app

# 設置 NODE_ENV 為 production
ENV NODE_ENV=production

# 從前端構建階段複製構建好的文件
COPY --from=frontend-builder /app/build /app/frontend/build

# 從後端準備階段複製後端文件
COPY --from=backend-prep /app /app

# 複製 nginx 配置
COPY nginx-render.conf /etc/nginx/conf.d/default.conf

# 創建啟動腳本
RUN echo '#!/bin/sh\n\
# 啟動後端服務在後台（監聽 3000 端口）\n\
echo "Starting backend server on port 3000..."\n\
node index.js &\n\
BACKEND_PID=$!\n\
\n\
# 啟動 nginx（監聽 80 端口）\n\
echo "Starting nginx on port 80..."\n\
nginx &\n\
NGINX_PID=$!\n\
\n\
# 等待任一進程退出\n\
wait -n $BACKEND_PID $NGINX_PID\n\
\n\
# 如果其中一個進程退出，終止所有進程\n\
echo "One of processes exited. Terminating..."\n\
kill $BACKEND_PID $NGINX_PID 2>/dev/null\n\
' > /app/start.sh && chmod +x /app/start.sh

# 創建非 root 用戶以提高安全性
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# 更改所有權限
RUN chown -R nodejs:nodejs /app

# 配置 nginx 權限
RUN chown -R nodejs:nodejs /var/lib/nginx && \
    chown -R nodejs:nodejs /var/log/nginx && \
    mkdir -p /run/nginx && \
    chown -R nodejs:nodejs /run/nginx

# 切換到非 root 用戶
USER nodejs

# 暴露端口（Nginx 端口）
EXPOSE 80

# 使用 dumb-init 來正確處理信號
ENTRYPOINT ["dumb-init", "--"]
CMD ["/app/start.sh"]
