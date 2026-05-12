# PatternQuest

Cross-platform logic puzzle game: find the next shape in a sequence. Features procedural puzzle generation, adaptive difficulty, real-time leaderboard, and performance-optimized animations for low-end devices.

**Live (web):** [cheslav.space/game](https://cheslav.space/game/)
**API:** [cheslav.space/api/patternquest](https://cheslav.space/api/patternquest/)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Shared | TypeScript, Zod schemas, procedural puzzle generator |
| Backend | NestJS, WebSocket (Socket.IO), in-memory store |
| Mobile | Expo (React Native), Reanimated v3, FlashList, Haptics |
| Monorepo | npm workspaces |

## Features

- Procedural puzzle generation with configurable difficulty
- SVG shape rendering (circles, triangles, squares, stars)
- Sound effects and haptic feedback
- Adaptive difficulty that scales with player performance
- 3 lives system
- Offline mode with local puzzle generation
- Real-time leaderboard via WebSocket
- EN/RU localization

## Getting Started

```bash
npm install

# Start backend
npm run backend        # http://localhost:3000

# Start mobile (in another terminal)
npm run mobile         # Scan QR with Expo Go
```

### Run Tests

```bash
npm test               # Shared package unit tests
```

## Architecture

```
┌──────────────────┐       ┌──────────────────┐
│  Expo Mobile App │       │  NestJS Backend   │
│                  │─REST──│                   │
│  React Native    │       │  Game Logic       │
│  Reanimated (UI) │──WS───│  WebSocket GW     │
│  FlashList       │       │  In-Memory Store  │
└──────────────────┘       └──────────────────┘
         │                          │
         └─── @logiclike/shared ────┘
              (Zod types + puzzle generator)
```

## Project Structure

```
logiclike-demo/
├── packages/
│   ├── shared/              # Shared types, validation, puzzle generator
│   │   └── src/
│   │       ├── types.ts     # Zod schemas & TypeScript types
│   │       └── puzzleGenerator.ts
│   ├── backend/             # NestJS API + WebSocket server
│   │   └── src/
│   │       ├── game/        # Controller, service, WS gateway
│   │       └── common/      # Guards, filters, interceptors
│   └── mobile/              # Expo React Native app
│       └── src/
│           ├── screens/     # Home, Game, Leaderboard
│           ├── components/  # ShapeItem, PuzzleBoard, OptionsList
│           ├── hooks/       # useGameEngine, useRenderTracker
│           ├── services/    # REST & WebSocket clients
│           ├── i18n.ts      # Localization strings
│           └── navigation/  # React Navigation config
├── docker-compose.yml
└── package.json
```

## Performance Optimizations

| Technique | Impact |
|-----------|--------|
| `React.memo` + custom comparator | Shapes re-render only on prop changes |
| Reanimated v3 worklets | 60fps animations on UI thread |
| `@shopify/flash-list` | Virtualized leaderboard, constant memory |
| `requestAnimationFrame` FPS counter | Dev-mode performance monitoring |

## Author

Vyacheslav Kovalev — [GitHub](https://github.com/al-mighty) · [cheslav.space](https://cheslav.space)