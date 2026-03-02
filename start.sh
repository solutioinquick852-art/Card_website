#!/bin/sh
set -e

echo "=== Starting Card Inventory Application ==="
echo ""

# 檢查工作目錄
echo "Working directory: $(pwd)"
echo ""

# 檢查文件是否存在
echo "Checking files..."
ls -la /app/

echo ""
echo "Checking frontend build directory..."
ls -la /app/frontend/ 2>/dev/null || echo "Frontend directory not found"

echo ""
echo "Checking for index.html..."
find /app -name "index.html" -type f

echo ""
echo "Checking backend files..."
ls -la /app/*.js 2>/dev/null || echo "Backend files not found in /app"

echo ""
if [ ! -f "/app/index.js" ]; then
    echo "ERROR: Backend index.js not found in /app!"
    exit 1
fi

if [ ! -d "/app/frontend/build" ]; then
    echo "ERROR: Frontend build directory not found at /app/frontend/build!"
    exit 1
fi

if [ ! -f "/app/frontend/build/index.html" ]; then
    echo "ERROR: Frontend index.html not found!"
    ls -la /app/frontend/build/
    exit 1
fi

echo "✓ All required files found"
echo ""

# 啟動後端服務在後台（監聽 3000 端口）
echo "Starting backend server on port 3000..."
cd /app
node index.js &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"
sleep 2

# 檢查後端是否成功啟動
if ps -p $BACKEND_PID > /dev/null; then
    echo "✓ Backend started successfully"
else
    echo "✗ Backend failed to start"
    exit 1
fi

echo ""
# 啟動 nginx（監聽 80 端口）
echo "Starting nginx on port 80..."
nginx -g "daemon off;" -t
if [ $? -eq 0 ]; then
    echo "✓ Nginx configuration is valid"
else
    echo "✗ Nginx configuration is invalid"
    exit 1
fi

nginx -g "daemon off;" &
NGINX_PID=$!
echo "Nginx PID: $NGINX_PID"
sleep 1

# 檢查 nginx 是否成功啟動
if ps -p $NGINX_PID > /dev/null; then
    echo "✓ Nginx started successfully"
else
    echo "✗ Nginx failed to start"
    exit 1
fi

echo ""
echo "=== Services Ready ==="
echo "Frontend: http://0.0.0.0:80"
echo "Backend: http://0.0.0.0:3000"
echo ""

# 等待任一進程退出
wait -n $BACKEND_PID $NGINX_PID || true

# 如果其中一個進程退出，終止所有進程
echo ""
echo "=== One of processes exited ==="
echo "Terminating all processes..."
kill $BACKEND_PID $NGINX_PID 2>/dev/null || true
echo "Done."
