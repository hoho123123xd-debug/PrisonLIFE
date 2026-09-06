---
name: Game shell styling
description: Durable styling boundary for the Prison Life game viewport.
---

The game viewport should keep its dense, game-specific layout rules in a dedicated stylesheet instead of expanding the shared public/registration stylesheet.

**Why:** The landing page and prisoner creator share many generic class names, so broad game overrides can silently change those flows; isolation also makes breakpoint tuning safer.

**How to apply:** When extending the game shell, prefer selectors scoped under `.game-shell-page` and update its dedicated stylesheet. Keep navigation and placeholder views inside the same shell rather than creating separate artifacts.

For desktop viewport fitting, keep the lower-module grid track explicit and clamp the cell scene to the available height of its own grid cell.

**Why:** Width-only sizing lets the 3:2 scene overflow into the lower modules on unusually wide or short viewports.

**How to apply:** Pair the desktop scene width rule with a `max-height` based on the cell-column track, and keep the cell column's overflow contained.