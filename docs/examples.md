# Examples

This repo includes ready-to-import API testing examples for Meta and Reference APIs.

## Postman

File:

```txt
examples/postman/SolvystAtlas.postman_collection.json
```

Use:

1. Open Postman.
2. Click `Import`.
3. Select [SolvystAtlas.postman_collection.json](../examples/postman/SolvystAtlas.postman_collection.json).
4. Set collection variables.

Variables:

```txt
BASE_URL=http://localhost:3100
META_API_KEY=<your-meta-api-key>
```

## Requestly

File:

```txt
examples/requestly/SolvystAtlas.requestly.json
```

Use:

1. Open Requestly.
2. Import [SolvystAtlas.requestly.json](../examples/requestly/SolvystAtlas.requestly.json).
3. Select the imported `Local` environment.
4. Update `META_API_KEY` before sending requests.

## Included Meta APIs

```txt
GET /api/v1/meta/geo?country=india
GET /api/v1/meta/regions?search=asia
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

## Included Reference APIs

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
