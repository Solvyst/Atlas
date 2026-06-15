# Database Migrations and Data Files

## Migration Command

```sh
pnpm db:migrate:sh
```

## Migration Folders

```txt
db/migrations/regions
db/migrations/countries
db/migrations/states
db/migrations/cities
db/migrations/currencies
db/migrations/timezones
```

## Meta Tables

```txt
meta.regions
meta.countries
meta.states
meta.cities
meta.currencies
meta.timezones
```

## Excel Data Exports

Seed data is also exported as `.xlsx` files:

```txt
db/migrations/regions/regions.xlsx
db/migrations/countries/countries.xlsx
db/migrations/states/states.xlsx
db/migrations/cities/cities.xlsx
db/migrations/currencies/currencies.xlsx
db/migrations/timezones/timezones.xlsx
```

Current export counts:

| File | Rows |
| --- | ---: |
| regions.xlsx | 6 |
| countries.xlsx | 250 |
| states.xlsx | 5,308 |
| cities.xlsx | 146,890 |
| currencies.xlsx | 155 |
| timezones.xlsx | 432 |

## Important Rules

States and cities can be large, so API queries are guarded:

- States require `countryCode`, `countryId`, or `search`.
- Cities require `stateId` or `search`.
- Country-only city requests are blocked.
- Global city search is capped to 20 results.
