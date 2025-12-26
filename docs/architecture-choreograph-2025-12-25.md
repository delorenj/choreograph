# System Architecture: Choreograph

**Date:** 2025-12-25
**Architect:** Jarad DeLorenzo
**Version:** 1.0
**Project Type:** Web Game / Simulation
**Project Level:** Level 3 (Complex)
**Status:** Draft

---

## Document Overview

This document defines the system architecture for Choreograph, a 3D web-based simulation game that uses metaphor and gameplay to illustrate invisible labor dynamics. It provides the technical blueprint for implementation, addressing all 21 functional requirements and 5 non-functional requirements from the PRD.

**Related Documents:**
- Product Requirements Document: `/home/delorenj/code/Choreography/docs/prd-choreograph-2025-12-22.md`
- Product Brief: `/home/delorenj/code/choreograph/PRD.md`

---

## Executive Summary

Choreograph's architecture follows a **Modular Monolith with Layered Architecture** pattern, separating concerns into three distinct layers: Data (state, events), Systems (business logic), and Presentation (rendering, UI). This architecture prioritizes clean abstractions, strict typing, and configuration-driven modularity while maintaining simplicity appropriate for a client-side web game.

The system runs entirely in the browser using PlayCanvas for 3D rendering and physics, TypeScript for type-safe logic, and Zod schemas for runtime configuration validation. All game parameters are externalized in JSON configurations, enabling rapid scenario creation and balancing without code changes.

**Key Architectural Decisions:**
1. **Layered separation**: Data/Systems/Presentation with clear interfaces
2. **Configuration-driven**: All parameters in validated JSON schemas
3. **Type-safe**: TypeScript strict mode with compile-time schema validation
4. **Event-driven**: Internal event bus for system communication
5. **Client-only**: No backend, localStorage for minimal persistence

---

## Architectural Drivers

These requirements heavily influence architectural decisions:

### 1. NFR-001: Performance (60 FPS on Integrated Graphics)

**Impact:** Requires efficient rendering pipeline, optimized physics calculations, minimal garbage collection overhead.

**Architectural Response:**
- Object pooling for frequently spawned/despawned entities (tasks, particles)
- Batched rendering with PlayCanvas built-in optimizations
- Fixed timestep physics at 60Hz
- Lazy evaluation for non-critical systems (stress calculations only when needed)

---

### 2. NFR-002: Modularity (Configuration-Driven Design)

**Impact:** All game parameters must be externalized, hot-reloadable, and schema-validated.

**Architectural Response:**
- Zod schemas define all configuration structures
- **Build-time validation**: Type generation from schemas prevents `undefined` property access
- ConfigLoader system with hot-reload support in dev mode
- No hardcoded magic numbers in game logic

---

### 3. NFR-004: Maintainability (Strict Layered Architecture)

**Impact:** Clear separation of concerns required for long-term maintainability and testing.

**Architectural Response:**
- **Data Layer**: Pure data structures, no logic
- **Systems Layer**: Business logic, no rendering knowledge
- **Presentation Layer**: Rendering only, delegates logic to systems
- No circular dependencies (enforced via ESLint)
- Component interfaces documented with TypeScript interfaces

---

### 4. NFR-005: Development Velocity (Live Preview <2s)

**Impact:** Fast iteration required for game feel tuning.

**Architectural Response:**
- Vite HMR for instant preview
- Config hot-reload without full page refresh
- Modular architecture allows replacing systems independently
- Type-safe contracts prevent runtime errors during iteration

---

### 5. Quality Architecture: Schema Validation Testing

**Impact:** Prevent runtime errors from schema/usage mismatch (discovered during debugging session).

**Architectural Response:**
- **Compile-time validation**: TypeScript types generated from Zod schemas
- Build fails if code accesses non-existent config properties
- Type guard functions for runtime validation with helpful errors
- Documentation generated from schemas (single source of truth)

**Rationale:** Prevents entire class of bugs where code expects `config.financial.startingBalance` but schema doesn't define `financial` section. TypeScript + Zod integration catches these at build time.

---

## System Overview

### High-Level Architecture

Choreograph uses a **3-Layer Modular Monolith** architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                  PRESENTATION LAYER                          │
│  (PlayCanvas Scene, UI Components, Visual Feedback)         │
│                                                               │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────┐   │
│  │ UIManager   │  │ SceneRenderer│  │ AudioController │   │
│  └─────────────┘  └──────────────┘  └─────────────────┘   │
└───────────────────────────┬─────────────────────────────────┘
                            │ Observes State, Handles User Input
                            │
┌───────────────────────────┴─────────────────────────────────┐
│                     SYSTEMS LAYER                            │
│     (Business Logic, Game Rules, Event Handlers)            │
│                                                               │
│  ┌──────────────┐  ┌────────────┐  ┌──────────────────┐   │
│  │ RoundManager │  │ TaskSpawner│  │ StressCalculator │   │
│  └──────────────┘  └────────────┘  └──────────────────┘   │
│  ┌──────────────┐  ┌────────────┐  ┌──────────────────┐   │
│  │ StateMachine │  │ RapportSys │  │ EmpathySystem    │   │
│  └──────────────┘  └────────────┘  └──────────────────┘   │
└───────────────────────────┬─────────────────────────────────┘
                            │ Reads/Writes State, Emits Events
                            │
┌───────────────────────────┴─────────────────────────────────┐
│                      DATA LAYER                              │
│       (State Store, Event Bus, Data Models)                 │
│                                                               │
│  ┌──────────────┐  ┌────────────┐  ┌──────────────────┐   │
│  │ EntityStore  │  │ EventBus   │  │ ConfigLoader     │   │
│  └──────────────┘  └────────────┘  └──────────────────┘   │
└─────────────────────────────────────────────────────────────┘

