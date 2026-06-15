# Setup

## Requirements

- Node.js compatible with the server TypeScript setup
- pnpm
- PostgreSQL database
- Redis for queue-related server features
- Flyway migrations through the provided scripts

## Install

```sh
pnpm install
```

## Environment Files

Create local env files from the examples:

```sh
cp .env.example .env
cp apps/server/.env.example apps/server/.env
```

Fill the required keys in:

```txt
.env
apps/server/.env
```

See [Environment Keys](./env-keys.md).

## Database Migrations

Run Flyway migrations from the root:

```sh
pnpm db:migrate:sh
```

Other useful commands:

```sh
pnpm db:info:sh
pnpm db:validate:sh
pnpm db:repair:sh
pnpm db:baseline:sh
```

## Run Server

```sh
pnpm dev:server
```

Default local URL:

```txt
http://localhost:5000
```

Health check:

```sh
curl "http://localhost:5000/health"
```

## Typecheck

```sh
pnpm --filter @solvyst/server typecheck
```
