# BOUND Website Refinement — Pass 1

## Scope
This pass intentionally changes only the first visual-system layer: dark palette, homepage hero composition, Persian typography, and language control. Methodology content, DOI data, schema, authority routes, SEO metadata, lifecycle logic, and publication records were preserved.

## Changes
- Replaced the near-black dark theme with a softer technical dark hierarchy: `#101827` background, `#172238` surfaces, `#21324C` raised surfaces.
- Reduced grid/glow contrast and softened cyan/blue/teal/amber signals.
- Rebuilt the homepage hero into a two-column composition: authority/content on one side, interactive BOUND mark + four-stage execution model on the other.
- Reduced three equal hero CTAs to two primary actions: Explore Method + Read Publication. Lifecycle remains a secondary contextual link.
- Moved the EN/FA switch out of the crowded navigation into a persistent floating language pill below the header.
- Embedded the user-selected Persian fonts: Titr for headings and Koodak for body/UI copy.
- Preserved the interactive mark IDs and canvas so existing JavaScript behavior continues to work.
- Added responsive collapse rules for tablet/mobile without changing underlying content sections.

## Files changed
- `index.html`
- `fa/index.html`
- `assets/bound.css`
- `assets/fonts/titr.ttf`
- `assets/fonts/koodak.ttf`

## Not changed in this pass
- Section content architecture below the hero
- BOUND/IFEM terminology or factual claims
- DOI / Zenodo / ORCID data
- JSON-LD / canonical / hreflang
- JS interaction model
- Existing secondary Persian authority routes

## Next pass
Recompose the major homepage sections one by one: Problem → Architecture → Contracts → Principles → Lifecycle → Practice → IFEM lineage → References.
