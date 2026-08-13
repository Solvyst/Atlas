# Deployment

## Production Order

For a fresh or migrated environment:

```sh
pnpm install --frozen-lockfile
pnpm --filter @solvyst-atlas/database build
pnpm --filter @solvyst-atlas/server build
pnpm db:migrate
pnpm db:contrib:validate
pnpm db:import
```

For production, run `pnpm db:import` only from a trusted maintainer job after staging validation.

## Docker

Build the production server image:

```sh
docker build -t solvyst-atlas-server:local .
```

Run with external database and no Redis:

```sh
docker compose up --build server
```

Run with local Docker PostgreSQL:

```sh
docker compose --profile local-db up -d postgres
docker compose --profile local-db up --build server
```

Run with Redis enabled:

```sh
docker compose --profile redis up --build server redis
```

Required runtime environment:

```env
DATABASE_URI="postgresql://user:password@host:5432/db?sslmode=require"
DOCKER_DATABASE_URI="postgresql://user:password@host:5432/db?sslmode=require"
META_API_KEY="<at-least-32-random-characters>"
WEB_URL="https://your-web-origin.example"
```

Optional:

```env
REDIS_ENABLED=false
CORS_ORIGINS="https://app.example.com,https://admin.example.com"
META_RATE_LIMIT_MAX=120
META_RATE_LIMIT_WINDOW_MS=60000
```

## CI/CD

GitHub Actions workflows are currently removed. Add CI back when the public contribution flow and deployment target are stable.
