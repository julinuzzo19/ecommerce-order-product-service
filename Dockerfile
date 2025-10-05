FROM node:22-alpine AS builder

WORKDIR /app

# Instalar herramientas necesarias
RUN apk add --no-cache openssl

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production && npm cache clean --force

# Copiar código fuente
COPY . .

# Generar Prisma Client
RUN npx prisma generate --schema=./src/shared/infrastructure/db/prisma/schema.prisma

# Compilar TypeScript
RUN npm run build

# ====================================
# Etapa de producción
# ====================================
FROM node:22-alpine AS production

WORKDIR /app

# Instalar herramientas necesarias para Prisma
RUN apk add --no-cache openssl curl

# Crear usuario no-root para seguridad
RUN addgroup -g 1001 -S 8js && \
    adduser -S expressjs -u 1001

# Copiar dependencias y archivos compilados desde builder
COPY --from=builder --chown=expressjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=expressjs:nodejs /app/dist ./dist
COPY --from=builder --chown=expressjs:nodejs /app/package*.json ./
COPY --from=builder --chown=expressjs:nodejs /app/src/shared/infrastructure/db/prisma ./prisma

# Script de inicio que ejecuta migraciones
COPY --chown=expressjs:nodejs <<EOF /app/start.sh
#!/bin/sh
set -e

echo "🔄 Running database migrations..."
npx prisma db push --schema=./prisma/schema.prisma --accept-data-loss

echo "🚀 Starting application..."
exec node dist/app/server.js
EOF

RUN chmod +x /app/start.sh

# Cambiar a usuario no-root
USER expressjs

# Exponer puerto
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:3000/api/v1/products || exit 1

# Comando de inicio
CMD ["/app/start.sh"]