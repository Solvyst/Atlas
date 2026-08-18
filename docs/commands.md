# Commands

Run these commands from the repository root unless a section says otherwise.

```sh
cd "/Users/anilmoharana/Work/Solvyst Atlas"
```

## Install

Install dependencies:

```sh
pnpm install
```

Install with lockfile strict mode, useful for production/CI:

```sh
pnpm install --frozen-lockfile
```

## Development

Run the full monorepo in dev mode:

```sh
pnpm dev
```

Run only the API server:

```sh
pnpm dev:server
```

Run only the web app:

```sh
pnpm dev:web
```

Run the default dev alias:

```sh
pnpm dev:all
```

Local URLs:

```txt
API: http://localhost:3100
Web: http://localhost:3000
```

## Build And Checks

Typecheck all packages:

```sh
pnpm typecheck
```

Build all packages:

```sh
pnpm build
```

Lint all packages:

```sh
pnpm lint
```

Build only the server:

```sh
pnpm build:server
```

Build only the web app:

```sh
pnpm build:web
```

Package-level checks:

```sh
pnpm --filter @solvyst-atlas/database typecheck
pnpm --filter @solvyst-atlas/database build
pnpm --filter @solvyst-atlas/server typecheck
pnpm --filter @solvyst-atlas/server build
pnpm sdk:typecheck
pnpm sdk:build
```

Clean generated dependency/build folders:

```sh
pnpm clean
```

## Database Schema And Migrations

Generate Drizzle migration after schema changes:

```sh
pnpm db:generate
```

Apply migrations to the configured PostgreSQL database:

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

Push schema directly to DB without migration files, mostly local/dev only:

```sh
pnpm db:push
```

Pull database schema state, mostly inspection/dev only:

```sh
pnpm db:pull
```

Current PostgreSQL schemas:

```txt
geo
reference
tax
drizzle
```

Important: geography tables live under PostgreSQL `geo`, address formatting metadata lives under `reference`, and tax form metadata lives under `tax`.

## Contribution JSON Validation

Validate all contributor JSON files:

```sh
pnpm db:contrib:validate
```

Validate only geo JSON:

```sh
pnpm --filter @solvyst-atlas/database contrib:validate:geo
```

Validate only tax JSON:

```sh
pnpm --filter @solvyst-atlas/database contrib:validate:tax
```

Validation checks:

```txt
JSON syntax
root array shape
required fields
duplicate keys
unknown fields
country/state references
basic ISO/dial-code formats
```

New JSON fields must be approved and wired through validator, Drizzle schema, migration, importer, API, docs, and examples before they pass.

## Convert JSON To CSV

Generate CSV files from canonical JSON contribution files:

```sh
pnpm data:export:csv
```

Alias:

```sh
pnpm data:export
```

Output folder:

```txt
data/csv
```

Source folder:

```txt
contributions
```

Rule: contributors edit JSON. CSV is generated output.

## Import JSON To Database

Import all validated JSON into PostgreSQL using UPSERT:

```sh
pnpm db:import
```

Import only geo data:

```sh
pnpm db:import:geo
```

Import only tax data:

```sh
pnpm db:import:tax
```

Database import flow:

```txt
contributions/**/*.json
  -> validation
  -> PostgreSQL UPSERT
  -> API reads from DB
```

Recommended fresh database flow:

```sh
pnpm db:migrate
pnpm db:contrib:validate
pnpm db:import
```

One-line fresh database flow:

```sh
pnpm db:migrate && pnpm db:contrib:validate && pnpm db:import
```

## Data CLI

Open the interactive data CLI:

```sh
pnpm data
```

CLI options:

```txt
1. Validate all contribution JSON
2. Validate geo JSON only
3. Validate tax JSON only
4. Export CSV files from contribution JSON
5. Import geo JSON to PostgreSQL UPSERT
6. Import tax JSON to PostgreSQL UPSERT
7. Import all JSON to PostgreSQL UPSERT
0. Exit
```

Import options write to PostgreSQL and require typing `IMPORT`.

## Local Database With Docker

Start local PostgreSQL only:

```sh
docker compose --profile local-db up -d postgres
```

Stop local PostgreSQL:

```sh
docker compose --profile local-db stop postgres
```

Remove local PostgreSQL container, keeping volume:

```sh
docker compose --profile local-db rm postgres
```

Remove local PostgreSQL data volume only when you intentionally want a fresh DB:

```sh
docker compose --profile local-db down -v
```

## Docker Server

Build the server Docker image:

```sh
docker build -t solvyst-atlas-server:local .
```

Run server with external database and no Redis:

```sh
docker compose up --build server
```

Run server with local Docker PostgreSQL:

```sh
docker compose --profile local-db up -d postgres
docker compose --profile local-db up --build server
```

Run server with Redis enabled:

```sh
docker compose --profile redis up --build server redis
```

Validate Docker Compose file:

```sh
docker compose config --quiet
```

## API Smoke Tests

Root banner:

```sh
curl "http://localhost:3100/"
```

Health:

```sh
curl "http://localhost:3100/health"
```

Load API key from root `.env`:

```sh
export ATLAS_API_KEY=$(grep '^ATLAS_API_KEY=' .env | cut -d= -f2- | tr -d '"')
```

Countries:

```sh
curl "http://localhost:3100/api/v1/meta/countries?search=india" \
  -H "x-api-key: $ATLAS_API_KEY"
```

States:

```sh
curl "http://localhost:3100/api/v1/meta/states?countryCode=IN" \
  -H "x-api-key: $ATLAS_API_KEY"
```

Cities:

```sh
curl "http://localhost:3100/api/v1/meta/cities?countryCode=IN&search=bhubaneswar" \
  -H "x-api-key: $ATLAS_API_KEY"
```

Phone codes:

```sh
curl "http://localhost:3100/api/v1/meta/phone-codes?dialCode=+91" \
  -H "x-api-key: $ATLAS_API_KEY"
```

Currencies:

```sh
curl "http://localhost:3100/api/v1/meta/currencies?search=INR" \
  -H "x-api-key: $ATLAS_API_KEY"
```

Timezones:

```sh
curl "http://localhost:3100/api/v1/meta/timezones?countryId=101" \
  -H "x-api-key: $ATLAS_API_KEY"
```

Address formats:

```sh
curl "http://localhost:3100/api/v1/reference/address-formats?countryCode=IN" \
  -H "x-api-key: $ATLAS_API_KEY"
```

Tax forms:

```sh
curl "http://localhost:3100/api/v1/tax/forms/IN" \
  -H "x-api-key: $ATLAS_API_KEY"
```

Docker server health, default compose port:

```sh
curl "http://localhost:5000/health"
```

## Recommended Workflows

After editing contribution JSON:

```sh
pnpm db:contrib:validate
pnpm data:export:csv
```

After editing database schema:

```sh
pnpm db:generate
pnpm db:migrate
pnpm --filter @solvyst-atlas/database build
```

Before importing production/staging data:

```sh
pnpm db:contrib:validate
pnpm db:migrate
pnpm db:import
```

Before pushing code:

```sh
pnpm db:contrib:validate
pnpm typecheck
pnpm build
```
