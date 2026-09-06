---
name: Prison Life build environment
description: Environment variables required when validating the Prison Life Vite artifact.
---

When running a production build for the Prison Life artifact, provide both `PORT` and `BASE_PATH` explicitly.

**Why:** The Vite configuration fails fast when either variable is absent, even though the managed development workflow supplies the runtime configuration automatically.

**How to apply:** Use the artifact's configured port and `BASE_PATH=/` for local build verification; do not treat a missing-variable failure as an application code failure.