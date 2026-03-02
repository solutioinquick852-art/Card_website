FROM node:18-alpine AS builder

WORKDIR /app

COPY backend/package*.json ./

RUN npm ci --only=production

COPY backend/ ./

FROM node:18-alpine AS production

WORKDIR /app

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --chown=nodejs:nodejs backend/ ./
COPY --chown=nodejs:nodejs frontend/ ./frontend/

USER nodejs

EXPOSE 3000


HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/', (r) => { if (r.statusCode !== 200) process.exit(1); }).on('error', () => process.exit(1))"

CMD ["npm", "start"]
