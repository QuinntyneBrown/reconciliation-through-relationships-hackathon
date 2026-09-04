# syntax=docker/dockerfile:1

# Production image for Azure Container Apps.
# Built around Next.js standalone output; see docs/deployment/AZURE_CHEAPEST.md.
#
# Builder and runner MUST share the same base image. next/image optimizes
# /rtr-logo.png at runtime on / and /demo, and the standalone trace carries the
# musl-linked sharp binaries (@img/sharp-linuxmusl-x64). Those will not load on
# a glibc base such as node:22-slim.
ARG NODE_VERSION=22-alpine

FROM node:${NODE_VERSION} AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
# NODE_ENV is deliberately left unset: next build needs devDependencies, and
# optional deps must stay on so sharp is present for output file tracing.
RUN npm ci --no-audit --no-fund

FROM node:${NODE_VERSION} AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# next build inlines NEXT_PUBLIC_* into the browser bundle, so these are build
# inputs, not runtime config. Setting them only on the running container leaves
# the previously baked-in values in place. All three are public by design;
# SUPABASE_SERVICE_ROLE_KEY must never be passed here.
ARG NEXT_PUBLIC_SUPABASE_URL=""
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY=""
ARG NEXT_PUBLIC_MAPBOX_TOKEN=""
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL \
    NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY \
    NEXT_PUBLIC_MAPBOX_TOKEN=$NEXT_PUBLIC_MAPBOX_TOKEN \
    NEXT_TELEMETRY_DISABLED=1 \
    NODE_ENV=production

RUN npm run build

# Fail here rather than at runtime if standalone output is missing.
RUN test -f .next/standalone/server.js \
  || (echo 'ERROR: .next/standalone/server.js missing - is output:"standalone" set in next.config.ts?' && exit 1)

FROM node:${NODE_VERSION} AS runner
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0 \
    DATA_SOURCE=mock

RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# standalone omits public/ and .next/static, so both are copied in explicitly.
# Without them the app boots and serves every page unstyled with 404s on chunks.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs
EXPOSE 3000

# Exec form so SIGTERM reaches node and Container Apps can drain the replica
# cleanly on revision swap and scale-to-zero.
CMD ["node", "server.js"]
