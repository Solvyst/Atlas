# Examples

This repo includes ready-to-import API testing examples.

## Postman

File:

```txt
examples/postman/Atlaskit.postman_collection.json
```

Use:

1. Open Postman.
2. Click `Import`.
3. Select [Atlaskit.postman_collection.json](../examples/postman/Atlaskit.postman_collection.json).
4. Set collection variables for base URL and API key if needed.

Required header for meta routes:

```http
x-api-key: <META_API_KEY>
```

Default local base URL:

```txt
http://localhost:5000/api/v1
```

## Requestly

File:

```txt
examples/requestly/Atlaskit.requestly.json
```

Use:

1. Open Requestly.
2. Import [Atlaskit.requestly.json](../examples/requestly/Atlaskit.requestly.json).
3. Enable the imported rules/environment needed for local API testing.

## Included API Area

The examples are intended for testing Atlaskit meta endpoints:

```txt
GET /api/v1/meta/regions
GET /api/v1/meta/countries
GET /api/v1/meta/states
GET /api/v1/meta/cities
GET /api/v1/meta/currencies
GET /api/v1/meta/timezones
```
