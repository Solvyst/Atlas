# syntax=docker/dockerfile:1.7

FROM node:24-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
WORKDIR /app
RUN corepack enable

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json tsconfig.base.json ./
COPY apps/server/package.json ./apps/server/package.json
COPY packages/database/package.json ./packages/database/package.json
RUN pnpm install --frozen-lockfile

FROM deps AS build
COPY apps/server ./apps/server
COPY packages/database ./packages/database
RUN pnpm build
RUN pnpm deploy --filter=@solvyst-atlas/server --prod --legacy /prod/server

FROM node:24-slim AS runner
ENV NODE_ENV=production
ENV PORT=5000
ENV HOST=0.0.0.0
WORKDIR /app

RUN groupadd --system --gid 1001 nodejs \
  && useradd --system --uid 1001 --gid nodejs solvystatlas

COPY --from=build --chown=solvystatlas:nodejs /prod/server ./

USER solvystatlas
EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:' + (process.env.PORT || 5000) + '/health').then((r)=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "dist/server.js"]
