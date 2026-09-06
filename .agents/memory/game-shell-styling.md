---
name: Game shell styling
description: Durable styling boundary for the Prison Life game viewport.
---

The game viewport should keep its dense, game-specific layout rules in a dedicated stylesheet instead of expanding the shared public/registration stylesheet.

**Why:** The landing page and prisoner creator share many generic class names, so broad game overrides can silently change those flows; isolation also makes breakpoint tuning safer.

**How to apply:** When extending the game shell, prefer selectors scoped under `.game-shell-page` and update its dedicated stylesheet. Keep navigation and placeholder views inside the same shell rather than creating separate artifacts.