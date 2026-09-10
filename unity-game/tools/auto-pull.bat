@echo off
REM Automatically pulls the latest changes for this branch every 60 seconds,
REM so Unity picks up new files/scripts without a manual "Pull" click.
REM
REM Usage (Windows, double-click or run from a terminal inside the cloned repo):
REM   unity-game\tools\auto-pull.bat
REM
REM Close this window to stop. If you have uncommitted local edits in Unity
REM (e.g. you tweaked something in the Inspector), a pull can fail rather
REM than silently overwrite your work — commit or discard those edits, then
REM it will keep retrying on its own.

setlocal
set BRANCH=claude/unity-browser-game-wpftcs
set INTERVAL=60

for /f "delims=" %%i in ('git rev-parse --show-toplevel') do set REPO_ROOT=%%i
cd /d "%REPO_ROOT%"
git checkout %BRANCH%

echo Auto-pulling '%BRANCH%' every %INTERVAL%s. Close this window to stop.

:loop
git pull --ff-only origin %BRANCH%
if errorlevel 1 echo Pull failed - you likely have local uncommitted changes. Resolve them, it will retry automatically.
timeout /t %INTERVAL% >nul
goto loop
