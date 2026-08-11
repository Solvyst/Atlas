# API Result Examples

All successful meta responses use this shape:

```json
{
  "success": true,
  "message": "Countries fetched",
  "data": {
    "items": [],
    "limit": 50,
    "offset": 0
  }
}
```

## Countries Result

Request:

```sh
curl "http://localhost:3100/api/v1/meta/countries?iso2=IN" \
  -H "x-api-key: <META_API_KEY>"
```

Example response:

```json
{
  "success": true,
  "message": "Countries fetched",
  "data": {
    "items": [
      {
        "id": 101,
        "name": "India",
        "iso3": "IND",
        "numeric_code": "356",
        "iso2": "IN",
        "phonecode": "91",
        "capital": "New Delhi",
        "currency": "INR",
        "currency_name": "Indian rupee",
        "currency_symbol": "₹",
        "region": "Asia",
        "region_id": 3,
        "subregion": "Southern Asia",
        "subregion_id": 14
      }
    ],
    "limit": 50,
    "offset": 0
  }
}
```

## States Result

Request:

```sh
curl "http://localhost:3100/api/v1/meta/states?countryCode=IN&search=odisha" \
  -H "x-api-key: <META_API_KEY>"
```

Example response:

```json
{
  "success": true,
  "message": "States fetched",
  "data": {
    "items": [
      {
        "id": 4013,
        "name": "Odisha",
        "country_id": 101,
        "country_code": "IN",
        "parent_id": null
      }
    ],
    "limit": 50,
    "offset": 0
  }
}
```

## Cities Result

Request:

```sh
curl "http://localhost:3100/api/v1/meta/cities?stateId=4013&search=bhub" \
  -H "x-api-key: <META_API_KEY>"
```

Example response:

```json
{
  "success": true,
  "message": "Cities fetched",
  "data": {
    "items": [
      {
        "id": 58000,
        "name": "Bhubaneswar",
        "state_id": 4013,
        "state_code": "OR",
        "state_name": "Odisha",
        "country_id": 101,
        "country_code": "IN",
        "country_name": "India",
        "latitude": "20.27241000",
        "longitude": "85.83385000",
        "timezone": "Asia/Kolkata"
      }
    ],
    "limit": 50,
    "offset": 0
  }
}
```

## Timezones Result

Request:

```sh
curl "http://localhost:3100/api/v1/meta/timezones?countryId=101" \
  -H "x-api-key: <META_API_KEY>"
```

Example response:

```json
{
  "success": true,
  "message": "Timezones fetched",
  "data": {
    "items": [
      {
        "id": 179,
        "country_id": 101,
        "zone_name": "Asia/Kolkata",
        "gmt_offset": 19800,
        "gmt_offset_name": "UTC+05:30",
        "abbreviation": "IST",
        "tz_name": "Indian Standard Time"
      }
    ],
    "limit": 50,
    "offset": 0
  }
}
```

## Error Results

Invalid API key:

```json
{
  "success": false,
  "message": "Invalid API key",
  "code": "AUTH_ERROR"
}
```

States without filter:

```json
{
  "success": false,
  "message": "countryCode, countryId or search is required",
  "code": "VALIDATION_ERROR"
}
```

Cities without filter:

```json
{
  "success": false,
  "message": "stateId or search is required",
  "code": "VALIDATION_ERROR"
}
```

Rate limit:

```json
{
  "success": false,
  "message": "Too many requests",
  "code": "RATE_LIMIT"
}
```
