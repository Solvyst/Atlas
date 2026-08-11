# Meta API

Meta API is the public HTTP namespace for geography and localization data. Internally, these endpoints query PostgreSQL tables under the `geo` schema.


## Base URL

```txt
/api/v1/meta
```

Local:

```txt
http://localhost:3100/api/v1/meta
```

## Authentication

All Meta endpoints require:

```http
x-api-key: <META_API_KEY>
```

## Rate Limit

Default:

```txt
120 requests / 60000 ms
```

Configured by:

```env
META_RATE_LIMIT_MAX=120
META_RATE_LIMIT_WINDOW_MS=60000
```

## Common Query Params

| Param | Type | Default |
| --- | --- | --- |
| `search` | string | none |
| `limit` | number | 100 |
| `offset` | number | 0 |

`limit` is validated from `1` to `250`. Global city/locality search is capped to `20`.

## Regions

```http
GET /api/v1/meta/regions
GET /api/v1/meta/regions?search=asia
```

## Countries

```http
GET /api/v1/meta/countries
GET /api/v1/meta/countries?search=india
GET /api/v1/meta/countries?currency=INR
GET /api/v1/meta/countries?iso2=IN
GET /api/v1/meta/countries?iso3=IND
```

## States

```http
GET /api/v1/meta/states?countryCode=IN
GET /api/v1/meta/states?countryId=101
GET /api/v1/meta/states?search=odisha
```

## Cities

```http
GET /api/v1/meta/cities?stateId=4013
GET /api/v1/meta/cities?stateId=4013&search=bhub
GET /api/v1/meta/cities?countryCode=IN&search=bhubaneswar
GET /api/v1/meta/cities?search=bhubaneswar
```

## Admin Areas

Use this for scalable state, province, district, county, parish, and similar hierarchy records.

```http
GET /api/v1/meta/admin-areas?countryCode=IN
GET /api/v1/meta/admin-areas?countryCode=US&type=county
GET /api/v1/meta/admin-areas?parentId=1457
GET /api/v1/meta/admin-areas?search=khordha
```

## Localities

Use this for city, town, village, locality, and settlement-like records.

```http
GET /api/v1/meta/localities?adminAreaId=4013
GET /api/v1/meta/localities?countryCode=IN&search=bhubaneswar
GET /api/v1/meta/localities?search=bhubaneswar
GET /api/v1/meta/localities?countryCode=US&type=city
```

## Phone Codes

Country calling-code lookup for values like `+91`, `+92`, and shared codes like `+1`.

```http
GET /api/v1/meta/phone-codes?dialCode=+91
GET /api/v1/meta/phone-codes?dialCode=91
GET /api/v1/meta/phone-codes?callingCode=+1
GET /api/v1/meta/phone-codes?countryCode=IN
GET /api/v1/meta/phone-codes?search=india
```

Response fields include:

```txt
country_id, country_code, country_name, phone_code, dial_code,
calling_code, national_destination_code, is_shared_calling_code
```

## Languages

```http
GET /api/v1/meta/languages
GET /api/v1/meta/languages?code=hi
GET /api/v1/meta/languages?direction=rtl
GET /api/v1/meta/languages?search=english
```

## Locales

```http
GET /api/v1/meta/locales
GET /api/v1/meta/locales?countryCode=IN
GET /api/v1/meta/locales?languageCode=hi
GET /api/v1/meta/locales?currencyCode=INR
GET /api/v1/meta/locales?search=en-IN
```

## Postal Code Rules

```http
GET /api/v1/meta/postal-code-rules
GET /api/v1/meta/postal-code-rules?countryCode=IN
GET /api/v1/meta/postal-code-rules?requiredOnly=true
GET /api/v1/meta/postal-code-rules?search=india
```

## Phone Number Rules

```http
GET /api/v1/meta/phone-number-rules
GET /api/v1/meta/phone-number-rules?dialCode=+91
GET /api/v1/meta/phone-number-rules?countryCode=IN
GET /api/v1/meta/phone-number-rules?search=india
```

Note: phone number min/max length and validation regex are starter placeholders until a complete numbering-plan source is imported.

## Address Formats

```http
GET /api/v1/meta/address-formats
GET /api/v1/meta/address-formats?countryCode=IN
GET /api/v1/meta/address-formats?search=india
```

## Currencies

```http
GET /api/v1/meta/currencies
GET /api/v1/meta/currencies?search=rupee
GET /api/v1/meta/currencies?search=INR
```

## Timezones

```http
GET /api/v1/meta/timezones
GET /api/v1/meta/timezones?countryId=101
GET /api/v1/meta/timezones?search=kolkata
GET /api/v1/meta/timezones?zoneName=Asia/Kolkata
```

## Errors

Invalid API key:

```json
{
  "success": false,
  "message": "Invalid API key"
}
```

Validation error example:

```json
{
  "success": false,
  "message": "countryCode, countryId or search is required"
}
```
