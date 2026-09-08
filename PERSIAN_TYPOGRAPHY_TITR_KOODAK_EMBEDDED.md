# BOUND Persian typography — embedded Titr + Koodak

The BOUND Persian edition now uses the exact user-provided local font files across every Persian route.

## Typography mapping

- **Titles/headings:** Titr (`assets/fonts/titr.ttf`)
- **Body/UI text:** Koodak (`assets/fonts/koodak.ttf`)
- Technical identifiers explicitly marked as code/mono remain in the site's monospace stack.

## Embedding

Both font binaries are stored inside the repository and referenced through `@font-face` in `assets/bound.css`. There is no remote Persian-font dependency.

Each Persian HTML route also preloads both local fonts using a route-correct relative path.

## Coverage

Applied to all Persian routes under `/fa/`, including the homepage, author/method pages, IFEM lineage page, AI-assisted engineering page, and all Persian technical articles.

## Content impact

No methodology copy, SEO metadata, canonical URLs, hreflang relationships, schema data, publication identifiers, interaction logic, or English typography was changed.
