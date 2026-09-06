---
name: Registration stage layout
description: Durable separation and sizing rules for the Prison Life registration wizard.
---

The supplied intake mockup is the source of truth for the registration layout. Stage 1 uses full-height identity, character preview, and prisoner type columns; the old appearance editor has been intentionally removed pending a new design. Stage 2 remains available as a larger specialization step in the wizard.

**Why:** The user chose to discard the first appearance-editor concept and rebuild it from scratch, while preserving the surrounding intake flow and visual proportions.

**How to apply:** When changing the registration layout, preserve the full-height desktop intake structure, fit it at the 1024px reference viewport, and let it collapse into a vertical flow on mobile. Do not restore the removed atlas selector without a new design decision.