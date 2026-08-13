# Reference API

Reference APIs are business and formatting datasets that live outside the Meta API namespace.

Base path:

```txt
/api/v1/reference
```

All routes require:

```http
x-api-key: <ATLAS_API_KEY>
```

## Endpoints

```txt
GET /api/v1/reference/currency-formats
GET /api/v1/reference/phone-number-rules
GET /api/v1/reference/business-identifiers
GET /api/v1/reference/banking-rules
GET /api/v1/reference/date-time-formats
GET /api/v1/reference/company-types
GET /api/v1/reference/units
GET /api/v1/reference/holidays
```

## Useful Queries

```txt
GET /api/v1/reference/currency-formats?countryCode=IN
GET /api/v1/reference/currency-formats?currencyCode=INR
GET /api/v1/reference/phone-number-rules?dialCode=+91
GET /api/v1/reference/business-identifiers?countryCode=IN
GET /api/v1/reference/business-identifiers?code=GSTIN
GET /api/v1/reference/banking-rules?countryCode=IN
GET /api/v1/reference/banking-rules?ibanSupported=true
GET /api/v1/reference/date-time-formats?countryCode=IN
GET /api/v1/reference/company-types?countryCode=IN
GET /api/v1/reference/units?category=mass
GET /api/v1/reference/holidays?countryCode=IN&nationalOnly=true
```

## Dataset Notes

The current data is an extensible production-shaped starter dataset. It includes source/provenance fields and normalized country filters so larger official or licensed datasets can be ingested later without changing public API shape.

For financial, tax, banking, and holiday datasets, treat starter rows as reference metadata and validate legal/compliance decisions against current official sources before production use.