External: JSON Config Files → ConfigLoader → Systems → State → Presentation
```

**Flow:**
1. **Initialization**: ConfigLoader loads and validates scenario JSON → Systems subscribe to EventBus → Presentation observes State
2. **Game Loop**: User input → Presentation → Systems → State mutations → Events → Systems react → Presentation updates
3. **Round Progression**: RoundManager fires timer events → Systems calculate stress/rapport/tasks → State updated → UI reflects changes

---

### Architectural Pattern

**Pattern:** Modular Monolith with Layered Architecture

**Rationale:**

**Why Monolith:**
- No network latency (all client-side)
- Simpler deployment (single bundle)
- Easier debugging (all code in one runtime)
- Appropriate for Level 3 complexity (not microservices territory)

**Why Layered:**
- Clear separation of concerns (easier testing, reasoning)
- Prevents presentation logic in business rules
- Enables independent layer evolution (swap PlayCanvas for Babylon.js without touching Systems)
- Aligns with strict typing and modular architectural preferences

**Why Modular:**
- Systems are independently replaceable (swap StressCalculator implementation without touching others)
- Each module has single responsibility
- Configuration-driven modularity (toggle systems via config)

**Trade-offs:**
- ✓ **Gain**: Simplicity, fast iteration, clear boundaries
- ✗ **Lose**: Cannot scale horizontally (not a concern for client-side game)
- ✗ **Lose**: All systems in one bundle (mitigated by code splitting if needed)

---

## Technology Stack

### Frontend (Full Stack for Client-Side Game)

**Choice:** TypeScript 5.3+ (strict mode) + PlayCanvas Engine

**Rationale:**
- **TypeScript strict mode**: Catches `undefined` errors at compile-time, enforces null checks, aligns with strict typing preferences
- **PlayCanvas**: Mature 3D engine with integrated physics (AmmoJS), scene editor, asset pipeline
  - Alternative considered: Babylon.js (more features but heavier, PlayCanvas better for simple physics)
  - Alternative considered: Three.js + Cannon.js (more control but requires manual integration, slower iteration)

**Trade-offs:**
- ✓ **Gain**: Type safety, established ecosystem, visual editor
- ✗ **Lose**: Locked into PlayCanvas API (mitigated by layered architecture)

---

### Configuration & Validation

**Choice:** Zod 3.x for runtime schema validation + TypeScript type generation

**Rationale:**
- **Zod**: Runtime validation + TypeScript type inference in single definition
- Prevents `config.nonExistent.property` errors at build time
- Schema-first approach aligns with configuration-driven modularity
- Alternative considered: JSON Schema + Ajv (separate type definitions, more boilerplate)

**Trade-offs:**
- ✓ **Gain**: Single source of truth for types and validation
- ✗ **Lose**: Runtime validation overhead (mitigated by caching parsed configs)

---

### Build & Development Tools

**Choice:** Bun + Vite 6.x + Vitest

**Rationale:**
- **Bun**: Fast package manager and runtime, aligns with development velocity NFR
- **Vite**: HMR <2s, PlayCanvas integration, modern ESM-first
- **Vitest**: Native ESM support, compatible with Vite, faster than Jest

**Trade-offs:**
- ✓ **Gain**: Sub-2-second preview updates, modern tooling
- ✗ **Lose**: Bun still maturing (fallback to npm if issues arise)

---

### State Management

**Choice:** Custom EntityStore (observable state container)

**Rationale:**
- Game state fits single global object (no need for Redux complexity)
- Observable pattern allows Presentation to react to changes
- Alternative considered: Zustand (extra dependency for simple use case)
- Alternative considered: Redux (overkill for client-side game state)

**Trade-offs:**
- ✓ **Gain**: Minimal overhead, predictable updates, easy debugging
- ✗ **Lose**: No time-travel debugging (not needed for this use case)

---

### Event Communication

**Choice:** Custom EventBus (pub/sub pattern)

**Rationale:**
- Decouples systems (RoundManager doesn't know about StressCalculator, just fires events)
- Simple implementation (<100 lines)
- Alternative considered: RxJS (heavyweight for simple event needs)

**Trade-offs:**
- ✓ **Gain**: Loose coupling, system independence
- ✗ **Lose**: Event flow harder to trace (mitigated by dev logging)

---

### Testing

**Choice:** Vitest + Testing Library (for UI components)

**Rationale:**
- **Vitest**: Fast, native ESM, Vite integration
- **Testing Library**: Tests user-facing behavior, not implementation details
- Target 80%+ coverage on Systems layer (business logic)

**Trade-offs:**
- ✓ **Gain**: Fast test execution, confidence in refactoring
- ✗ **Lose**: Mocking PlayCanvas components requires setup

---

### Deployment

**Choice:** Static hosting (Vercel, Netlify, or GitHub Pages)

**Rationale:**
- No backend required (client-only game)
- Zero infrastructure management
- CDN-backed (low latency globally)

**Trade-offs:**
- ✓ **Gain**: Zero ops overhead, automatic SSL, instant deploys
- ✗ **Lose**: No server-side analytics (use client-side analytics if needed)

---

## System Components

### Component 1: ConfigLoader

**Purpose:** Load, validate, and hot-reload scenario configurations

**Responsibilities:**
- Load JSON config files from `/scenarios/*.json`
- Validate configs against Zod schemas
- Provide hot-reload support in dev mode
- Expose typed config objects to systems

**Interfaces:**
```typescript
interface ConfigLoader {
  loadScenario(id: string): Promise<ScenarioConfig>;
  loadDefault(): ScenarioConfig;
  getActiveConfig(): Readonly<ScenarioConfig>;
  validateConfig(raw: unknown): ValidationResult;
  enableHotReload(intervalMs?: number): void;
}
```

**Dependencies:**
- Zod schemas (`src/config/schema.ts`)
- Default configs (`src/config/defaults.ts`)

**FRs Addressed:** FR-018 (Scenario Configuration), FR-019 (Scenario Selection)

---

### Component 2: EventBus

**Purpose:** Centralized pub/sub system for inter-system communication

**Responsibilities:**
- Emit typed events (RoundStart, TaskComplete, StressUpdate, etc.)
- Subscribe to events with type-safe callbacks
- Support wildcard subscriptions for logging/debugging
- Event replay for testing

**Interfaces:**
```typescript
interface EventBus {
  emit<T extends GameEvent>(event: T): void;
  on<T extends GameEvent>(
    eventType: T['type'],
    handler: (event: T) => void
  ): UnsubscribeFn;
  once<T extends GameEvent>(
    eventType: T['type'],
    handler: (event: T) => void
  ): void;
}
```

**Dependencies:** None (core infrastructure)

**FRs Addressed:** All (foundational communication layer)

---

### Component 3: EntityStore

**Purpose:** Central state container with observable updates

**Responsibilities:**
- Store current game state (GameState interface)
- Notify observers on state changes
- Provide snapshot access for systems
- Enforce immutable updates (prevent accidental mutations)

**Interfaces:**
```typescript
interface EntityStore {
  getState(): Readonly<GameState>;
  setState(updater: (state: GameState) => GameState): void;
  subscribe(observer: (state: GameState) => void): UnsubscribeFn;
  getSnapshot(): GameState; // For time-travel debugging
}
```

**Dependencies:**
- GameState type definition (`src/data/state/gameState.ts`)

**FRs Addressed:** All (central state management)

---

### Component 4: GameStateMachine

**Purpose:** Manage high-level game state transitions

**Responsibilities:**
- Track current game phase (LOADING → SCENARIO_SELECT → ROLE_SELECT → PLAYING → ROUND_END → GAME_OVER)
- Enforce valid state transitions
- Emit events on state changes
- Prevent invalid transitions (e.g., can't jump from LOADING to PLAYING)

**Interfaces:**
```typescript
interface GameStateMachine {
  getState(): GamePhase;
  startGame(): void; // LOADING → SCENARIO_SELECT
  selectScenario(): void; // SCENARIO_SELECT → ROLE_SELECT
  selectRole(): void; // ROLE_SELECT → PLAYING
  endRound(): void; // PLAYING → ROUND_END
  continueToNextRound(): void; // ROUND_END → PLAYING
  gameOver(): void; // Any → GAME_OVER
}
```

**Dependencies:**
- EventBus (emits state change events)

**FRs Addressed:** FR-001 (Round System), FR-002 (Role Selection), FR-016 (Summary Screen)

---

### Component 5: RoundManager

**Purpose:** Orchestrate round lifecycle and time progression

**Responsibilities:**
- Start/end rounds (1 round = 1 week)
- Track round timer countdown
- Detect paycheck rounds (every 2 rounds)
- Fire round end events when timer expires
- Handle incomplete task carryover

**Interfaces:**
```typescript
interface RoundManager {
  startRound(roundNumber: number): void;
  endRound(): RoundSummary;
  getRemainingTime(): number;
  isPaycheckRound(roundNumber: number): boolean;
  pauseRound(): void;
  resumeRound(): void;
}
```

**Dependencies:**
- EventBus (emits RoundStart, RoundEnd, TimerTick events)
- EntityStore (reads/updates round state)
- ConfigLoader (reads round duration config)

**FRs Addressed:** FR-001 (Round System), FR-005 (Paycheck System), FR-016 (Summary Screen)

---

### Component 6: TaskSpawner (Blue & Red variants)

**Purpose:** Generate Blue work chunks and Red household tasks

**Responsibilities:**
- **BlueTaskSpawner**: Spawn work from tube, split into subtasks, handle scope creep
- **RedTaskSpawner**: Spawn household tasks at configured intervals
- Use configured spawn rates and task types
- Apply randomization per scenario config

**Interfaces:**
```typescript
interface TaskSpawner {
  spawnTasks(roundNumber: number): Task[];
  getActiveTaskCount(): number;
  clearTasks(): void;
}
```

**Dependencies:**
- EventBus (emits TaskSpawned events)
- EntityStore (writes tasks to state)
- ConfigLoader (reads spawn rates, task types)

**FRs Addressed:** FR-003 (Blue Work), FR-006 (Red Tasks)

---

### Component 7: StressSystem

**Purpose:** Calculate and manage Blue/Red stress mechanics

**Responsibilities:**
- Calculate Blue stress (incomplete tasks, helping Red, rapport decay)
- Calculate Red stress (incomplete tasks, task refusal logic)
- Apply stress-based debuffs (Blue overflow, Red high-stress debuffs)
- Track sustained stress for debuff triggers
- Handle empathy action stress reduction

**Interfaces:**
```typescript
interface StressSystem {
  calculateBlueStress(state: GameState): number;
  calculateRedStress(state: GameState): number;
  applyEmpathyAction(amount: number): void;
  getActiveDebuffs(): Debuff[];
}
```

**Dependencies:**
- EventBus (listens to TaskComplete, RoundEnd, EmpathyAction events)
- EntityStore (reads/updates stress meters)
- ConfigLoader (reads stress thresholds, penalty rates)

**FRs Addressed:** FR-010 (Blue Stress), FR-011 (Red Stress), FR-012 (Empathy Actions)

---

### Component 8: RapportSystem

**Purpose:** Manage Blue's employment rapport and firing mechanics

**Responsibilities:**
- Track rapport level (0-100, displayed as emoji)
- Decrease rapport on missed deadlines
- Apply compound multipliers for consecutive failures
- Trigger firing at randomized low threshold (15-25%)
- Handle rapport increase on successful rounds

**Interfaces:**
```typescript
interface RapportSystem {
  getRapportLevel(): number;
  getRapportEmoji(): string; // 😢 😕 😐 🙂 😊
  checkFiring(): boolean;
  decreaseRapport(amount: number): void;
  increaseRapport(amount: number): void;
}
```

**Dependencies:**
- EventBus (listens to RoundEnd events)
- EntityStore (reads incomplete Blue tasks, updates rapport)
- ConfigLoader (reads rapport thresholds, decay rates)

**FRs Addressed:** FR-004 (Rapport System)

---

### Component 9: UIManager

**Purpose:** Coordinate all Presentation layer components

**Responsibilities:**
- Render game UI (stress meters, rapport gauge, timer, balance)
- Display modals (empathy actions, summary screens, tutorials)
- Handle user input routing to appropriate systems
- Update visual feedback (particle effects, color grading)

**Interfaces:**
```typescript
interface UIManager {
  showModal(type: ModalType, content: ModalContent): void;
  hideModal(): void;
  updateStressMeters(blue: number, red: number): void;
  updateRapportGauge(level: number): void;
  updateBalance(amount: number): void;
  updateTimer(remaining: number): void;
}
```

**Dependencies:**
- EventBus (listens to all game events)
- EntityStore (observes state changes)

**FRs Addressed:** FR-016 (Summary Screen), FR-017 (Tutorials), FR-012 (Empathy Modals)

---

### Component 10: SceneManager (PlayCanvas Integration)

**Purpose:** Manage PlayCanvas scene, entities, and physics

**Responsibilities:**
- Initialize PlayCanvas application
- Create camera, lighting, environment
- Manage ball entities (Blue, Red)
- Handle task visualization (splotches, chunks)
- Apply physics gravity toward active tasks

**Interfaces:**
```typescript
interface SceneManager {
  initialize(canvas: HTMLCanvasElement): pc.Application;
  createBall(role: 'blue' | 'red'): BallEntity;
  createTask(task: Task): TaskEntity;
  applyGravityToward(ball: BallEntity, target: Vector3): void;
  cleanupTask(taskId: string): void;
}
```

**Dependencies:**
- PlayCanvas engine
- EntityStore (reads ball positions, task locations)

**FRs Addressed:** FR-014 (Physics), FR-015 (Camera), FR-008 (Task Interaction)

---

## Data Architecture

### Data Model

**Core Entities:**

```typescript
// Player-controlled or AI-controlled ball
interface Ball {
  id: 'blue' | 'red';
  role: 'blue' | 'red';
  position: Vector3;
  velocity: Vector3;
  stress: number; // 0-100+
  currentTask: TaskId | null;
  isAI: boolean;
}

// Blue work chunk or Red household task
interface Task {
  id: string;
  type: 'blue' | 'red';
  category?: 'cleaning' | 'cooking' | 'childcare' | 'errands'; // Red only
  subtasks?: Subtask[]; // Blue only
  completionProgress: number; // 0-1
  position: Vector3;
  createdAt: number; // round number
  scopeCreepApplied: boolean; // Blue only
}

// Blue work subtask (chunk splits into subtasks)
interface Subtask {
  id: string;
  completionTime: number; // seconds
  completed: boolean;
}

// Round state (1 round = 1 week)
interface Round {
  number: number;
  phase: 'IDLE' | 'ACTIVE' | 'ENDED';
  elapsedTime: number;
  remainingTime: number;
  isPaycheckRound: boolean;
  startedAt: number | null;
  endedAt: number | null;
}

// Financial tracking
interface FinancialState {
  balance: number;
  lastPaycheckAmount: number;
  totalIncome: number;
  totalExpenses: number;
}

// Tutorial/tip tracking
interface TutorialState {
  hasSeenFirstTask: boolean;
  hasSeenFirstHelpRequest: boolean;
  hasSeenFirstDebuff: boolean;
  tutorialEnabled: boolean;
}

// Complete game state
interface GameState {
  currentRound: Round;
  playerRole: 'blue' | 'red';
  gamePhase: GamePhase;
  blueBall: Ball;
  redBall: Ball;
  blueTasks: Map<string, Task>;
  redTasks: Map<string, Task>;
  financialState: FinancialState;
  employmentEventTriggered: boolean;
  roundsSinceHighRedStress: number;
  activeModal: ModalType | null;
  tutorialState: TutorialState;
}
```

**Relationships:**
- Ball `1:1` currentTask (optional)
- Round `1:N` Tasks (tasks created during round)
- GameState `1:1` FinancialState
- GameState `1:1` TutorialState

**Cardinality:**
- `blueBall`: exactly 1
- `redBall`: exactly 1
- `blueTasks`: 0-N (unbounded, can accumulate)
- `redTasks`: 0-N (unbounded, can accumulate)

---

### Database Design

**Storage:** Browser localStorage (no backend database)

**Schema:**
```
localStorage['choreograph_config_cache'] = {
  scenarioId: string,
  config: ScenarioConfig,
  timestamp: number
}

localStorage['choreograph_tutorial_state'] = {
  hasSeenFirstTask: boolean,
  hasSeenFirstHelpRequest: boolean,
  hasSeenFirstDebuff: boolean
}
```

**Rationale:**
- No persistence required beyond tutorial state (sessions are 15-30 mins)
- Config caching reduces JSON parsing overhead
- Alternative considered: IndexedDB (overkill for minimal data)

---

### Data Flow

**Read Path:**
1. ConfigLoader loads JSON → Validates with Zod → Returns typed config
2. Systems read config → Calculate game logic → Emit events
3. EntityStore reads events → Updates state → Notifies observers
4. Presentation reads state → Renders UI/scene

**Write Path:**
1. User input → UIManager → Emits event (e.g., TaskComplete)
2. Systems listen to event → Calculate updates (stress, rapport, tasks)
3. Systems call EntityStore.setState() → State updated
4. EntityStore notifies observers → Presentation re-renders

**Caching:**
- Config parsed once per scenario load, frozen object returned
- State snapshots cached during round for summary calculations
- Task entity pools reused (create once, reset instead of recreate)

---

## API Design

### API Architecture

**Pattern:** No external API (client-side only game)

**Internal Event API:**
All system communication via EventBus using typed events:

```typescript
// Event types
type GameEvent =
  | { type: 'ROUND_START'; roundNumber: number }
  | { type: 'ROUND_END'; summary: RoundSummary }
  | { type: 'TASK_SPAWNED'; task: Task }
  | { type: 'TASK_COMPLETED'; taskId: string; ball: 'blue' | 'red' }
  | { type: 'STRESS_UPDATED'; ball: 'blue' | 'red'; newValue: number }
  | { type: 'RAPPORT_CHANGED'; oldValue: number; newValue: number }
  | { type: 'EMPATHY_ACTION'; reductionAmount: number }
  | { type: 'EMPLOYMENT_EVENT_TRIGGERED' }
  | { type: 'GAME_OVER'; reason: 'fired' | 'quit' };

// Usage
eventBus.emit({ type: 'TASK_COMPLETED', taskId: '123', ball: 'blue' });
eventBus.on('TASK_COMPLETED', (event) => {
  // Handle task completion
});
```

**Rationale:**
- Type-safe events via discriminated unions
- Compile-time validation of event payloads
- Self-documenting via TypeScript types

---

### Authentication & Authorization

**Not Applicable:** No user accounts, no multiplayer, no sensitive data.

**Future Consideration:** If analytics added, use anonymous client-side tracking (no PII).

---

## Non-Functional Requirements Coverage

### NFR-001: Performance - Frame Rate

**Requirement:** Game maintains 60 FPS on modern desktop browsers with integrated graphics (Intel HD 620 equivalent or better).

**Architecture Solution:**

**Rendering Optimizations:**
- Use PlayCanvas batching for static geometry (floor, walls)
- Dynamic entities (balls, tasks) use instanced rendering where possible
- Particle effects capped at 100 particles max, recycled from pool
- Disable shadows on low-end hardware (detected via WebGL capabilities)

**Physics Optimizations:**
- Fixed timestep at 60Hz (prevents frame-rate-dependent physics)
- Simplified collision meshes (sphere for balls, box for tasks)
- Physics simulation limited to 10 active bodies max (balls + nearest tasks)
- Sleeping bodies for tasks far from active ball

**Logic Optimizations:**
- Stress calculations only on round end, not every frame
- Task spawning uses generator pattern (spread over multiple frames)
- Event handlers debounced where appropriate (e.g., UI updates)

**Memory Management:**
- Object pooling for tasks, particles, event objects
- Avoid allocations in hot paths (reuse vectors, matrices)
- Manual cleanup of PlayCanvas entities on task completion

**Implementation Notes:**
- Profile on Intel HD 620 target hardware
- Use Chrome DevTools Performance panel to identify bottlenecks
- Lazy-load non-critical assets (tutorial animations, empathy modals)

**Validation:**
- Automated performance tests in CI (measure frame time avg/p95)
- Manual testing on target hardware before each release
- Frame time budget: 16.6ms per frame (60 FPS), 13ms target to account for GC pauses

---

### NFR-002: Modularity - Configuration-Driven

**Requirement:** All game parameters (spawn rates, stress thresholds, task types, etc.) are defined in external JSON/YAML configuration files, not hardcoded in source.

**Architecture Solution:**

**Schema-First Configuration:**
```typescript
// src/config/schema.ts - Single source of truth
export const ScenarioConfigSchema = z.object({
  id: z.string(),
  name: z.string(),
  round: RoundConfigSchema,
  blue: BlueBallConfigSchema,
  red: RedBallConfigSchema,
  stress: StressConfigSchema,
  rapport: RapportConfigSchema,
  employmentEvent: EmploymentEventConfigSchema,
  ui: UIConfigSchema,
  financial: FinancialConfigSchema,
  tutorial: TutorialConfigSchema,
});

// TypeScript types auto-generated from schema
export type ScenarioConfig = z.infer<typeof ScenarioConfigSchema>;
```

**Build-Time Validation (Key Quality Improvement):**
- TypeScript types generated from Zod schemas ensure compile-time safety
- Any code accessing `config.nonExistentSection.property` fails at build time
- Example: `config.financial.startingBalance` is valid because `financial` is in schema
- Counter-example: `config.tutorial.enabled` requires `tutorial` schema section (which we added during debug session)

**Hot-Reload Support:**
```typescript
// ConfigLoader watches for file changes in dev mode
configLoader.enableHotReload(); // Polls every 2s in dev
// On change detected: validate → update → emit event → systems reload
```

**No Magic Numbers:**
```typescript
// ❌ BAD: Hardcoded values
const stressIncrease = 0.1;

// ✅ GOOD: From config
const stressIncrease = config.stress.blue.incompleteTaskPenalty;
```

**Implementation Notes:**
- All systems receive config via dependency injection (constructor params)
- Config changes in dev trigger system reinitialization
- Production builds freeze configs (no runtime modification)

**Validation:**
- Lint rule: No numeric/string literals in game logic (except 0, 1, -1)
- Unit tests validate that changing config actually changes behavior
- Schema validation catches typos/invalid values on load

---

### NFR-003: Browser Compatibility

**Requirement:** Game runs on modern desktop browsers (Chrome, Firefox, Safari, Edge). Mobile support is out of scope for MVP.

**Architecture Solution:**

**Target Browsers:**
- Chrome 120+
- Firefox 120+
- Safari 17+
- Edge 120+

**Required Features:**
- WebGL 2.0 (for PlayCanvas rendering)
- ES2020+ (for optional chaining, nullish coalescing)
- Web Audio API (for adaptive music)
- localStorage (for tutorial state)

**Polyfills:**
- None required (target browsers natively support all features)
- Graceful degradation for optional features (e.g., disable audio if Web Audio unavailable)

**Testing Strategy:**
- Automated cross-browser testing via Playwright
- Manual smoke tests on all target browsers before release
- BrowserStack for testing Safari (if no Mac available)

**Implementation Notes:**
- Vite handles module bundling for browser compatibility
- No experimental APIs used (all features stable in target browsers)
- Responsive layouts for desktop window sizes (1280x720 minimum)

**Validation:**
- CI runs Playwright tests against all target browsers
- Error tracking (Sentry or similar) monitors browser-specific issues in production
- Feature detection (not user-agent sniffing) for optional capabilities

---

### NFR-004: Maintainability - Code Structure

**Requirement:** Codebase follows modular architecture with clear separation of concerns: data models, game systems (logic), rendering (presentation). TypeScript with strict typing.

**Architecture Solution:**

**Directory Structure:**
```
src/
├── config/                 # Data Layer - Configuration
│   ├── schema.ts          # Zod schemas (source of truth)
│   ├── defaults.ts        # Default config values
│   ├── types.ts           # TypeScript types
│   └── loader.ts          # ConfigLoader component
├── data/                   # Data Layer - State & Events
│   ├── state/
│   │   ├── gameState.ts   # GameState interface
│   │   └── entityStore.ts # EntityStore component
│   └── events/
│       └── eventBus.ts    # EventBus component
├── systems/                # Systems Layer - Business Logic
│   ├── core/
│   │   ├── stateMachine/  # GameStateMachine
│   │   ├── roundManager.ts# RoundManager
│   │   └── taskSpawner.ts # TaskSpawner (Blue/Red variants)
│   ├── stress/
│   │   └── stressSystem.ts# StressSystem
│   └── rapport/
│       └── rapportSystem.ts# RapportSystem
├── presentation/           # Presentation Layer - UI & Rendering
│   ├── ui/
│   │   └── uiManager.ts   # UIManager component
│   └── scene/
│       └── sceneManager.ts# SceneManager (PlayCanvas)
└── main.ts                 # Composition root

tests/
├── unit/                   # Systems layer unit tests
├── integration/            # Cross-layer integration tests
└── e2e/                    # End-to-end Playwright tests
```

**TypeScript Strict Mode:**
```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "exactOptionalPropertyTypes": true
  }
}
```

**Dependency Rules (Enforced via ESLint):**
- Data Layer: No imports from Systems or Presentation
- Systems Layer: Can import from Data, not from Presentation
- Presentation Layer: Can import from Data and Systems

**Interface Documentation:**
```typescript
/**
 * Manages round lifecycle and time progression.
 *
 * Responsibilities:
 * - Start/end rounds (1 round = 1 week)
 * - Track round timer countdown
 * - Detect paycheck rounds (every 2 rounds)
 *
 * Dependencies:
 * - EventBus: Emits RoundStart, RoundEnd events
 * - EntityStore: Reads/updates round state
 * - ConfigLoader: Reads round duration
 */
