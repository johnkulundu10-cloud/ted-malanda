@echo off
setlocal

if not exist "src\components\admin\ProfileForm.tsx" (
  echo ERROR: Install the Admin Account and Profile patch first.
  exit /b 1
)

copy /Y "src\components\admin\ProfileForm.tsx" "%TEMP%\ted-malanda-ProfileForm.tsx.bak" >nul
xcopy /E /I /Y "%~dp0payload\src" "src" >nul

if errorlevel 1 (
  echo ERROR: The fix could not be installed.
  exit /b 1
)

echo Profile password form fix installed successfully.
endlocal
