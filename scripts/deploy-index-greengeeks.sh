#!/usr/bin/env bash
set -Eeuo pipefail

DEST="/home/stepston/public_html/mentorandi/index.html"
SRC="index.html"

if [[ ! -f "$SRC" ]]; then
  echo "Run this script from the mentorandi-website repository root." >&2
  exit 1
fi

if ! ssh -G greengeeks >/dev/null 2>&1; then
  echo "SSH alias 'greengeeks' is not configured on this machine." >&2
  exit 1
fi

echo "Verifying GreenGeeks destination..."
ssh greengeeks '
  set -eu
  test -d /home/stepston/public_html/mentorandi
  test -f /home/stepston/public_html/mentorandi/index.html
  echo "Destination verified."
'

echo "Dry run: index.html only"
rsync -avn --checksum "$SRC" "greengeeks:$DEST"

echo "Deploying index.html only..."
rsync -av --checksum "$SRC" "greengeeks:$DEST"

echo "Verifying live Log in link..."
for i in 1 2 3 4 5; do
  if curl --fail --silent --show-error --max-time 20     "https://mentorandi.com/index.html?deploy=$(date +%s)"     | grep -q 'https://app.mentorandi.com/login'; then
    echo "Success: live homepage contains Log in."
    exit 0
  fi
  sleep 3
done

echo "Upload completed, but live verification did not find the Log in link." >&2
exit 1
