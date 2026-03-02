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
    test -f /app/build/index.html && echo "✓ Frontend build successful" || echo "✗ Frontend build failed"

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
RUN test -f /app/index.js && echo "✓ Backend files ready" || echo "✗ Backend files missing"

# ==================== 最終階段：整合前端和後端 ====================
FROM node:18-alpine

# 安裝必要套件
RUN apk add --no-cache dumb-init nginx gettext curl

WORKDIR /app

# 設置 NODE_ENV 為 production
ENV NODE_ENV=production

# 複製前端與後端
COPY --from=frontend-builder /app/build /app/frontend/build
COPY --from=backend-prep /app /app

# 驗證文件複製
RUN ls -la /app/frontend/build/ && \
    test -f /app/frontend/build/index.html && echo "✓ Frontend build copied" || echo "✗ Frontend build copy failed"

# 複製 nginx config 模板
COPY nginx-render.conf.template /etc/nginx/conf.d/default.conf

# 複製啟動腳本
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

# 暴露端口（Nginx 端口）
EXPOSE 80

# 使用 dumb-init 來正確處理信號
ENTRYPOINT ["dumb-init", "--"]
CMD ["/app/start.sh"]
