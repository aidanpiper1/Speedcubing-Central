# Speedcubing Central

A full-stack speedcubing platform: timer, algorithm trainer, WCA rankings & competition
tools, real-time Battle Mode, 3D reconstruction viewer, BLD trainer, and more.

## Stack

| Layer      | Technology                                                        |
| ---------- | ----------------------------------------------------------------- |
| Frontend   | React 18 + TypeScript + Vite                                      |
| Styling    | Tailwind CSS (dark mode default, `#0f1117` / `#1e2130` / `#7c5cfc`) |
| State       | Zustand (auth, settings, toasts) + TanStack Query (server state) |
| Backend    | Node.js + Express + TypeScript (ESM / NodeNext)                   |
| Database   | PostgreSQL via Prisma ORM                                         |
| Realtime   | Socket.io (Battle Mode)                                           |
| Auth       | WCA OAuth 2.0 + JWT email/password fallback (httpOnly cookies)    |
| Scrambles  | `cubing.js` random-state (TNoodle-quality), `scrambow` fallback   |
| 3D cube    | `cubing.js` (`<twisty-player>`) for reconstruction & alg diagrams |
| Puzzle icons | `@cubing/icons` CSS icon library (`<span className="cubing-icon event-333">`) |
| Charts     | `recharts` (improvement graphs)                                   |

This is an **npm workspaces monorepo** with three packages: `shared`, `server`, `client`.

## Directory structure

```
.
├── client/                 # React + Vite SPA
│   └── src/
│       ├── components/      # Layout, nav, toasts, CubeDiagram, shared UI
│       ├── data/           # Hardcoded alg sets (OLL/PLL/F2L/COLL/ZBLL + 2×2 OrtegaOLL/PBL/CLL/EG-1/EG-2), Speffz lettering
│       ├── features/       # One folder per feature (see Routes below)
│       ├── lib/            # axios api client, scramble helper
│       ├── store/          # Zustand stores: auth, settings, toast
│       ├── App.tsx          # Router + route guards
│       └── main.tsx
├── server/                 # Express API + Socket.io
│   └── src/
│       ├── auth/           # jwt helpers, requireAuth/requireAdmin/optionalAuth
│       ├── routes/         # auth, sessions, solves, daily, wca, profile, admin, battle, bld, alg
│       ├── util/dto.ts     # Prisma model -> DTO mappers
│       ├── cache.ts        # Redis-or-in-memory cache for the WCA proxy
│       ├── scramble.ts     # scrambow wrappers (incl. deterministic daily scrambles)
│       ├── socket.ts       # Battle Mode realtime server
│       ├── app.ts          # Express app (helmet, cors, rate-limit, error handler)
│       └── index.ts        # HTTP server + Socket.io bootstrap
├── shared/                 # Types + averaging logic shared by client & server
│   └── src/
│       ├── index.ts        # DTOs, WCA event list, socket event types, time formatting
│       └── averaging.ts    # WCA trimmed average + mean (drop best/worst, DNF rules)
├── prisma/schema.prisma    # Database schema
├── docker-compose.yml      # Local Postgres convenience
└── .env.example
```

## Getting started

```bash
# 1. Install (also builds shared/ and generates the Prisma client)
npm install

# 2. Start Postgres — pick ONE:
npm run db:up                # (a) Docker: docker compose up -d
# --- or, if you don't have Docker (e.g. Windows) ---
npm run db:embedded:init     # (b) one-time: download + init an embedded Postgres
npm run db:embedded          #     then run this in its own terminal to keep it up

# 3. Configure environment
cp .env.example .env         # then fill in WCA_CLIENT_ID / SECRET for OAuth (optional)

# 4. Create the schema + seed demo data
npm run db:setup             # prisma db push + seed
#   (or: npm run prisma:migrate  to create versioned migrations)

# 5. Run both server (:3001) and client (:5173)
npm run dev
```

Open http://localhost:5173. The Vite dev server proxies `/api` and `/socket.io` to the
backend, so no CORS setup is needed in development.

### Seeded accounts

| Role  | Email                        | Password    |
| ----- | ---------------------------- | ----------- |
| Admin | `admin@speedcubing.central`  | `admin1234` |
| User  | `demo@speedcubing.central`   | `demo1234`  |

## Key commands

| Command                  | Description                                       |
| ------------------------ | ------------------------------------------------- |
| `npm run dev`            | Run server + client concurrently                  |
| `npm run dev:server`     | Server only (tsx watch)                           |
| `npm run dev:client`     | Client only (vite)                                |
| `npm run build`          | Build shared, server, then client                 |
| `npm run typecheck`      | `tsc --noEmit` across all three packages          |
| `npm run db:up`          | Start the Postgres container                      |
| `npm run db:setup`       | `prisma db push` + seed                            |
| `npm run prisma:migrate` | Create/apply a versioned migration                |
| `npm run prisma:studio`  | Open Prisma Studio                                |
| `npm run prisma:seed`    | Seed demo data                                    |

