# Dispatch 💬

Dispatch is a full-stack, real-time messaging application for keeping up with friends. Users can manage friend requests, start one-to-one conversations, see when a friend comes online, and receive live updates when a friendship changes.

The project is organized as a monorepo with a Next.js frontend and a FastAPI backend. Supabase provides authentication, PostgreSQL, and object storage; Redis supports live event delivery, online presence, and rate limiting.

## 🌟 Key Features

- **Real-time direct messaging:** Send and receive messages in active conversations over a WebSocket connection, with conversation history loaded from the backend.
- **Friend management:** Find people, send and respond to friend requests, reconnect with former friends, and unfriend users.
- **Live friendship state:** Friendship changes are published to connected users, so conversation access and friend status stay current without a manual refresh.
- **Online presence:** See whether a conversation partner is online and receive updates when their presence changes.
- **Read receipts:** Conversation participants receive live updates when messages are read.
- **Notifications:** View friend-related notifications, manage their read state, and keep track of unread notifications.
- **Profile customization:** Update profile details and upload a profile image to Supabase Storage.
- **Conversation themes:** Choose a conversation theme and have the change reflected for the other participant in real time.
- **Authentication:** Register, confirm an email address, sign in, and manage the authenticated session with Supabase Auth.

## 🛠️ Tech Stack

This repository is a **monorepo** containing the frontend, backend, and a Docker Compose definition for the backend and Redis services.

### Frontend (`frontend/`)

- **Framework:** Next.js 16 with the App Router, React 19, and TypeScript
- **Styling and UI:** Tailwind CSS v4, shadcn-style components built with Radix UI, `class-variance-authority`, and `tw-animate-css`
- **Icons:** `@iconify/react` and `lucide-react`
- **Client state:** Zustand
- **Authentication and storage:** Supabase JS and Supabase SSR
- **Theme and notifications:** `next-themes` and Sonner
- **Data display and utilities:** TanStack Table and `date-fns`

### Backend (`backend/`)

- **Runtime and API:** Python 3.12+, FastAPI, and Pydantic
- **Database:** Supabase-hosted PostgreSQL accessed asynchronously with SQLAlchemy and `asyncpg`
- **Authentication:** Supabase-issued tokens validated by the API
- **Real-time services and rate limiting:** Redis, Redis Pub/Sub, and SlowAPI
- **Object storage:** Supabase Storage accessed through its S3-compatible API
- **Dependency management:** Poetry
- **Linting and formatting:** Ruff and Black
- **Backend test tooling:** pytest and pytest-asyncio

### Infrastructure

- **Frontend hosting:** Vercel
- **Backend and Redis hosting:** DigitalOcean Droplet, with FastAPI and Redis running as Docker containers
- **Database and authentication:** Supabase free tier
- **Object storage:** Supabase Storage
- **Container orchestration:** Docker Compose; `docker-compose.yml` defines the FastAPI and Redis containers

## 🚀 Quick Start

Use the deployed application: [https://dispatch.xbryan25.dev](#deployed-website).

## 📐 Architecture & Technical Decisions

### Application structure

The frontend and backend live in separate top-level folders so each can use its own runtime, dependencies, and deployment process. The frontend owns the user interface and client-side state. The backend owns messaging, friendship, notification, and profile API operations.

The FastAPI backend groups code by feature. Each feature has its own router and separates request handling from service and query code. This keeps changes to areas such as friends or messages close together while shared concerns—database sessions, Redis, storage, and rate limiting—live under `backend/src/core/`.

### Request and real-time flows

1. The Next.js client uses Supabase Auth to manage the signed-in session.
2. The frontend calls FastAPI endpoints for application data and actions such as messaging and friend management.
3. For live updates, the frontend opens an authenticated WebSocket connection to FastAPI using the current Supabase access token.
4. FastAPI uses Redis presence keys and per-user Pub/Sub channels to track online users and deliver events, including new messages, friendship changes, notifications, read receipts, and conversation theme updates.
5. Zustand stores apply incoming events to the relevant client state so the interface can update without reloading the page.

### Why this approach

- **Feature-oriented backend modules** keep related routes, schemas, queries, and services together as the application grows.
- **REST for request-response work and WebSockets for live events** give each interaction a clear path: API calls for fetching and changing records, and a persistent connection for updates that should appear immediately.
- **Redis for ephemeral state and event distribution** avoids using PostgreSQL as an online-presence store and gives connected backend processes a shared channel for user events.
- **Supabase for managed authentication and data services** keeps account sessions, PostgreSQL, and profile-image storage within one hosted platform while the API retains control of application-specific operations.
- **Zustand for client state** lets the message, friend, and notification interfaces respond to API and WebSocket updates without threading state through unrelated components.
- **Separate frontend and backend deployments** allow the Next.js app and Python API to be hosted in environments suited to their respective runtimes.

## ☁️ Deployment

The Next.js frontend is deployed on Vercel. FastAPI and Redis run as Docker containers on a DigitalOcean Droplet. Supabase provides the PostgreSQL database, authentication, and object storage on its free tier.

### Deployed Website

> **Live website:** [Dispatch](https://dispatch.xbryan25.dev)

## 🗺️ Planned Features

- **Notification sounds:** Play an optional sound when a new message or notification arrives.
- **Message attachments:** Allow users to send images and files in conversations. Profile-image uploads are already supported; message attachments are a separate planned feature.
- **Group chats:** Create conversations with multiple participants, manage membership, and exchange messages as a group.

## 📁 Repository Structure

```text
dispatch/
├── frontend/
│   ├── app/                 # Next.js routes and layouts
│   ├── components/          # UI, auth, messaging, friends, notifications
│   ├── hooks/               # Shared client hooks, including WebSocket setup
│   ├── lib/                 # API clients, Supabase clients, utilities
│   ├── store/               # Zustand state stores
│   └── types/               # Frontend TypeScript types
├── backend/
│   ├── src/
│   │   ├── auth/            # Authentication and profile routes/services
│   │   ├── core/            # Shared database, Redis, storage, and config
│   │   ├── friends/         # Friendship routes, services, and queries
│   │   ├── messages/        # Conversation and message routes/services
│   │   ├── notifications/   # Notification routes, services, and queries
│   │   └── websocket/       # Authenticated WebSocket endpoint
│   └── tests/               # Backend pytest suite
└── docker-compose.yml       # Backend and Redis services
```
