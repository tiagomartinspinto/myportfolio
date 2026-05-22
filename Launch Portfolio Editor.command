#!/bin/zsh
cd "$(dirname "$0")"
npm run launch
echo ""
echo "Launcher finished. Press Return to close this window."
read
