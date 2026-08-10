# Environment Keys

## Root `.env`

Used by Drizzle migrations, database seeds, and other root database commands.

```env
DATABASE_URI="postgresql://postgres.<project-ref>:<database-password>@aws-0-<region>.pooler.supabase.com:5432/postgres?sslmode=require"
```

Notes:

- `DATABASE_URI` should be a single PostgreSQL connection string.
- For Supabase session pooler, use the Session Pooler URL from Supabase, not the Transaction Pooler URL.
- Keep `sslmode=require` in the URL.

## Server `apps/server/.env`

```env
APP_VERSION=0.1.0
NODE_ENV=development

PORT=5000
HOST=0.0.0.0
APP_NAME=Atlaskit

DATABASE_URI=""

REDIS_HOST=host.docker.internal
REDIS_ENABLED=false
REDIS_PORT=6379
REDIS_URL=redis://127.0.0.1:6379
REDIS_TLS=false
BULL_PREFIX=atlaskit
EMAIL_QUEUE_RETRY=3
EMAIL_QUEUE_CONCURRENCY=5

WEB_URL=http://localhost:3000
ATLASKIT_API_URL=http://localhost:5000


META_API_KEY="<strong-random-secret>"
META_RATE_LIMIT_MAX=120
META_RATE_LIMIT_WINDOW_MS=60000
```

## Key Details

`DATABASE_URI`

PostgreSQL connection string used by the Node server, Drizzle migrations, and seed scripts.

`REDIS_ENABLED`

Set `false` for MVP/single-instance deployments. Set `true` only when Redis is available for distributed rate limiting and queues.

`WEB_URL`

Browser client origin allowed by CORS.

`ATLASKIT_API_URL`

Server/API origin allowed by CORS when needed.

`ATLASKIT_API_KEY`

API key used by this server when it calls Atlaskit as an external meta microservice. If omitted, the client falls back to `META_API_KEY`.

`META_API_KEY`

Required for all `/api/v1/meta/*` routes. Send it as:

```http
x-api-key: <META_API_KEY>
```

Generate a strong local key:

```sh
openssl rand -hex 32
```

`META_RATE_LIMIT_MAX`

Maximum requests allowed per API key/IP window.

`META_RATE_LIMIT_WINDOW_MS`

Rate-limit window in milliseconds.

## Security Notes

- Do not commit `.env`.
- Keep only `.env.example` in Git.
- CORS is browser protection only.
- API key protects server-to-server, Postman, curl, and browser calls.
- IP allowlist is optional and should be used only when caller IPs are static.
