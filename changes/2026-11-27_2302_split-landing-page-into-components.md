# Split landing page into components

**Date:** 2026-11-27 23:02
**Follows:** [2026-11-26_2329_landing-page-redesign.md](2026-11-26_2329_landing-page-redesign.md)
**Covers:** Landing page file split

## Landing page file split

**Starting point:** [page.tsx](../frontend/app/page.tsx) was 415 lines. Besides the page itself, it held helper components, the scene's CSS and inline script, and the data for the feature list. The user asked for these to be moved into a `/utils` folder.

**What changed:**

1. Planned it in plan mode. Decision: most of what was in the file was React components, not utilities. The repo keeps components in `frontend/components/<feature>/` and helpers in `frontend/lib/`, and has no `utils/` folder. So the code went into a new `components/landing/` folder instead. The user approved this plan.
2. Moved the code as-is into three files:
   - [initial.tsx](../frontend/components/landing/initial.tsx) holds the `Initial` avatar, which both of the other files use.
   - [conversationScene.tsx](../frontend/components/landing/conversationScene.tsx) holds the hero conversation, with its CSS and the inline script that pauses the animation until you scroll to it. The script still renders after the `.dl-scene` wrapper, as it must.
   - [facts.tsx](../frontend/components/landing/facts.tsx) holds the `facts` data and the list that shows it (`FactsList`).
3. Cut [page.tsx](../frontend/app/page.tsx) down to 111 lines. It now has only the header, hero text, sections and footer.
4. Ran `npx tsc --noEmit` and `eslint` on the changed files. Neither reported any errors.

**Still open:**

- The page was not opened in a browser. Nobody has checked yet that the animation, the hold-until-scrolled behaviour and dark mode still look the same.
- The `defaultTheme` and `roseTheme` lookups are now copied in both [conversationScene.tsx](../frontend/components/landing/conversationScene.tsx) and [facts.tsx](../frontend/components/landing/facts.tsx). This was a deliberate choice, since each is one line.
- Not committed.
