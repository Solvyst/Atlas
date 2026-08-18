# Database Bin

Clean database automation for Solvyst Atlas.

## Structure

```txt
bin/console.mjs            # interactive data CLI
bin/scripts/
  export/
    csv.mjs              # contributions JSON -> data/csv
  import/
    geo.mjs                 # contributions/geo -> PostgreSQL upsert
    tax.mjs                 # contributions/tax -> PostgreSQL upsert
  validation/
    geo-contributions.mjs
    tax-contributions.mjs
```

## Commands

Validate JSON contribution data:

```bash
pnpm contrib:validate
pnpm contrib:validate:tax
```

Open the interactive CLI:

```bash
pnpm cli
```

Export contribution JSON to CSV:

```bash
pnpm export:csv
```

Import validated JSON into PostgreSQL with idempotent upserts:

```bash
pnpm import:geo
pnpm import:tax
pnpm import:all
```

## Architecture

```txt
contributions/**/*.json
        ↓ validation
bin/scripts/validation
        ↓ trusted importer
bin/scripts/import
        ↓ UPSERT
PostgreSQL
        ↓
Solvyst Atlas API
```

Contributors edit JSON only. Database import is a trusted maintainer/staging/production job.