export class RoundManager { ... }
```

**Implementation Notes:**
- All public APIs documented with JSDoc
- Component responsibilities clearly defined
- No circular dependencies (detected by ESLint)

**Validation:**
- ESLint enforces dependency rules
- Type coverage >95% (measured by type-coverage tool)
- Architecture Decision Records (ADRs) for major design choices

---

### NFR-005: Development Velocity

**Requirement:** PlayCanvas editor supports rapid iteration with live preview and automated asset pipeline.

**Architecture Solution:**

**Live Preview (<2s):**
- Vite HMR detects file changes → hot-swaps modules → preserves game state where possible
- Config hot-reload polls `/scenarios/*.json` every 2s in dev mode
- On change detected: validate → update systems → maintain game state (don't reset round)

**Asset Pipeline:**
- PlayCanvas assets (3D models, textures, audio) managed via PlayCanvas Editor
- Export to `/public/assets/` directory
- Vite serves static assets, no build step required
- Asset changes visible on page refresh (no rebuild)

**Fast Build:**
- Vite build: <5s for full production bundle
- Type checking: <3s via `tsc --noEmit`
- Linting: <2s via ESLint
- Tests: <10s for unit tests (Vitest parallel execution)

**Developer Experience:**
- Type errors shown inline in VSCode (TypeScript language server)
- Config validation errors shown with helpful messages (Zod error formatting)
- Hot-reload preserves game state (round number, stress levels, task progress)

**Implementation Notes:**
- Use `import.meta.hot` for HMR acceptance
- Preserve state across HMR via module-level variables
- Disable hot-reload in specific modules if state preservation breaks (e.g., EventBus)

**Validation:**
- Measure HMR time: <2s from file save to UI update
- Developer survey: "Can you iterate on game feel quickly?" (qualitative)
- Build time monitored in CI (fail if >10s)

---

## Security Architecture

### Authentication

**Not Applicable:** Client-side only game, no user accounts.

**Future Consideration:** If multiplayer added, consider:
- Firebase Authentication (OAuth, email/password)
- Supabase Auth (alternative, open-source)
- JWT tokens for session management

---

### Authorization

**Not Applicable:** No user roles, no protected resources.

**Future Consideration:** If scenario editor added, consider:
- Read-only scenarios for regular users
- Admin-only scenario creation/editing

---

### Data Encryption

**At Rest:**
- No sensitive data stored (tutorial state, config cache only)
- localStorage unencrypted (acceptable for non-sensitive data)

**In Transit:**
- HTTPS enforced on hosting platform (Vercel, Netlify auto-provision SSL)
- No API calls to external services

**Future Consideration:** If analytics added:
- Anonymize IP addresses
- No PII collected
- GDPR-compliant consent banner

---

### Security Best Practices

**Input Validation:**
- Config files validated via Zod schemas before use
- User input limited to button clicks (no free-form text input)

**XSS Prevention:**
- No `innerHTML` usage (use PlayCanvas UI or framework-managed DOM)
- Config text sanitized if displayed (Zod string validation)

**Dependency Security:**
- Automated dependency updates via Dependabot
- `npm audit` run in CI (fail build on high/critical vulnerabilities)

**Content Security Policy:**
```html
<!-- index.html -->
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-eval';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data:;
  connect-src 'self';
">
```

**Rationale:**
- `'unsafe-eval'` required for PlayCanvas engine
- `'unsafe-inline'` for styles (acceptable for static site)
- No third-party scripts loaded

---

## Scalability & Performance

### Scaling Strategy

**Not Applicable (Client-Side Game):**
- No server to scale
- Each player runs independent instance in their browser

**Client-Side Performance Scaling:**
- Dynamic quality settings based on detected hardware:
  - High-end: Full particle effects, shadows, 60 FPS
  - Mid-range: Reduced particles, no shadows, 60 FPS
  - Low-end: Minimal effects, 30 FPS fallback

**Asset Scaling:**
- CDN-hosted assets (Vercel/Netlify Edge Network)
- Lazy-load empathy modal animations (on-demand)
- Progressive texture loading (low-res → high-res)

---

### Performance Optimization

**Critical Path Optimizations:**
1. **Task completion** (hot path, runs every frame during hold):
   - Avoid allocations (reuse progress objects)
   - Batch UI updates (update fill bar at 30 FPS, not 60 FPS)

2. **Stress calculation** (called every round end):
   - Cache intermediate results (task counts, stress deltas)
   - Use bitmasks for debuff flags (faster than object lookups)

3. **Physics simulation**:
   - Sleep distant bodies (task entities >10m from active ball)
   - Simplified collision meshes (spheres, boxes only)

**Non-Critical Optimizations:**
- Debounce audio playback (prevent 100 simultaneous "ding" sounds)
- Throttle event emissions (e.g., stress updates max once per 100ms)

**Measurement:**
- Chrome DevTools Performance profiler
- Lighthouse performance score >90
- Custom performance marks for critical paths:
  ```typescript
  performance.mark('stress-calc-start');
  stressSystem.calculateBlue();
  performance.mark('stress-calc-end');
  performance.measure('stress-calc', 'stress-calc-start', 'stress-calc-end');
  ```

---

### Caching Strategy

**Config Caching:**
- Parsed configs cached in memory (frozen objects)
- localStorage cache for recently loaded scenarios (skip re-parsing JSON)

**Asset Caching:**
- PlayCanvas assets cached by browser (HTTP cache headers)
- Service worker for offline support (future enhancement)

**State Caching:**
- Round summary data cached during round (avoid recalculating on summary screen)
- Task entity pool cached (reuse instead of recreate)

**Cache Invalidation:**
- Config cache invalidated on scenario switch
- Asset cache managed by browser (respects HTTP headers)
- State cache cleared on round start

---

### Load Balancing

**Not Applicable:** Client-side only, no server load balancing.

**CDN Distribution:**
- Static assets served via CDN edge nodes (automatic via hosting platform)
- Reduces latency for global players

---

## Reliability & Availability

### High Availability Design

**Not Applicable:** No backend to fail.

**Client-Side Reliability:**
- Error boundaries catch React-style crashes (if UI framework added)
- Fallback to default config if scenario load fails
- localStorage persistence for tutorial state (survives page refresh)

**Graceful Degradation:**
- If WebGL unavailable: Show error message, don't crash silently
- If Web Audio unavailable: Disable music, continue gameplay
- If localStorage full: Disable tutorial persistence, warn user

---

### Disaster Recovery

**Not Applicable:** No data to recover (stateless client-side game).

**Future Consideration:** If save/load added:
- Periodic localStorage backups to cloud (Google Drive API)
- Export/import save files as JSON

---

### Backup Strategy

**Not Applicable:** No user data stored on server.

**Developer Backups:**
- Git repository backed up to GitHub (automatic)
- Scenario configs versioned in Git

---

### Monitoring & Alerting

**Client-Side Monitoring:**
- Error tracking: Sentry (free tier for low traffic)
  - Capture unhandled exceptions
  - Capture promise rejections
  - Source maps uploaded for stack traces

**Performance Monitoring:**
- Lighthouse CI in CI/CD pipeline (track performance over time)
- User Timing API for critical path measurements
- Optional: Google Analytics for basic usage metrics (anonymized)

**Alerting:**
- Sentry alerts on new error types
- GitHub Actions alert on build failures
- No on-call required (no backend to monitor)

---

## Development Architecture

### Code Organization

**Modular Structure:**
- Each component in its own file
- Barrel exports for public APIs (`src/systems/index.ts`)
- Co-locate tests with implementation (`roundManager.ts` + `roundManager.test.ts`)

**Naming Conventions:**
- PascalCase for classes, components (`RoundManager`, `EventBus`)
- camelCase for functions, variables (`startRound`, `currentState`)
- SCREAMING_SNAKE_CASE for constants (`MAX_STRESS`, `DEFAULT_ROUND_DURATION`)
- Interfaces prefixed with `I` if ambiguous (`IConfigLoader` vs `ConfigLoader` class)

**File Organization:**
```
src/systems/core/roundManager.ts       # Implementation
src/systems/core/roundManager.test.ts  # Unit tests
src/systems/core/index.ts              # Barrel export
```

---

### Module Structure

**Dependency Injection:**
```typescript
// Systems receive dependencies via constructor
export class RoundManager {
  constructor(
    private eventBus: EventBus,
    private stateMachine: GameStateMachine,
    private config: RoundManagerConfig
  ) {}
}

// Composition root assembles dependencies
const eventBus = new EventBus();
const stateMachine = new GameStateMachine(eventBus, 'LOADING');
const roundManager = new RoundManager(eventBus, stateMachine, config.round);
```

**Interface Segregation:**
- Components depend on interfaces, not concrete implementations
- Enables testing with mocks

```typescript
interface IEventBus {
  emit<T>(event: T): void;
  on<T>(type: string, handler: (event: T) => void): void;
}

class RoundManager {
  constructor(private eventBus: IEventBus) {} // Interface, not EventBus class
}
```

---

### Testing Strategy

**Test Pyramid:**
- **70% Unit Tests** (Systems layer, pure logic)
- **20% Integration Tests** (Cross-layer, e.g., RoundManager + EventBus + EntityStore)
- **10% E2E Tests** (Playwright, critical user flows)

**Unit Testing:**
```typescript
// src/systems/core/roundManager.test.ts
import { describe, it, expect, vi } from 'vitest';
import { RoundManager } from './roundManager';

describe('RoundManager', () => {
  it('emits RoundStart event when startRound called', () => {
    const eventBus = createMockEventBus();
    const roundManager = new RoundManager(eventBus, ...deps);

    roundManager.startRound(1);

    expect(eventBus.emit).toHaveBeenCalledWith({
      type: 'ROUND_START',
      roundNumber: 1,
    });
  });
});
```

**Integration Testing:**
```typescript
// tests/integration/roundFlow.test.ts
it('completes full round lifecycle', () => {
  const { eventBus, stateMachine, roundManager } = setupGameSystems();

  stateMachine.startGame();
  roundManager.startRound(1);
  // ... simulate round progression
  roundManager.endRound();

  expect(stateMachine.getState()).toBe('ROUND_END');
});
```

**E2E Testing:**
```typescript
// tests/e2e/playthrough.spec.ts
import { test, expect } from '@playwright/test';

test('can complete first round', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Start Game');
  await page.click('text=Play as Blue Ball');
  // ... interact with game
  await expect(page.locator('.round-summary')).toBeVisible();
});
```

**Coverage Targets:**
- Systems layer: 80%+ coverage
- Data layer: 90%+ coverage (simpler, should be fully tested)
- Presentation layer: 50%+ coverage (harder to test, lower priority)

---

### CI/CD Pipeline

**Pipeline Stages:**

1. **Lint** (parallel with build)
   ```bash
   bun run lint  # ESLint + Prettier check
   ```

2. **Type Check** (parallel with build)
   ```bash
   bun run type-check  # tsc --noEmit
   ```

3. **Build**
   ```bash
   bun run build  # Vite production build
   ```

4. **Test** (after build)
   ```bash
   bun run test:unit      # Vitest unit tests
   bun run test:integration  # Integration tests
   ```

5. **E2E** (after build)
   ```bash
   bun run test:e2e  # Playwright tests
   ```

6. **Deploy** (on main branch only)
   ```bash
   vercel deploy --prod  # Deploy to production
   ```

**CI Configuration (.github/workflows/ci.yml):**
```yaml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bun run lint
      - run: bun run type-check
      - run: bun run build
      - run: bun run test
      - run: bun run test:e2e
```

**Deployment Triggers:**
- Push to `main` → Deploy to production
- Push to `develop` → Deploy to staging (preview URL)
- Pull request → Deploy to preview environment

---

## Deployment Architecture

### Environments

**Development:**
- Local: `http://localhost:3000` (Vite dev server)
- Hot reload enabled
- Config hot-reload polling active
- Source maps enabled
- Debug logging verbose

**Staging:**
- URL: `https://choreograph-staging.vercel.app`
- Deploy trigger: Push to `develop` branch
- Production build, but with staging config
- Source maps enabled
- Analytics disabled

**Production:**
- URL: `https://choreograph.vercel.app` (or custom domain)
- Deploy trigger: Push to `main` branch
- Optimized production build
- Source maps uploaded to Sentry (not served to users)
- Analytics enabled (if added)

---

### Deployment Strategy

**Strategy:** Continuous Deployment (CD) via Vercel

**Process:**
1. Developer pushes to Git
2. GitHub webhook triggers Vercel build
3. Vercel runs: `bun install && bun run build`
4. Build output (`dist/`) deployed to CDN edge nodes
5. Preview URL available in seconds
6. On success, production alias updated (zero downtime)

**Rollback:**
- Vercel preserves previous deployments
- Instant rollback via Vercel dashboard (point alias to previous deployment)
- Git revert + push to trigger automatic rollback deploy

**Blue-Green Deployment:**
- Not required (atomic CDN updates, instant rollback)
- Vercel handles edge node propagation automatically

---

### Infrastructure as Code

**Vercel Configuration (vercel.json):**
```json
{
  "buildCommand": "bun run build",
  "devCommand": "bun run dev",
  "installCommand": "bun install",
  "framework": null,
  "outputDirectory": "dist",
  "env": {
    "NODE_ENV": "production"
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}
```

**Alternative Hosting (if not using Vercel):**
- Netlify: Similar setup, `netlify.toml` config
- GitHub Pages: Static hosting, manual deploy via Actions
- Self-hosted: Nginx serving `dist/`, Docker container

---

## Requirements Traceability

### Functional Requirements Coverage

| FR ID | FR Name | Components | Architecture Notes |
|-------|---------|------------|-------------------|
| FR-001 | Round-Based Time System | RoundManager, GameStateMachine, EntityStore | Round timer managed by RoundManager, state transitions via GameStateMachine |
| FR-002 | Player Role Selection | GameStateMachine, UIManager | State machine enforces LOADING → SCENARIO_SELECT → ROLE_SELECT flow |
| FR-003 | Blue Work Generation | BlueTaskSpawner, TaskSystem | Spawner uses config for chunk/subtask counts, scope creep probability |
| FR-004 | Employment Rapport System | RapportSystem | Calculates rapport decay, detects firing threshold, emits events |
| FR-005 | Paycheck System | RoundManager, FinancialState | RoundManager detects paycheck rounds, updates FinancialState balance |
| FR-006 | Red Task Spawning | RedTaskSpawner, TaskSystem | Spawns tasks at configured intervals, applies task type weights |
| FR-007 | Red Task Behavior | StressSystem, TaskSystem | Refusal logic based on Red stress, no hard penalties |
| FR-008 | Task Completion Interaction | UIManager, SceneManager | Button-hold UI via UIManager, physics gravity via SceneManager |
| FR-009 | Context Switching Penalty | StressSystem, TaskSystem | Tracks active task type, applies regrowth when switching Blue → Red |
| FR-010 | Blue Stress Mechanics | StressSystem | Calculates stress from tasks, helping, rapport decay |
| FR-011 | Red Stress Mechanics | StressSystem | Calculates stress from incomplete tasks, triggers help requests |
| FR-012 | Empathy Action System | EmpathySystem, UIManager | Displays modals, reduces Blue stress on action performed |
| FR-013 | Red Employment Event | RoundManager, EventSystem | Triggers mid-game (rounds 3-5), reduces Blue work time |
| FR-014 | 3D Physics-Based Movement | SceneManager (PlayCanvas) | PlayCanvas rigid body physics, gravity toward tasks |
| FR-015 | Fixed Isometric Camera | SceneManager (PlayCanvas) | PlayCanvas camera entity, locked rotation/zoom |
| FR-016 | End-of-Round Summary Screen | UIManager, RoundManager | RoundManager calculates summary, UIManager displays modal |
| FR-017 | Tutorial/Tip Modals | UIManager, TutorialSystem | Displays modals at key moments, tracks tutorial state |
| FR-018 | Scenario Configuration System | ConfigLoader, Zod Schemas | JSON configs, Zod validation, hot-reload in dev |
| FR-019 | Scenario Selection Screen | UIManager, ConfigLoader | Lists scenarios, loads selected config |
| FR-020 | Audio Feedback System | AudioController, EventBus | Listens to events, plays sounds, adapts music to stress |
| FR-021 | Visual Polish | SceneManager, UIManager | Particle effects, color grading, transitions |

**Coverage:** 21/21 FRs addressed (100%)

---

### Non-Functional Requirements Coverage

| NFR ID | NFR Name | Architecture Solutions | Validation Method |
|--------|----------|------------------------|-------------------|
| NFR-001 | Performance (60 FPS) | Object pooling, batched rendering, fixed timestep physics, lazy evaluation | Automated perf tests, manual testing on Intel HD 620 |
| NFR-002 | Modularity (Config-Driven) | Zod schemas, build-time validation, hot-reload, no magic numbers | Lint rules, schema validation tests |
| NFR-003 | Browser Compatibility | WebGL 2.0, ES2020+, cross-browser testing, no polyfills needed | Playwright tests on Chrome/Firefox/Safari/Edge |
| NFR-004 | Maintainability (Code Structure) | 3-layer architecture, TypeScript strict mode, dependency injection, docs | ESLint rules, type coverage >95%, ADRs |
| NFR-005 | Development Velocity (<2s preview) | Vite HMR, config hot-reload, fast build pipeline | Measure HMR time, build time monitoring |

**Coverage:** 5/5 NFRs addressed (100%)

---

## Trade-offs & Decision Log

### Decision 1: Modular Monolith vs Microservices

**Decision:** Modular Monolith

**Context:** Client-side game with no backend.

**Trade-offs:**
- ✓ **Gain**: Simplicity, single deployment, no network overhead
- ✗ **Lose**: Cannot scale independently (not a concern for client-side)

**Rationale:** Microservices solve distribution/scaling problems that don't exist in client-side games. Layered monolith provides modularity benefits without unnecessary complexity.

---

### Decision 2: Zod for Schema Validation vs JSON Schema

**Decision:** Zod

**Context:** Need runtime validation + TypeScript type safety.

**Trade-offs:**
- ✓ **Gain**: Single source of truth (schema = types), excellent DX, composable schemas
- ✗ **Lose**: Runtime validation overhead (~1-2ms per config parse)

**Rationale:** Type safety prevents entire class of bugs (`config.undefined.property`). Runtime overhead negligible (configs parsed once per scenario load). Alternative (JSON Schema + separate TS types) requires maintaining two sources of truth.

---

### Decision 3: Custom EventBus vs RxJS

**Decision:** Custom EventBus

**Context:** Need pub/sub for system communication.

**Trade-offs:**
- ✓ **Gain**: Zero dependencies, simple implementation, full control
- ✗ **Lose**: No operators (map, filter, debounce), manual unsubscribe management

**Rationale:** Simple event patterns don't justify RxJS bundle size (50KB+). Custom implementation <100 lines, type-safe via discriminated unions. If complex event transformations needed later, can migrate to RxJS.

---

### Decision 4: PlayCanvas vs Babylon.js vs Three.js

**Decision:** PlayCanvas

**Context:** Need 3D engine with physics for browser game.

**Trade-offs:**
- ✓ **Gain**: Integrated physics (AmmoJS), visual editor, good docs, lighter bundle
- ✗ **Lose**: Less flexible than Three.js, smaller community than Babylon

**Rationale:** Integrated physics simplifies development. Visual editor enables non-programmers to adjust scenes. Three.js + Cannon.js requires manual integration (slower iteration). Babylon.js more features but heavier bundle (not needed for simple physics game).

---

### Decision 5: localStorage vs IndexedDB vs No Persistence

**Decision:** localStorage (minimal usage)

**Context:** Need to persist tutorial state between sessions.

**Trade-offs:**
- ✓ **Gain**: Simple API, synchronous, universally supported
- ✗ **Lose**: 5MB limit, string-only storage

**Rationale:** Minimal data to persist (tutorial state, config cache). IndexedDB overkill for <1KB of data. No persistence considered but degrades UX (tutorial repeats every session).

---

### Decision 6: Build-Time Schema Validation vs Runtime-Only

**Decision:** Build-time validation (TypeScript + Zod)

**Context:** Prevent `config.undefined.property` runtime errors.

**Trade-offs:**
- ✓ **Gain**: Catches errors at compile-time, prevents runtime crashes, better DX
- ✗ **Lose**: Requires type generation step, slightly complex build

**Rationale:** Runtime validation only catches errors when code executes (miss rarely-executed paths). Build-time validation catches all property accesses during compilation. This architectural decision directly addresses the bug discovered during debugging session.

---

## Quality Architecture: Schema Validation Testing

**Problem Discovered During Debugging:**
- Code accessed `config.financial.startingBalance` and `config.tutorial.enabled`
- Schema didn't define `financial` or `tutorial` sections
- Runtime error: `TypeError: Cannot read properties of undefined`

**Architectural Solution:**

### 1. Type-Safe Config Access (Build-Time Validation)

**Mechanism:**
```typescript
// src/config/schema.ts
export const ScenarioConfigSchema = z.object({
  // ... existing sections ...
  financial: FinancialConfigSchema,  // Required section
  tutorial: TutorialConfigSchema,    // Required section
});

// TypeScript type auto-generated
export type ScenarioConfig = z.infer<typeof ScenarioConfigSchema>;
```

**Effect:**
```typescript
// ✅ Valid: TypeScript knows financial exists
const balance = config.financial.startingBalance; // OK

// ❌ Invalid: TypeScript error at compile-time
const foo = config.nonExistent.property;
// Error: Property 'nonExistent' does not exist on type 'ScenarioConfig'
```

**Validation:** TypeScript compiler fails build if accessing non-existent properties.

---

### 2. Schema-Usage Alignment Tests

**Test Strategy:**
```typescript
// tests/config/schemaUsage.test.ts
import { describe, it, expect } from 'vitest';
import { ScenarioConfigSchema } from '@/config/schema';
import { parse as tsparse } from '@typescript-eslint/parser';

describe('Schema Usage Alignment', () => {
  it('all config property accesses exist in schema', () => {
    // Parse all TypeScript files
    const configAccesses = findConfigPropertyAccesses('./src');
    // e.g., ['financial.startingBalance', 'tutorial.enabled']

    // Validate each access against schema
    configAccesses.forEach(access => {
      const result = validateAccessAgainstSchema(access, ScenarioConfigSchema);
      expect(result.valid).toBe(true);
    });
  });
});
```

**Implementation Note:** This test uses static analysis to find all `config.X.Y` patterns and validates them against Zod schema. Catches schema/usage mismatches before runtime.

---

### 3. Runtime Validation with Helpful Errors

**Error Messages:**
```typescript
// src/config/loader.ts
validateConfig(config: unknown): ValidationResult {
  try {
    const validated = ScenarioConfigSchema.parse(config);
    return { success: true, config: validated };
  } catch (error) {
    if (error instanceof ZodError) {
      const formattedErrors = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
        expected: err.expected,  // What schema expects
        received: err.received,  // What config provided
      }));

      return {
        success: false,
        errors: formattedErrors,
      };
    }
    // ... handle unknown errors
  }
}
```

**User-Facing Error:**
```
Config validation failed for scenario 'baseline':

  - financial.startingBalance: Required field missing
    Expected: number (min: 0)
    Received: undefined

  - tutorial.enabled: Required field missing
    Expected: boolean
    Received: undefined

Fix: Add these sections to /scenarios/baseline.json or use default values.
```

---

### 4. CI/CD Integration

**Pre-Commit Hook:**
```bash
# .husky/pre-commit
#!/bin/sh
bun run type-check  # Fails if config access doesn't match schema
bun run test:unit   # Runs schema-usage alignment tests
```

**CI Pipeline:**
```yaml
# .github/workflows/ci.yml
- name: Validate Schema Usage
  run: |
    bun run type-check
    bun run test:config-alignment
```

**Effect:** Prevents merging code that accesses non-existent config properties.

---

### 5. Documentation Generation

**Auto-Generated Docs:**
```typescript
// scripts/generateConfigDocs.ts
import { ScenarioConfigSchema } from '@/config/schema';

// Generate markdown table from Zod schema
const docs = generateMarkdownDocs(ScenarioConfigSchema);
// Outputs: docs/config-reference.md

/*
# Configuration Reference

## Financial Section

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| startingBalance | number | 10000 | Initial household balance |

## Tutorial Section

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| enabled | boolean | true | Enable tutorial tips |
*/
```

**Rationale:** Schema is single source of truth. Docs stay in sync automatically.

---

### Impact Assessment

**Before (Problem State):**
- Runtime errors from undefined config access
- Manual validation of config structure
- Schema/usage drift over time
- Debugging time wasted on trivial errors

**After (Solution State):**
- Compile-time validation catches 100% of undefined access
- Automated tests prevent schema/usage drift
- Self-documenting config structure
- Zero runtime errors from config issues

**Effort:**
- **Implementation**: M (2-3 days)
  - Schema alignment test harness
  - CI integration
  - Documentation generation
- **Maintenance**: S (negligible)
  - Auto-runs on every build
  - Schema changes automatically validated

**Value:**
- Prevents entire class of bugs
- Improves developer confidence in refactoring
- Reduces debugging time
- Aligns with "control and agency" architectural values

---

## Open Issues & Risks

### Issue 1: PlayCanvas Hot-Reload Limitations

**Description:** PlayCanvas entities (balls, tasks) may not hot-reload cleanly without full page refresh.

**Impact:** Degrades development velocity NFR.

**Mitigation:**
- Document which changes require full refresh
- Provide "Quick Reload" button in dev UI (destroys entities, re-initializes)

**Resolution Plan:** Test HMR with PlayCanvas, identify non-reloadable modules, document for team.

---

### Issue 2: Audio Timing Precision

**Description:** Web Audio API timing not frame-perfect, may cause audio drift over long sessions.

**Impact:** Minor UX degradation (audio slightly off from visuals).

**Mitigation:**
- Use `audioContext.currentTime` for scheduling (not `setTimeout`)
- Periodic re-sync audio to visual events

**Resolution Plan:** Prototype audio implementation early, validate timing accuracy.

---

### Issue 3: Browser Performance Variance

**Description:** Integrated graphics performance varies widely (Intel HD 620 vs HD 5500 vs UHD 600).

**Impact:** May not hit 60 FPS on low-end target hardware.

**Mitigation:**
- Dynamic quality settings (auto-detect GPU, reduce effects if needed)
- Explicit "Performance Mode" toggle in settings

**Resolution Plan:** Test on multiple GPUs, establish baseline (e.g., HD 620 = minimum viable).

---

## Assumptions & Constraints

### Assumptions

1. **PlayCanvas Capability:** PlayCanvas can achieve 60 FPS with 10-20 physics bodies on Intel HD 620 integrated graphics.
   - **Validation:** Prototype early, benchmark on target hardware.

2. **Config Size:** Scenario configs remain <50KB (parse time <5ms).
   - **Validation:** Monitor config size in CI, fail if >50KB.

3. **Session Length:** Players complete sessions in single sitting (15-30 mins), no mid-session save needed.
   - **Validation:** Analytics track session duration (if added).

4. **Browser LocalStorage:** localStorage available and not disabled by user settings.
   - **Validation:** Feature detection, graceful fallback to in-memory state.

5. **Single-Player Only:** MVP requires no multiplayer, networking, or backend.
   - **Validation:** PRD explicitly states single-player AI opponent.

---

### Constraints

1. **No Backend:** Client-side only architecture (no server, no database, no API).
   - **Implication:** Cannot store user data server-side, no cross-device sync.

2. **Desktop Only:** No mobile/tablet support in MVP.
   - **Implication:** Can assume mouse/keyboard input, 1280x720+ screen.

3. **Modern Browsers:** Target Chrome/Firefox/Safari/Edge (latest 2 versions).
   - **Implication:** Can use ES2020+ features, WebGL 2.0, no polyfills.

4. **Bundle Size:** Target <5MB initial bundle (including PlayCanvas).
   - **Implication:** Code splitting required if bundle grows.

5. **Development Team:** Solo developer (Jarad DeLorenzo).
   - **Implication:** Prioritize simplicity over perfectionism, leverage existing tools.

---

## Future Considerations

### Multiplayer Support

**If Added:**
- Require backend (WebSocket server for real-time sync)
- State reconciliation (handle network latency, packet loss)
- Matchmaking system (pair players by skill/preference)

**Architecture Changes:**
- Add `NetworkSystem` for client-server sync
- EntityStore becomes authoritative (server-side)
- Event-driven architecture extends to network events

**Effort:** XL (significant refactoring, new infrastructure)

---

### Mobile/Tablet Support

**If Added:**
- Touch controls (virtual joystick or swipe gestures)
- Responsive layouts (portrait/landscape)
- Performance optimization (lower poly models, reduced effects)

**Architecture Changes:**
- `InputSystem` abstracts mouse/touch input
- Adaptive quality settings (mobile = "Performance Mode" by default)
- Asset variants (low-poly models for mobile)

**Effort:** L (touch controls complex, performance tuning required)

---

### Save/Load System

**If Added:**
- Persist full game state (round number, tasks, stress, rapport)
- Cloud save (Google Drive API, Dropbox, or custom backend)
- Export/import save files as JSON

**Architecture Changes:**
- `SaveSystem` serializes EntityStore state
- ConfigLoader manages save file validation
- UI for save slots, load confirmation

**Effort:** M (serialization logic, cloud integration)

---

### Advanced Analytics

**If Added:**
- Track player behavior (task completion rates, help requests, empathy actions)
- Heatmaps (where players spend time in game space)
- Funnel analysis (where players drop off)

**Architecture Changes:**
- `AnalyticsSystem` batches events, sends to analytics service
- Event schema versioning (for long-term data compatibility)

**Effort:** S (integration with existing EventBus)

**Privacy Consideration:** Anonymize data, GDPR consent banner required.

---

## Approval & Sign-off

**Review Status:**
- [ ] Technical Lead: Jarad DeLorenzo
- [ ] Product Owner: Jarad DeLorenzo

**Notes:**
- Single-person project, approval implicit upon document completion.

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-12-25 | Jarad DeLorenzo | Initial architecture document |

---

## Next Steps

### Phase 4: Sprint Planning & Implementation

Run `/bmad:sprint-planning` to:
- Break 8 epics into 41-54 detailed user stories
- Estimate story complexity (S/M/L/XL)
- Plan 2-week sprint iterations
- Begin implementation following this architectural blueprint

**Key Implementation Principles:**
1. **Follow Layered Architecture**: Data → Systems → Presentation, no shortcuts
2. **Implement NFR Solutions**: Object pooling, config validation, schema testing
3. **Use Technology Stack**: TypeScript strict, PlayCanvas, Zod, Vite
4. **Adhere to Interfaces**: Component contracts documented in this architecture
5. **Schema-First Development**: Update schemas before adding config properties

**First Sprint Priorities:**
1. Core game loop (EPIC-001): Round system, role selection, summary screens
2. Configuration system (FR-018): Zod schemas, ConfigLoader, validation tests
3. Physics foundation (FR-014): PlayCanvas scene, ball entities, gravity mechanics

---

**This document was created using BMAD Method v6 - Phase 3 (Solutioning)**

*To continue: Run `/bmad:workflow-status` to see your progress and next recommended workflow.*

---

## Appendix A: Technology Evaluation Matrix

| Technology | Use Case | Alternatives Considered | Score (1-5) | Rationale |
|-----------|----------|------------------------|-------------|-----------|
| TypeScript | Type-safe development | JavaScript (no types), Flow | 5 | Strict typing prevents entire class of bugs |
| PlayCanvas | 3D rendering + physics | Babylon.js, Three.js + Cannon.js | 4 | Integrated physics, visual editor, good docs |
| Zod | Schema validation | JSON Schema + Ajv, Yup | 5 | Type inference, composable, excellent DX |
| Vite | Build tool | Webpack, Rollup, Parcel | 5 | Fast HMR, modern ESM, PlayCanvas compat |
| Vitest | Testing framework | Jest, Mocha + Chai | 4 | Native ESM, Vite integration, fast |
| Bun | Package manager | npm, pnpm, Yarn | 4 | Fast, modern, maturing ecosystem |
| Vercel | Hosting | Netlify, GitHub Pages | 5 | Zero-config, CDN, instant previews |

**Scoring:**
- 5 = Perfect fit, no significant downsides
- 4 = Strong fit, minor downsides acceptable
- 3 = Acceptable, trade-offs balanced
- 2 = Weak fit, significant downsides
- 1 = Poor fit, should avoid

---

## Appendix B: Capacity Planning

**Target Audience Size:** N/A (open web game, no capacity limits)

**Concurrent Players:** Each player runs independent client-side instance (no shared resources).

**Asset Storage:**
- Total assets: ~20MB (3D models, textures, audio)
- CDN bandwidth: Negligible cost (<$1/month for 1000 players)
- No database costs (client-only)

**Hosting Costs:**
- Vercel Free Tier: Adequate for MVP (<100GB bandwidth/month)
- Estimated cost at 10,000 monthly players: $0 (within free tier)
- Estimated cost at 100,000 monthly players: ~$20/month (bandwidth overage)

---

## Appendix C: Cost Estimation

**Development Costs:**
- Solo developer (Jarad DeLorenzo): N/A (personal project)

**Infrastructure Costs (Annual):**
- Hosting (Vercel): $0 (free tier) to $240/year (Pro tier if needed)
- Domain: $12/year (optional, can use vercel.app subdomain)
- Error tracking (Sentry): $0 (free tier, <5K events/month)
- Analytics (Plausible): $0 (optional, self-hosted) or $90/year (hosted)

**Total Estimated Annual Cost:** $12 - $342/year

**Scaling Costs:**
- Linear scaling with bandwidth (more players = more CDN costs)
- No database costs to scale
- No server costs (client-only)

**Break-even Analysis:** N/A (personal project, not monetized)
