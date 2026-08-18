# Database And Data Import

Solvyst Atlas uses PostgreSQL with Drizzle migrations. Contributor-editable source data lives as JSON, and trusted import commands upsert that JSON into PostgreSQL.

## Current Schemas

```txt
geo         geography, localization, phone, timezone, currency metadata
reference   address and other reference metadata
tax         tax-profile form metadata
drizzle     Drizzle migration history
```

Public API paths are split by domain: `/api/v1/meta`, `/api/v1/reference`, and `/api/v1/tax`.

## Migration Commands

Generate migrations after schema changes:

```sh
pnpm db:generate
```

Apply migrations to the configured database:

```sh
pnpm db:migrate
```

Check migration/schema state:

```sh
pnpm db:check
```

Open Drizzle Studio:

```sh
pnpm db:studio
```

Migration files live in:

```txt
packages/database/drizzle
```

## Source Data

Human-editable source data lives in:

```txt
contributions/geo
contributions/tax
```

Geo contribution files include:

```txt
contributions/geo/regions/regions.json
contributions/geo/subregions/subregions.json
contributions/geo/countries/countries.json
contributions/geo/states/states.json
contributions/geo/cities/<ISO2>.json
contributions/geo/counties/<ISO2>.json
contributions/geo/postcodes/<ISO2>.json
contributions/geo/postcodes/<ISO2>/part-001.json
contributions/geo/languages/languages.json
contributions/geo/phone-codes/phone-codes.json
contributions/geo/timezones/timezones.json
contributions/geo/locales/locales.json
```

Contributors should edit JSON files only. They should not write to PostgreSQL directly.

## Interactive Data CLI

Run the interactive CLI from repo root:

```sh
pnpm data
```

It exposes validation, CSV export, and trusted PostgreSQL import commands in one menu. Import actions require explicit confirmation because they write to the configured database.

## Validation Commands

Validate all contribution data:

```sh
pnpm db:contrib:validate
```

Validate only geo data:

```sh
pnpm --filter @solvyst-atlas/database contrib:validate:geo
```

Validate only tax data:

```sh
pnpm --filter @solvyst-atlas/database contrib:validate:tax
```

Validation checks JSON shape, required fields, duplicate IDs, ISO-like country codes, and important foreign-key relationships.

## CSV Export

CSV exports are generated from canonical JSON contribution files:

```sh
pnpm data:export:csv
```

Output:

```txt
data/csv
```

CSV is an export format only. Contributors still edit JSON.

## Import Commands

Import geo JSON into PostgreSQL:

```sh
pnpm db:import:geo
```

Import tax JSON into PostgreSQL:

```sh
pnpm db:import:tax
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

The import scripts use `INSERT ... ON CONFLICT ... DO UPDATE`, so rerunning the same import is safe.

## Import Flow

```txt
Contributor JSON change
  -> Pull request
  -> CI validation
  -> Merge
  -> Staging import validation
  -> Trusted production import
  -> PostgreSQL
  -> API
```

Production DB should not be blindly modified on every PR merge.

## Database Automation

Database scripts live in:

```txt
packages/database/bin
```

Current layout:

```txt
bin/console.mjs
bin/scripts/export
bin/scripts/import
bin/scripts/validation
```

## Schema Package

```txt
packages/database/src/schema
```

## Geo Tables

```txt
geo.regions
geo.subregions
geo.countries
geo.states
geo.cities
geo.admin_areas
geo.localities
geo.currencies
geo.timezones
geo.phone_codes
geo.languages
geo.locales
```

## Reference Tables

```txt
reference.address_formats
```

## Tax Tables

```txt
tax.country_forms
tax.form_fields
```

## Important Rules

- JSON in `contributions/` is the canonical open-source source of truth.
- PostgreSQL is the runtime source used by the API.
- Generated CSV in `data/csv` is export output, not contributor source.
- Run migrations before imports when schema changes exist.
- Use PR validation first, then staging import, then production sync.
- Large/time-sensitive datasets should keep clear source/provenance fields.
