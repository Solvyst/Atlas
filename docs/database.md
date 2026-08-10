# Database Migrations

## Migration Commands

```sh
pnpm db:generate
pnpm db:migrate
```

Other useful Drizzle commands:

```sh
pnpm db:push
pnpm db:pull
pnpm db:check
pnpm db:studio
```

## Migration Folder

```txt
packages/database/drizzle
```

## Seed Commands

Seed files are generated from:

```txt
/Users/anilmoharana/Postman/countries-states-cities-database
```

Build generated SQL seed files:

```sh
pnpm db:seed:build
```

Run generated SQL seed files:

```sh
pnpm db:seed
```

Build and run in one command:

```sh
pnpm db:seed:rebuild
```

Override the source repo when needed:

```sh
CSC_DB_SOURCE_DIR=/path/to/countries-states-cities-database pnpm db:seed:build
```

Generated seed files live in:

```txt
packages/database/seeds/generated
```

## Schema Package

```txt
packages/database/src/schema
```

## Meta Tables

```txt
meta.regions
meta.subregions
meta.countries
meta.states
meta.cities
meta.admin_areas
meta.localities
meta.currencies
meta.timezones
```

## Scalable Geography Model

`meta.states` and `meta.cities` are kept for backward-compatible country/state/city APIs.

Use these tables for future scalable metadata:

```txt
meta.admin_areas
meta.localities
```

`meta.admin_areas` is a generic hierarchy table for subdivisions such as:

```txt
state
province
region
district
county
parish
subdistrict
municipality
```

Important columns:

```txt
country_id
country_code
parent_id
type
level
code
iso3166_2
```

`meta.localities` stores populated places and place-like records. It includes:

```txt
admin_area_id
type
is_settlement
latitude
longitude
population
```

For product dropdowns:

```sql
-- Children of a state/province/district/county
SELECT *
FROM meta.admin_areas
WHERE parent_id = $1
ORDER BY level, name;

-- Cities/towns/villages under an admin area
SELECT *
FROM meta.localities
WHERE admin_area_id = $1
  AND is_settlement = 1
ORDER BY name;
```

Current generated seed counts:

| Table | Rows |
| --- | ---: |
| meta.regions | 6 |
| meta.subregions | 22 |
| meta.countries | 250 |
| meta.states | 5,308 |
| meta.cities | 152,970 |
| meta.admin_areas | 8,365 |
| meta.localities | 152,970 |
| meta.currencies | 154 |
| meta.timezones | 432 |

## Important Rules

States and cities can be large, so API queries are guarded:

- States require `countryCode`, `countryId`, or `search`.
- Cities require `stateId` or `search`.
- Country-only city requests are blocked.
- Global city search is capped to 20 results.
