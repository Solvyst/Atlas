# Meta API

## Base URL

```txt
/api/v1/meta
```

Local:

```txt
http://localhost:5000/api/v1/meta
```

## Authentication

All meta endpoints require:

```http
x-api-key: <META_API_KEY>
```

Missing or invalid key:

```json
{
  "success": false,
  "message": "Invalid API key",
  "code": "AUTH_ERROR"
}
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

Rate-limit response headers:

```http
X-RateLimit-Limit
X-RateLimit-Remaining
X-RateLimit-Reset
```

## Common Query Params

Most endpoints support:

| Param | Type | Default |
| --- | --- | --- |
| `search` | string | none |
| `limit` | number | 100 |
| `offset` | number | 0 |

`limit` is validated from `1` to `250`, except global city/locality search is capped to `20`.

## Regions

```http
GET /api/v1/meta/regions
GET /api/v1/meta/regions?search=asia
GET /api/v1/meta/regions?limit=20&offset=0
```

## Countries

```http
GET /api/v1/meta/countries
GET /api/v1/meta/countries?search=india
GET /api/v1/meta/countries?currency=INR
GET /api/v1/meta/countries?iso2=IN
GET /api/v1/meta/countries?iso3=IND
GET /api/v1/meta/countries?regionId=3
GET /api/v1/meta/countries?subregionId=14
```

Search checks:

```txt
name, iso2, iso3, capital, currency, currency_name
```

## States

Allowed:

```http
GET /api/v1/meta/states?countryCode=IN
GET /api/v1/meta/states?countryId=101
GET /api/v1/meta/states?countryCode=IN&search=odisha
GET /api/v1/meta/states?search=odisha
```

Blocked:

```http
GET /api/v1/meta/states
```

Error:

```json
{
  "success": false,
  "message": "countryCode, countryId or search is required",
  "code": "VALIDATION_ERROR"
}
```

## Cities

Allowed:

```http
GET /api/v1/meta/cities?stateId=4013
GET /api/v1/meta/cities?stateId=4013&search=bhub
GET /api/v1/meta/cities?countryCode=IN&search=bhubaneswar
GET /api/v1/meta/cities?countryId=101&search=bhubaneswar
GET /api/v1/meta/cities?search=bhubaneswar
```

Blocked:

```http
GET /api/v1/meta/cities
GET /api/v1/meta/cities?countryCode=IN
GET /api/v1/meta/cities?countryId=101
GET /api/v1/meta/cities?timezone=Asia/Kolkata
```

Rules:

- `stateId` has highest priority.
- If `stateId` is present, country filters are ignored.
- `stateId + search` searches inside the state.
- `countryCode + search` searches inside the country.
- `countryId + search` searches inside the country.
- `search` alone performs global search with max `limit = 20`.

Error:

```json
{
  "success": false,
  "message": "stateId or search is required",
  "code": "VALIDATION_ERROR"
}
```

## Admin Areas

Use this for scalable state/district/county/subdistrict hierarchies.

Allowed:

```http
GET /api/v1/meta/admin-areas?countryCode=IN
GET /api/v1/meta/admin-areas?countryCode=US&type=county
GET /api/v1/meta/admin-areas?parentId=1457
GET /api/v1/meta/admin-areas?countryCode=IN&level=2
GET /api/v1/meta/admin-areas?search=khordha
```

Rules:

- `parentId` returns child admin areas.
- `type` can filter values such as `state`, `province`, `district`, `county`, or `parish`.
- `level` supports generic hierarchy depth.

## Localities

Use this for future-ready city/town/village/locality queries.

Allowed:

```http
GET /api/v1/meta/localities?adminAreaId=4013
GET /api/v1/meta/localities?countryCode=IN&search=bhubaneswar
GET /api/v1/meta/localities?search=bhubaneswar
GET /api/v1/meta/localities?countryCode=US&type=city
GET /api/v1/meta/localities?countryCode=US&settlementsOnly=false&type=county
```

Rules:

- `settlementsOnly` defaults to `true`.
- Global locality search is capped to max `limit = 20`.
- `settlementsOnly=false` includes admin-like and non-settlement records from the source dataset.

## Currencies

```http
GET /api/v1/meta/currencies
GET /api/v1/meta/currencies?search=rupee
GET /api/v1/meta/currencies?search=INR
```

Search checks:

```txt
code, name, symbol
```

## Timezones

```http
GET /api/v1/meta/timezones
GET /api/v1/meta/timezones?countryId=101
GET /api/v1/meta/timezones?search=kolkata
GET /api/v1/meta/timezones?zoneName=Asia/Kolkata
```

Search checks:

```txt
zone_name, gmt_offset_name, abbreviation, tz_name
```

## Curl Template

```sh
curl "http://localhost:5000/api/v1/meta/countries?search=india" \
  -H "x-api-key: <META_API_KEY>"
```
