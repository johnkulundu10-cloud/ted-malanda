@echo off
setlocal

if not exist "package.json" (
  echo ERROR: package.json was not found.
  echo Open PowerShell in the ted-malanda project folder and run this installer again.
  exit /b 1
)

if not exist "src\components\admin\AdminArticlesTable.tsx" (
  echo ERROR: This does not appear to be the Ted Malanda project folder.
  exit /b 1
)

set "backup_dir=%TEMP%\ted-malanda-article-analytics-backup-%RANDOM%%RANDOM%"
mkdir "%backup_dir%" >nul 2>nul
copy /Y "src\components\admin\AdminArticlesTable.tsx" "%backup_dir%\AdminArticlesTable.tsx" >nul
copy /Y "src\app\admin\admin.module.css" "%backup_dir%\admin.module.css" >nul

xcopy /E /I /Y "%~dp0payload\src" "src" >nul
if errorlevel 1 (
  echo ERROR: The patch could not be installed completely.
  echo Your backup is at: %backup_dir%
  exit /b 1
)

echo.
echo Article-row analytics installed successfully.
echo Backup created at: %backup_dir%
echo.
endlocal
