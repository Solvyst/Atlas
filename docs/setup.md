# Setup

## Requirements

- Node.js compatible with the server TypeScript setup
- pnpm
- PostgreSQL database
- Redis for queue-related server features
- Drizzle migrations through `@atlaskit/database`

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

Generate and run Drizzle migrations from the root:

```sh
pnpm db:generate
pnpm db:migrate
```

Build and run meta seed data:

```sh
pnpm db:seed:build
pnpm db:seed
```

Other useful commands:

```sh
pnpm db:check
pnpm db:studio
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
pnpm --filter @atlaskit/server typecheck
```

## API Testing Examples

Import these files for local testing:

```txt
examples/postman/Atlaskit.postman_collection.json
examples/requestly/Atlaskit.requestly.json
```

See [Examples](./examples.md).
