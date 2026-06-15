param(
  [ValidateSet("migrate","validate","info","repair","clean","baseline")]
  [string]$Action = "migrate"
)

$ErrorActionPreference = "Stop"

if ($Action -eq "clean") {
  Write-Error "Refusing to run CLEAN from this script. Use Flyway directly if you really need it."
  exit 1
}

$envFile = Join-Path (Split-Path $PSScriptRoot -Parent) ".env"

if (Test-Path $envFile) {
  Get-Content $envFile | ForEach-Object {
    if ($_ -match '^\s*#' -or $_ -match '^\s*$') { return }

    $kv = $_ -split '=', 2

    if ($kv.Length -eq 2) {
      $key = $kv[0].Trim()
      $value = $kv[1].Trim().Trim('"')
      [System.Environment]::SetEnvironmentVariable($key, $value, "Process")
    }
  }
}

if (-not $env:DATABASE_URL) {
  Write-Error "FLYWAY_DATABASE_URL environment variable is required"
  exit 1
}

if (-not $env:DATABASE_USER) {
  Write-Error "FLYWAY_DATABASE_USER environment variable is required"
  exit 1
}

if (-not $env:DATABASE_PASSWORD) {
  Write-Error "FLYWAY_DATABASE_PASSWORD environment variable is required"
  exit 1
}

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
  Write-Error "Docker is not installed or not in PATH. Install Docker Desktop and restart terminal."
  exit 1
}

docker run --rm `
  -v "${PSScriptRoot}:/flyway/sql" `
  flyway/flyway:10.9.1 `
  "-url=jdbc:$env:DATABASE_URL" `
  "-user=$env:DATABASE_USER" `
  "-password=$env:DATABASE_PASSWORD" `
  "-locations=filesystem:/flyway/sql/migrations" `
  "-schemas=public,meta" `
  "-table=flyway_schema_history" `
  "-sqlMigrationSuffixes=.sql" `
  "-validateMigrationNaming=true" `
  "-outOfOrder=true" `
  "-baselineOnMigrate=true" `
  "-baselineVersion=0" `
  "-baselineDescription=init" `
  $Action