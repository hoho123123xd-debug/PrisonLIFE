#!/usr/bin/env bash
# Automatically pulls the latest changes for this branch every 60 seconds,
# so Unity picks up new files/scripts without a manual "Pull" click.
#
# Usage (macOS/Linux, from anywhere inside the cloned repo):
#   bash unity-game/tools/auto-pull.sh
#
# Stop with Ctrl+C. If you have uncommitted local edits in Unity (e.g. you
# tweaked something in the Inspector), a pull can fail rather than silently
# overwrite your work — commit or discard those edits, then it will keep
# retrying on its own.
set -euo pipefail

BRANCH="claude/unity-browser-game-wpftcs"
INTERVAL_SECONDS=60

cd "$(git rev-parse --show-toplevel)"
git checkout "$BRANCH"

echo "Auto-pulling '$BRANCH' every ${INTERVAL_SECONDS}s. Press Ctrl+C to stop."
while true; do
  if git pull --ff-only origin "$BRANCH"; then
    :
  else
    echo "Pull failed — you likely have local uncommitted changes. Resolve them, it will retry automatically."
  fi
  sleep "$INTERVAL_SECONDS"
done
