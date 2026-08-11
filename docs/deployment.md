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

Run with Docker Compose:

```sh
docker compose up --build
```

Required runtime environment:

```env
DATABASE_URI="postgresql://postgres.<project-ref>:<database-password>@aws-0-<region>.pooler.supabase.com:5432/postgres?sslmode=require"
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

GitHub Actions workflows:

```txt
.github/workflows/ci.yml
.github/workflows/docker-publish.yml
```

`ci.yml` should run validation, typecheck, Drizzle check, build, and Docker build on pull requests and pushes.

Recommended CI command set:

```sh
pnpm db:contrib:validate
pnpm --filter @solvyst-atlas/database typecheck
pnpm --filter @solvyst-atlas/database build
pnpm --filter @solvyst-atlas/database db:check
pnpm --filter @solvyst-atlas/server typecheck
pnpm --filter @solvyst-atlas/server build
```

`docker-publish.yml` publishes the server image to GitHub Container Registry:

```txt
ghcr.io/<owner>/<repo>/server
```

It runs on pushes to `main`/`master`, version tags, and manual dispatch.
