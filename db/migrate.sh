#!/usr/bin/env bash
set -euo pipefail

ACTION="${1:-migrate}"

if [[ "$ACTION" == "clean" ]]; then
  echo "ERROR: Refusing to run CLEAN from this script." >&2
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="$(cd "${SCRIPT_DIR}/.." && pwd)/.env"

# Load .env
if [[ -f "$ENV_FILE" ]]; then
  while IFS= read -r line || [[ -n "$line" ]]; do
    [[ "$line" =~ ^[[:space:]]*# ]] && continue
    [[ -z "${line// /}" ]] && continue

    key="${line%%=*}"
    value="${line#*=}"

    key="$(echo "$key" | xargs)"
    value="$(echo "$value" | sed -e 's/^"//' -e 's/"$//')"

    export "$key=$value"
  done < "$ENV_FILE"
fi

if [[ -z "${DATABASE_URL:-}" ]]; then
  echo "ERROR: DATABASE_URL env var is required" >&2
  exit 1
fi

if [[ -z "${DATABASE_USER:-}" ]]; then
  echo "ERROR: DATABASE_USER env var is required" >&2
  exit 1
fi

if [[ -z "${DATABASE_PASSWORD:-}" ]]; then
  echo "ERROR: DATABASE_PASSWORD env var is required" >&2
  exit 1
fi

docker run --rm \
  -v "${SCRIPT_DIR}:/flyway/sql" \
  flyway/flyway:10.9.1 \
  "-url=jdbc:${DATABASE_URL}" \
  "-user=${DATABASE_USER}" \
  "-password=${DATABASE_PASSWORD}" \
  "-locations=filesystem:/flyway/sql/migrations" \
  "-schemas=public,meta" \
  "-table=flyway_schema_history" \
  "-sqlMigrationSuffixes=.sql" \
  "-validateMigrationNaming=true" \
  "-outOfOrder=true" \
  "-baselineOnMigrate=true" \
  "-baselineVersion=0" \
  "-baselineDescription=init" \
  "${ACTION}"