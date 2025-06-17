# build environment
FROM node:21-alpine AS base

ENV NODE_ENV=production \
    PORT=3000 \
    BASE_PATH="/" \
    HOST="0.0.0.0" \
    NEXT_PUBLIC_HOST=${HOST} \
    NEXT_TELEMETRY_DISABLED=1

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat && \
    npm cache clean --force

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm install typescript @types/node --save-dev && npx next telemetry disable

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build && npm prune --production

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

# Set the correct permission for prerender cache
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs && \
    mkdir .next && \
    chown nextjs:nodejs .next /app

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/scripts/entrypoint.sh ./entrypoint.sh

USER nextjs

# only required if user did not set permissions locally
RUN chmod +x entrypoint.sh

EXPOSE 3000
EXPOSE 9229

ENTRYPOINT ["./entrypoint.sh"]