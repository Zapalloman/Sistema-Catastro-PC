# Dockerfile para Next.js Frontend - Catastro PC
ARG NODE_VERSION=20
ARG NODE_ENV=production

# Imagen base
FROM node:${NODE_VERSION}-alpine AS base

# Instalar dependencias del sistema
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Instalar dumb-init para manejo de señales
RUN apk add --no-cache dumb-init

# --- Etapa de dependencias ---
FROM base AS deps

# Copiar archivos de configuración de dependencias
COPY package.json yarn.lock* package-lock.json* pnpm-lock.json* ./

# Instalar dependencias
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.json ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# --- Etapa de construcción ---
FROM base AS build
WORKDIR /app

# Copiar dependencias de la etapa anterior
COPY --from=deps /app/node_modules ./node_modules

# Copiar código fuente
COPY . .

# Configurar variable de entorno para construcción
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NODE_ENV=production

# Deshabilitar telemetría de Next.js
ENV NEXT_TELEMETRY_DISABLED 1

# Construir la aplicación
RUN \
  if [ -f yarn.lock ]; then yarn run build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.json ]; then corepack enable pnpm && pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

# --- Etapa de producción ---
FROM base AS production
WORKDIR /app

# Crear usuario no privilegiado
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Configurar variables de entorno de producción
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED 1
ENV PORT=3000

# Copiar archivos necesarios para producción
COPY --from=build /app/public ./public

# Copiar archivos de construcción estática
COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static

# Crear directorio para logs
RUN mkdir -p /app/logs && chown nextjs:nodejs /app/logs

# Cambiar a usuario no privilegiado
USER nextjs

# Exponer puerto
EXPOSE 3000

# Configurar health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD node health-check.js || exit 1

# Usar dumb-init para manejo de señales
ENTRYPOINT ["dumb-init", "--"]

# Comando de inicio
CMD ["node", "server.js"]
