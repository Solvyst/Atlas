# Atlaskit Docs

Atlaskit is an open-source metadata platform that provides production-ready APIs for countries, states, cities, currencies, timezones, GST, industries, categories, and business onboarding data.

It is designed for SaaS products, ERP systems, CRM platforms, HRMS applications, eCommerce platforms, and internal business tools that require reliable master data and reference datasets.

## Features

* Countries API
* States API
* Cities API
* Timezones API
* Currencies API
* GST Types API
* GST HSN Search API
* Industries API
* Organization Onboarding Metadata API
* PostgreSQL Powered
* Flyway Database Migrations
* API Key Authentication
* TypeScript Support

## Use Cases

* User onboarding forms
* Organization setup workflows
* Address management
* GST and taxation systems
* ERP and accounting software
* CRM applications
* eCommerce checkout systems
* Global business applications

## Documentation

* [Setup](./setup.md)
* [Environment Keys](./env-keys.md)
* [Database Migrations and Data Files](./database.md)
* [Meta API](./meta-api.md)
* [API Result Examples](./api-results.md)

## API Base URL

Local Development:

```txt
http://localhost:5000/api/v1
```

## Authentication

Meta routes are protected using an API key.

```http
x-api-key: <META_API_KEY>
```

Example:

```sh
curl \
  -H "x-api-key: your-api-key" \
  http://localhost:5000/api/v1/meta/countries
```

## Tech Stack

* Node.js
* Express
* TypeScript
* PostgreSQL
* Kysely
* Flyway
* Docker

## License

MIT License
