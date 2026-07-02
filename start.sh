#!/bin/bash

echo "Starting QADemo App..."
echo "App will be available at: http://localhost:6162"
echo "Press Ctrl+C to stop."
echo ""

npm run dev -- --host 0.0.0.0 --port 6162
