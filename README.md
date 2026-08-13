# Solvyst Atlas

Solvyst Atlas is a metadata API for geography, localization, phone, currency, timezone, and business reference datasets. It uses PostgreSQL, Drizzle, JSON contribution files, and trusted UPSERT imports.

## Quick Start

```sh
pnpm install
pnpm db:migrate
pnpm db:import
pnpm dev:server
```

Local API:

```txt
http://localhost:3100
```

API routes require:

```http
x-api-key: <META_API_KEY>
```

## Main Commands

```sh
pnpm dev:server          # run API server
pnpm dev:web             # run web app
pnpm db:generate         # generate Drizzle migration
pnpm db:migrate          # apply migrations
pnpm db:contrib:validate # validate contribution JSON
pnpm data:export:csv     # convert JSON contributions to CSV
pnpm db:import           # import validated JSON to PostgreSQL
pnpm data                # open data CLI
```

## Documentation

Start here:

- [Docs Home](./docs/README.md)
- [Setup](./docs/setup.md)
- [Commands](./docs/commands.md)
- [Environment Keys](./docs/env-keys.md)
- [Database and Data Import](./docs/database.md)

API docs:

- [Meta API](./docs/meta-api.md)
- [Reference API](./docs/reference-api.md)
- [API Result Examples](./docs/api-results.md)

Data and contribution docs:

- [Contributions](./contributions/README.md)
- [Postman and Requestly Examples](./docs/examples.md)

Deployment:

- [Deployment](./docs/deployment.md)

## Repository Layout

```txt
apps/server          Express API server
apps/web             Next.js web app
packages/database    Drizzle schema, migrations, import/export tools
contributions        Canonical JSON source data
data/csv             Generated CSV exports
docs                 Documentation
examples             API client examples
```

## License

ODbL-1.0
