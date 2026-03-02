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

# ==================== 階段 2：準備後端 ====================
FROM node:18-alpine AS backend-prep

WORKDIR /app

# 複製後端 package.json 和 package-lock.json
COPY backend/package*.json ./

# 安裝後端依賴（使用 npm ci 更快）
RUN npm ci --only=production

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

# 創建啟動腳本（保持 root 用戶）
RUN echo '#!/bin/sh\n\
# 設置錯誤處理\n\
set -e\n\
\n\
# 啟動後端服務在後台（監聽 3000 端口）\n\
echo "Starting backend server on port 3000..."\n\
node index.js &\n\
BACKEND_PID=$!\n\
\n\
# 啟動 nginx（監聽 80 端口）\n\
echo "Starting nginx on port 80..."\n\
nginx -g "daemon off;" &\n\
NGINX_PID=$!\n\
\n\
# 等待任一進程退出\n\
wait -n $BACKEND_PID $NGINX_PID || true\n\
\n\
# 如果其中一個進程退出，終止所有進程\n\
echo "One of processes exited. Terminating..."\n\
kill $BACKEND_PID $NGINX_PID 2>/dev/null || true\n\
' > /app/start.sh && chmod +x /app/start.sh

# 暴露端口（Nginx 端口）
EXPOSE 80

# 使用 dumb-init 來正確處理信號
ENTRYPOINT ["dumb-init", "--"]
CMD ["/app/start.sh"]
