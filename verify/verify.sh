#!/bin/bash
# Auto-plays chapters in headless Chrome and reports pass/fail per chapter.
# usage: ./verify/verify.sh [from] [to] [port]
FROM=${1:-1}; TO=${2:-13}; PORT=${3:-8431}
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
cd "$(dirname "$0")/.." || exit 1

# server (idempotent)
if ! curl -s --noproxy '*' -o /dev/null "http://127.0.0.1:$PORT/index.html"; then
  python3 -m http.server $PORT >/dev/null 2>&1 &
  sleep 1
fi

FAIL=0
for n in $(seq $FROM $TO); do
  UD=$(mktemp -d)
  OUT=$("$CHROME" --headless=new --disable-gpu --no-proxy-server --user-data-dir="$UD" \
    --virtual-time-budget=60000 --window-size=320,240 --dump-dom \
    "http://127.0.0.1:$PORT/index.html?test=1&ch=$n" 2>/dev/null \
    | grep -o '<div id="test-status"[^>]*>[^<]*</div>' | sed 's/<[^>]*>//g')
  rm -rf "$UD"
  case "$OUT" in
    *"ALL DONE"*) echo "ch$n PASS ($OUT)";;
    *) echo "ch$n FAIL: $OUT"; FAIL=1;;
  esac
done
exit $FAIL
