#!/bin/sh
set -e

echo "Starting backend..."
node server.js &

echo "Starting nginx..."
exec dumb-init nginx -g "daemon off;"