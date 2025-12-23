# Choreograph

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![Bun](https://img.shields.io/badge/Bun-latest-black.svg)](https://bun.sh/)

Asymmetric household labor simulation. Invisible work, visible stress, impossible balance.

Built with TypeScript, PlayCanvas, and Vite using a strict layered architecture.

## Overview

Choreograph simulates emotional labor dynamics through a round-based game where two colored spheres (Blue and Red) manage work and household tasks. Blue handles invisible employment work with scope creep and context-switching penalties. Red manages visible household tasks with asymmetric stress mechanics. The game features rapport tracking, employment events, and configuration-driven scenarios that reveal the systemic impossibility of "having it all."

## Tech Stack

- **TypeScript** (^5.3.0) - Strict mode enabled
- **PlayCanvas** (^2.4.0) - WebGL 2.0 rendering engine
- **Vite** (^6.0.0) - Build tool with HMR (<2s reload)
- **Zod** (^3.22.0) - Runtime schema validation
- **Vitest** (^2.0.0) - Unit testing framework
- **ESLint + Prettier** - Code quality and formatting
- **Bun** - Package manager

## Architecture

The project follows a strict 4-layer architecture:

```
CONFIG → DATA → SYSTEMS → PRESENTATION
```

**Dependency Rules:**
- Config Layer: No dependencies (bottom layer)
- Data Layer: Depends on Config
- Systems Layer: Depends on Data and Config
- Presentation Layer: Depends on Systems, Data, and Config (top layer)

**No circular dependencies allowed. Systems cannot import from Presentation.**

## Project Structure

```
choreograph/
├── src/
│   ├── config/              # CONFIG LAYER
│   │   ├── schema.ts        # Zod validation schemas
│   │   ├── loader.ts        # Config loading
│   │   ├── defaults.ts      # Default values
│   │   └── types.ts         # Config type exports
│   ├── data/                # DATA LAYER
│   │   ├── entities/        # Entity type definitions
│   │   ├── events/          # EventBus (pub/sub)
│   │   └── state/           # Game state
│   ├── systems/             # SYSTEMS LAYER
│   │   ├── core/            # Core systems (RoundManager, StateMachine)
│   │   ├── gameplay/        # Gameplay systems (Tasks, Stress, Rapport)
│   │   ├── interaction/     # Interaction systems (Empathy, ContextSwitch)
│   │   └── ai/              # AI controller
│   ├── presentation/        # PRESENTATION LAYER
│   │   ├── renderer/        # PlayCanvas rendering
│   │   ├── ui/              # DOM UI overlay
│   │   └── audio/           # Web Audio API
│   └── main.ts              # Entry point
├── scenarios/               # JSON scenario configs
│   └── baseline.json        # Default scenario
├── tests/
│   ├── unit/                # Unit tests
│   └── integration/         # Integration tests
├── public/
│   └── assets/              # Static assets (audio, textures)
├── docs/                    # Documentation
│   ├── prd-domesticsimulation-2025-12-22.md
│   └── architecture-domesticsimulation-2025-12-22.md
├── tsconfig.json            # TypeScript config (strict mode)
├── vite.config.js           # Vite config (HMR, path aliases)
├── eslint.config.js         # ESLint config (layered architecture rules)
├── .prettierrc              # Prettier config
└── vitest.config.ts         # Vitest config
```

## Getting Started

### Prerequisites

- Bun installed (recommended) or Node.js 18+

### Installation

```bash
bun install
```

### Development

Start the dev server with hot reload:

```bash
bun run dev
```

The application will be available at `http://localhost:3000`

### Available Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start Vite dev server with HMR |
| `bun run build` | Type check and build for production |
| `bun run preview` | Preview production build locally |
| `bun run test` | Run unit tests with Vitest |
| `bun run test:ui` | Run tests with UI |
| `bun run test:coverage` | Generate test coverage report |
| `bun run lint` | Check code with ESLint |
| `bun run lint:fix` | Fix ESLint errors automatically |
| `bun run format` | Format code with Prettier |
| `bun run format:check` | Check code formatting |
| `bun run typecheck` | Type check without building |

### Path Aliases

The project uses TypeScript path aliases for clean imports:

```typescript
import { ScenarioConfig } from '@/config';
import { EventBus } from '@/data/events';
import { RoundManager } from '@/systems/core';
import { SceneRenderer } from '@/presentation/renderer';
```

## Configuration

All game parameters are defined in JSON scenario files (`scenarios/*.json`). The configuration is validated at runtime using Zod schemas and frozen to ensure immutability.

Example scenario:
```json
{
  "id": "baseline",
  "name": "Baseline",
  "description": "Standard household dynamic with one employed partner",
  "difficulty": 2
}
```

## Testing

Run unit tests:
```bash
bun run test
```

The project uses Vitest with path alias support. Tests are isolated from PlayCanvas dependencies for fast execution.

## Code Quality

- **TypeScript Strict Mode**: All strict checks enabled
- **ESLint**: Enforces layered architecture rules
- **Prettier**: Consistent code formatting
- **No `any` types**: Explicit typing required
- **Layer Isolation**: Systems cannot import from Presentation

## Performance Targets

- 60 FPS on Intel HD 620 integrated graphics
- <2 second hot reload during development
- <16.67ms frame time budget
- <50 draw calls per frame

## Documentation

- [PRD](docs/prd-choreograph-2025-12-22.md) - Product Requirements
- [Architecture](docs/architecture-choreograph-2025-12-22.md) - Technical Architecture

## References

- [PlayCanvas Engine API](https://api.playcanvas.com/engine/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Vite Documentation](https://vitejs.dev/)
- [Zod Documentation](https://zod.dev/)
- [Vitest Documentation](https://vitest.dev/)
