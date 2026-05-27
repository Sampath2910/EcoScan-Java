@echo off
REM EcoScan Backend Startup Script
REM Sets environment variables and starts the Spring Boot server

echo Starting EcoScan Backend...
echo.

REM Load environment variables from .env if it exists
if exist "%~dp0.env" (
    echo Loading configuration from .env...
    for /f "usebackq tokens=1,2 delims==" %%i in ("%~dp0.env") do (
        set %%i=%%j
    )
) else (
    echo Warning: .env file not found. Please configure your .env file.
    set DATABASE_URL=jdbc:mysql://localhost:3306/ecoscan_db
    set DATABASE_USER=root
)

REM Navigate to backend directory
cd /d "%~dp0backend"

REM Start Maven Spring Boot
mvn spring-boot:run

REM Keep window open if there's an error
pause
