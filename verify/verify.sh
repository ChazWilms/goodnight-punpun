#!/bin/bash
# Auto-plays chapters in headless Chrome; the page beacons its status to the
# http server, whose access log we parse. usage: ./verify/verify.sh [from] [to] [port]
FROM=${1:-1}; TO=${2:-13}; PORT=${3:-8444}
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
cd "$(dirname "$0")/.." || exit 1
LOG=/tmp/pp_verify_$PORT.log

pkill -f "http.server $PORT" 2>/dev/null
python3 -m http.server $PORT > "$LOG" 2>&1 &
SRV=$!
sleep 1

FAIL=0
for n in $(seq "$FROM" "$TO"); do
  MARK="MARK_ch${n}_${RANDOM}"
  tries=0
  until curl -s --noproxy '*' -o /dev/null "http://127.0.0.1:$PORT/__mark/$MARK"; do
    tries=$((tries+1)); [ $tries -gt 20 ] && { echo "server never came up"; exit 2; }
    sleep 0.5
  done
  until grep -q "$MARK" "$LOG"; do sleep 0.2; done
  UD=$(mktemp -d)
  "$CHROME" --headless=new --disable-gpu --no-proxy-server --user-data-dir="$UD" \
    --remote-debugging-port=0 --window-size=320,240 \
    "http://127.0.0.1:$PORT/index.html?test=1&ch=$n" >/dev/null 2>&1 &
  CPID=$!
  RES=""
  for i in $(seq 1 90); do
    sleep 1
    SEG=$(sed -n "/$MARK/,\$p" "$LOG")
    if echo "$SEG" | grep -q "__status/ALL%20DONE"; then RES="PASS"; break; fi
    ERRL=$(echo "$SEG" | grep -o '__status/ERR[^ "]*' | tail -1)
    if [ -n "$ERRL" ]; then RES="FAIL: $(python3 -c "import sys,urllib.parse;print(urllib.parse.unquote(sys.argv[1]))" "$ERRL")"; break; fi
  done
  kill "$CPID" 2>/dev/null
  sleep 1
  rm -rf "$UD" 2>/dev/null || true
  if [ -z "$RES" ]; then
    HB=$(sed -n "/$MARK/,\$p" "$LOG" | grep -o '__status/[^ "]*' | tail -1)
    RES="FAIL: no-result last=$(python3 -c "import sys,urllib.parse;print(urllib.parse.unquote(sys.argv[1]))" "${HB:-none}")"
  fi
  echo "ch$n $RES"
  case "$RES" in PASS) ;; *) FAIL=1 ;; esac
done
kill "$SRV" 2>/dev/null
exit $FAIL
