# Landing page redesign and contrast fixes

**Date:** 2026-11-26 23:29

## What was wrong with the original landing page

It looked like a generic AI-made template, with almost nothing specific to Dispatch:

- **Stock decorations:**
  - a pulsing "badge" pill
  - gradient text on "speed of thought"
  - a frosted-glass card floating on blurry colour blobs
  - little floating chips ("✓ Right where you left off", "✦ Only the good stuff")
  - a fake stack of avatar circles
  - three identical icon cards with small all-caps labels above the headings
- **Copy that was all mood and no facts:** "a calmer place", "in good company". It never said what Dispatch does.
- **A misleading mock:** it showed "Saturday crew · 4 friends", which is a group chat, and Dispatch doesn't have group chats.
- **Light mode only:** the colours were hardcoded, so dark mode didn't work.
- **The real selling points were missing:** friends-only messaging, live online status, read receipts and shared conversation themes.

## What changed, step by step

1. **`init`:** a three-question interview produced [`PRODUCT.md`](../PRODUCT.md), a short brief on who Dispatch is for and what's true about it. Later steps used it to avoid inventing claims.
2. **`shape`:** the page was planned before any code was written, covering the copy, what the hero shows, and the GitHub link.
3. **Build** ([`frontend/app/page.tsx`](../frontend/app/page.tsx)):
   - **Hero:** the hero now plays a real conversation with Maya. She comes online, messages arrive, "Seen" appears, and the theme changes to Rose.
   - **Features:** the mood cards became the four real features, each shown with a small piece of real-looking UI.
   - **Light and dark:** both work.
   - **Review:** a separate reviewer caught that the first version drew things the app doesn't actually look like, so they were matched to the real components.
4. **First `audit`, 18/20** ([report](../frontend/.impeccable/audit/2026-11-26T14-33-27Z__app-page-tsx.md)): found two contrast failures, an animation that finished before phone users scrolled to it, and two small footer issues.
5. **`colorize`:**
   - **What it found:** the bubble problem was bigger than the audit suggested. In the real app, 12 of the 18 conversation themes had hard-to-read text in dark mode, and 3 did in light mode.
   - **The fix:** it was fixed at the source in [`frontend/lib/themes.ts`](../frontend/lib/themes.ts), so every conversation benefits, not just the landing page.
   - **Also fixed:** the theme dialog's label and the green "Active now" text.
6. **`animate`:**
   - **What it does:** on phones the conversation now waits until it's on screen before playing.
   - **First version:** the motion reviewer caught two flaws. It could visibly reset on slow phones, and it could get stuck on short screens.
   - **The fix:** a simpler version that runs before the page first draws.
7. **`polish`:** fixed the two small footer issues. A keyboard check also found focus outlines you couldn't see, because indigo rings sat on indigo buttons.
8. **Second `audit`, 19/20** ([report](../frontend/.impeccable/audit/2026-11-26T15-14-42Z__app-page-tsx.md)): no contrast failures in either theme at any screen size tested.

## Still open

- **Login and signup pages:** still light-only.
- **Shared button focus ring:** the faint ring on [`frontend/components/ui/button.tsx`](../frontend/components/ui/button.tsx) affects every screen except the landing page; it's a one-line fix.
- **Conversation screens:** they were never opened during this work. Check a conversation and the theme dialog in dark mode.
