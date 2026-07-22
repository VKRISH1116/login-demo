# Loads secrets from the project-root .env into this session, then starts the backend.
# Usage (from the backend/ folder):  ./run-dev.ps1
$envFile = Join-Path $PSScriptRoot '..\.env'
if (-not (Test-Path $envFile)) {
    Write-Error "Missing .env at repo root. Copy .env.example to .env and fill it in."
    exit 1
}
Get-Content $envFile | ForEach-Object {
    $line = $_.Trim()
    if ($line -and -not $line.StartsWith('#') -and $line.Contains('=')) {
        $name, $value = $line -split '=', 2
        Set-Item -Path "Env:$($name.Trim())" -Value $value.Trim()
    }
}
Write-Host "Loaded env from .env — starting Spring Boot..." -ForegroundColor Green
& "$PSScriptRoot\mvnw.cmd" spring-boot:run