## Routes (client)

| Path                | Feature                                                          |
| ------------------- | ---------------------------------------------------------------- |
| `/`                 | Landing (logged out) / Dashboard (logged in)                    |
| `/timer`            | Timer — spacebar/touch, inspection, live Ao5/12/50/100, sessions |
| `/calculator`       | Average / mean calculator (Ao5…Ao100, Mo3, MoX)                  |
| `/alg-trainer`      | Algorithm Library — puzzle picker (3×3 + 2×2), browse, drill, recognition; 3×3: OLL/PLL/F2L/COLL/ZBLL; 2×2: OrtegaOLL/PBL/CLL/EG-1/EG-2 |
| `/rankings`         | WCA rankings + competitor lookup (proxied)                       |
| `/competitions`     | Upcoming comps + cutoff predictor                                |
| `/battle`, `/battle/:roomId` | Real-time head-to-head Battle Mode (Socket.io)          |
| `/reconstruction`   | 3D scramble+solution playback (cubing.js)                        |
| `/bld`              | BLD trainer (Speffz, letter pairs, memo, drill)                  |
| `/resources`        | Method guides + community links                                  |
| `/profile`, `/profile/:wcaId` | Stats dashboard, goals, improvement graph, comparison  |
| `/login`            | WCA OAuth + email/password                                       |
| `/admin`            | Admin panel (daily scrambles, stats) — ADMIN role only           |

## Conventions & notes

- **Module system:** server & shared are ESM (`"type": "module"`, NodeNext). Relative
  imports in the server use explicit `.js` extensions. `scrambow` is CommonJS and is
  imported via a default-interop shim in `server/src/scramble.ts`.
- **Auth:** access (15 min) + refresh (7 day) JWTs in httpOnly cookies. The axios client
  (`client/src/lib/api.ts`) auto-refreshes on a 401 and replays the request once.
- **Roles:** `GUEST` (not logged in — timer/calculator/trainers work; solves saved to
  `localStorage` only), `USER` (full access, server-persisted), `ADMIN` (manages daily
  scrambles & content).
- **Averaging** lives in `shared/averaging.ts` so the client and server compute identical
  Ao5/mean values (trim best + worst; >1 DNF in the trimmed set ⇒ DNF).
- **WCA API** is *only* called server-side, through `cache.ts` (1-hour TTL; Redis when
  `REDIS_URL` is set, otherwise in-memory node-cache). The client never calls WCA directly.
  Note: the WCA public API does not expose a top-100 rankings list, so the Rankings page
  shows live results via the competitor lookup and gracefully indicates when the bulk
  rankings feed is unavailable.
- **Scrambles** use cubing.js `randomScrambleForEvent` (random-state, the same family as
  TNoodle) with a synchronous `scrambow` fallback. The timer prefetches the next scramble
  during a solve (`useScrambler`) to hide 4x4+ generation latency.
- **Daily scrambles** are fixed per `(date, event)` by persistence: the first request that
  day generates and stores the scramble, and everyone else reads the stored one.
- **Alg data** is hardcoded in `client/src/data/` (full OLL 57, PLL 21, F2L 41, COLL 40,
  ZBLL subset; 2×2: OrtegaOLL 7, PBL 6, CLL 42, EG-1 42, EG-2 42). Spaced repetition uses
  SM-2, persisted per user at `/api/alg/review`.
- **Alg diagrams** use `cubing.js` `<twisty-player>` with `experimentalSetupAlg = 'x2 ' + invertAlg(moves)`
  to display the unsolved case from above. `puzzle` prop supports `'3x3x3'` and `'2x2x2'`.
  `AlgCase.diagramPrefix` can prepend extra moves to the setup alg for orientation corrections
  (e.g. EG-1 AS 1 uses `diagramPrefix: 'x2'`). F2L cases have `slotAlts` (per-slot orientation
  tabs: Front Right / Front Left / Back Left / Back Right). All diagram components live in
  `client/src/components/CubeDiagram.tsx`.
- **Puzzle icons** use `@cubing/icons` (`import '@cubing/icons'`), rendered as
  `<span className="cubing-icon event-222" />`. The Algorithm Library landing shows 3×3 and
  2×2 as available; Square-1, Megaminx, Pyraminx, Skewb are marked "Coming Soon".
- **Security:** helmet, per-IP rate limiting on `/api`, CORS locked to `FRONTEND_URL`, and a
  central error handler that never leaks stack traces to clients.

## Environment variables

See `.env.example`. `WCA_CLIENT_ID` / `WCA_CLIENT_SECRET` are only needed for WCA OAuth —
email/password auth and all client-side tools work without them. `REDIS_URL` is optional.
