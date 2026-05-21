#!/bin/zsh
set -u

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
REPO_ROOT_QUOTED="$(printf "%q" "$REPO_ROOT")"

cd "$REPO_ROOT" || exit 1

echo "Starting Tiago Martins Pinto portfolio editor..."
echo "Repository: $REPO_ROOT"

osascript <<APPLESCRIPT
tell application "Terminal"
  activate
  do script "cd $REPO_ROOT_QUOTED && npm run admin"
  do script "cd $REPO_ROOT_QUOTED && npm run preview"
end tell
APPLESCRIPT

sleep 2

open "http://127.0.0.1:8787/"
open "http://127.0.0.1:8080/"

echo ""
echo "Admin:   http://127.0.0.1:8787/"
echo "Preview: http://127.0.0.1:8080/"
echo ""
echo "Two server windows should stay open for logs and errors."
echo "Close those windows when you want to stop the servers."
echo ""
read "?Press Return to close this launcher window. "
