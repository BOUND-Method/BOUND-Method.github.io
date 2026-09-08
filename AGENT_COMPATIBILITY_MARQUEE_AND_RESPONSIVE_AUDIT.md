# Agent compatibility marquee + responsive audit

## Added
- Vendor-neutral compatibility strip between the agentic problem/solution section and the BOUND hero.
- Seamless horizontal loop with logo + name chips.
- Representative major coding-agent workflows: Claude Code, OpenAI Codex, GitHub Copilot, Gemini CLI, Google Jules, Cursor, Windsurf, Cline, Replit Agent, JetBrains Junie, OpenCode.
- English and Persian copy. Persian heading/body use the embedded Titr/Koodak stack while tool names remain LTR isolates.
- Hover/focus pauses the marquee. `prefers-reduced-motion` disables the animation and exposes a horizontally scrollable static row.
- Trademark/affiliation disclaimer added to avoid implying vendor endorsement.

## Responsive constraints
- No fixed page width.
- Marquee track is intentionally wider than viewport but clipped by its own mask; it must not create document-level horizontal overflow.
- Mobile chip sizing reduces below 760px and again below 380px.
- Large-screen heading measure increases above 1800px without overextending body copy.
- RTL copy remains RTL while Latin product names/logos are isolated LTR.

## Asset notes
- The third-party marks are bundled locally under `assets/agent-logos/` for deterministic rendering. Simple Icons source marks are preserved without geometric modification where available.
- OpenAI Codex uses the compact Codex mark embedded in the official `openai/codex` repository login assets.
- Marks are identification only and do not imply partnership, endorsement, or affiliation.
