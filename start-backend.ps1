# EcoScan Backend Startup Script (PowerShell)
# Sets environment variables and starts the Spring Boot server

Write-Host "Starting EcoScan Backend..." -ForegroundColor Green
Write-Host ""

# Load environment variables from .env if it exists
$envFile = Join-Path $PSScriptRoot ".env"
if (Test-Path $envFile) {
    Get-Content $envFile | Where-Object { $_ -match '=' -and $_ -notmatch '^#' } | ForEach-Object {
        $name, $value = $_ -split '=', 2
        [System.Environment]::SetEnvironmentVariable($name.Trim(), $value.Trim())
    }
    Write-Host "Loaded configuration from .env" -ForegroundColor Green
} else {
    Write-Host "Warning: .env file not found. Using defaults." -ForegroundColor Yellow
    $env:DATABASE_URL = "jdbc:mysql://localhost:3306/ecoscan_db"
    $env:DATABASE_USER = "root"
}

# Navigate to backend directory
Set-Location -Path (Join-Path $PSScriptRoot "backend")

Write-Host "Environment variables set:" -ForegroundColor Cyan
Write-Host "  DATABASE_URL: $env:DATABASE_URL"
Write-Host "  DATABASE_USER: $env:DATABASE_USER"
Write-Host ""
Write-Host "Starting Spring Boot server..." -ForegroundColor Yellow
Write-Host ""

# Start Maven Spring Boot
mvn spring-boot:run

# Keep window open if there's an error
Write-Host ""
Write-Host "Backend stopped. Press any key to close..." -ForegroundColor Red
Read-Host
