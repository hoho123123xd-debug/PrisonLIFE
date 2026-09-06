---
name: Responsive design (project-wide)
description: Constitutional responsiveness rule for every Prison Life screen and component — takes precedence over ad-hoc CSS fixes.
---

Every screen and every component in Prison Life must be one fluid, responsive interface — never a separate "desktop version" and "mobile version". The layout adapts continuously to the available viewport while keeping the same structure and functionality.

**Priority order, in this exact sequence:**
1. The whole interface stays visible.
2. Proportions stay correct.
3. No elements overlap.
4. No unnecessary scrolling.
5. Hierarchy and functionality are preserved.
6. Only then: make full use of any extra space.

**Never:**
- Design for one fixed resolution, or assume a 1920×1080 monitor.
- Enlarge elements just because more space happens to be available.
- Use fixed widths/heights where the element should be flexible.
- Use `transform: scale()` to scale the whole interface.
- Push elements outside the viewport.
- Fix a layout problem with a stray `overflow: hidden`.
- Hide an existing element just to make a layout fit.
- Ship a new screen without testing it across multiple viewport ratios.

**Every new screen must be verified at minimum at:** 1920×1080, 1600×900, 1440×900, 1366×768, 1280×800. If it works at 1920×1080 but something is clipped/broken at 1366×768, the screen is **not done**.

**Every new component must respond to both width and height changes** — more width does not imply room to grow taller. This applies to every current and future system: game screens, cell art, side panels, cards, modals, hotspots, menus, stat displays, bars, tables, lists, forms, combat, inventory, jobs, chat, rankings, quests, gang, achievements, settings, etc.

**When touching an existing screen:** preserve its existing structure, styling, proportions, assets, and hierarchy first, then adapt that to the viewport — don't redesign it from scratch on every change.

**When space runs short, in this order:** shrink an element that can be shrunk → constrain/limit its space → change how things are arranged → only ever consider removing/hiding an element as an absolute last resort. Never remove an element from a screen just because the viewport is smaller.

**Assets:** never let images stretch or distort — preserve aspect ratio. Anything positioned inside a scene/image (e.g. a clickable hotspot on the bed in the cell artwork) must be positioned relative to that scene's own container, not the page viewport, so it stays anchored to the art at every resolution. Never hardcode per-breakpoint magic-number offsets (e.g. "at 1920px use `left: 420px`, at 1440px use `left: 300px`") — derive the position from the container (percentages, `object-fit`-aware math, container queries) instead.

**Scroll:** for app/dashboard-style screens whose main elements are meant to fit within the viewport, a vertical scrollbar is not an acceptable fix for a layout that doesn't fit. Scroll is fine only where it is a genuine part of a specific component (chat history, a long item/message list), never as a patch for a badly fitted layout.

**Before adding anything new:** check how it affects the existing layout at other sizes; don't add an element in a way that only works at the current viewport size. Do a responsiveness pass after any significant change.

**This rule has precedence over ad-hoc CSS fixes.** If a new change conflicts with the existing layout, fix the underlying layout mechanic rather than bolting on another CSS hack.
