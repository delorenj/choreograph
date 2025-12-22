# Architecture Document: DomesticSimulation

**Date:** 2025-12-22
**Author:** System Architect
**Version:** 1.0
**Status:** Draft
**PRD Reference:** `/home/delorenj/code/DomesticSimulation/docs/prd-domesticsimulation-2025-12-22.md`

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Architectural Drivers](#architectural-drivers)
3. [High-Level Architecture](#high-level-architecture)
4. [Technology Stack](#technology-stack)
5. [System Components](#system-components)
6. [Data Architecture](#data-architecture)
7. [NFR Solutions](#nfr-solutions)
8. [API Contracts](#api-contracts)
9. [Security & Deployment](#security--deployment)
10. [Traceability Matrix](#traceability-matrix)
11. [Trade-offs & Decisions](#trade-offs--decisions)

---

## 1. Executive Summary

DomesticSimulation is a single-player 3D web game built with PlayCanvas that simulates emotional labor dynamics through asymmetric gameplay mechanics. This architecture document defines a **layered, configuration-driven game architecture** optimized for:

- 60 FPS performance on integrated graphics
- Complete scenario configurability via JSON/YAML
- Strict TypeScript with clear separation of concerns
- Rapid iteration with hot-reload development workflow

**Architectural Style:** Layered Game Architecture with Entity-Component-System (ECS) hybrid

**Key Architectural Decisions:**
1. Four-layer separation: Config -> Data -> Systems -> Presentation
2. Configuration-first design with runtime schema validation
3. Observable game state with event-driven updates
4. PlayCanvas as rendering layer only (game logic decoupled)

---

## 2. Architectural Drivers

### 2.1 Validated Drivers

The following architectural drivers directly influence design decisions:

| ID | Driver | Priority | Rationale |
|----|--------|----------|-----------|
| **AD-001** | NFR-001: 60 FPS Performance | Must Have | Physics simulation + particle effects require optimized update loops |
| **AD-002** | NFR-002: Configuration-Driven | Must Have | All 21 FRs require parameter flexibility; designer iteration without code |
| **AD-003** | NFR-004: TypeScript Strict Mode | Should Have | Pydantic-like validation, maintainable codebase, IDE support |
| **AD-004** | NFR-005: 2-Second Hot Reload | Should Have | Game feel requires rapid iteration cycles |
| **AD-005** | FR-018: Complete Scenario Config | Should Have | JSON/YAML scenarios define all game parameters |

### 2.2 Driver Analysis

```
                    +-----------------+
                    | AD-001: 60 FPS  |
                    +--------+--------+
                             |
         +-------------------+-------------------+
         |                   |                   |
         v                   v                   v
+--------+--------+ +--------+--------+ +--------+--------+
| Fixed timestep  | | Object pooling  | | Batched render  |
| physics (60Hz)  | | for tasks/FX    | | calls           |
+-----------------+ +-----------------+ +-----------------+

                    +-----------------+
                    | AD-002: Config  |
                    +--------+--------+
                             |
         +-------------------+-------------------+
         |                   |                   |
         v                   v                   v
+--------+--------+ +--------+--------+ +--------+--------+
| JSON schema     | | Runtime loader  | | Hot reload dev  |
| validation      | | with defaults   | | file watcher    |
+-----------------+ +-----------------+ +-----------------+
```

### 2.3 Quality Attribute Scenarios

| Quality Attribute | Scenario | Response Measure |
|-------------------|----------|------------------|
| Performance | User completes task with particle effect during heavy physics | Frame time < 16.67ms (60 FPS) |
| Modifiability | Designer changes stress threshold in config | Change visible in < 2 seconds without restart |
| Testability | Developer writes unit test for StressSystem | No PlayCanvas dependencies required |
| Maintainability | New developer adds empathy action type | Change isolated to single system file |

---

## 3. High-Level Architecture

### 3.1 Layered Architecture Diagram

```
+===========================================================================+
|                           PRESENTATION LAYER                               |
|  +----------------+ +----------------+ +----------------+ +----------------+
|  | PlayCanvas     | | UI Manager     | | Audio Manager  | | Camera         |
|  | Scene Renderer | | (DOM Overlay)  | | (Web Audio)    | | Controller     |
|  +----------------+ +----------------+ +----------------+ +----------------+
|                               ^                                            |
|                               | observes                                   |
+===========================================================================+
                                |
+===========================================================================+
|                            SYSTEMS LAYER                                   |
|  +----------------+ +----------------+ +----------------+ +----------------+
|  | Round Manager  | | Task Spawn     | | Stress System  | | Rapport System |
|  | (game clock)   | | System         | | (dual meters)  | | (emoji gauge)  |
|  +----------------+ +----------------+ +----------------+ +----------------+
|  +----------------+ +----------------+ +----------------+ +----------------+
|  | Context Switch | | Empathy Modal  | | Employment     | | AI Controller  |
|  | System         | | System         | | Event System   | | (naive AI)     |
|  +----------------+ +----------------+ +----------------+ +----------------+
|                               |                                            |
|                               | mutates                                    |
+===========================================================================+
                                |
+===========================================================================+
|                             DATA LAYER                                     |
|  +----------------+ +----------------+ +----------------+ +----------------+
|  | Game State     | | Entity Store   | | Event Bus      | | State Machine  |
|  | (observable)   | | (balls, tasks) | | (pub/sub)      | | (round phases) |
|  +----------------+ +----------------+ +----------------+ +----------------+
|                               ^                                            |
|                               | hydrated from                              |
+===========================================================================+
                                |
+===========================================================================+
|                            CONFIG LAYER                                    |
|  +----------------+ +----------------+ +----------------+ +----------------+
|  | Scenario       | | Schema         | | Config Loader  | | Hot Reload     |
|  | Definitions    | | Validator      | | (JSON/YAML)    | | Watcher        |
|  +----------------+ +----------------+ +----------------+ +----------------+
+===========================================================================+
```

### 3.2 Layer Responsibilities

| Layer | Responsibility | Dependencies | Example Components |
|-------|---------------|--------------|-------------------|
| **Config** | Load, validate, and hot-reload game parameters | None | ScenarioConfig, ConfigValidator |
| **Data** | Maintain game state, entities, and event propagation | Config | GameState, EntityStore, EventBus |
| **Systems** | Execute game logic, mutate state based on rules | Data | RoundManager, StressSystem, AIController |
| **Presentation** | Render 3D scene, UI overlays, audio feedback | Systems (observe), PlayCanvas | SceneRenderer, UIManager, AudioManager |

### 3.3 Dependency Rules

1. **Strict downward dependencies only**: Presentation -> Systems -> Data -> Config
2. **No circular dependencies**: Systems cannot depend on Presentation
3. **Config is immutable at runtime**: Systems read config, never write
4. **Data layer is observable**: Systems mutate state, Presentation observes changes
5. **PlayCanvas isolated to Presentation**: Game logic has zero PlayCanvas imports

---

## 4. Technology Stack

### 4.1 Core Technologies

| Category | Technology | Version | Rationale |
|----------|------------|---------|-----------|
| **Game Engine** | PlayCanvas | ^2.4.0 | WebGL 2.0, physics, particle system, strong TypeScript support |
| **Language** | TypeScript | ^5.3.0 | Strict mode, structural typing, compile-time safety |
| **Build Tool** | Vite | ^6.0.0 | ESM-native, <100ms HMR, ES2022 target |
| **Runtime** | Modern Browsers | ES2022 | Chrome 120+, Firefox 120+, Safari 17+, Edge 120+ |
| **Config Format** | JSON (primary), YAML (optional) | RFC 8259 | Native browser support, schema validation |

### 4.2 Development Dependencies

| Category | Technology | Purpose |
|----------|------------|---------|
| **Type Checking** | TypeScript `strict: true` | Catch errors at compile time |
| **Linting** | ESLint + @typescript-eslint | Consistent code style, error prevention |
| **Formatting** | Prettier | Consistent formatting |
| **Testing** | Vitest | Fast unit testing, Vite integration |
| **Schema Validation** | Zod | Runtime type validation for configs |

### 4.3 Asset Pipeline

```
                                    +-------------+
                                    |   Vite Dev  |
                                    |   Server    |
                                    +------+------+
                                           |
                    +----------------------+----------------------+
                    |                      |                      |
                    v                      v                      v
          +---------+--------+   +---------+--------+   +---------+--------+
          |   TypeScript     |   |   JSON Configs   |   |   Static Assets  |
          |   src/**/*.ts    |   |   scenarios/*.json|  |   public/*       |
          +---------+--------+   +---------+--------+   +---------+--------+
                    |                      |                      |
                    v                      v                      v
          +---------+--------+   +---------+--------+   +---------+--------+
          |   ESBuild        |   |   JSON Loader    |   |   Asset Copy     |
          |   (transpile)    |   |   + Zod Validate |   |   (passthrough)  |
          +---------+--------+   +---------+--------+   +---------+--------+
                    |                      |                      |
                    +----------------------+----------------------+
                                           |
                                           v
                                    +------+------+
                                    |   Browser   |
                                    |   Bundle    |
                                    +-------------+
```

### 4.4 TypeScript Configuration

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "exactOptionalPropertyTypes": true,
    "noPropertyAccessFromIndexSignature": true,
    "lib": ["ES2022", "DOM"],
    "types": ["playcanvas"],
    "baseUrl": "./src",
    "paths": {
      "@config/*": ["config/*"],
      "@data/*": ["data/*"],
      "@systems/*": ["systems/*"],
      "@presentation/*": ["presentation/*"]
    }
  }
}
```

---

## 5. System Components

### 5.1 Component Overview

The architecture defines **12 core systems** organized by layer:

```
+------------------------------------------------------------------+
|                         SYSTEMS LAYER                             |
+------------------------------------------------------------------+
|  CORE SYSTEMS (4)           |  GAMEPLAY SYSTEMS (4)               |
|  - RoundManager             |  - TaskSpawnSystem                  |
|  - GameStateMachine         |  - TaskCompletionSystem             |
|  - ConfigLoader             |  - StressSystem                     |
|  - EventBus                 |  - RapportSystem                    |
+------------------------------------------------------------------+
|  INTERACTION SYSTEMS (2)    |  PRESENTATION SYSTEMS (2)           |
|  - ContextSwitchSystem      |  - AIController                     |
|  - EmpathyModalSystem       |  - EmploymentEventSystem            |
+------------------------------------------------------------------+
```

### 5.2 System Specifications

#### 5.2.1 RoundManager

**Purpose:** Controls round-based time progression (1 round = 1 week)

**Interfaces:**
```typescript
interface RoundManager {
  // State
  readonly currentRound: number;
  readonly roundTimeRemaining: number;
  readonly isPaycheckRound: boolean;
  readonly roundPhase: RoundPhase;

  // Commands
  startRound(): void;
  endRound(): void;
  pauseRound(): void;
  resumeRound(): void;

  // Events (published to EventBus)
  // 'round:start' | 'round:end' | 'round:paycheck' | 'round:tick'
}

type RoundPhase = 'IDLE' | 'PLAYING' | 'PAUSED' | 'SUMMARY';
```

**Dependencies:** ConfigLoader, EventBus, GameStateMachine

**FR Coverage:** FR-001, FR-005 (paycheck timing), FR-016 (summary trigger)

---

#### 5.2.2 TaskSpawnSystem

**Purpose:** Spawns Blue work chunks and Red household tasks

**Interfaces:**
```typescript
interface TaskSpawnSystem {
  // Blue Ball Tasks
  spawnBlueWorkChunk(): BlueTask;
  splitIntoSubtasks(chunk: BlueTask): BlueSubtask[];
  triggerScopeCreep(completedChunk: BlueTask): BlueTask[];

  // Red Ball Tasks
  spawnRedTask(): RedTask;

  // Configuration
  readonly blueSpawnRate: number;  // from config
  readonly redSpawnRate: number;   // from config
}

interface BlueTask {
  id: string;
  subtasks: BlueSubtask[];
  isVisible: boolean;  // false by default (invisible to Red)
  completionProgress: number;
  scopeCreepProbability: number;
}

interface BlueSubtask {
  id: string;
  parentId: string;
  completionTime: number;  // log-distributed
  isComplete: boolean;
}

interface RedTask {
  id: string;
  type: 'cleaning' | 'cooking' | 'childcare' | 'errands';
  position: Vector3;
  completionTime: number;
  isComplete: boolean;
}
```

**Dependencies:** ConfigLoader, EntityStore, EventBus

**FR Coverage:** FR-003, FR-006

---

#### 5.2.3 StressSystem

**Purpose:** Manages asymmetric stress mechanics for Blue and Red balls

**Interfaces:**
```typescript
interface StressSystem {
  // Stress Levels (0-200%, can overflow)
  getBlueStress(): number;
  getRedStress(): number;

  // Stress Mutations
  addBlueStress(amount: number, source: BlueStressSource): void;
  addRedStress(amount: number, source: RedStressSource): void;
  reduceRedStress(amount: number): void;

  // Debuff Calculation
  getBlueDebuffs(): BlueDebuffs;
  getRedDebuffs(): RedDebuffs;

  // Weeping State
  isBlueWeeping(): boolean;  // stress >= 90%
}

type BlueStressSource =
  | 'INCOMPLETE_TASK'      // +10% per task
  | 'HELPED_RED'           // +5% per Red task completed
  | 'RAPPORT_DECAY'        // +15% per level lost
  | 'SUSTAINED_RED_STRESS'; // from Red's high stress debuff

type RedStressSource =
  | 'INCOMPLETE_TASK';     // +8% per task

interface BlueDebuffs {
  taskCompletionMultiplier: number;  // 1.0 = normal, 0.9 = 10% slower per 10% overflow
  taskRegrowthMultiplier: number;    // 1.0 = normal, 1.5 = 50% faster regrowth
}
```

**Dependencies:** EntityStore, EventBus, ConfigLoader

**FR Coverage:** FR-010, FR-011

---

#### 5.2.4 RapportSystem

**Purpose:** Tracks Blue's employment rapport as ambiguous emoji gauge

**Interfaces:**
```typescript
interface RapportSystem {
  // Rapport Level (internal 0-100, displayed as emoji)
  readonly rapportLevel: number;
  readonly rapportEmoji: RapportEmoji;

  // Rapport Changes
  decreaseRapport(missedDeadlines: number): void;
  increaseRapport(successfulRound: boolean): void;

  // Firing Logic
  checkFiring(): FiringResult;
}

type RapportEmoji = 'cry' | 'frown' | 'neutral' | 'smile' | 'happy';
// Ranges: 0-20, 20-40, 40-60, 60-80, 80-100

interface FiringResult {
  isFired: boolean;
  wasRandomized: boolean;  // firing threshold randomized 15-25%
}
```

**Dependencies:** EventBus, ConfigLoader

**FR Coverage:** FR-004

---

#### 5.2.5 ContextSwitchSystem

**Purpose:** Implements Blue task regrowth when context-switching to Red tasks

**Interfaces:**
```typescript
interface ContextSwitchSystem {
  // Active Task Tracking
  setActiveTask(task: BlueTask | RedTask | null): void;
  getActiveTask(): BlueTask | RedTask | null;

  // Context Switch Detection
  isInContextSwitch(): boolean;
  getRegrowingTasks(): BlueTask[];

  // Regrowth Calculation
  applyRegrowth(deltaTime: number): void;
}
```

**Dependencies:** EntityStore, StressSystem (for debuff multipliers)

**FR Coverage:** FR-009

---

#### 5.2.6 EmpathyModalSystem

**Purpose:** Displays periodic empathy action modals with educational content

**Interfaces:**
```typescript
interface EmpathyModalSystem {
  // Modal State
  isModalVisible(): boolean;
  getCurrentAction(): EmpathyAction | null;

  // Modal Control
  showModal(): void;
  dismissModal(actionTaken: boolean): void;

  // Action Library
  getRandomAction(): EmpathyAction;
}

interface EmpathyAction {
  id: string;
  category: 'physical' | 'verbal' | 'service';
  animationUrl: string;  // 2-3 second loop
  description: string;
  stressReduction: number;  // 25-40%
}
```

**Dependencies:** StressSystem, RoundManager (pauses game)

**FR Coverage:** FR-012

---

#### 5.2.7 EmploymentEventSystem

**Purpose:** Manages mid-game Red employment event (rounds 3-5)

**Interfaces:**
```typescript
interface EmploymentEventSystem {
  // Event State
  hasEventTriggered(): boolean;
  getRedIncome(): number;  // $400/round after event

  // Blue Debuffs from Event
  getWorkTimeMultiplier(): number;  // 0.55 after event (45% reduction)

  // Event Trigger
  checkEventTrigger(currentRound: number): boolean;
  triggerEvent(): void;
}
```

**Dependencies:** RoundManager, ConfigLoader, EventBus

**FR Coverage:** FR-013

---

#### 5.2.8 AIController

**Purpose:** Controls non-player ball with naive deterministic AI

**Interfaces:**
```typescript
interface AIController {
  // AI Role
  readonly controlledBall: 'BLUE' | 'RED';

  // Decision Making
  update(deltaTime: number): AIAction;

  // Behavior Parameters
  readonly helpRequestThreshold: number;    // Red: 75% stress
  readonly taskRefusalThreshold: number;    // Red: 60% stress
  readonly empathyActionProbability: number; // Red: 10%
}

type AIAction =
  | { type: 'MOVE_TO_TASK'; taskId: string }
  | { type: 'COMPLETE_TASK'; taskId: string }
  | { type: 'REQUEST_HELP' }
  | { type: 'REFUSE_TASK'; taskId: string }
  | { type: 'END_ROUND' }
  | { type: 'IDLE' };
```

**Dependencies:** EntityStore, StressSystem, RapportSystem

**FR Coverage:** FR-002, FR-007

---

#### 5.2.9 TaskCompletionSystem

**Purpose:** Handles button-hold task completion with audio/visual feedback

**Interfaces:**
```typescript
interface TaskCompletionSystem {
  // Task Interaction
  startTaskCompletion(taskId: string): void;
  cancelTaskCompletion(): void;

  // Progress Tracking
  getCompletionProgress(taskId: string): number;  // 0-1
  isTaskActive(): boolean;

  // Events
  // 'task:progress' | 'task:complete' | 'task:cancel'
}
```

**Dependencies:** EntityStore, AudioManager, EventBus

**FR Coverage:** FR-008

---

#### 5.2.10 GameStateMachine

**Purpose:** Manages overall game state transitions

**Interfaces:**
```typescript
interface GameStateMachine {
  readonly currentState: GameState;
  transition(event: GameEvent): void;
}

type GameState =
  | 'LOADING'
  | 'SCENARIO_SELECT'
  | 'ROLE_SELECT'
  | 'PLAYING'
  | 'PAUSED'
  | 'EMPATHY_MODAL'
  | 'ROUND_SUMMARY'
  | 'GAME_OVER'
  | 'VICTORY';

type GameEvent =
  | 'LOAD_COMPLETE'
  | 'SCENARIO_SELECTED'
  | 'ROLE_SELECTED'
  | 'PAUSE'
  | 'RESUME'
  | 'SHOW_EMPATHY'
  | 'DISMISS_EMPATHY'
  | 'ROUND_END'
  | 'CONTINUE'
  | 'FIRED'
  | 'RESTART';
```

**Dependencies:** EventBus

**FR Coverage:** FR-001, FR-002, FR-016, FR-019

---

#### 5.2.11 ConfigLoader

**Purpose:** Loads and validates scenario configurations

**Interfaces:**
```typescript
interface ConfigLoader {
  // Loading
  loadScenario(scenarioId: string): Promise<ScenarioConfig>;
  reloadConfig(): Promise<void>;  // hot reload

  // Validation
  validateConfig(config: unknown): ValidationResult;

  // Active Config
  readonly activeConfig: ScenarioConfig;
}
```

**Dependencies:** Zod schemas

**FR Coverage:** FR-018, FR-019

---

#### 5.2.12 EventBus

**Purpose:** Pub/sub event system for decoupled communication

**Interfaces:**
```typescript
interface EventBus {
  emit<T extends GameEventType>(event: T, payload: GameEventPayload[T]): void;
  on<T extends GameEventType>(event: T, handler: (payload: GameEventPayload[T]) => void): Unsubscribe;
  off<T extends GameEventType>(event: T, handler: Function): void;
}

type GameEventType =
  | 'round:start'
  | 'round:end'
  | 'round:tick'
  | 'task:spawned'
  | 'task:complete'
  | 'task:progress'
  | 'stress:changed'
  | 'rapport:changed'
  | 'empathy:shown'
  | 'empathy:dismissed'
  | 'employment:event'
  | 'game:fired'
  | 'game:stateChanged';

type Unsubscribe = () => void;
```

**Dependencies:** None (core infrastructure)

---

### 5.3 Component Diagram

```
                                +------------------+
                                |   ConfigLoader   |
                                +--------+---------+
                                         |
                                         | provides config
                                         v
+------------------+           +------------------+           +------------------+
|   EventBus       |<--------->|   GameState      |<--------->|   EntityStore    |
| (pub/sub infra)  |           |   Machine        |           | (balls, tasks)   |
+--------+---------+           +--------+---------+           +--------+---------+
         |                              |                              |
         |  events                      |  state                       |  entities
         |                              |                              |
         v                              v                              v
+--------+---------+           +--------+---------+           +--------+---------+
|   RoundManager   |<--------->|   StressSystem   |<--------->|   TaskSpawn      |
|                  |           |                  |           |   System         |
+--------+---------+           +--------+---------+           +--------+---------+
         |                              |                              |
         |                              |                              |
         v                              v                              v
+--------+---------+           +--------+---------+           +--------+---------+
|   ContextSwitch  |           |   RapportSystem  |           |   TaskComplete   |
|   System         |           |                  |           |   System         |
+--------+---------+           +--------+---------+           +--------+---------+
         |                              |                              |
         +------------------------------+------------------------------+
                                        |
                                        v
+------------------+           +--------+---------+           +------------------+
|   EmpathyModal   |           |   Employment     |           |   AIController   |
|   System         |           |   EventSystem    |           |                  |
+------------------+           +------------------+           +------------------+
```

---

## 6. Data Architecture

### 6.1 Entity Model

```typescript
// =============================================================================
// CORE ENTITIES
// =============================================================================

interface Ball {
  id: 'blue' | 'red';
  position: Vector3;
  velocity: Vector3;
  stress: number;           // 0-200+ (can overflow)
  isPlayerControlled: boolean;
  isWeeping: boolean;       // derived from stress >= 90%
}

interface BlueBall extends Ball {
  id: 'blue';
  rapport: number;          // 0-100 (internal, displayed as emoji)
  isEmployed: boolean;
  activeBlueTask: string | null;
}

interface RedBall extends Ball {
  id: 'red';
  hasJob: boolean;          // after employment event
  income: number;           // $400/round after event
  activeRedTask: string | null;
}

// =============================================================================
// TASK ENTITIES
// =============================================================================

interface Task {
  id: string;
  position: Vector3;
  completionProgress: number;  // 0-1
  completionTime: number;      // base time in seconds
  isComplete: boolean;
  isVisible: boolean;
  createdAtRound: number;
}

interface BlueTask extends Task {
  type: 'work';
  subtasks: BlueSubtask[];
  scopeCreepProbability: number;  // 0.1-0.2
  isRegressing: boolean;          // context switch regrowth
  regressionRate: number;         // 0.3 = 30%
}

interface BlueSubtask {
  id: string;
  parentTaskId: string;
  completionTime: number;  // log-distributed (most quick, some long)
  isComplete: boolean;
}

interface RedTask extends Task {
  type: 'cleaning' | 'cooking' | 'childcare' | 'errands';
  visualStyle: TaskVisualStyle;
}

interface TaskVisualStyle {
  color: Color;
  shape: 'splatter' | 'blob' | 'pile';
  scale: number;
}

// =============================================================================
// ROUND & TIME ENTITIES
// =============================================================================

interface Round {
  number: number;
  startTime: number;
  duration: number;            // config-driven
  remainingTime: number;
  isPaycheckRound: boolean;    // even-numbered rounds
  phase: RoundPhase;
}

type RoundPhase = 'IDLE' | 'PLAYING' | 'PAUSED' | 'SUMMARY';

interface RoundSummary {
  roundNumber: number;
  blueTasksCompleted: number;
  blueTasksTotal: number;
  redTasksCompleted: number;
  redTasksTotal: number;
  blueStressChange: number;
  redStressChange: number;
  rapportChange: number;
  incomeReceived: number;
  runningBalance: number;
}

// =============================================================================
// FINANCIAL ENTITIES
// =============================================================================

interface FinancialState {
  balance: number;
  totalEarned: number;
  bluePaycheck: number;        // $6,250 every 2 rounds
  redIncome: number;           // $400/round after event
  expenses: number;            // hidden, causes deficit
}

// =============================================================================
// EMPATHY ENTITIES
// =============================================================================

interface EmpathyAction {
  id: string;
  category: 'physical' | 'verbal' | 'service';
  name: string;
  description: string;
  animationUrl: string;
  stressReduction: number;     // 25-40%
}
```

### 6.2 Game State Structure

```typescript
interface GameState {
  // Core State
  currentRound: Round;
  playerRole: 'blue' | 'red';
  gamePhase: GamePhase;

  // Entities
  blueBall: BlueBall;
  redBall: RedBall;
  blueTasks: Map<string, BlueTask>;
  redTasks: Map<string, RedTask>;

  // Systems State
  financialState: FinancialState;
  employmentEventTriggered: boolean;
  roundsSinceHighRedStress: number;  // for Blue debuff calculation

  // UI State
  activeModal: ModalType | null;
  selectedEmpathyAction: EmpathyAction | null;
  tutorialState: TutorialState;
}

type GamePhase =
  | 'LOADING'
  | 'SCENARIO_SELECT'
  | 'ROLE_SELECT'
  | 'PLAYING'
  | 'PAUSED'
  | 'EMPATHY_MODAL'
  | 'ROUND_SUMMARY'
  | 'GAME_OVER';

type ModalType = 'empathy' | 'tutorial' | 'summary' | 'employment_event';

interface TutorialState {
  hasSeenFirstTask: boolean;
  hasSeenFirstHelpRequest: boolean;
  hasSeenFirstDebuff: boolean;
  tutorialEnabled: boolean;
}
```

### 6.3 Configuration Schema

```typescript
// =============================================================================
// SCENARIO CONFIGURATION
// =============================================================================

interface ScenarioConfig {
  id: string;
  name: string;
  description: string;
  difficulty: 1 | 2 | 3 | 4 | 5;

  // Round Settings
  round: RoundConfig;

  // Blue Ball Settings
  blue: BlueBallConfig;

  // Red Ball Settings
  red: RedBallConfig;

  // Stress Settings
  stress: StressConfig;

  // Employment Event
  employmentEvent: EmploymentEventConfig;

  // UI Visibility
  ui: UIConfig;
}

interface RoundConfig {
  durationSeconds: number;      // default: 120
  paycheckInterval: number;     // default: 2 (every 2 rounds)
}

interface BlueBallConfig {
  workSpawnRate: number;        // chunks per round start (default: 3-5)
  subtasksPerChunk: {
    min: number;                // default: 4
    max: number;                // default: 12
  };
  scopeCreepProbability: {
    min: number;                // default: 0.1
    max: number;                // default: 0.2
  };
  scopeCreepChunks: {
    min: number;                // default: 2
    max: number;                // default: 5
  };
  paycheck: number;             // default: 6250
  contextSwitchRegrowth: number; // default: 0.3 (30%)
  workVisibility: boolean;      // default: false (invisible to Red)
}

interface RedBallConfig {
  taskSpawnInterval: {
    min: number;                // default: 30 seconds
    max: number;                // default: 45 seconds
  };
  taskTypes: Array<{
    type: 'cleaning' | 'cooking' | 'childcare' | 'errands';
    weight: number;             // spawn probability weight
    completionTime: number;     // base time in seconds
  }>;
}

interface StressConfig {
  blue: {
    incompleteTaskPenalty: number;    // default: 10%
    helpedRedPenalty: number;         // default: 5%
    rapportDecayPenalty: number;      // default: 15%
    overflowDebuffRate: number;       // default: 0.1 (10% slower per 10% overflow)
    weepingThreshold: number;         // default: 90%
  };
  red: {
    incompleteTaskPenalty: number;    // default: 8%
    taskCompletionReduction: number;  // default: 10%
    blueHelpReduction: number;        // default: 15%
    highStressThreshold: number;      // default: 75%
    sustainedStressRounds: number;    // default: 3
    blueDebuffCompletionMultiplier: number;  // default: 0.7 (30% slower)
    blueDebuffRegrowthMultiplier: number;    // default: 1.5 (50% faster)
  };
}

interface EmploymentEventConfig {
  triggerRound: {
    min: number;                // default: 3
    max: number;                // default: 5
  };
  redIncome: number;            // default: 400
  blueWorkTimeReduction: number; // default: 0.45 (45%)
  enabled: boolean;             // default: true
}

interface RapportConfig {
  initialLevel: number;         // default: 75
  successBonus: number;         // default: 5
  missedDeadlinePenalty: number; // default: 10
  compoundMultiplier: number;   // default: 1.5 (compounds with consecutive misses)
  firingThreshold: {
    min: number;                // default: 15
    max: number;                // default: 25
  };
}

interface UIConfig {
  showBlueStressMeter: boolean;
  showRedStressMeter: boolean;
  showRapportGauge: boolean;
  showBalance: boolean;
  showRoundTimer: boolean;
  empathyModalInterval: number;  // default: 30 seconds
}
```

### 6.4 State Flow Diagram

```
+-------------------+
|    GAME START     |
+--------+----------+
         |
         v
+--------+----------+
|  SCENARIO SELECT  |<------------------+
+--------+----------+                   |
         |                              |
         v                              |
+--------+----------+                   |
|   ROLE SELECT     |                   |
+--------+----------+                   |
         |                              |
         v                              |
+--------+----------+     +---------+   |
|   ROUND PLAYING   |<--->|  PAUSED |   |
+--------+----------+     +---------+   |
         |                              |
    +----+----+                         |
    |         |                         |
    v         v                         |
+---+---+ +---+----+                    |
|EMPATHY| |ROUND   |                    |
|MODAL  | |SUMMARY |                    |
+---+---+ +---+----+                    |
    |         |                         |
    +----+----+                         |
         |                              |
    +----+----+                         |
    |         |                         |
    v         v                         |
+---+---+ +---+----+                    |
|CONTINUE| |RESTART|--------------------+
+---+---+ +--------+
    |
    v
+---+----+
|GAME    |
|OVER    |
|(fired) |
+--------+
```

---

## 7. NFR Solutions

### 7.1 NFR-001: 60 FPS Performance

**Requirement:** Maintain 60 FPS on Intel HD 620 integrated graphics

**Solution Architecture:**

```
+------------------------------------------------------------------+
|                    PERFORMANCE STRATEGY                           |
+------------------------------------------------------------------+

1. FIXED TIMESTEP PHYSICS (60Hz)
   +------------------+
   | Physics Loop     |  <- Fixed 16.67ms timestep
   | - Ball movement  |  <- Decoupled from render
   | - Collisions     |
   +------------------+

2. OBJECT POOLING
   +------------------+
   | Task Pool        |  <- Pre-allocated 50 tasks
   | Particle Pool    |  <- Pre-allocated 200 particles
   | Audio Pool       |  <- Pre-allocated 20 audio sources
   +------------------+

3. BATCHED RENDERING
   +------------------+
   | Static Batching  |  <- Floor, walls (never move)
   | Dynamic Batching |  <- Tasks (same material)
   | Instanced Render |  <- Particles (GPU instanced)
   +------------------+

4. LEVEL OF DETAIL
   +------------------+
   | LOD 0: Near      |  <- Full geometry
   | LOD 1: Medium    |  <- Simplified (not needed for MVP)
   | LOD 2: Far       |  <- Billboard (not needed for MVP)
   +------------------+
```

**Implementation Details:**

| Technique | Implementation | Impact |
|-----------|---------------|--------|
| Fixed timestep | `accumulator += deltaTime; while(accumulator >= FIXED_DT)` | Stable physics at 60Hz |
| Object pooling | Pre-allocate task entities, reuse on spawn/despawn | Zero allocation during gameplay |
| Render batching | PlayCanvas static/dynamic batch components | Reduced draw calls (target: <50) |
| Efficient updates | Dirty flag pattern, only update changed entities | Avoid unnecessary recalculations |
| Minimal overdraw | Single ambient light, no shadows (MVP) | GPU fill rate preservation |

**Performance Budget:**

| Category | Budget | Measurement |
|----------|--------|-------------|
| Frame time | 16.67ms max | `performance.now()` frame delta |
| Draw calls | <50 per frame | PlayCanvas profiler |
| JavaScript | <8ms per frame | Leaves 8ms for rendering |
| Physics | <2ms per frame | Fixed timestep accumulator |
| System updates | <4ms per frame | All game systems combined |

---

### 7.2 NFR-002: Configuration-Driven Modularity

**Requirement:** All game parameters in external JSON/YAML, no hardcoded values

**Solution Architecture:**

```
scenarios/
  baseline.json          <- Default scenario
  red-gets-job.json      <- Employment event enabled
  both-working.json      <- Future scenario
  single-parent.json     <- Future scenario

src/
  config/
    schema.ts            <- Zod validation schemas
    loader.ts            <- Async config loading
    defaults.ts          <- Default values (fallback)
    watcher.ts           <- Hot reload (dev mode)
```

**Config Loading Flow:**

```
+----------------+     +----------------+     +----------------+
|  JSON File     | --> |  Zod Validate  | --> |  Merge with    |
|  (scenarios/)  |     |  (schema.ts)   |     |  Defaults      |
+----------------+     +----------------+     +-------+--------+
                                                      |
                                                      v
+----------------+     +----------------+     +-------+--------+
|  Active Config | <-- |  Freeze Object | <-- |  Type-safe     |
|  (readonly)    |     |  (immutable)   |     |  ScenarioConfig|
+----------------+     +----------------+     +----------------+
```

**Validation with Zod:**

```typescript
import { z } from 'zod';

const RoundConfigSchema = z.object({
  durationSeconds: z.number().min(30).max(600).default(120),
  paycheckInterval: z.number().min(1).max(10).default(2),
});

const ScenarioConfigSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string(),
  difficulty: z.number().int().min(1).max(5),
  round: RoundConfigSchema,
  // ... rest of schema
});

export type ScenarioConfig = z.infer<typeof ScenarioConfigSchema>;
```

---

### 7.3 NFR-003: Browser Compatibility

**Requirement:** Chrome 120+, Firefox 120+, Safari 17+, Edge 120+

**Solution:**

| Concern | Solution |
|---------|----------|
| JavaScript | ES2022 target (supported by all target browsers) |
| WebGL | WebGL 2.0 with fallback detection |
| Audio | Web Audio API (universal support) |
| Modules | ES Modules (native support) |
| Polyfills | None required for target browsers |

**Feature Detection:**

```typescript
function checkBrowserSupport(): BrowserSupport {
  return {
    webgl2: !!document.createElement('canvas').getContext('webgl2'),
    webAudio: 'AudioContext' in window || 'webkitAudioContext' in window,
    esModules: 'noModule' in HTMLScriptElement.prototype,
    minWidth: window.innerWidth >= 1280,
    minHeight: window.innerHeight >= 720,
  };
}
```

---

### 7.4 NFR-004: TypeScript Strict Mode Architecture

**Requirement:** Strict typing with clear separation of concerns

**Solution:**

**Directory Structure:**

```
src/
  config/                    <- CONFIG LAYER
    schema.ts                <- Zod schemas
    loader.ts                <- Config loading
    defaults.ts              <- Default values
    types.ts                 <- Config type exports

  data/                      <- DATA LAYER
    entities/
      ball.ts                <- Ball entity types
      task.ts                <- Task entity types
      round.ts               <- Round entity types
    state/
      gameState.ts           <- Game state interface
      entityStore.ts         <- Entity storage
    events/
      eventBus.ts            <- Pub/sub infrastructure
      eventTypes.ts          <- Event type definitions

  systems/                   <- SYSTEMS LAYER
    core/
      roundManager.ts        <- Round lifecycle
      gameStateMachine.ts    <- State transitions
    gameplay/
      taskSpawnSystem.ts     <- Task spawning
      taskCompletionSystem.ts <- Task completion
      stressSystem.ts        <- Stress calculations
      rapportSystem.ts       <- Rapport tracking
    interaction/
      contextSwitchSystem.ts <- Context switching
      empathyModalSystem.ts  <- Empathy modals
    ai/
      aiController.ts        <- Naive AI

  presentation/              <- PRESENTATION LAYER
    renderer/
      sceneRenderer.ts       <- PlayCanvas scene
      entityRenderer.ts      <- Entity visuals
    ui/
      uiManager.ts           <- DOM UI overlay
      components/
        stressMeter.ts
        rapportGauge.ts
        roundTimer.ts
        modalOverlay.ts
    audio/
      audioManager.ts        <- Web Audio management

  main.ts                    <- Entry point (composition root)
```

**Import Rules (enforced by ESLint):**

```typescript
// VALID: Presentation imports from Systems
import { StressSystem } from '@systems/gameplay/stressSystem';

// VALID: Systems imports from Data
import { GameState } from '@data/state/gameState';

// VALID: Data imports from Config
import { ScenarioConfig } from '@config/types';

// INVALID: Systems imports from Presentation
import { UIManager } from '@presentation/ui/uiManager'; // ERROR

// INVALID: Data imports from Systems
import { RoundManager } from '@systems/core/roundManager'; // ERROR
```

---

### 7.5 NFR-005: 2-Second Hot Reload

**Requirement:** Changes visible in <2 seconds during development

**Solution:**

**Vite HMR Configuration:**

```typescript
// vite.config.ts
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3000,
    open: true,
    hmr: {
      overlay: true,
    },
  },
  build: {
    target: 'esnext',
    minify: 'terser',
  },
  optimizeDeps: {
    include: ['playcanvas'],
  },
});
```

**Config Hot Reload:**

```typescript
// src/config/watcher.ts
if (import.meta.hot) {
  import.meta.hot.accept('./scenarios/baseline.json', (newModule) => {
    configLoader.reloadConfig(newModule);
  });
}
```

**HMR Boundaries:**

| Module Type | HMR Strategy |
|-------------|--------------|
| Config files | Full config reload, preserve game state |
| System files | Full page reload (state machines) |
| Presentation | Component-level HMR (UI/audio) |
| Entity files | Type-only, no runtime effect |

---

## 8. API Contracts

### 8.1 Internal System APIs

All systems communicate through the EventBus with typed events:

```typescript
// =============================================================================
// EVENT CONTRACTS
// =============================================================================

interface GameEventPayloads {
  // Round Events
  'round:start': { roundNumber: number; isPaycheckRound: boolean };
  'round:end': { roundNumber: number; summary: RoundSummary };
  'round:tick': { remainingTime: number; elapsedTime: number };
  'round:paycheck': { amount: number; balance: number };

  // Task Events
  'task:spawned': { task: BlueTask | RedTask };
  'task:progress': { taskId: string; progress: number };
  'task:complete': { taskId: string; completedBy: 'blue' | 'red' };
  'task:regressing': { taskId: string; regressionRate: number };

  // Stress Events
  'stress:changed': {
    ball: 'blue' | 'red';
    previousLevel: number;
    newLevel: number;
    source: string;
  };
  'stress:weeping': { ball: 'blue' | 'red'; isWeeping: boolean };
  'stress:debuff': { ball: 'blue' | 'red'; debuffs: BlueDebuffs | RedDebuffs };

  // Rapport Events
  'rapport:changed': {
    previousLevel: number;
    newLevel: number;
    emoji: RapportEmoji;
  };
  'rapport:firing': { wasRandomized: boolean };

  // Empathy Events
  'empathy:shown': { action: EmpathyAction };
  'empathy:dismissed': { actionTaken: boolean; stressReduction: number };

  // Employment Events
  'employment:event': { redIncome: number; blueWorkTimeReduction: number };

  // Game State Events
  'game:stateChanged': { previousState: GamePhase; newState: GamePhase };
  'game:fired': { finalRapport: number };
  'game:restart': {};
}
```

### 8.2 Configuration API

```typescript
// =============================================================================
// CONFIG LOADER API
// =============================================================================

interface ConfigLoaderAPI {
  /**
   * Load a scenario configuration by ID
   * @param scenarioId - Scenario identifier (e.g., 'baseline', 'red-gets-job')
   * @returns Validated and frozen ScenarioConfig
   * @throws ConfigValidationError if config is invalid
   */
  loadScenario(scenarioId: string): Promise<ScenarioConfig>;

  /**
   * Get list of available scenarios
   * @returns Array of scenario metadata
   */
  listScenarios(): Promise<ScenarioMetadata[]>;

  /**
   * Hot reload current config (dev mode only)
   * @returns Updated config
   */
  reloadConfig(): Promise<ScenarioConfig>;

  /**
   * Get currently active configuration
   */
  readonly activeConfig: Readonly<ScenarioConfig>;
}

interface ScenarioMetadata {
  id: string;
  name: string;
  description: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
}
```

### 8.3 Presentation Layer API

```typescript
// =============================================================================
// SCENE RENDERER API
// =============================================================================

interface SceneRendererAPI {
  /**
   * Initialize PlayCanvas application
   */
  initialize(canvas: HTMLCanvasElement): Promise<void>;

  /**
   * Spawn visual entity for ball
   */
  spawnBall(ball: Ball): pc.Entity;

  /**
   * Spawn visual entity for task
   */
  spawnTask(task: BlueTask | RedTask): pc.Entity;

  /**
   * Update entity visual state
   */
  updateEntity(entityId: string, state: Partial<EntityVisualState>): void;

  /**
   * Destroy entity visual
   */
  destroyEntity(entityId: string): void;

  /**
   * Trigger particle effect at position
   */
  spawnParticles(position: Vector3, effectType: ParticleEffectType): void;
}

interface EntityVisualState {
  position: Vector3;
  scale: Vector3;
  color: Color;
  emissive: Color;
  isWeeping: boolean;
  completionProgress: number;
}

type ParticleEffectType =
  | 'task_complete'
  | 'stress_increase'
  | 'empathy_action';
```

---

## 9. Security & Deployment

### 9.1 Security Model

DomesticSimulation is a **client-side only** application with no backend services. Security considerations are minimal but include:

| Concern | Mitigation |
|---------|-----------|
| XSS | No user-generated content, CSP headers |
| Config tampering | Client-side validation (non-critical, single-player) |
| Code injection | No `eval()`, strict TypeScript, bundled output |
| Asset integrity | SRI hashes for CDN assets (if applicable) |

**Content Security Policy:**

```html
<meta http-equiv="Content-Security-Policy"
      content="default-src 'self';
               script-src 'self';
               style-src 'self' 'unsafe-inline';
               img-src 'self' data:;
               connect-src 'self';">
```

### 9.2 Deployment Architecture

```
+------------------------------------------------------------------+
|                    STATIC HOSTING (CDN)                           |
+------------------------------------------------------------------+
|                                                                   |
|  +-------------------+  +-------------------+  +-----------------+|
|  |  index.html       |  |  assets/          |  |  scenarios/     ||
|  |  (entry point)    |  |  - audio/         |  |  - baseline.json||
|  +-------------------+  |  - textures/      |  |  - *.json       ||
|                         |  - models/        |  +-----------------+|
|  +-------------------+  +-------------------+                     |
|  |  dist/            |                                            |
|  |  - main.js        |  Build Output                              |
|  |  - main.css       |  (Vite production build)                   |
|  |  - vendor.js      |                                            |
|  +-------------------+                                            |
|                                                                   |
+------------------------------------------------------------------+
```

**Hosting Options:**

| Option | Cost | CDN | Custom Domain | Recommended |
|--------|------|-----|---------------|-------------|
| GitHub Pages | Free | Yes (via Cloudflare) | Yes | MVP |
| Netlify | Free tier | Yes | Yes | Production |
| Vercel | Free tier | Yes | Yes | Production |
| AWS S3 + CloudFront | ~$1/month | Yes | Yes | Scale |

### 9.3 Build Pipeline

```
+------------------+     +------------------+     +------------------+
|   Source Code    | --> |   Vite Build     | --> |   dist/          |
|   (TypeScript)   |     |   (production)   |     |   (static files) |
+------------------+     +------------------+     +------------------+
                                 |
                    +------------+------------+
                    |            |            |
                    v            v            v
              +-----+----+ +-----+----+ +-----+----+
              | Minify   | | Tree     | | Code     |
              | (Terser) | | Shake    | | Split    |
              +----------+ +----------+ +----------+
```

**Build Commands:**

```bash
# Development
npm run dev          # Start Vite dev server with HMR

# Production
npm run build        # Generate production bundle
npm run preview      # Preview production build locally

# Quality
npm run lint         # ESLint check
npm run typecheck    # TypeScript check
npm run test         # Vitest unit tests
```

---

## 10. Traceability Matrix

### 10.1 Functional Requirements to Components

| FR ID | Description | Primary Component(s) | Secondary Component(s) |
|-------|-------------|---------------------|------------------------|
| FR-001 | Round-Based Time System | RoundManager | GameStateMachine, EventBus |
| FR-002 | Player Role Selection | GameStateMachine | UIManager, AIController |
| FR-003 | Blue Work Generation | TaskSpawnSystem | EntityStore, ConfigLoader |
| FR-004 | Employment Rapport System | RapportSystem | EventBus, UIManager |
| FR-005 | Paycheck System | RoundManager | FinancialState, UIManager |
| FR-006 | Red Task Spawning | TaskSpawnSystem | EntityStore, ConfigLoader |
| FR-007 | Red Task Behavior | AIController | StressSystem, EntityStore |
| FR-008 | Task Completion Interaction | TaskCompletionSystem | AudioManager, SceneRenderer |
| FR-009 | Context Switching Penalty | ContextSwitchSystem | StressSystem, EntityStore |
| FR-010 | Blue Stress Mechanics | StressSystem | EventBus, UIManager |
| FR-011 | Red Stress Mechanics | StressSystem | EventBus, UIManager |
| FR-012 | Empathy Action System | EmpathyModalSystem | StressSystem, UIManager |
| FR-013 | Red Employment Event | EmploymentEventSystem | RoundManager, ConfigLoader |
| FR-014 | 3D Physics-Based Movement | SceneRenderer | PlayCanvas Physics |
| FR-015 | Fixed Isometric Camera | SceneRenderer | CameraController |
| FR-016 | End-of-Round Summary Screen | UIManager | RoundManager, GameStateMachine |
| FR-017 | Tutorial/Tip Modals | UIManager | TutorialState, ConfigLoader |
| FR-018 | Scenario Configuration System | ConfigLoader | All Systems |
| FR-019 | Scenario Selection Screen | UIManager | ConfigLoader, GameStateMachine |
| FR-020 | Audio Feedback System | AudioManager | EventBus, StressSystem |
| FR-021 | Visual Polish | SceneRenderer | ParticleSystem, PostProcessing |

### 10.2 Non-Functional Requirements to Solutions

| NFR ID | Description | Architectural Solution | Verification |
|--------|-------------|----------------------|--------------|
| NFR-001 | 60 FPS Performance | Fixed timestep, object pooling, batching | Frame time profiling |
| NFR-002 | Configuration-Driven | Zod schemas, JSON configs, hot reload | Config change test |
| NFR-003 | Browser Compatibility | ES2022 target, WebGL 2.0, feature detection | Cross-browser test |
| NFR-004 | TypeScript Strict Mode | `strict: true`, layered architecture, ESLint | Type check, lint |
| NFR-005 | 2-Second Hot Reload | Vite HMR, config watcher | Dev iteration timing |

### 10.3 Epic to Component Mapping

| Epic | Components |
|------|-----------|
| EPIC-001: Core Game Loop | RoundManager, GameStateMachine, UIManager (Summary) |
| EPIC-002: Blue Employment | TaskSpawnSystem (Blue), RapportSystem, ContextSwitchSystem |
| EPIC-003: Red Household | TaskSpawnSystem (Red), AIController |
| EPIC-004: Task Interaction | TaskCompletionSystem, SceneRenderer, AudioManager |
| EPIC-005: Stress System | StressSystem, EmpathyModalSystem |
| EPIC-006: Red's Job Event | EmploymentEventSystem |
| EPIC-007: Camera & Visual | SceneRenderer, CameraController, AudioManager |
| EPIC-008: Config & Tutorial | ConfigLoader, UIManager (Tutorial) |

---

## 11. Trade-offs & Decisions

### 11.1 Architectural Decision Records

#### ADR-001: Layered Architecture over Pure ECS

**Status:** Accepted

**Context:** Game architectures typically use Entity-Component-System (ECS) for flexibility. However, DomesticSimulation has fixed entity types (2 balls, N tasks) and complex business rules.

**Decision:** Use layered architecture (Config -> Data -> Systems -> Presentation) with ECS-inspired patterns (entities, components, systems).

**Consequences:**
- (+) Clear separation of concerns
- (+) Testable systems without PlayCanvas
- (+) Familiar patterns for web developers
- (-) Less flexible than pure ECS for entity composition
- (-) May need refactoring if entity types proliferate

**Trade-off Accepted:** Simplicity and testability over flexibility.

---

#### ADR-002: Zod for Runtime Validation

**Status:** Accepted

**Context:** TypeScript provides compile-time type safety, but JSON configs are loaded at runtime.

**Decision:** Use Zod for runtime schema validation of all configuration files.

**Consequences:**
- (+) Type-safe config loading with inference
- (+) Helpful error messages for invalid configs
- (+) Schema serves as documentation
- (-) ~15KB bundle size increase
- (-) Runtime overhead on config load (negligible)

**Trade-off Accepted:** Bundle size for developer experience and safety.

---

#### ADR-003: PlayCanvas Isolated to Presentation Layer

**Status:** Accepted

**Context:** PlayCanvas provides rendering, physics, and audio. Tight coupling would make systems untestable.

**Decision:** All game logic operates on plain TypeScript data structures. PlayCanvas is only used in Presentation layer.

**Consequences:**
- (+) Systems testable with Vitest (no browser/WebGL required)
- (+) Potential to swap rendering engines
- (+) Clear boundary for physics updates
- (-) Manual synchronization between game state and scene
- (-) Some duplication (e.g., position in both GameState and pc.Entity)

**Trade-off Accepted:** Testability over convenience.

---

#### ADR-004: Event Bus for System Communication

**Status:** Accepted

**Context:** Systems need to communicate without direct dependencies.

**Decision:** Implement typed EventBus with pub/sub pattern for all inter-system communication.

**Consequences:**
- (+) Loose coupling between systems
- (+) Easy to add new listeners
- (+) Debugging via event logging
- (-) Indirect data flow (harder to trace)
- (-) Risk of event explosion (need discipline)

**Trade-off Accepted:** Flexibility over explicit call chains.

---

#### ADR-005: No Backend / Static Hosting

**Status:** Accepted

**Context:** Game is single-player with no persistence requirements.

**Decision:** Deploy as static files to CDN. No backend services.

**Consequences:**
- (+) Zero hosting cost (GitHub Pages, Netlify free tier)
- (+) No server maintenance
- (+) Fast global delivery via CDN
- (-) No cloud saves
- (-) No multiplayer (future consideration)
- (-) No server-side validation (acceptable for single-player)

**Trade-off Accepted:** Simplicity over features.

---

### 11.2 Alternative Approaches Considered

| Decision | Chosen Approach | Alternatives Considered | Reason for Choice |
|----------|-----------------|------------------------|-------------------|
| State Management | Observable state + EventBus | Redux, MobX, Zustand | Lighter weight, game-specific |
| Config Format | JSON (primary) | YAML, TOML, JavaScript | Native browser support |
| Physics | PlayCanvas built-in | cannon.js, custom | Already bundled, sufficient |
| UI Framework | DOM overlay | React, PlayCanvas GUI | Simpler, more flexible |
| Testing | Vitest | Jest, Mocha | Vite integration, speed |

---

## 12. Appendices

### Appendix A: File Structure

```
DomesticSimulation/
  docs/
    prd-domesticsimulation-2025-12-22.md
    architecture-domesticsimulation-2025-12-22.md

  public/
    assets/
      audio/
        ding-01.mp3
        ding-02.mp3
        stress-increase.mp3
        paycheck.mp3
        music-calm.mp3
        music-tense.mp3
      textures/
        floor.png
        splatter-01.png

  scenarios/
    baseline.json
    red-gets-job.json

  src/
    config/
      schema.ts
      loader.ts
      defaults.ts
      types.ts
      watcher.ts

    data/
      entities/
        ball.ts
        task.ts
        round.ts
        financial.ts
        empathy.ts
      state/
        gameState.ts
        entityStore.ts
      events/
        eventBus.ts
        eventTypes.ts

    systems/
      core/
        roundManager.ts
        gameStateMachine.ts
      gameplay/
        taskSpawnSystem.ts
        taskCompletionSystem.ts
        stressSystem.ts
        rapportSystem.ts
      interaction/
        contextSwitchSystem.ts
        empathyModalSystem.ts
        employmentEventSystem.ts
      ai/
        aiController.ts

    presentation/
      renderer/
        sceneRenderer.ts
        entityRenderer.ts
        cameraController.ts
        particleSystem.ts
      ui/
        uiManager.ts
        components/
          stressMeter.ts
          rapportGauge.ts
          roundTimer.ts
          modalOverlay.ts
          summaryScreen.ts
      audio/
        audioManager.ts

    main.ts

  tests/
    systems/
      roundManager.test.ts
      stressSystem.test.ts
      taskSpawnSystem.test.ts
    config/
      loader.test.ts

  index.html
  package.json
  tsconfig.json
  vite.config.ts
  eslint.config.js
  .prettierrc
```

### Appendix B: Glossary

| Term | Definition |
|------|------------|
| **Blue Ball** | The employed partner entity with invisible work and rapport tracking |
| **Red Ball** | The household manager entity with visible tasks and help requests |
| **Round** | One game cycle representing 1 week of in-game time |
| **Rapport** | Blue's relationship with employer, displayed as emoji gauge |
| **Context Switch** | When Blue switches from Blue task to Red task, triggering regrowth |
| **Empathy Action** | Periodic modal showing simple supportive actions Red can perform |
| **Scope Creep** | Random event where completed Blue work spawns additional work |
| **Employment Event** | Mid-game event where Red gets part-time job, reducing Blue's time |

### Appendix C: Example Scenario Configuration

```json
{
  "id": "baseline",
  "name": "Baseline",
  "description": "Standard household dynamic with one employed partner",
  "difficulty": 2,

  "round": {
    "durationSeconds": 120,
    "paycheckInterval": 2
  },

  "blue": {
    "workSpawnRate": 4,
    "subtasksPerChunk": { "min": 4, "max": 12 },
    "scopeCreepProbability": { "min": 0.1, "max": 0.2 },
    "scopeCreepChunks": { "min": 2, "max": 5 },
    "paycheck": 6250,
    "contextSwitchRegrowth": 0.3,
    "workVisibility": false
  },

  "red": {
    "taskSpawnInterval": { "min": 30, "max": 45 },
    "taskTypes": [
      { "type": "cleaning", "weight": 0.4, "completionTime": 8 },
      { "type": "cooking", "weight": 0.3, "completionTime": 12 },
      { "type": "childcare", "weight": 0.2, "completionTime": 15 },
      { "type": "errands", "weight": 0.1, "completionTime": 20 }
    ]
  },

  "stress": {
    "blue": {
      "incompleteTaskPenalty": 10,
      "helpedRedPenalty": 5,
      "rapportDecayPenalty": 15,
      "overflowDebuffRate": 0.1,
      "weepingThreshold": 90
    },
    "red": {
      "incompleteTaskPenalty": 8,
      "taskCompletionReduction": 10,
      "blueHelpReduction": 15,
      "highStressThreshold": 75,
      "sustainedStressRounds": 3,
      "blueDebuffCompletionMultiplier": 0.7,
      "blueDebuffRegrowthMultiplier": 1.5
    }
  },

  "rapport": {
    "initialLevel": 75,
    "successBonus": 5,
    "missedDeadlinePenalty": 10,
    "compoundMultiplier": 1.5,
    "firingThreshold": { "min": 15, "max": 25 }
  },

  "employmentEvent": {
    "triggerRound": { "min": 3, "max": 5 },
    "redIncome": 400,
    "blueWorkTimeReduction": 0.45,
    "enabled": true
  },

  "ui": {
    "showBlueStressMeter": true,
    "showRedStressMeter": true,
    "showRapportGauge": true,
    "showBalance": true,
    "showRoundTimer": true,
    "empathyModalInterval": 30
  }
}
```

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-12-22 | System Architect | Initial architecture document |

---

## Next Steps

### Phase 4: Sprint Planning

After architecture approval, execute `/bmad:sprint-planning` to:

1. Break 8 epics into 41-54 detailed user stories
2. Estimate story complexity (story points)
3. Plan sprint iterations (2-week sprints)
4. Prioritize MVP features (Must Have first)

### Recommended Implementation Order

1. **Sprint 1:** Config layer + Data layer + EventBus (foundation)
2. **Sprint 2:** RoundManager + GameStateMachine + Basic UI
3. **Sprint 3:** TaskSpawnSystem + TaskCompletionSystem + Physics
4. **Sprint 4:** StressSystem + RapportSystem
5. **Sprint 5:** EmpathyModalSystem + EmploymentEventSystem + AIController
6. **Sprint 6:** Audio + Visual Polish + Testing

---

**This document was created using BMAD Method v6 - Phase 3 (Architecture)**

*To continue: Run `/bmad:workflow-status` to see your progress and next recommended workflow.*
