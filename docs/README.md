# Solvyst Atlas Docs

Solvyst Atlas is a metadata service for building reliable business applications. It exposes production-ready APIs for country, geography, localization, address, phone, currency, timezone, and business reference datasets.

## Current Features

- Countries API
- Regions and subregions API
- States API
- Cities API
- Admin areas API for districts, counties, provinces, and other hierarchy levels
- Localities API for cities, towns, villages, and settlement-like records
- Currencies API
- Timezones API
- Phone codes API for values like `+91`, `+92`, `+1`
- Languages API
- Locales API
- Postal code rules API
- Phone number rules API
- Address formats API
- Reference API for currency formats, business identifiers, banking rules, date-time formats, company types, units, and holidays
- PostgreSQL `geo` and `reference` schemas managed by Drizzle
- JSON contribution validation and trusted PostgreSQL import commands
- Interactive data CLI and generated CSV exports
- API key authentication
- Rate limiting
- Docker support

## Documentation

- [Setup](./setup.md)
- [Commands](./commands.md)
- [Environment Keys](./env-keys.md)
- [Database and Data Import](./database.md)
- [Meta API](./meta-api.md)
- [Reference API](./reference-api.md)
- [API Result Examples](./api-results.md)
- [Postman and Requestly Examples](./examples.md)
- [Deployment](./deployment.md)

## Local Base URL

```txt
http://localhost:3100/api/v1
```

## Authentication

```http
x-api-key: <ATLAS_API_KEY>
```

## Quick Test

```bash
curl \
  -H "x-api-key: <ATLAS_API_KEY>" \
  "http://localhost:3100/api/v1/meta/countries?search=india"
```
