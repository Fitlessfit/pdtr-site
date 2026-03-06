@echo off
setlocal

cd /d "%~dp0"

set "PHP_CMD="
where php >nul 2>&1
if not errorlevel 1 set "PHP_CMD=php"

if not defined PHP_CMD if exist "C:\xampp\php\php.exe" set "PHP_CMD=C:\xampp\php\php.exe"
if not defined PHP_CMD (
    for /d %%D in ("C:\OSPanel\modules\php\PHP_*") do (
        if exist "%%~fD\php.exe" set "PHP_CMD=%%~fD\php.exe"
    )
)
if not defined PHP_CMD (
    for /d %%D in ("C:\OpenServer\modules\php\PHP_*") do (
        if exist "%%~fD\php.exe" set "PHP_CMD=%%~fD\php.exe"
    )
)

if not defined PHP_CMD (
    echo [ERROR] PHP is not found in PATH and common local folders.
    echo Install PHP or add php.exe to PATH, then run this file again.
    pause
    exit /b 1
)

set "HOST=127.0.0.1"
set "PORT=8000"
set "URL=http://%HOST%:%PORT%/"

echo Using PHP: %PHP_CMD%
echo Starting local server at %URL%
start "" "%URL%"

"%PHP_CMD%" -S %HOST%:%PORT% -t "%~dp0"

endlocal
