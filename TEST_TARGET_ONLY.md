# ⚠ DEMO / TEST TARGET ONLY

This `demo-app/` directory is **NOT part of the QA Automation AI Enabler product.**

It is a self-contained sandbox SPA used only as a **recording target** and
**bug-prediction sandbox** for developing and demoing the platform:

- The Browser Recorder points at it (`http://localhost:6162`) to capture flows.
- The AI-QA Risk Prediction analyzes its source as a demo repo.

Do **not** ship it, deploy it, or treat its code as production. It runs locally
only, has hard-coded demo credentials, and resets all state on reload.

Started automatically by the root `./start.sh` (skip with `./start.sh --no-demo`).
