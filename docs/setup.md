# Setup

## Requirements

- Node.js compatible with the server TypeScript setup
- pnpm
- PostgreSQL database
- Redis only when queue/distributed-rate-limit features are enabled
- Drizzle migrations through `@solvyst-atlas/database`

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

## Database Setup

For a fresh database, run migrations first, then validate/import JSON contribution data:

```sh
pnpm db:migrate
pnpm db:contrib:validate
pnpm db:import
```

Generate a migration after schema changes:

```sh
pnpm db:generate
```

Other useful database commands:

```sh
pnpm db:check
pnpm db:studio
pnpm data
pnpm data:export:csv
```

See [Commands](./commands.md) for the full command list.

## Run Server

```sh
pnpm dev:server
```

Default local URL:

```txt
http://localhost:3100
```

Health check:

```sh
curl "http://localhost:3100/health"
```

## Typecheck And Build

```sh
pnpm --filter @solvyst-atlas/database typecheck
pnpm --filter @solvyst-atlas/server typecheck
pnpm --filter @solvyst-atlas/server build
```

## API Testing Examples

Import these files for local testing:

```txt
examples/postman/SolvystAtlas.postman_collection.json
examples/requestly/SolvystAtlas.requestly.json
```

See [Examples](./examples.md).
