# Reference API

Reference APIs expose business and formatting metadata that is not part of the core geography hierarchy.

Base path:

```txt
/api/v1/reference
```

All requests require:

```http
x-api-key: <ATLAS_API_KEY>
```

## Address Formats

```http
GET /api/v1/reference/address-formats
GET /api/v1/reference/address-formats?countryCode=IN
GET /api/v1/reference/address-formats?search=india
```

Query params:

```txt
search
countryId
countryCode
limit
offset
```
