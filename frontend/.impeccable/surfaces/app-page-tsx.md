---
version: 1
slug: "app-page-tsx"
primary_target: "app/page.tsx"
related_targets: []
---

# Landing page (`/`)

Mode: Persuade. Audience: general visitors, often arriving from a friend's link or the portfolio. Action: Get started → /register. Proof: the product shown working; no invented users, counts, or testimonials. Constraints: one file (page.tsx), no new libraries, light + dark, header inlined in page.tsx (GuestHeader stays untouched because auth pages are light-only). Only shipped features: no groups, attachments, sounds, encryption claims.

## Direction contract

THESIS: The page shows a real 1:1 Dispatch conversation happening instead of describing a feeling. It refuses the SaaS hero: no badge, no gradient headline, no glass, no floating chips, no icon-tile cards.

OWN-WORLD: Theme-token neutrals (background, foreground, muted, border) with indigo as the only brand accent: the wordmark dot, the primary action and the online/live marks. The chat reuses the app's real bubble language: rounded-2xl with a tucked tail corner, theme colours taken from lib/themes.ts, and a tiny avatar for "Seen". Geist throughout.

STORY: Dispatch is a messenger for people you've actually added as friends. You can see who's online, know when a message was read, and pick a conversation colour you both see. Sign up.

FIRST VIEWPORT: Inline header (wordmark left, Login right). On the left, a large plain headline, a one-sentence factual subhead and the Get started button. On the right, at real app scale, a framed conversation with Maya (presence dot in the header, three messages, Seen, theme swap). On mobile the conversation stacks below and the action stays above the fold.

FORM: refinement of the incumbent split hero plus a fact strip, where each fact sits beside a small real UI detail rendered in code. seed: none (pinned): "mostly improve what's already established, and make it not look like ai slop". The signature interaction is one CSS-only scene that plays once: the friend comes online, their message arrives, the reply sends, "Seen" appears, and the theme changes from Default to Rose. Motion grammar: short exponential ease-out reveals. Reduced motion shows the final state.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
