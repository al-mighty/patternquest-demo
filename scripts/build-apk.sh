#!/bin/bash
set -e
echo "Building APK..."
cd "$(dirname "$0")/../packages/mobile"
npx eas-cli build --platform android --profile preview --non-interactive

echo "Downloading APK..."
APK_URL=$(npx eas-cli build:list --platform android --status finished --limit 1 --json | python3 -c "import sys,json; print(json.loads(sys.stdin.read())[0]['artifacts']['buildUrl'])")
curl -L -o /tmp/patternquest.apk "$APK_URL"

echo "Uploading to VPS..."
scp /tmp/patternquest.apk root@194.87.96.85:/opt/cheslav/clm/patternquest.apk

echo "Done! APK available at https://cheslav.space/patternquest.apk"