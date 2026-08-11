# Solvyst Atlas

Solvyst Atlas is a production-ready metadata API platform for SaaS, ERP, CRM, HRMS, eCommerce, onboarding, and internal business tools.

It provides reliable reference datasets for geography, localization, address forms, phone metadata, currencies, and timezones through a secured REST API backed by PostgreSQL and Drizzle.

## What It Provides

- Countries, regions, and subregions
- States, provinces, districts, counties, and other admin areas
- Cities, towns, villages, and localities
- Currencies and timezones
- Country calling codes such as `+91`, `+92`, `+1`
- Languages and locales such as `hi`, `en-IN`, `en-US`
- Postal code formats, regex rules, and examples
- Phone number rule placeholders by country
- Address format metadata by country
- Business reference datasets for currency formats, identifiers, banking, dates, company types, units, and holidays
- API key authentication and rate limiting
- Docker and CI/CD ready server setup


## Monorepo Structure

```txt
apps/
  server/        Express API server
  web/           Next.js web app
packages/
  database/      Drizzle schema, migrations, and JSON import automation
docs/            Project documentation
examples/        Postman and Requestly collections
```

## Quick Start

```bash
pnpm install
pnpm db:migrate
pnpm db:import
pnpm dev:server
```

Local API:

```txt
http://localhost:3100/api/v1/meta
```

All Meta API routes require:

```http
x-api-key: <META_API_KEY>
```

## Core Commands

```bash
pnpm dev              # run all dev tasks through Turbo
pnpm dev:server       # run API server
pnpm dev:web          # run web app
pnpm build            # build all packages/apps
pnpm lint             # lint all packages/apps
pnpm typecheck        # typecheck all packages/apps
pnpm db:migrate       # apply Drizzle migrations
pnpm data                # open interactive data CLI
pnpm db:contrib:validate # validate contribution JSON
pnpm data:export:csv     # generate CSV exports
pnpm db:import           # upsert validated JSON into PostgreSQL
```

## Meta API Examples

```txt
GET /api/v1/meta/countries?search=india
GET /api/v1/meta/states?countryCode=IN
GET /api/v1/meta/cities?search=bhubaneswar
GET /api/v1/meta/admin-areas?countryCode=US&type=county
GET /api/v1/meta/localities?countryCode=IN&search=bhubaneswar
GET /api/v1/meta/phone-codes?dialCode=+91
GET /api/v1/meta/languages?code=hi
GET /api/v1/meta/locales?countryCode=IN
GET /api/v1/meta/postal-code-rules?countryCode=IN
GET /api/v1/meta/phone-number-rules?dialCode=+91
GET /api/v1/meta/address-formats?countryCode=IN
GET /api/v1/meta/currencies?search=INR
GET /api/v1/meta/timezones?countryId=101
```

## Reference API Examples

```txt
GET /api/v1/reference/currency-formats?countryCode=IN
GET /api/v1/reference/phone-number-rules?dialCode=+91
GET /api/v1/reference/business-identifiers?countryCode=IN
GET /api/v1/reference/banking-rules?countryCode=IN
GET /api/v1/reference/date-time-formats?countryCode=IN
GET /api/v1/reference/company-types?countryCode=IN
GET /api/v1/reference/units?category=mass
GET /api/v1/reference/holidays?countryCode=IN&nationalOnly=true
```

## Data Import

Source data lives in:

```txt
contributions/geo
contributions/reference
```

Trusted import commands upsert validated JSON into PostgreSQL:

```bash
pnpm db:contrib:validate
pnpm db:import
```

## Documentation

- [Setup](./docs/setup.md)
- [Commands](./docs/commands.md)
- [Environment Keys](./docs/env-keys.md)
- [Database and Data Import](./docs/database.md)
- [Contributions](./contributions/README.md)
- [Meta API](./docs/meta-api.md)
- [Reference API](./docs/reference-api.md)
- [Examples](./docs/examples.md)
- [Deployment](./docs/deployment.md)
- [Changelog](./CHANGELOG.md)

## Tech Stack

- Node.js
- Express
- TypeScript
- PostgreSQL
- Drizzle ORM
- Drizzle Kit
- pnpm workspaces
- Turbo
- Docker

## License

ODbL-1.0
