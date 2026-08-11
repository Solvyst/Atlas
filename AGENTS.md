# .agent.md

This file provides guidance to coding agents working in the Solvyst Atlas repository.

## Repository Overview

Solvyst Atlas is a metadata API platform for SaaS, ERP, CRM, HRMS, eCommerce, onboarding, and internal business tools. It provides geography, localization, phone, currency, timezone, and business reference datasets through a secured REST API backed by PostgreSQL and Drizzle.

This is both a code repository and an open-source data repository. Data integrity, reviewable contributions, and trusted imports matter as much as API code.

## Monorepo Structure

```txt
apps/
  server/        Express API server
  web/           Next.js web app
packages/
  database/      Drizzle schema, migrations, JSON validation/import/export tools
contributions/   Canonical open-source JSON source data
data/csv/        Generated CSV exports from contributions JSON
docs/            Project documentation
examples/        Postman and Requestly collections
```

## Core Architecture

Source data flows from JSON contributions into PostgreSQL through trusted import commands:

```txt
Contributor
  -> contributions/**/*.json
  -> Pull request
  -> JSON validation
  -> Merge
  -> Staging import validation
  -> Trusted PostgreSQL import
  -> Solvyst Atlas API
```

Important distinction:

```txt
JSON in contributions/ = canonical open-source source of truth
PostgreSQL             = runtime source used by API
SQL migrations         = schema evolution only
CSV in data/csv        = generated export format
```

## Database Schemas

Current PostgreSQL schemas:

```txt
geo         geography, localization, phone, currency, timezone metadata
reference   business reference datasets
drizzle     Drizzle migration history
```

The public HTTP API route is still `/api/v1/meta`, but geography tables live in the PostgreSQL `geo` schema.

## Data Contribution Rules

Contributors should edit JSON only:

```txt
contributions/geo
contributions/reference
```

Do not ask contributors to edit SQL, migrations, database rows, generated CSV, or compiled output.

### Geo Contribution Files

```txt
contributions/geo/regions/regions.json
contributions/geo/subregions/subregions.json
contributions/geo/countries/countries.json
contributions/geo/states/states.json
contributions/geo/cities/<ISO2>.json
contributions/geo/counties/<ISO2>.json
contributions/geo/postcodes/<ISO2>.json
contributions/geo/languages/languages.json
contributions/geo/phone-codes/phone-codes.json
contributions/geo/timezones/timezones.json
```

### Reference Contribution Files

```txt
contributions/reference/currency-formats.json
contributions/reference/phone-number-rules.json
contributions/reference/business-identifiers.json
contributions/reference/banking-rules.json
contributions/reference/date-time-formats.json
contributions/reference/company-types.json
contributions/reference/units.json
contributions/reference/holidays.json
```

## Common Commands

Run from repository root unless specified otherwise.

### Development

```bash
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

### Build And Typecheck

```bash
pnpm typecheck
pnpm build
pnpm --filter @solvyst-atlas/database typecheck
pnpm --filter @solvyst-atlas/database build
pnpm --filter @solvyst-atlas/server typecheck
pnpm --filter @solvyst-atlas/server build
```

### Database Migrations

```bash
pnpm db:generate
pnpm db:migrate
pnpm db:check
pnpm db:studio
```

Use `pnpm db:generate` after Drizzle schema changes. Review generated SQL carefully before treating it as production-safe.

For schema renames, Drizzle may prompt interactively. Prefer a safe rename migration over destructive drop/create SQL.

### Data CLI

```bash
pnpm data
```

The CLI exposes validation, CSV export, and trusted PostgreSQL import actions. Import actions write to the configured database and require typing `IMPORT`.

### Contribution Validation

```bash
pnpm db:contrib:validate
pnpm --filter @solvyst-atlas/database contrib:validate:geo
pnpm --filter @solvyst-atlas/database contrib:validate:reference
```

### CSV Export

```bash
pnpm data:export:csv
```

Output:

```txt
data/csv
```

CSV is generated output. Do not treat it as canonical source.

### Database Import

```bash
pnpm db:import:geo
pnpm db:import:reference
pnpm db:import
```

Recommended fresh DB order:

```bash
pnpm db:migrate
pnpm db:contrib:validate
pnpm db:import
```

Do not run import commands casually against production. Use staging validation first.

## Database Automation Layout

```txt
packages/database/bin/console.mjs
packages/database/bin/scripts/validation/geo-contributions.mjs
packages/database/bin/scripts/validation/reference-contributions.mjs
packages/database/bin/scripts/import/geo.mjs
packages/database/bin/scripts/import/reference.mjs
packages/database/bin/scripts/export/csv.mjs
```

Importer design:

- Reads validated JSON contribution files.
- Uses idempotent PostgreSQL UPSERTs.
- Writes to `geo.*` and `reference.*` tables.
- Should remain safe to rerun with the same data.

## API Namespaces

```txt
/api/v1/meta       geography and localization APIs backed by geo schema
/api/v1/reference  business reference APIs backed by reference schema
/health            health check
```

Example smoke tests:

```bash
curl "http://localhost:3100/health"

