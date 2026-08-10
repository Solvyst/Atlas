# Deployment

## Docker

Build the production server image:

```sh
docker build -t atlaskit-server:local .
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

`ci.yml` runs lint, typecheck, Drizzle check, build, and Docker build on pull requests and pushes.

`docker-publish.yml` publishes the server image to GitHub Container Registry:

```txt
ghcr.io/<owner>/<repo>/server
```

It runs on pushes to `main`/`master`, version tags, and manual dispatch.
