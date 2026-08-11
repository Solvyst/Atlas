# Commands

Use these commands from the repository root unless a section says otherwise.

## Development

```sh
pnpm install
pnpm dev
pnpm dev:server
pnpm dev:web
```

Local URLs:

```txt
API: http://localhost:3100
Web: http://localhost:3000
```

## Build And Checks

```sh
pnpm typecheck
pnpm build
pnpm lint
```

Package-level checks:

```sh
pnpm --filter @solvyst-atlas/database typecheck
pnpm --filter @solvyst-atlas/database build
pnpm --filter @solvyst-atlas/server typecheck
pnpm --filter @solvyst-atlas/server build
```

## Database Migrations

Generate a migration after schema changes:

```sh
pnpm db:generate
```

Apply migrations to the configured database:

```sh
pnpm db:migrate
```

Check Drizzle migration state:

```sh
pnpm db:check
```

Open Drizzle Studio:

```sh
pnpm db:studio
```

Current DB schemas:

```txt
geo
reference
drizzle
```

The public API route is still `/api/v1/meta`, but the geography tables live under the PostgreSQL `geo` schema.

## Data CLI

Open the interactive data CLI:

```sh
pnpm data
```

CLI options include:

```txt
1. Validate all contribution JSON
2. Validate geo JSON only
3. Validate reference JSON only
4. Export CSV files from contribution JSON
5. Import geo JSON to PostgreSQL UPSERT
6. Import reference JSON to PostgreSQL UPSERT
7. Import all JSON to PostgreSQL UPSERT
0. Exit
```

Import options write to the configured PostgreSQL database and require typing `IMPORT`.

## Contribution Validation

Validate all contributor JSON:

```sh
pnpm db:contrib:validate
```

This command checks JSON shape, required fields, duplicate keys, foreign-key style references, and unknown fields. New fields must be approved and wired through validation, schema, migrations, importer, API/docs before they can pass.

Validate only geo data:

```sh
pnpm --filter @solvyst-atlas/database contrib:validate:geo
```

Validate only reference data:

```sh
pnpm --filter @solvyst-atlas/database contrib:validate:reference
```

## CSV Export

Generate CSV from canonical JSON contribution files:

```sh
pnpm data:export:csv
```

Output:

```txt
data/csv
```

CSV is generated output. Contributors should edit JSON in `contributions/`.

## Database Import

Import validated geo JSON into PostgreSQL:

```sh
pnpm db:import:geo
```

Import validated reference JSON into PostgreSQL:

```sh
pnpm db:import:reference
```

Import all validated JSON:

```sh
pnpm db:import
```

Recommended order for a fresh DB:

```sh
pnpm db:migrate
pnpm db:contrib:validate
pnpm db:import
```

## API Smoke Tests

Health:

```sh
curl "http://localhost:3100/health"
```

Countries:

```sh
curl "http://localhost:3100/api/v1/meta/countries?search=india" \
  -H "x-api-key: <META_API_KEY>"
```

Phone codes:

```sh
curl "http://localhost:3100/api/v1/meta/phone-codes?dialCode=+91" \
  -H "x-api-key: <META_API_KEY>"
```

Reference API:

```sh
curl "http://localhost:3100/api/v1/reference/business-identifiers?countryCode=IN" \
  -H "x-api-key: <META_API_KEY>"
```

## Docker

Build the server image:

```sh
docker build -t solvyst-atlas-server:local .
```

Run local compose:

```sh
docker compose up --build
```
