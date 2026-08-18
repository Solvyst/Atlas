# Contributions

Solvyst Atlas accepts source data contributions as JSON. Contributors should edit JSON source files only; database imports, migrations, and dist files are maintained by project maintainers.

## Geo Data

Geo datasets live in:

```txt
contributions/geo/
  regions/regions.json
  languages/languages.json
  phone-codes/phone-codes.json
  timezones/timezones.json
  locales/locales.json
  subregions/subregions.json
  countries/countries.json
  states/states.json
  cities/<ISO2>.json
  counties/<ISO2>.json
  postcodes/<ISO2>.json
  postcodes/<ISO2>/part-001.json
```

Rules:

- Add or edit focused geo JSON only, including countries, states, cities, languages, locales, phone codes, and timezones.
- Keep existing `id` values when editing existing rows.
- New rows should use stable IDs only if maintainers assign them; otherwise open a PR with clear notes.
- Do not edit runtime database state directly.
- City files are split by country code, for example `cities/IN.json`.
- Postcodes are accepted as contribution source, but not yet exposed through Atlas API. Large postcode datasets should be split into `postcodes/<ISO2>/part-001.json`, `part-002.json`, and so on to stay below GitHub file-size warnings.

Validate geo contributions:

```bash
pnpm --filter @solvyst-atlas/database contrib:validate:geo
```

## How To Add Data

1. Pick the matching JSON file.
2. Add one focused row or a small focused group of rows.
3. Use stable IDs and country codes that match the target dataset.
4. Add a source URL or clear notes when available.
5. Do not edit runtime database state directly.

## Field Changes

Contribution JSON is strict. Validation fails when a row contains a field that Atlas does not already support. This protects production imports from silent schema drift.

If a new field is useful, open it as a maintainer-approved data model change:

1. Add the field to the contribution validator allow-list.
2. Add or update the Drizzle schema and migration.
3. Update the JSON importer/upsert mapping.
4. Expose it through the API only when it is part of the public contract.
5. Update docs and examples.

Do not add random columns directly in contributor JSON and expect them to be imported.

## Validate Locally

From repo root:

```bash
pnpm db:contrib:validate
```

Individual validation:

```bash
pnpm --filter @solvyst-atlas/database contrib:validate:geo
pnpm --filter @solvyst-atlas/database contrib:validate:tax
```

## Maintainer Flow

Maintainers import validated JSON into trusted databases with:

```bash
pnpm db:import:geo
pnpm db:import:tax
pnpm db:import
```

Recommended production path:

```txt
PR validation -> merge -> staging import -> production sync
```

## CSV Exports

Maintainers can generate CSV exports from JSON with:

```bash
pnpm data:export:csv
```

CSV files are generated output. Contributors should keep editing JSON.

## Contribution Rules

- Keep country codes uppercase.
- Use official or reputable sources for legal, tax, and geography metadata.
- Prefer adding source URLs for time-sensitive or compliance-sensitive data.
- Keep database import concerns out of normal contributor PRs unless a maintainer requested it.
- For uncertain data, add a note instead of guessing.
