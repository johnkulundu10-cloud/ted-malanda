@echo off
setlocal

if not exist "package.json" (
  echo ERROR: package.json was not found.
  echo Open PowerShell in the ted-malanda project folder and run this installer again.
  exit /b 1
)

if not exist "src\app\admin\(protected)\about\page.tsx" (
  echo ERROR: Install this in the Ted Malanda project after the Admin Content Workflow patch.
  exit /b 1
)

set "backup_dir=%TEMP%\ted-malanda-about-page-backup-%RANDOM%%RANDOM%"
mkdir "%backup_dir%" >nul 2>nul
copy /Y "src\app\about\page.tsx" "%backup_dir%\about-page.tsx" >nul
copy /Y "src\app\admin\actions.ts" "%backup_dir%\actions.ts" >nul
copy /Y "src\app\admin\admin.module.css" "%backup_dir%\admin.module.css" >nul

xcopy /E /I /Y "%~dp0payload\src" "src" >nul
if errorlevel 1 (
  echo ERROR: The patch could not be installed completely.
  echo Your backup is at: %backup_dir%
  exit /b 1
)

echo.
echo About page admin patch installed successfully.
echo Backup created at: %backup_dir%
echo.
endlocal
