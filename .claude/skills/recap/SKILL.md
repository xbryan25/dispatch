---
name: recap
description: Write a dated change note in changes/ summarising what happened in this session since the last recap. Only when the user types /recap.
user-invocable: true
disable-model-invocation: true
argument-hint: "[optional title]"
---

Write a change note that records what happened in this session, so the user doesn't have to reconstruct it later. The reader is the user, and anyone reading the repo later, who wasn't watching the session: say what was wrong or asked for, what was done about it, and what is still open.

## 1. Decide where this recap starts

The user may run `/recap` several times in one long session. Never repeat what an earlier note already covers.

- If `/recap` already ran earlier in this conversation, cover only the work after that run.
- Also list `changes/` and read the newest note. Its `**Covers:**` line names the topics it recorded; older notes without that line are judged by their `##` headings. Leave out anything that note already describes, even if your memory of the session is thin (long sessions get summarised).
- If nothing has happened since then, tell the user in one line and stop. Write no file.

## 2. Split the work into topics

Group what happened by the thing it changed: a feature, a screen, or a shared system such as a colour palette or a component. Unrelated work gets separate `##` sections; never blend two topics into one story. When one piece of work touched two topics, put it under the topic it was for and add a one-line pointer from the other.

Questions, plans and discussion that changed nothing belong only if they led to a decision the reader needs (for example, a scope choice the user made).

## 3. Write each topic in three parts

- **Starting point:** what was wrong or what was asked for, concretely (the actual problem, not "improvements were needed").
- **What changed:** numbered steps in the order they happened. Name the command or skill used at each step (e.g. Impeccable `audit`, `colorize`), and say what each step found or fixed. Include corrections: if a reviewer or a check caught a mistake, say what it was and how it was fixed.
- **Still open:** what was skipped, deferred, or not verified. Be plain about anything that was never checked.

Only record what actually happened in this session. No invented results, scores or claims. If a result wasn't checked, say so.

## 4. Link, don't copy

- Link every file you mention, relative to `changes/` (e.g. `[page.tsx](../frontend/app/page.tsx)`).
- When a tool already saved its own report (e.g. Impeccable audits in `frontend/.impeccable/audit/`), link to it and give the one-line result instead of pasting its contents.
- Before finishing, check that every link resolves.

## 5. Write the file

1. Get the local time: `date '+%Y-%m-%d_%H%M'` (filename) and `date '+%Y-%m-%d %H:%M'` (header).
2. Title: the argument if the user gave one; otherwise the main topic, or the two main topics joined with "and".
3. Path: `changes/<YYYY-MM-DD_HHMM>_<kebab-case-title>.md` at the repo root. Create `changes/` if it doesn't exist. Never overwrite an existing note.
4. Start the file with:

```markdown
# <Title>

**Date:** YYYY-MM-DD HH:MM
**Follows:** [<previous note filename>](<previous note filename>)
**Covers:** <topic 1>, <topic 2>
```

Leave out `**Follows:**` when there is no earlier note. The `**Covers:**` topic names must match the `##` headings, because the next `/recap` reads them.

5. Then one `##` section per topic, as in step 3.

## 6. Finish

Reply with a link to the new note and a two- or three-line summary of what it covers. Do not commit; the user decides when to commit it.
