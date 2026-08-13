# Environment Keys

Solvyst Atlas uses a single root `.env` file for local commands, database migrations/imports, Docker Compose, and the API server.

Create it from the example:

```sh
cp .env.example .env
```

## Required Keys

`DATABASE_URI`

PostgreSQL connection string used by local pnpm commands, Drizzle migrations, and JSON import scripts.

```env
DATABASE_URI="postgresql://user:password@127.0.0.1:5432/solvyst_atlas?sslmode=disable"
```

For Supabase, use the Session Pooler URL and keep SSL enabled:

```env
DATABASE_URI="postgresql://postgres.<project-ref>:<database-password>@aws-0-<region>.pooler.supabase.com:5432/postgres?sslmode=require"
```

`DOCKER_DATABASE_URI`

PostgreSQL connection string used by the server container in Docker Compose. For local Docker PostgreSQL, the hostname should be `postgres` instead of `127.0.0.1`.

```env
DOCKER_DATABASE_URI="postgresql://solvyst_atlas:solvyst_atlas@postgres:5432/solvyst_atlas?sslmode=disable"
```

For an external hosted database, this can usually be the same value as `DATABASE_URI`.

`ATLAS_API_KEY`

Required for all `/api/v1/meta/*` and `/api/v1/reference/*` routes. Send it as:

```http
x-api-key: <ATLAS_API_KEY>
```

Generate a strong local key:

```sh
openssl rand -hex 32
```

`META_API_KEY` is still accepted as a deprecated fallback for older deployments, but new installs should use `ATLAS_API_KEY`.

`WEB_URL`

Primary browser/client origin allowed by CORS.

```env
WEB_URL="http://localhost:3000"
```

## App Keys

```env
APP_NAME="Solvyst Atlas"
APP_VERSION=0.1.0
NODE_ENV=production
HOST=0.0.0.0
PORT=5000
CORS_ORIGINS=*
```

`CORS_ORIGINS` defaults to `*` for MVP/self-host simplicity. It also accepts comma-separated origins when you want to lock browser access down:

```env
CORS_ORIGINS="https://app.example.com,https://admin.example.com"
```

## Local Docker PostgreSQL Keys

Used by the `postgres` service in `docker-compose.yml`:

```env
POSTGRES_DB=solvyst_atlas
POSTGRES_USER=solvyst_atlas
POSTGRES_PASSWORD="solvyst_atlas"
POSTGRES_PORT=5432
```

## Redis Keys

Redis is optional. Keep it disabled for MVP/single-instance deployments unless you need distributed rate limiting or queues.

```env
REDIS_ENABLED=false
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_URL=redis://redis:6379
REDIS_TLS=false
BULL_PREFIX=solvyst-atlas
EMAIL_QUEUE_RETRY=3
EMAIL_QUEUE_CONCURRENCY=5
```

When running Redis through Docker Compose, use the Redis profile:

```sh
docker compose --profile redis up --build server redis
```

## Rate Limit Keys

```env
META_RATE_LIMIT_MAX=120
META_RATE_LIMIT_WINDOW_MS=60000
```

`META_RATE_LIMIT_MAX` is the maximum requests allowed per API key/IP window.

`META_RATE_LIMIT_WINDOW_MS` is the rate-limit window in milliseconds.

## Optional Server Override

The API server loads root `.env` first and then `apps/server/.env` if it exists. Use `apps/server/.env` only for local server overrides, such as a different dev port.

For MVP/self-host, this is enough for browser access plus API-key protection:

```env
WEB_URL=http://localhost:3000
CORS_ORIGINS=*
ATLAS_API_KEY=<strong-random-secret>
```

Avoid old `ATLASKIT_*` keys; Solvyst Atlas uses `ATLAS_API_KEY` for API access.

## Security Notes

- Do not commit `.env`.
- Keep only `.env.example` in Git.
- Use a strong `ATLAS_API_KEY` in production.
- CORS is browser protection only; it is not a replacement for API authentication.
- Redis is optional. If `REDIS_ENABLED=false`, in-memory rate limiting is used for the running process.
