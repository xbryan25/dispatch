# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two audiences, weighted equally:

- **Real users:** people who message their friends one-to-one, day to day, from a desktop or mobile browser.
- **Evaluators:** recruiters, reviewers and peers who sign up, click through the app and judge its engineering and craft. Dispatch is a flagship portfolio piece and also a working product.

## Product Purpose

Dispatch is a real-time, one-to-one messaging app for keeping up with friends. People add friends, start conversations, and see messages, presence, read receipts and theme changes as they happen. Success means two things: real users can depend on it day to day, and evaluators come away convinced by how complete and polished it is.

## Positioning

Dispatch is a general-purpose friend messenger. It has no mechanism a neighbouring product couldn't copy. Its difference lies entirely in execution: reliability, real-time behaviour that feels right, and craft in the details. Future work should not invent a concept-level claim it can't back up.

## Operating Context

- Users sign up with an email address and confirm it, then sign in (Supabase Auth).
- Conversations are friends-only. You can only message someone after a friendship exists. If a friendship ends, the conversation becomes read-only.
- Live events (new messages, friendship changes, notifications, read receipts, presence, theme updates) come in over an authenticated WebSocket.
- Main surfaces: `/messages` (and `/messages/[conversationId]`), `/friends`, `/notifications`, plus the auth flows (`/login`, `/register`, `/email-confirmed`, `/resend-confirmation-email`).
- Deployed at https://dispatch.xbryan25.dev (frontend on Vercel, API and Redis on a DigitalOcean Droplet).

## Capabilities and Constraints

- **Shipped:** 1:1 real-time messaging with history, friend requests (send, accept, decline, reconnect, unfriend), live friendship state, online presence, read receipts, notifications (read/unread, bulk delete), profile editing with an image upload, per-conversation themes that sync to the other participant, and conversation search.
- **Planned, not built:** notification sounds, message attachments, group chats. Some settings are marked "coming soon" in the UI.
- **Stack (existing):** Next.js 16 App Router, React 19, Tailwind v4, shadcn-style Radix components, Zustand, plus a FastAPI backend, Supabase (Postgres, Auth, Storage) and Redis.
- **Terminology:** "friends", "friend requests", "conversations", "messages", "notifications", "conversation theme".

## Brand Commitments

- Name: **Dispatch**.
- Light and dark mode must both stay supported.

## Evidence on Hand

- The live deployment and the feature list in `README.md`.
- No users, usage numbers, testimonials or press exist. Don't fabricate any.

## Product Principles

1. **Execution is the differentiator.** With no novel concept, quality of behaviour and detail is the whole case, for users and evaluators alike.
2. **Live state must be trustworthy.** Presence, receipts, friendship and theme changes should show up instantly and never contradict the server.
3. **Feature-complete over feature-wide.** Finish and polish what's shipped before adding more. Label unbuilt things honestly ("coming soon"), never fake them.
4. **Friends-only by design.** Messaging follows from friendship, and the UI should make that relationship and its current state obvious.
