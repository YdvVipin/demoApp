#!/bin/bash

DEMO_PORT=6162
API_PORT=6163

echo "Starting QADemo App..."
echo "UI:  http://localhost:${DEMO_PORT}"
echo "API: http://localhost:${API_PORT} (OpenAPI at /api/openapi.json)"
echo "Press Ctrl+C to stop."
echo ""

# Free both ports. Browser Recorder hardcodes localhost:6162 — refuse to
# silently bind another port.
for PORT in "$DEMO_PORT" "$API_PORT"; do
  pids=$(lsof -ti tcp:"$PORT" 2>/dev/null || true)
  if [ -n "$pids" ]; then
    echo "Port $PORT is in use (PID: $pids). Stopping it..."
    echo "$pids" | xargs kill -9 2>/dev/null || true
    sleep 1
    if [ "$PORT" = "$DEMO_PORT" ] && lsof -ti tcp:"$DEMO_PORT" >/dev/null 2>&1; then
      echo "ERROR: Could not free port $DEMO_PORT. Stop the other process and retry."
      exit 1
    fi
  fi
done

# Start the API server (zero-dependency Node) in the background; stop it on exit.
node server.js &
API_PID=$!
trap 'kill $API_PID 2>/dev/null' EXIT

npm run dev