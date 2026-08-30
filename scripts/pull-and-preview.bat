@echo off
REM ============================================================
REM  Zuza's Diary - pull latest branch + quick local preview
REM  Faster than a full EAS build for checking a change - opens
REM  a web preview in the browser. (Expo Go on the phone needs a
REM  version matching this project's SDK; if that's out of sync,
REM  use rebuild-and-test.bat for a real .apk instead.)
REM ============================================================

set BRANCH=claude/mobile-apk-md-ogynun

cd /d "%~dp0\.."

echo.
echo === [1/3] Fetching %BRANCH% ===
git fetch origin %BRANCH%
if errorlevel 1 goto :error

echo.
echo === [2/3] Resetting local branch to match origin exactly ===
git checkout %BRANCH% 2>nul
git reset --hard origin/%BRANCH%
if errorlevel 1 goto :error

echo.
echo === Now on commit: ===
git log -1 --oneline

echo.
echo === [3/4] Installing dependencies exactly as locked (npm ci) ===
REM Plain "npm install" can let a package (react-dom here, once) drift to a
REM slightly different version than what's actually committed in
REM package-lock.json, causing an "Incompatible React versions" crash on
REM the web preview even though the repo itself is pinned correctly. npm ci
REM wipes node_modules and installs strictly from the lockfile every time,
REM so this can't happen no matter what got installed locally before.
call npm ci
if errorlevel 1 goto :error

echo.
echo === [4/4] Starting Expo (press w for web, scan the QR for Expo Go) ===
npx expo start
goto :end

:error
echo.
echo Something failed above - scroll up to see the error.

:end
echo.
pause
