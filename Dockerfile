# Install dependencies only when needed
FROM node:lts-alpine AS deps
WORKDIR /app
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk update --no-cache \
  && apk upgrade --no-cache \
  && apk add --no-cache libc6-compat \
  && yarn config set registry https://registry.npmmirror.com \
  && yarn config set sharp_binary_host "https://npmmirror.com/mirrors/sharp" \
  && yarn config set sharp_libvips_binary_host "https://npmmirror.com/mirrors/sharp-libvips"
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# If using npm with a `package-lock.json` comment out above and use below instead
# COPY package.json package-lock.json ./ 
# RUN npm ci

# Rebuild the source code only when needed
FROM node:lts-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN apk update --no-cache \
  && apk upgrade --no-cache \
  && yarn config set registry https://registry.npmmirror.com \
  # && yarn build && yarn install --production --ignore-scripts --prefer-offline
  && yarn build


# If using npm comment out above and use below instead
# RUN npm run build

# Production image, copy all the files and run next
FROM node:lts-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# You only need to copy next.config.js if you are NOT using the default configuration
COPY --from=builder /app/.env ./
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/public ./public
# COPY --from=builder /app/package.json ./package.json

# Automatically leverage output traces to reduce image size 
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