curl "http://localhost:3100/api/v1/meta/countries?search=india" \
  -H "x-api-key: <META_API_KEY>"

curl "http://localhost:3100/api/v1/meta/phone-codes?dialCode=+91" \
  -H "x-api-key: <META_API_KEY>"

curl "http://localhost:3100/api/v1/reference/business-identifiers?countryCode=IN" \
  -H "x-api-key: <META_API_KEY>"
```

## Environment Notes

Root `.env` is used by Drizzle migrations and database import/export tooling.

Server env lives in:

```txt
apps/server/.env
```

Important keys:

```env
DATABASE_URI="postgresql://..."
META_API_KEY="<strong-random-secret>"
REDIS_ENABLED=false
PORT=3100
HOST=0.0.0.0
```

Use a single PostgreSQL connection string in `DATABASE_URI`. For Supabase, prefer the Session Pooler URL when that is the deployment plan.

## Important Rules

DO:

- Keep `contributions/**/*.json` as the data source of truth.
- Split large datasets by country or category when possible.
- Validate before import.
- Run migrations before import when schema changes exist.
- Keep importers idempotent with UPSERT behavior.
- Keep API route compatibility unless the user explicitly asks to rename public endpoints.
- Clean stale `dist/` output when files are renamed or removed.
- Update docs and examples when commands, routes, or data locations change.

DO NOT:

- Ask contributors to edit SQL directly.
- Treat Excel or CSV as canonical repo source.
- Commit secrets from `.env` files.
- Blindly run production imports on every PR merge.
- Reintroduce generated SQL seed files as source data.
- Reintroduce GST code/data until the project explicitly resumes GST work.
- Leave stale compiled artifacts like removed modules in `apps/server/dist` or `packages/database/dist` after structural changes.

## Preferred Data Format Strategy

For open-source contributions:

```txt
JSON = source of truth
CSV  = generated export
SQL  = migration/import internal
Excel = optional helper input only, not canonical source
```

If non-technical users provide Excel/CSV, convert it into validated JSON before PR review.

## Verification Checklist

After schema, importer, or API changes, run the relevant subset:

```bash
pnpm db:contrib:validate
pnpm --filter @solvyst-atlas/database typecheck
pnpm --filter @solvyst-atlas/database build
pnpm --filter @solvyst-atlas/database db:check
pnpm --filter @solvyst-atlas/server typecheck
pnpm --filter @solvyst-atlas/server build
pnpm data:export:csv
```

For server route/schema changes, also grep for stale references:

```bash
rg "metaCountries|metaStates|metaCities|metaPhoneCodes|metaLanguages|metaTimezones|gst|GST" apps/server/src apps/server/dist packages/database/src packages/database/dist -n
```

Expected current state:

- Database schema exports use `geo*` names.
- Server meta repo queries `geo*` Drizzle tables.
- No GST API module in current server source.
- Public API path remains `/api/v1/meta`.
