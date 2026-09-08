# BOUND Theme, RTL, and Composition Fix

## Scope

This pass addresses the reported presentation defects without changing BOUND methodology content, publication metadata, canonical URLs, schema, or the embedded Titr/Koodak typography choice.

## Root causes found

1. The final dark-theme `:root` token block appeared **after** the existing light-theme token block. Because the selectors had equivalent specificity, the later dark values won in the cascade even when `data-theme="light"` was active. The toggle changed state, but much of the page continued using dark colors.
2. Several pass-1 components used hard-coded dark translucent backgrounds, so light mode remained visually inconsistent even where color variables switched correctly.
3. The shared theme JavaScript assumed every page contained an SVG with `id="themeIcon"`. Several article pages used a plain glyph button instead, which caused the toggle update path to fail.
4. The Persian homepage used `.section-inner`, `.section-intro`, `.three-questions`, `.contract-grid`, `.question-card`, and related structures without a complete shared composition layer.
5. Persian navigation relied on manual flex `order` values. This made source order, RTL direction, and responsive behavior fight each other.
6. Several shared components still had physical LTR properties (`text-align:left`, `border-left`, `padding-left`, left-positioned nav indicators) instead of logical/RTL-aware composition.

## Fixes

- Added a final authoritative light-theme token block after all dark refinements.
- Added explicit light variants for the hero visual, navigation, floating language control, cards, accordions, section-alt surfaces, quotes, lifecycle elements, footer, and utility controls.
- Rebuilt theme-toggle handling so it works with or without a pre-existing SVG icon and persists correctly through `localStorage`.
- Added an early theme-state initializer to every HTML route to prevent a dark flash before the deferred JavaScript executes.
- Added shared `.section-inner`, `.section-intro`, `.content-copy`, `.concept-grid`, and Persian homepage card compositions.
- Removed the effect of Persian manual nav ordering through final RTL rules and restored source-order flex behavior.
- Corrected RTL alignment for headings, paragraphs, lifecycle cards, accordion triggers, quotes, lists, publication actions, authority pages, article pages, and footer content.
- Converted physical LTR decorations to RTL equivalents where needed: nav underlines, mobile menu rails, lifecycle labels, quote rails, list markers, section dividers.
- Preserved mixed English technical identifiers using `unicode-bidi: plaintext` where appropriate.
- Kept Titr for Persian headings and Koodak for Persian body/UI text.

## Files changed

- `assets/bound.css`
- `assets/bound.js`
- All HTML routes received the small early theme initializer.

## Validation targets

- Dark and light modes on English and Persian homepages.
- Persian desktop and mobile composition.
- Theme toggle on article routes that previously used a text-only icon.
- No methodology, DOI, canonical, hreflang, or JSON-LD changes.
