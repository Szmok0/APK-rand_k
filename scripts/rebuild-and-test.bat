@echo off
REM ============================================================
REM  Zuza's Diary - pull latest branch + build installable APK
REM  Double-click this file (or run from cmd) inside the repo.
REM  It always jumps to the repo root first, so it works no
REM  matter where you double-click it from.
REM ============================================================

set BRANCH=claude/mobile-apk-md-ogynun

cd /d "%~dp0\.."

echo.
echo === [1/4] Fetching %BRANCH% ===
git fetch origin %BRANCH%
if errorlevel 1 goto :error

echo.
echo === [2/4] Resetting local branch to match origin exactly ===
REM Uses reset --hard (not pull) on purpose: a plain pull can get stuck on
REM local uncommitted changes (e.g. app.json's EAS projectId written by an
REM earlier build) and silently fail to update. This always matches what's
REM on GitHub, no exceptions.
git checkout %BRANCH% 2>nul
git reset --hard origin/%BRANCH%
if errorlevel 1 goto :error

echo.
echo === [3/4] Now on commit: ===
git log -1 --oneline

echo.
echo === [4/4] Starting EAS build (installable .apk, Android) ===
echo This uploads to Expo's build servers and takes a few minutes.
echo When it finishes you'll get a link to download the .apk.
echo.
npx eas-cli build --profile preview --platform android

echo.
echo Done. Download the .apk from the link above, copy it to your
echo phone, and install it (allow "install from unknown sources" if asked).
goto :end

:error
echo.
echo Something failed above - scroll up to see the error.

:end
echo.
pause
