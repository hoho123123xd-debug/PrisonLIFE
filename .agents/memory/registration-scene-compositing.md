---
name: Registration scene compositing
description: Visual compositing rule for the Prison Life character creator.
---

The registration preview should use a transparent character asset over a subject-free prison environment. Full-page reference screenshots often contain their own prisoner, so using one as the stage background creates a visible double character.

**Why:** A realistic character cutout was initially composited over a reference image that already contained a prisoner, producing an obvious duplicate silhouette and weakening the game-like preview.

**How to apply:** When adding or replacing character art, keep the environment image empty in the central subject area and use CSS/asset layers for appearance selections.