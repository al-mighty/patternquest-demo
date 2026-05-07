# PatternQuest — LogicLike Demo

Cross-platform logic game: find the next shape in a sequence.
Demonstrates performance optimization for weak devices, real-time leaderboard, and clean monorepo architecture.

## Architecture

```
┌─────────────────────┐       ┌───────────────────┐
│   Expo Mobile App   │       │   NestJS Backend   │
│                     │──REST──│                    │
│  React Native       │       │  Game Logic        │
│  Reanimated (UI)    │──WS───│  WebSocket Gateway │
│  FlashList          │       │  In-Memory Store   │
│  Haptics            │       │                    │
└─────────────────────┘       └───────────────────┘
         │                              │
         └──── @logiclike/shared ───────┘
              (Zod types + validation)
```

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start backend
npm run backend
# → http://localhost:3000

# 3. Start mobile (in another terminal)
npm run mobile
# → Scan QR with Expo Go
```

## Performance Highlights

| Optimization | Where | Impact |
|---|---|---|
| `React.memo` + custom comparator | `ShapeItem.tsx` | Shapes re-render only when props change |
| `react-native-reanimated` worklets | All animations | 60fps on UI thread, JS thread free |
| `@shopify/flash-list` | `LeaderboardScreen` | Virtualized list, constant memory |
| `requestAnimationFrame` FPS counter | `PerformanceOverlay` | Dev-mode perf monitoring |
| `expo-haptics` | `OptionsList` | Tactile feedback without blocking |
| Zod shared validation | `@logiclike/shared` | Single source of truth, no type drift |

## Tech Decisions

| Choice | Why |
|---|---|
| npm workspaces | Zero-config monorepo, no Turborepo overhead for a demo |
| Zod (not class-validator) | Shared between RN and NestJS, runtime + compile-time |
| In-memory store | Instant setup, no DB deps. Production → PostgreSQL + Prisma |
| Reanimated v3 (not Animated) | UI-thread animations = 60fps on weak devices |
| FlashList (not FlatList) | Built for low-end device perf by Shopify |
| fetch (not axios) | Zero deps for 3 endpoints |
| Socket.IO | Auto-reconnect, rooms, NestJS gateway integration |

## Project Structure

```
logiclike-demo/
├── packages/
│   ├── shared/          # Zod types, validation, constants
│   ├── backend/         # NestJS: REST API + WebSocket
│   │   └── src/game/    # Controller, Service, Gateway
│   └── mobile/          # Expo React Native
│       └── src/
│           ├── screens/     # Home, Game, Leaderboard
│           ├── components/  # ShapeItem, PuzzleBoard, OptionsList, ProgressBar
│           ├── hooks/       # useGameEngine, useRenderTracker
│           └── services/    # REST client, WebSocket client
├── docker-compose.yml
└── README.md
```

## What I'd Add in Production

- PostgreSQL + Prisma for persistent storage
- Auth (JWT / OAuth)
- CI/CD pipeline (GitHub Actions)
- E2E tests (Detox) + unit tests (Jest)
- i18n (LogicLike's international audience)
- Analytics (Amplitude / Mixpanel)
- Push notifications for daily challenges
- Difficulty calibration based on user performance history