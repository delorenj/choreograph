# Sprint Planning Document: DomesticSimulation

**Date:** 2025-12-22
**Author:** BMAD Scrum Master (Automated)
**Version:** 1.0
**Status:** Ready for Implementation
**Based on:**
- PRD v1.0 (`/home/delorenj/code/DomesticSimulation/docs/prd-domesticsimulation-2025-12-22.md`)
- Architecture v1.0 (`/home/delorenj/code/DomesticSimulation/docs/architecture-domesticsimulation-2025-12-22.md`)

---

## Executive Summary

**Total Scope:** 180 story points
**Estimated Duration:** 6 sprints (12 weeks)
**Team Size Assumption:** 1 senior developer
**Sprint Length:** 2 weeks
**Velocity Assumption:** 30 points/sprint

### Sprint Overview

| Sprint | Focus | Points | Key Deliverables |
|--------|-------|--------|------------------|
| Sprint 1 | Infrastructure & Foundation | 30 | Config system, data layer, event bus, project setup |
| Sprint 2 | Core Game Loop | 30 | Round system, state machine, role selection, basic UI |
| Sprint 3 | Task Systems & Physics | 30 | Task spawning, completion, physics movement, camera |
| Sprint 4 | Stress & Rapport | 30 | Dual stress systems, rapport tracking, context switching |
| Sprint 5 | Advanced Features | 30 | Empathy modals, employment event, AI controller |
| Sprint 6 | Polish & Integration | 30 | Audio system, visual effects, tutorial, testing |

---

## Epic Breakdown

### EPIC-001: Core Game Loop
**Business Value:** Foundation for all gameplay. Without a working game loop, nothing else functions.
**Total Points:** 23 points
**Priority:** Must Have

#### User Stories:
1. **STORY-001-01**: Project Setup & Build Configuration (3 points)
2. **STORY-001-02**: Round Timer System (5 points)
3. **STORY-001-03**: Role Selection Screen (3 points)
4. **STORY-001-04**: End-of-Round Summary Screen (5 points)
5. **STORY-001-05**: Round Progression & Paycheck Timing (5 points)
6. **STORY-001-06**: Task Carryover Between Rounds (2 points)

---

### EPIC-002: Blue Ball Employment Simulation
**Business Value:** Core metaphor for invisible labor and employment precarity.
**Total Points:** 32 points
**Priority:** Must Have

#### User Stories:
1. **STORY-002-01**: Blue Work Chunk Spawning (5 points)
2. **STORY-002-02**: Subtask Splitting with Log Distribution (5 points)
3. **STORY-002-03**: Scope Creep Mechanic (5 points)
4. **STORY-002-04**: Blue Work Visibility Toggle (3 points)
5. **STORY-002-05**: Rapport Gauge System (5 points)
6. **STORY-002-06**: Rapport Decay & Firing Logic (5 points)
7. **STORY-002-07**: Paycheck System (2 points)
8. **STORY-002-08**: Context Switch Regrowth Penalty (2 points)

---

### EPIC-003: Red Ball Household Simulation
**Business Value:** Represents visible but undervalued household labor.
**Total Points:** 18 points
**Priority:** Must Have

#### User Stories:
1. **STORY-003-01**: Red Task Spawning System (5 points)
2. **STORY-003-02**: Task Type Categorization (3 points)
3. **STORY-003-03**: Red Task Refusal Behavior (5 points)
4. **STORY-003-04**: Red Sleep/End Round with Incomplete Tasks (3 points)
5. **STORY-003-05**: Red Help Request System (2 points)

---

### EPIC-004: Task Interaction & Physics
**Business Value:** Makes the game feel satisfying to play. Poor interaction would undermine the message.
**Total Points:** 26 points
**Priority:** Must Have

#### User Stories:
1. **STORY-004-01**: Button-Hold Task Completion (5 points)
2. **STORY-004-02**: Visual Fill Progress Bar (3 points)
3. **STORY-004-03**: Rising Audio During Hold (3 points)
4. **STORY-004-04**: Task Completion "Ding" Sound (2 points)
5. **STORY-004-05**: Physics-Based Ball Movement (8 points)
6. **STORY-004-06**: Gravity Toward Active Task (5 points)

---

### EPIC-005: Asymmetric Stress System
**Business Value:** The emotional core of the game. Reveals central tension and unfairness.
**Total Points:** 35 points
**Priority:** Must Have

#### User Stories:
1. **STORY-005-01**: Blue Stress Meter & Calculation (5 points)
2. **STORY-005-02**: Blue Stress from Incomplete Tasks (3 points)
3. **STORY-005-03**: Blue Stress from Helping Red (3 points)
4. **STORY-005-04**: Blue Stress from Rapport Decay (3 points)
5. **STORY-005-05**: Blue Cannot Request Help (2 points)
6. **STORY-005-06**: Blue Weeping Animation (3 points)
7. **STORY-005-07**: Red Stress Meter & Calculation (5 points)
8. **STORY-005-08**: Red Stress Debuffs to Blue (5 points)
9. **STORY-005-09**: Empathy Modal System (6 points)

---

### EPIC-006: Red's Job Event
**Business Value:** Demonstrates how "helping" can paradoxically increase Blue's burden.
**Total Points:** 13 points
**Priority:** Must Have

#### User Stories:
1. **STORY-006-01**: Employment Event Trigger (3 points)
2. **STORY-006-02**: Red Income Integration (3 points)
3. **STORY-006-03**: Blue Work Time Reduction (5 points)
4. **STORY-006-04**: Event Announcement Modal (2 points)

---

### EPIC-007: Camera & Visual Systems
**Business Value:** Polish makes the game professional and engaging.
**Total Points:** 20 points
**Priority:** Should Have

#### User Stories:
1. **STORY-007-01**: Fixed Isometric Camera (5 points)
2. **STORY-007-02**: Camera Panning (WASD & Mouse Edge) (3 points)
3. **STORY-007-03**: Audio Feedback System (5 points)
4. **STORY-007-04**: Stress-Adaptive Music (5 points)
5. **STORY-007-05**: Visual Polish (Particles, Color Grading) (2 points)

---

### EPIC-008: Configuration & Tutorial
**Business Value:** Configuration enables easy balancing and scenario expansion.
**Total Points:** 13 points
**Priority:** Should Have

#### User Stories:
1. **STORY-008-01**: Scenario Configuration System (5 points)
2. **STORY-008-02**: Config Schema Validation (Zod) (3 points)
3. **STORY-008-03**: Hot Reload Dev Mode (3 points)
4. **STORY-008-04**: Tutorial Modal System (2 points)

---

## Detailed User Stories

### Infrastructure Stories

---

### STORY-INF-01: Project Scaffolding & TypeScript Setup
**Epic:** Infrastructure (prerequisite)
**Points:** 3
**Priority:** Must Have

**User Story:**
As a **developer**
I want to **set up the project with Vite, TypeScript, and PlayCanvas**
So that **I have a working development environment with hot reload**

**Acceptance Criteria:**
- [ ] Vite development server configured and running
- [ ] TypeScript `strict: true` mode enabled
- [ ] PlayCanvas installed and imported successfully
- [ ] ESLint and Prettier configured
- [ ] Path aliases configured (@config, @data, @systems, @presentation)
- [ ] Basic index.html with canvas element
- [ ] Hot module reload working (<2 second refresh)

**Technical Notes:**
- Implementation approach: Vite + TypeScript template, manual PlayCanvas integration
- Components affected: Build system, all layers
- Package dependencies: vite, typescript, playcanvas, @typescript-eslint, prettier, zod

**Tasks:**
1. **INF-01-T1**: Initialize Vite + TypeScript project (1h)
   - Type: Implementation
   - Dependencies: None
2. **INF-01-T2**: Install and configure PlayCanvas (2h)
   - Type: Implementation
   - Dependencies: INF-01-T1
3. **INF-01-T3**: Configure tsconfig.json with strict mode and paths (1h)
   - Type: Configuration
   - Dependencies: INF-01-T1
4. **INF-01-T4**: Set up ESLint + Prettier (1h)
   - Type: Configuration
   - Dependencies: INF-01-T1
5. **INF-01-T5**: Create directory structure (config, data, systems, presentation) (1h)
   - Type: Design
   - Dependencies: INF-01-T3
6. **INF-01-T6**: Verify HMR works with test component (1h)
   - Type: Testing
   - Dependencies: INF-01-T2, INF-01-T5

**Definition of Done:**
- [ ] Code completed and follows standards
- [ ] `npm run dev` starts dev server
- [ ] TypeScript compiler has zero errors
- [ ] ESLint passes with no warnings
- [ ] HMR verified (change file, see update <2s)
- [ ] README.md with setup instructions

---

### STORY-INF-02: EventBus Infrastructure
**Epic:** Infrastructure (prerequisite)
**Points:** 5
**Priority:** Must Have

**User Story:**
As a **developer**
I want to **implement a typed EventBus for system communication**
So that **systems can communicate without direct dependencies**

**Acceptance Criteria:**
- [ ] EventBus class with emit, on, off methods
- [ ] Full TypeScript typing for all event types
- [ ] Event payload type safety
- [ ] Unsubscribe mechanism
- [ ] Event logging in dev mode
- [ ] Unit tests for pub/sub behavior

**Technical Notes:**
- Implementation approach: Observer pattern with generic type safety
- Components affected: All systems will use this for communication
- Event types: ~15 events (round:start, task:spawned, stress:changed, etc.)

**Tasks:**
1. **INF-02-T1**: Define GameEventType union type (2h)
   - Type: Design
   - Dependencies: None
2. **INF-02-T2**: Define GameEventPayload mapped type (2h)
   - Type: Design
   - Dependencies: INF-02-T1
3. **INF-02-T3**: Implement EventBus class with generic methods (4h)
   - Type: Implementation
   - Dependencies: INF-02-T2
4. **INF-02-T4**: Add dev mode event logging (1h)
   - Type: Implementation
   - Dependencies: INF-02-T3
5. **INF-02-T5**: Write unit tests for EventBus (3h)
   - Type: Testing
   - Dependencies: INF-02-T3

**Definition of Done:**
- [ ] Code completed and follows standards
- [ ] EventBus is fully typed (TypeScript inference works)
- [ ] Unit tests written and passing (>90% coverage)
- [ ] Documentation with usage examples
- [ ] No circular dependencies
- [ ] Event logging verified in dev mode

---

### STORY-INF-03: Entity Store & Game State
**Epic:** Infrastructure (prerequisite)
**Points:** 5
**Priority:** Must Have

**User Story:**
As a **developer**
I want to **create the core game state structure and entity storage**
So that **all game systems can access and mutate shared state**

**Acceptance Criteria:**
- [ ] GameState interface defined with all required properties
- [ ] EntityStore for managing balls and tasks (Map-based)
- [ ] Observable state pattern (listeners for changes)
- [ ] Immutable state updates (functional approach)
- [ ] Entity CRUD operations (create, read, update, delete)
- [ ] Unit tests for state mutations

**Technical Notes:**
- Implementation approach: Central GameState object with Maps for entities
- Components affected: All systems (foundation for data layer)
- Observable pattern: Simple listener registration system

**Tasks:**
1. **INF-03-T1**: Define all entity interfaces (Ball, Task, Round, etc.) (4h)
   - Type: Design
   - Dependencies: None
2. **INF-03-T2**: Implement GameState interface (2h)
   - Type: Design
   - Dependencies: INF-03-T1
3. **INF-03-T3**: Create EntityStore class with CRUD methods (4h)
   - Type: Implementation
   - Dependencies: INF-03-T2
4. **INF-03-T4**: Add observable pattern for state changes (3h)
   - Type: Implementation
   - Dependencies: INF-03-T3
5. **INF-03-T5**: Write unit tests for entity operations (3h)
   - Type: Testing
   - Dependencies: INF-03-T4

**Definition of Done:**
- [ ] Code completed and follows standards
- [ ] All entity types defined and exported
- [ ] EntityStore supports ball and task entities
- [ ] State changes trigger listeners
- [ ] Unit tests written and passing
- [ ] No mutation of state objects (immutability verified)

---

### STORY-INF-04: Configuration System Foundation
**Epic:** EPIC-008 (Configuration)
**Points:** 8
**Priority:** Must Have

**User Story:**
As a **developer**
I want to **create the configuration system with Zod validation**
So that **all game parameters are loaded from JSON files with type safety**

**Acceptance Criteria:**
- [ ] Zod schemas for all config sections (Round, Blue, Red, Stress, etc.)
- [ ] ConfigLoader class with async loading
- [ ] Default values for all parameters
- [ ] Validation errors with helpful messages
- [ ] Hot reload in dev mode (file watcher)
- [ ] Example baseline.json scenario

**Technical Notes:**
- Implementation approach: Zod schemas with inferred types, async JSON loading
- Components affected: All systems (foundation for config layer)
- Config sections: 8 major sections per ScenarioConfig in architecture

**Tasks:**
1. **INF-04-T1**: Define Zod schemas for all config sections (6h)
   - Type: Design
   - Dependencies: None
2. **INF-04-T2**: Create default values constants (2h)
   - Type: Implementation
   - Dependencies: INF-04-T1
3. **INF-04-T3**: Implement ConfigLoader class (4h)
   - Type: Implementation
   - Dependencies: INF-04-T1, INF-04-T2
4. **INF-04-T4**: Add JSON file loading with validation (3h)
   - Type: Implementation
   - Dependencies: INF-04-T3
5. **INF-04-T5**: Implement hot reload file watcher (3h)
   - Type: Implementation
   - Dependencies: INF-04-T4
6. **INF-04-T6**: Create baseline.json example scenario (2h)
   - Type: Design
   - Dependencies: INF-04-T1
7. **INF-04-T7**: Write unit tests for config loading and validation (4h)
   - Type: Testing
   - Dependencies: INF-04-T4, INF-04-T6

**Definition of Done:**
- [ ] Code completed and follows standards
- [ ] All config schemas defined with Zod
- [ ] Validation errors are clear and helpful
- [ ] baseline.json loads successfully
- [ ] Hot reload triggers config refresh in dev mode
- [ ] Unit tests written and passing
- [ ] Schema documentation generated

---

### Core Game Loop Stories

---

### STORY-001-01: Game State Machine
**Epic:** EPIC-001
**Points:** 5
**Priority:** Must Have

**User Story:**
As a **player**
I want **the game to transition through states (loading, role select, playing, paused, summary)**
So that **the game flow is organized and predictable**

**Acceptance Criteria:**
- [ ] GameStateMachine class with state transitions
- [ ] States: LOADING, SCENARIO_SELECT, ROLE_SELECT, PLAYING, PAUSED, EMPATHY_MODAL, ROUND_SUMMARY, GAME_OVER
- [ ] Valid transition rules enforced
- [ ] State change events emitted to EventBus
- [ ] Invalid transitions throw errors
- [ ] Unit tests for state machine logic

**Technical Notes:**
- Implementation approach: Finite state machine with explicit transitions
- Components affected: All game systems (central orchestrator)
- State transitions: ~12 valid transitions defined

**Tasks:**
1. **001-01-T1**: Define GameState and GameEvent enums (2h)
   - Type: Design
   - Dependencies: None
2. **001-01-T2**: Implement state machine with transition table (5h)
   - Type: Implementation
   - Dependencies: 001-01-T1, INF-02 (EventBus)
3. **001-01-T3**: Add state change event emission (2h)
   - Type: Implementation
   - Dependencies: 001-01-T2
4. **001-01-T4**: Write unit tests for all transitions (4h)
   - Type: Testing
   - Dependencies: 001-01-T3

**Definition of Done:**
- [ ] Code completed and follows standards
- [ ] All states and transitions implemented
- [ ] Invalid transitions are blocked
- [ ] State change events emit correctly
- [ ] Unit tests written and passing (>90% coverage)
- [ ] State diagram documentation updated

---

### STORY-001-02: Round Timer System
**Epic:** EPIC-001
**Points:** 5
**Priority:** Must Have

**User Story:**
As a **player**
I want **a round timer that counts down each week (round)**
So that **I feel time pressure and know when the round will end**

**Acceptance Criteria:**
- [ ] RoundManager class with timer functionality
- [ ] Round duration configurable from config (default: 120 seconds)
- [ ] Timer starts on round start
- [ ] Timer pauses on pause/modal
- [ ] Timer triggers round end at 0
- [ ] round:tick event every second
- [ ] round:end event when timer expires

**Technical Notes:**
- Implementation approach: Interval-based timer with accumulator
- Components affected: RoundManager, UIManager (timer display)
- Timer precision: 1 second updates via EventBus

**Tasks:**
1. **001-02-T1**: Design Round entity structure (2h)
   - Type: Design
   - Dependencies: INF-03 (GameState)
2. **001-02-T2**: Implement RoundManager class (4h)
   - Type: Implementation
   - Dependencies: 001-02-T1, INF-02 (EventBus)
3. **001-02-T3**: Add timer start/pause/resume logic (3h)
   - Type: Implementation
   - Dependencies: 001-02-T2
4. **001-02-T4**: Integrate with config for round duration (2h)
   - Type: Implementation
   - Dependencies: 001-02-T3, INF-04 (Config)
5. **001-02-T5**: Write unit tests for timer behavior (3h)
   - Type: Testing
   - Dependencies: 001-02-T4

**Definition of Done:**
- [ ] Code completed and follows standards
- [ ] Timer accurately counts down
- [ ] Pause/resume works correctly
- [ ] round:tick events emit every second
- [ ] round:end event triggers at 0
- [ ] Config integration verified
- [ ] Unit tests written and passing

---

### STORY-001-03: Role Selection Screen
**Epic:** EPIC-001
**Points:** 3
**Priority:** Must Have

**User Story:**
As a **player**
I want to **choose to play as Blue Ball or Red Ball at game start**
So that **I can experience different perspectives**

**Acceptance Criteria:**
- [ ] Role selection UI overlay (DOM-based)
- [ ] Two buttons: "Play as Blue Ball" and "Play as Red Ball"
- [ ] Selection sets playerRole in GameState
- [ ] Non-selected ball controlled by AI
- [ ] Visual distinction between balls in selection UI
- [ ] Selection triggers transition to PLAYING state
- [ ] Restart option allows role switching

**Technical Notes:**
- Implementation approach: DOM overlay with CSS, no PlayCanvas GUI
- Components affected: UIManager, GameStateMachine, AIController
- Styling: Minimal, clear buttons with ball colors

**Tasks:**
1. **001-03-T1**: Design role selection UI HTML/CSS (2h)
   - Type: Design
   - Dependencies: None
2. **001-03-T2**: Create UIManager class structure (2h)
   - Type: Implementation
   - Dependencies: None
3. **001-03-T3**: Implement role selection logic (2h)
   - Type: Implementation
   - Dependencies: 001-03-T1, 001-03-T2, 001-01 (StateMachine)
4. **001-03-T4**: Connect to GameState and AI controller (2h)
   - Type: Integration
   - Dependencies: 001-03-T3, INF-03 (GameState)
5. **001-03-T5**: Add restart functionality (1h)
   - Type: Implementation
   - Dependencies: 001-03-T4

**Definition of Done:**
- [ ] Code completed and follows standards
- [ ] UI renders correctly on all target browsers
- [ ] Role selection persists in GameState
- [ ] AI takes control of non-selected ball
- [ ] Restart allows role change
- [ ] Visual styling is clear and accessible
- [ ] Transition to PLAYING state verified

---

### STORY-001-04: End-of-Round Summary Screen
**Epic:** EPIC-001
**Points:** 5
**Priority:** Must Have

**User Story:**
As a **player**
I want to **see a summary screen after each round ends**
So that **I understand what happened and can track my progress**

**Acceptance Criteria:**
- [ ] Summary screen displays at round end
- [ ] Shows: Blue tasks completed/total, Red tasks completed/total
- [ ] Shows: Blue stress change, Red stress change
- [ ] Shows: Rapport change (emoji visualization)
- [ ] Shows: Income received (on paycheck rounds)
- [ ] Shows: Running balance total
- [ ] "Continue" button advances to next round
- [ ] "Restart" button resets game
- [ ] Subtle exposition text hinting at metaphor

**Technical Notes:**
- Implementation approach: DOM overlay with flexbox layout
- Components affected: UIManager, RoundManager, EventBus
- Data sources: RoundSummary entity from GameState

**Tasks:**
1. **001-04-T1**: Design RoundSummary entity structure (2h)
   - Type: Design
   - Dependencies: INF-03 (GameState)
2. **001-04-T2**: Create summary screen HTML/CSS template (3h)
   - Type: Design
   - Dependencies: None
3. **001-04-T3**: Implement summary data calculation in RoundManager (4h)
   - Type: Implementation
   - Dependencies: 001-04-T1, 001-02 (RoundManager)
4. **001-04-T4**: Connect summary screen to UIManager (3h)
   - Type: Implementation
   - Dependencies: 001-04-T2, 001-04-T3
5. **001-04-T5**: Add continue/restart button logic (2h)
   - Type: Implementation
   - Dependencies: 001-04-T4, 001-01 (StateMachine)

**Definition of Done:**
- [ ] Code completed and follows standards
- [ ] Summary screen appears at round end
- [ ] All data displays correctly
- [ ] Continue button advances round
- [ ] Restart button resets game
- [ ] UI is responsive and readable
- [ ] Exposition text is subtle and non-explicit

---

### STORY-001-05: Round Progression & Paycheck Timing
**Epic:** EPIC-001
**Points:** 5
**Priority:** Must Have

**User Story:**
As a **player**
I want **rounds to progress sequentially and paychecks to arrive every 2 rounds**
So that **I experience the weekly rhythm and biweekly income**

**Acceptance Criteria:**
- [ ] Round number increments on continue
- [ ] Paycheck arrives on even-numbered rounds (2, 4, 6, etc.)
- [ ] Paycheck amount from config (default: $6,250)
- [ ] Balance updated on paycheck rounds
- [ ] round:paycheck event emitted
- [ ] Summary screen shows different content on paycheck vs non-paycheck rounds
- [ ] Financial state persists across rounds

**Technical Notes:**
- Implementation approach: RoundManager tracks round number, FinancialState tracks balance
- Components affected: RoundManager, FinancialState, UIManager
- Paycheck logic: `round % paycheckInterval === 0`

**Tasks:**
1. **001-05-T1**: Define FinancialState entity (2h)
   - Type: Design
   - Dependencies: INF-03 (GameState)
2. **001-05-T2**: Implement paycheck logic in RoundManager (3h)
   - Type: Implementation
   - Dependencies: 001-05-T1, 001-02 (RoundManager)
3. **001-05-T3**: Add balance tracking and updates (2h)
   - Type: Implementation
   - Dependencies: 001-05-T2
4. **001-05-T4**: Emit paycheck events (1h)
   - Type: Implementation
   - Dependencies: 001-05-T3, INF-02 (EventBus)
5. **001-05-T5**: Update summary screen for paycheck rounds (3h)
   - Type: Implementation
   - Dependencies: 001-05-T4, 001-04 (Summary Screen)
6. **001-05-T6**: Write unit tests for paycheck timing (2h)
   - Type: Testing
   - Dependencies: 001-05-T5

**Definition of Done:**
- [ ] Code completed and follows standards
- [ ] Rounds increment correctly
- [ ] Paycheck arrives every 2 rounds (configurable)
- [ ] Balance updates correctly
- [ ] Paycheck events emit
- [ ] Summary screen shows income on paycheck rounds
- [ ] Unit tests written and passing

---

### STORY-001-06: Task Carryover Between Rounds
**Epic:** EPIC-001
**Points:** 2
**Priority:** Must Have

**User Story:**
As a **player**
I want **incomplete tasks to carry over to the next round**
So that **I feel the accumulation of unfinished work**

**Acceptance Criteria:**
- [ ] Incomplete Blue tasks persist to next round
- [ ] Incomplete Red tasks persist to next round
- [ ] Task completion state preserved
- [ ] Task progress preserved (for partially completed tasks)
- [ ] Carried tasks included in next round's summary totals
- [ ] No duplicate task IDs across rounds

**Technical Notes:**
- Implementation approach: EntityStore maintains tasks across rounds
- Components affected: RoundManager, TaskSpawnSystem, EntityStore
- Task lifecycle: Tasks only removed when completed or game restarted

**Tasks:**
1. **001-06-T1**: Update EntityStore to preserve tasks across rounds (2h)
   - Type: Implementation
   - Dependencies: INF-03 (EntityStore)
2. **001-06-T2**: Modify RoundManager to not clear tasks on round end (1h)
   - Type: Implementation
   - Dependencies: 001-06-T1, 001-02 (RoundManager)
3. **001-06-T3**: Add round number tracking to tasks (createdAtRound) (2h)
   - Type: Implementation
   - Dependencies: 001-06-T2
4. **001-06-T4**: Write unit tests for task carryover (2h)
   - Type: Testing
   - Dependencies: 001-06-T3

**Definition of Done:**
- [ ] Code completed and follows standards
- [ ] Incomplete tasks carry over
- [ ] Task state preserved correctly
- [ ] Summary totals include carried tasks
- [ ] No task duplication bugs
- [ ] Unit tests written and passing

---

### Task Systems Stories

---

### STORY-002-01: Blue Work Chunk Spawning
**Epic:** EPIC-002
**Points:** 5
**Priority:** Must Have

**User Story:**
As **Blue Ball**
I want **work chunks to spawn from the tube at round start**
So that **I have invisible work tasks to complete**

**Acceptance Criteria:**
- [ ] TaskSpawnSystem spawns Blue work chunks
- [ ] Chunks spawn at round start (configurable quantity: 3-5)
- [ ] Chunks spawn from "tube" position in adjacent room
- [ ] Chunks are invisible to Red by default (workVisibility config)
- [ ] Each chunk has unique ID
- [ ] task:spawned event emitted
- [ ] Chunks stored in EntityStore

**Technical Notes:**
- Implementation approach: TaskSpawnSystem subscribes to round:start event
- Components affected: TaskSpawnSystem, EntityStore, EventBus
- Spawn location: Fixed position for "tube" in 3D space

**Tasks:**
1. **002-01-T1**: Design BlueTask entity structure (2h)
   - Type: Design
   - Dependencies: INF-03 (GameState)
2. **002-01-T2**: Create TaskSpawnSystem class (3h)
   - Type: Implementation
   - Dependencies: 002-01-T1, INF-02 (EventBus)
3. **002-01-T3**: Implement Blue chunk spawning logic (4h)
   - Type: Implementation
   - Dependencies: 002-01-T2, INF-04 (Config)
4. **002-01-T4**: Add visibility toggle from config (2h)
   - Type: Implementation
   - Dependencies: 002-01-T3
5. **002-01-T5**: Write unit tests for spawn behavior (3h)
   - Type: Testing
   - Dependencies: 002-01-T4

**Definition of Done:**
- [ ] Code completed and follows standards
- [ ] Chunks spawn at round start
- [ ] Spawn quantity respects config
- [ ] Visibility toggle works
- [ ] task:spawned events emit
- [ ] Unit tests written and passing

---

### STORY-002-02: Subtask Splitting with Log Distribution
**Epic:** EPIC-002
**Points:** 5
**Priority:** Must Have

**User Story:**
As **Blue Ball**
I want **work chunks to split into random subtasks with log-distributed completion times**
So that **most tasks are quick but some are unexpectedly long**

**Acceptance Criteria:**
- [ ] Each chunk splits into N subtasks (N = 4-12, randomized)
- [ ] Subtask completion times follow log-normal distribution
- [ ] Most subtasks complete quickly (30-60 seconds)
- [ ] Rare subtasks are long (120-300 seconds)
- [ ] Subtasks linked to parent chunk
- [ ] Chunk completion requires all subtasks complete

**Technical Notes:**
- Implementation approach: Log-normal distribution using Math.log with randomness
- Components affected: TaskSpawnSystem, BlueTask entity
- Distribution parameters: μ=3.5, σ=0.8 for realistic skew

**Tasks:**
1. **002-02-T1**: Design BlueSubtask entity structure (2h)
   - Type: Design
   - Dependencies: 002-01-T1 (BlueTask)
2. **002-02-T2**: Implement log-normal distribution utility (3h)
   - Type: Implementation
   - Dependencies: None
3. **002-02-T3**: Add subtask splitting logic to TaskSpawnSystem (4h)
   - Type: Implementation
   - Dependencies: 002-02-T1, 002-02-T2, 002-01 (Chunk spawning)
4. **002-02-T4**: Link subtasks to parent chunks (2h)
   - Type: Implementation
   - Dependencies: 002-02-T3
5. **002-02-T5**: Write unit tests for distribution and splitting (3h)
   - Type: Testing
   - Dependencies: 002-02-T4

**Definition of Done:**
- [ ] Code completed and follows standards
- [ ] Subtasks split correctly (4-12 per chunk)
- [ ] Completion times follow log-normal distribution
- [ ] Distribution verified (histogram test)
- [ ] Parent-child relationships maintained
- [ ] Unit tests written and passing

---

### STORY-002-03: Scope Creep Mechanic
**Epic:** EPIC-002
**Points:** 5
**Priority:** Must Have

**User Story:**
As **Blue Ball**
I want **completed chunks to sometimes spawn additional chunks (scope creep)**
So that **I experience unpredictable workload growth**

**Acceptance Criteria:**
- [ ] 10-20% of completed chunks trigger scope creep (configurable)
- [ ] Scope creep spawns 2-5 additional chunks (randomized)
- [ ] Scope creep is random and unpredictable
- [ ] New chunks spawn at same location as parent
- [ ] task:spawned events emit for new chunks
- [ ] Visual indicator for scope creep (particle effect)

**Technical Notes:**
- Implementation approach: On task complete, roll probability and spawn new chunks
- Components affected: TaskCompletionSystem, TaskSpawnSystem, EventBus
- Probability calculation: Random float compared to config threshold

**Tasks:**
1. **002-03-T1**: Add scope creep config parameters (1h)
   - Type: Design
   - Dependencies: INF-04 (Config)
2. **002-03-T2**: Implement scope creep probability check (3h)
   - Type: Implementation
   - Dependencies: 002-03-T1
3. **002-03-T3**: Add new chunk spawning on scope creep (4h)
   - Type: Implementation
   - Dependencies: 002-03-T2, 002-01 (Chunk spawning)
4. **002-03-T4**: Emit scope creep event (1h)
   - Type: Implementation
   - Dependencies: 002-03-T3, INF-02 (EventBus)
5. **002-03-T5**: Write unit tests for scope creep logic (3h)
   - Type: Testing
   - Dependencies: 002-03-T4

**Definition of Done:**
- [ ] Code completed and follows standards
- [ ] Scope creep triggers at configured probability
- [ ] New chunks spawn correctly
- [ ] Randomness verified (statistical test)
- [ ] Events emit correctly
- [ ] Unit tests written and passing

---

### STORY-002-04: Blue Work Visibility Toggle
**Epic:** EPIC-002
**Points:** 3
**Priority:** Must Have

**User Story:**
As a **scenario designer**
I want to **toggle whether Blue's work is visible to Red**
So that **different scenarios can show/hide invisible labor**

**Acceptance Criteria:**
- [ ] workVisibility config parameter (boolean)
- [ ] When false (default), Blue tasks invisible to Red
- [ ] When true, Blue tasks visible to both
- [ ] Visibility affects rendering layer only (not game logic)
- [ ] Config change updates visibility immediately (hot reload)

**Technical Notes:**
- Implementation approach: Visibility flag on BlueTask, checked by renderer
- Components affected: BlueTask entity, SceneRenderer, ConfigLoader
- Rendering: Conditional material opacity based on playerRole and visibility

**Tasks:**
1. **002-04-T1**: Add isVisible property to BlueTask (1h)
   - Type: Design
   - Dependencies: 002-01-T1 (BlueTask)
2. **002-04-T2**: Update TaskSpawnSystem to set visibility from config (2h)
   - Type: Implementation
   - Dependencies: 002-04-T1, INF-04 (Config)
3. **002-04-T3**: Add visibility check in renderer (placeholder for now) (2h)
   - Type: Implementation
   - Dependencies: 002-04-T2
4. **002-04-T4**: Write unit tests for visibility toggle (2h)
   - Type: Testing
   - Dependencies: 002-04-T3

**Definition of Done:**
- [ ] Code completed and follows standards
- [ ] Visibility respects config parameter
- [ ] Hot reload updates visibility
- [ ] Rendering layer respects visibility flag
- [ ] Unit tests written and passing

---

### STORY-002-05: Rapport Gauge System
**Epic:** EPIC-002
**Points:** 5
**Priority:** Must Have

**User Story:**
As **Blue Ball**
I want **my employment rapport tracked as an ambiguous emoji gauge**
So that **I feel job insecurity without precise metrics**

**Acceptance Criteria:**
- [ ] RapportSystem tracks internal rapport level (0-100)
- [ ] Rapport displayed as emoji (😢 😕 😐 🙂 😊)
- [ ] Emoji ranges: 0-20, 20-40, 40-60, 60-80, 80-100
- [ ] No numeric percentage shown
- [ ] Initial rapport configurable (default: 75)
- [ ] rapport:changed event emitted on changes
- [ ] UI displays emoji gauge

**Technical Notes:**
- Implementation approach: RapportSystem class with internal number, emoji mapping
- Components affected: RapportSystem, UIManager, EventBus
- Emoji selection: Unicode emoji for cross-browser support

**Tasks:**
1. **002-05-T1**: Create RapportSystem class structure (2h)
   - Type: Implementation
   - Dependencies: INF-02 (EventBus), INF-04 (Config)
2. **002-05-T2**: Implement rapport level tracking (3h)
   - Type: Implementation
   - Dependencies: 002-05-T1
3. **002-05-T3**: Add emoji mapping logic (2h)
   - Type: Implementation
   - Dependencies: 002-05-T2
4. **002-05-T4**: Create rapport gauge UI component (3h)
   - Type: Implementation
   - Dependencies: 002-05-T3
5. **002-05-T5**: Write unit tests for rapport calculations (3h)
   - Type: Testing
   - Dependencies: 002-05-T4

**Definition of Done:**
- [ ] Code completed and follows standards
- [ ] Rapport level tracked accurately
- [ ] Emoji updates based on level
- [ ] No numeric display (emoji only)
- [ ] UI renders correctly
- [ ] Unit tests written and passing

---

### STORY-002-06: Rapport Decay & Firing Logic
**Epic:** EPIC-002
**Points:** 5
**Priority:** Must Have

**User Story:**
As **Blue Ball**
I want **rapport to decay when I miss deadlines and fire me unpredictably**
So that **I experience employment precarity**

**Acceptance Criteria:**
- [ ] Rapport decreases on incomplete Blue tasks at round end
- [ ] Decay amount configurable (default: -10 per task)
- [ ] Decay compounds with consecutive misses (1.5x multiplier)
- [ ] Successful round increases rapport (+5)
- [ ] Firing threshold randomized (15-25% rapport)
- [ ] Firing feels sudden (no explicit warning)
- [ ] game:fired event triggers game over
- [ ] Firing triggers GAME_OVER state

**Technical Notes:**
- Implementation approach: RapportSystem listens to round:end, calculates decay
- Components affected: RapportSystem, RoundManager, GameStateMachine
- Firing randomization: Roll random threshold on each round check

**Tasks:**
1. **002-06-T1**: Implement rapport decay logic (4h)
   - Type: Implementation
   - Dependencies: 002-05 (RapportSystem), 001-02 (RoundManager)
2. **002-06-T2**: Add compound multiplier for consecutive misses (3h)
   - Type: Implementation
   - Dependencies: 002-06-T1
3. **002-06-T3**: Implement firing threshold check (3h)
   - Type: Implementation
   - Dependencies: 002-06-T2
4. **002-06-T4**: Add randomization to firing (2h)
   - Type: Implementation
   - Dependencies: 002-06-T3
5. **002-06-T5**: Emit game:fired event and trigger game over (2h)
   - Type: Implementation
   - Dependencies: 002-06-T4, 001-01 (StateMachine)
6. **002-06-T6**: Write unit tests for decay and firing (4h)
   - Type: Testing
   - Dependencies: 002-06-T5

**Definition of Done:**
- [ ] Code completed and follows standards
- [ ] Rapport decays on missed deadlines
- [ ] Compound multiplier works correctly
- [ ] Firing triggers unpredictably
- [ ] Firing threshold randomized
- [ ] Game over state reached on firing
- [ ] Unit tests written and passing

---

### STORY-002-07: Paycheck System
**Epic:** EPIC-002
**Points:** 2
**Priority:** Must Have

**User Story:**
As **Blue Ball**
I want to **receive $6,250 every 2 weeks if employed**
So that **I can keep the household financially stable**

**Acceptance Criteria:**
- [ ] Paycheck amount configurable (default: $6,250)
- [ ] Paycheck arrives every 2 rounds (paycheckInterval config)
- [ ] No paycheck if fired before paycheck round
- [ ] Balance updated on paycheck receipt
- [ ] round:paycheck event emitted
- [ ] Paycheck shown on summary screen

**Technical Notes:**
- Implementation approach: RoundManager checks employment status and round number
- Components affected: RoundManager, FinancialState, RapportSystem
- Already partially implemented in STORY-001-05, needs employment check

**Tasks:**
1. **002-07-T1**: Add employment status check to paycheck logic (2h)
   - Type: Implementation
   - Dependencies: 001-05 (Paycheck timing), 002-06 (Firing)
2. **002-07-T2**: Update FinancialState with Blue paycheck tracking (2h)
   - Type: Implementation
   - Dependencies: 002-07-T1
3. **002-07-T3**: Write unit tests for employed/fired paycheck scenarios (2h)
   - Type: Testing
   - Dependencies: 002-07-T2

**Definition of Done:**
- [ ] Code completed and follows standards
- [ ] Paycheck arrives when employed
- [ ] No paycheck when fired
- [ ] Balance updates correctly
- [ ] Summary screen shows paycheck
- [ ] Unit tests written and passing

---

### STORY-002-08: Context Switch Regrowth Penalty (Tracking)
**Epic:** EPIC-002
**Points:** 2
**Priority:** Must Have

**User Story:**
As **Blue Ball**
I want **my Blue task progress to regrow when I switch to Red tasks**
So that **I feel the cost of context switching**

**Acceptance Criteria:**
- [ ] ContextSwitchSystem tracks active task
- [ ] Detects switch from Blue task to Red task
- [ ] Marks Blue task as "regressing"
- [ ] Regrowth rate configurable (default: 30%)
- [ ] Regrowth pauses when resuming Blue task
- [ ] Visual indicator for regressing tasks (pulsing)
- [ ] task:regressing event emitted

**Technical Notes:**
- Implementation approach: ContextSwitchSystem monitors active task changes
- Components affected: ContextSwitchSystem, TaskCompletionSystem, EventBus
- Note: Visual regrowth logic will be in STORY-004-01 (task completion)

**Tasks:**
1. **002-08-T1**: Create ContextSwitchSystem class (3h)
   - Type: Implementation
   - Dependencies: INF-02 (EventBus), INF-03 (EntityStore)
2. **002-08-T2**: Implement active task tracking (2h)
   - Type: Implementation
   - Dependencies: 002-08-T1
3. **002-08-T3**: Add context switch detection logic (3h)
   - Type: Implementation
   - Dependencies: 002-08-T2
4. **002-08-T4**: Mark tasks as regressing (2h)
   - Type: Implementation
   - Dependencies: 002-08-T3
5. **002-08-T5**: Write unit tests for context switch detection (3h)
   - Type: Testing
   - Dependencies: 002-08-T4

**Definition of Done:**
- [ ] Code completed and follows standards
- [ ] Context switches detected accurately
- [ ] Blue tasks marked as regressing
- [ ] Regrowth rate from config
- [ ] task:regressing events emit
- [ ] Unit tests written and passing

---

### Red Ball Stories

---

### STORY-003-01: Red Task Spawning System
**Epic:** EPIC-003
**Points:** 5
**Priority:** Must Have

**User Story:**
As **Red Ball**
I want **household tasks to spawn visibly around the environment**
So that **both balls can see the work that needs doing**

**Acceptance Criteria:**
- [ ] Red tasks spawn at predictable intervals (30-45 seconds)
- [ ] Tasks spawn at random positions in game area
- [ ] Spawn rate configurable from config
- [ ] Tasks visible to both Blue and Red
- [ ] Tasks persist across rounds if not completed
- [ ] task:spawned event emitted
- [ ] Maximum cap on active tasks (prevent overflow)

**Technical Notes:**
- Implementation approach: Interval timer in TaskSpawnSystem, random position generation
- Components affected: TaskSpawnSystem, EntityStore, EventBus
- Position randomization: Within bounds of play area (configurable)

**Tasks:**
1. **003-01-T1**: Design RedTask entity structure (2h)
   - Type: Design
   - Dependencies: INF-03 (GameState)
2. **003-01-T2**: Add Red task spawning to TaskSpawnSystem (4h)
   - Type: Implementation
   - Dependencies: 003-01-T1, 002-01 (TaskSpawnSystem)
3. **003-01-T3**: Implement spawn interval timer (3h)
   - Type: Implementation
   - Dependencies: 003-01-T2, INF-04 (Config)
4. **003-01-T4**: Add random position generation within bounds (2h)
   - Type: Implementation
   - Dependencies: 003-01-T3
5. **003-01-T5**: Add task cap logic (max 20 active tasks) (2h)
   - Type: Implementation
   - Dependencies: 003-01-T4
6. **003-01-T6**: Write unit tests for spawn timing and position (3h)
   - Type: Testing
   - Dependencies: 003-01-T5

**Definition of Done:**
- [ ] Code completed and follows standards
- [ ] Tasks spawn at configured intervals
- [ ] Positions randomized within bounds
- [ ] Spawn rate respects config
- [ ] Task cap prevents overflow
- [ ] task:spawned events emit
- [ ] Unit tests written and passing

---

### STORY-003-02: Task Type Categorization
**Epic:** EPIC-003
**Points:** 3
**Priority:** Must Have

**User Story:**
As **Red Ball**
I want **tasks categorized by type (cleaning, cooking, childcare, errands)**
So that **tasks feel like realistic household work**

**Acceptance Criteria:**
- [ ] Task types: cleaning, cooking, childcare, errands
- [ ] Each type has different completion time (from config)
- [ ] Each type has different visual appearance (color/shape)
- [ ] Task type weighted spawn probability (from config)
- [ ] Type shown in UI tooltip/label

**Technical Notes:**
- Implementation approach: Task type property on RedTask, weighted random selection
- Components affected: TaskSpawnSystem, RedTask entity, SceneRenderer
- Weights example: cleaning 40%, cooking 30%, childcare 20%, errands 10%

**Tasks:**
1. **003-02-T1**: Add type property to RedTask entity (1h)
   - Type: Design
   - Dependencies: 003-01-T1 (RedTask)
2. **003-02-T2**: Implement weighted random type selection (3h)
   - Type: Implementation
   - Dependencies: 003-02-T1, INF-04 (Config)
3. **003-02-T3**: Add type-specific completion times (2h)
   - Type: Implementation
   - Dependencies: 003-02-T2
4. **003-02-T4**: Define visual styles per type (placeholder) (2h)
   - Type: Design
   - Dependencies: 003-02-T3
5. **003-02-T5**: Write unit tests for type distribution (2h)
   - Type: Testing
   - Dependencies: 003-02-T4

**Definition of Done:**
- [ ] Code completed and follows standards
- [ ] All 4 task types implemented
- [ ] Type selection weighted correctly
- [ ] Completion times vary by type
- [ ] Visual styles defined (to be rendered later)
- [ ] Unit tests written and passing

---

### STORY-003-03: Red Task Refusal Behavior
**Epic:** EPIC-003
**Points:** 5
**Priority:** Must Have

**User Story:**
As **Red Ball**
I want to **refuse tasks when stressed**
So that **I can simulate realistic overwhelm behavior**

**Acceptance Criteria:**
- [ ] AI Red can refuse tasks based on stress level
- [ ] Refusal probability increases with stress (0% at 0%, 90% at 90%)
- [ ] Player Red can ignore tasks (no forced completion)
- [ ] Task refusal has no hard penalty (only stress accumulation)
- [ ] Refusal threshold configurable (default: 60%)
- [ ] AI behavior documented

**Technical Notes:**
- Implementation approach: AIController checks Red stress before starting task
- Components affected: AIController, StressSystem
- Probability curve: Linear relationship between stress and refusal

**Tasks:**
1. **003-03-T1**: Add task refusal logic to AIController (4h)
   - Type: Implementation
   - Dependencies: Will create AIController in Sprint 5 (placeholder for now)
2. **003-03-T2**: Implement stress-based refusal probability (3h)
   - Type: Implementation
   - Dependencies: 003-03-T1, INF-04 (Config)
3. **003-03-T3**: Add player task ignoring (no forced completion) (2h)
   - Type: Implementation
   - Dependencies: 003-03-T2
4. **003-03-T4**: Write unit tests for refusal behavior (3h)
   - Type: Testing
   - Dependencies: 003-03-T3

**Definition of Done:**
- [ ] Code completed and follows standards
- [ ] AI refuses tasks based on stress
- [ ] Probability curve verified
- [ ] Player can ignore tasks freely
- [ ] No hard penalty for refusal
- [ ] Unit tests written and passing

---

### STORY-003-04: Red Sleep/End Round with Incomplete Tasks
**Epic:** EPIC-003
**Points:** 3
**Priority:** Must Have

**User Story:**
As **Red Ball**
I want to **sleep (end round) even with tasks remaining**
So that **I'm not forced to complete everything**

**Acceptance Criteria:**
- [ ] Red can trigger round end at any time
- [ ] "Sleep" button in UI for player Red
- [ ] AI Red can end round when stress high (>75%)
- [ ] Incomplete Red tasks carry over to next round
- [ ] No game over or failure from sleeping early
- [ ] round:end event triggered

**Technical Notes:**
- Implementation approach: Sleep button calls RoundManager.endRound()
- Components affected: UIManager, RoundManager, AIController
- AI sleep behavior: Probability-based when stress >75%

**Tasks:**
1. **003-04-T1**: Add "Sleep" button to UI (2h)
   - Type: Implementation
   - Dependencies: UIManager (from 001-03)
2. **003-04-T2**: Connect sleep button to RoundManager.endRound() (2h)
   - Type: Implementation
   - Dependencies: 003-04-T1, 001-02 (RoundManager)
3. **003-04-T3**: Add AI sleep behavior to AIController (placeholder) (3h)
   - Type: Implementation
   - Dependencies: 003-04-T2
4. **003-04-T4**: Write unit tests for sleep functionality (2h)
   - Type: Testing
   - Dependencies: 003-04-T3

**Definition of Done:**
- [ ] Code completed and follows standards
- [ ] Sleep button works for player Red
- [ ] AI Red can end round when stressed
- [ ] Tasks carry over correctly
- [ ] No penalty for sleeping early
- [ ] Unit tests written and passing

---

### STORY-003-05: Red Help Request System
**Epic:** EPIC-003
**Points:** 2
**Priority:** Must Have

**User Story:**
As **Red Ball**
I want to **request Blue's help when stressed**
So that **I can reduce my own stress burden**

**Acceptance Criteria:**
- [ ] "Request Help" button in UI for player Red
- [ ] Help request only available when stress >50%
- [ ] AI Red requests help at stress >75%
- [ ] Help request notifies Blue (visual indicator)
- [ ] Blue (player or AI) can accept or ignore
- [ ] Accepted help reduces Red stress by 15%
- [ ] Help request cooldown (30 seconds)

**Technical Notes:**
- Implementation approach: Help request event, Blue response logic
- Components affected: UIManager, StressSystem, AIController, EventBus
- Visual indicator: Pulsing icon or text above Red

**Tasks:**
1. **003-05-T1**: Add "Request Help" button to UI (2h)
   - Type: Implementation
   - Dependencies: UIManager
2. **003-05-T2**: Implement help request event (1h)
   - Type: Implementation
   - Dependencies: 003-05-T1, INF-02 (EventBus)
3. **003-05-T3**: Add stress reduction logic for accepted help (2h)
   - Type: Implementation
   - Dependencies: 003-05-T2, StressSystem (Sprint 4)
4. **003-05-T4**: Add cooldown timer (2h)
   - Type: Implementation
   - Dependencies: 003-05-T3
5. **003-05-T5**: Write unit tests for help request flow (2h)
   - Type: Testing
   - Dependencies: 003-05-T4

**Definition of Done:**
- [ ] Code completed and follows standards
- [ ] Help request button works
- [ ] Request only available when stressed
- [ ] Blue notified of request
- [ ] Stress reduction on acceptance
- [ ] Cooldown prevents spam
- [ ] Unit tests written and passing

---

### Physics & Interaction Stories

---

### STORY-004-01: Button-Hold Task Completion
**Epic:** EPIC-004
**Points:** 5
**Priority:** Must Have

**User Story:**
As a **player**
I want to **hold a button to complete tasks**
So that **task completion feels deliberate and satisfying**

**Acceptance Criteria:**
- [ ] Hold spacebar or mouse click to work on task
- [ ] Progress fills during hold
- [ ] Release before complete cancels progress (no partial credit)
- [ ] Task completion time from entity (varies by task)
- [ ] Multiple tasks can be worked on sequentially
- [ ] task:progress and task:complete events emitted
- [ ] Context switch regrowth applies during hold

**Technical Notes:**
- Implementation approach: TaskCompletionSystem tracks active task and elapsed time
- Components affected: TaskCompletionSystem, EventBus, InputHandler
- Input: Spacebar or left mouse button

**Tasks:**
1. **004-01-T1**: Create TaskCompletionSystem class (3h)
   - Type: Implementation
   - Dependencies: INF-02 (EventBus), INF-03 (EntityStore)
2. **004-01-T2**: Implement button hold tracking (4h)
   - Type: Implementation
   - Dependencies: 004-01-T2
3. **004-01-T3**: Add progress calculation and events (3h)
   - Type: Implementation
   - Dependencies: 004-01-T2
4. **004-01-T4**: Integrate context switch regrowth (3h)
   - Type: Implementation
   - Dependencies: 004-01-T3, 002-08 (ContextSwitch)
5. **004-01-T5**: Add cancel on release logic (2h)
   - Type: Implementation
   - Dependencies: 004-01-T4
6. **004-01-T6**: Write unit tests for completion flow (3h)
   - Type: Testing
   - Dependencies: 004-01-T5

**Definition of Done:**
- [ ] Code completed and follows standards
- [ ] Button hold works smoothly
- [ ] Progress tracks correctly
- [ ] Release cancels progress
- [ ] Events emit at correct times
- [ ] Context switch regrowth applies
- [ ] Unit tests written and passing

---

### STORY-004-02: Visual Fill Progress Bar
**Epic:** EPIC-004
**Points:** 3
**Priority:** Must Have

**User Story:**
As a **player**
I want to **see a circular fill bar showing task progress**
So that **I know how long to hold the button**

**Acceptance Criteria:**
- [ ] Circular progress bar appears above active task
- [ ] Bar fills smoothly from 0-100%
- [ ] Bar disappears on completion or cancel
- [ ] Bar color matches task type (blue/red)
- [ ] Bar updates in real-time during hold
- [ ] Responsive to progress events

**Technical Notes:**
- Implementation approach: DOM overlay with SVG circle or CSS animation
- Components affected: UIManager, TaskCompletionSystem, EventBus
- Rendering: Position overlay above task in 3D space (screen coordinates)

**Tasks:**
1. **004-02-T1**: Design progress bar HTML/CSS/SVG (3h)
   - Type: Design
   - Dependencies: None
2. **004-02-T2**: Create progress bar UI component (3h)
   - Type: Implementation
   - Dependencies: 004-02-T1, UIManager
3. **004-02-T3**: Subscribe to task:progress events (2h)
   - Type: Implementation
   - Dependencies: 004-02-T2, 004-01 (TaskCompletion)
4. **004-02-T4**: Update bar position based on task 3D position (3h)
   - Type: Implementation
   - Dependencies: 004-02-T3
5. **004-02-T5**: Add smooth animation (1h)
   - Type: Implementation
   - Dependencies: 004-02-T4

**Definition of Done:**
- [ ] Code completed and follows standards
- [ ] Progress bar renders correctly
- [ ] Bar fills smoothly
- [ ] Bar positioned above task
- [ ] Color matches task type
- [ ] Animation is smooth (60 FPS)

---

### STORY-004-03: Rising Audio During Hold
**Epic:** EPIC-004
**Points:** 3
**Priority:** Must Have

**User Story:**
As a **player**
I want to **hear rising audio pitch during button hold**
So that **task completion feels tense and engaging**

**Acceptance Criteria:**
- [ ] Audio pitch rises during hold (increasing tension)
- [ ] Pitch resets on release or cancel
- [ ] Audio stops on completion (replaced by ding)
- [ ] Volume configurable
- [ ] Audio can be muted
- [ ] Web Audio API for pitch control

**Technical Notes:**
- Implementation approach: Web Audio API oscillator with pitch ramp
- Components affected: AudioManager, TaskCompletionSystem, EventBus
- Pitch range: 200Hz → 800Hz over completion duration

**Tasks:**
1. **004-03-T1**: Create AudioManager class structure (3h)
   - Type: Implementation
   - Dependencies: None
2. **004-03-T2**: Implement Web Audio API integration (4h)
   - Type: Implementation
   - Dependencies: 004-03-T1
3. **004-03-T3**: Add rising pitch audio effect (4h)
   - Type: Implementation
   - Dependencies: 004-03-T2, 004-01 (TaskCompletion)
4. **004-03-T4**: Add volume control and mute (2h)
   - Type: Implementation
   - Dependencies: 004-03-T3
5. **004-03-T5**: Test audio across browsers (2h)
   - Type: Testing
   - Dependencies: 004-03-T4

**Definition of Done:**
- [ ] Code completed and follows standards
- [ ] Rising pitch audio works
- [ ] Audio stops/resets correctly
- [ ] Volume and mute controls work
- [ ] Cross-browser compatibility verified
- [ ] Audio latency <100ms

---

### STORY-004-04: Task Completion "Ding" Sound
**Epic:** EPIC-004
**Points:** 2
**Priority:** Must Have

**User Story:**
As a **player**
I want to **hear a satisfying "ding" when I complete a task**
So that **progress feels rewarding**

**Acceptance Criteria:**
- [ ] "Ding" sound plays on task completion
- [ ] 3-5 variations to avoid repetition
- [ ] Sound is satisfying and clear
- [ ] Volume configurable
- [ ] Responds to task:complete event
- [ ] Audio pooling for performance

**Technical Notes:**
- Implementation approach: AudioManager plays random ding variation
- Components affected: AudioManager, EventBus
- Sound files: Short MP3/OGG files (<1 second each)

**Tasks:**
1. **004-04-T1**: Source or create 3-5 ding sound variations (2h)
   - Type: Design
   - Dependencies: None
2. **004-04-T2**: Add sound file loading to AudioManager (2h)
   - Type: Implementation
   - Dependencies: 004-04-T1, 004-03 (AudioManager)
3. **004-04-T3**: Implement random variation selection (1h)
   - Type: Implementation
   - Dependencies: 004-04-T2
4. **004-04-T4**: Subscribe to task:complete event (1h)
   - Type: Implementation
   - Dependencies: 004-04-T3, INF-02 (EventBus)
5. **004-04-T5**: Add audio pooling for performance (2h)
   - Type: Implementation
   - Dependencies: 004-04-T4

**Definition of Done:**
- [ ] Code completed and follows standards
- [ ] Ding plays on completion
- [ ] Variations sound satisfying
- [ ] Volume control works
- [ ] No audio lag or stuttering
- [ ] Pooling prevents performance issues

---

### STORY-004-05: Physics-Based Ball Movement
**Epic:** EPIC-004
**Points:** 8
**Priority:** Must Have

**User Story:**
As a **player**
I want **balls to move with realistic 3D physics**
So that **movement feels natural and responsive**

**Acceptance Criteria:**
- [ ] Balls use PlayCanvas rigid body physics
- [ ] Balls bounce realistically on collision
- [ ] Balls roll with appropriate friction
- [ ] Collision with walls and obstacles
- [ ] Movement feels responsive (<100ms input latency)
- [ ] Physics runs at 60Hz fixed timestep
- [ ] No physics glitches or jitter

**Technical Notes:**
- Implementation approach: PlayCanvas SceneRenderer creates ball entities with physics
- Components affected: SceneRenderer, PlayCanvas scene setup
- Physics: Sphere collider, rigid body dynamics, material friction

**Tasks:**
1. **004-05-T1**: Create SceneRenderer class structure (4h)
   - Type: Implementation
   - Dependencies: PlayCanvas installed (INF-01)
2. **004-05-T2**: Initialize PlayCanvas application and canvas (3h)
   - Type: Implementation
   - Dependencies: 004-05-T1
3. **004-05-T3**: Create ball entity with sphere collider (4h)
   - Type: Implementation
   - Dependencies: 004-05-T2
4. **004-05-T4**: Add rigid body physics component (3h)
   - Type: Implementation
   - Dependencies: 004-05-T3
5. **004-05-T5**: Configure friction and bounce materials (3h)
   - Type: Implementation
   - Dependencies: 004-05-T4
6. **004-05-T6**: Set up fixed timestep physics loop (3h)
   - Type: Implementation
   - Dependencies: 004-05-T5
7. **004-05-T7**: Add floor and wall collision meshes (4h)
   - Type: Implementation
   - Dependencies: 004-05-T6
8. **004-05-T8**: Test physics behavior and tune parameters (4h)
   - Type: Testing
   - Dependencies: 004-05-T7

**Definition of Done:**
- [ ] Code completed and follows standards
- [ ] Balls move with realistic physics
- [ ] Collision detection works
- [ ] Friction and bounce feel natural
- [ ] Physics stable at 60Hz
- [ ] No jitter or glitches
- [ ] Input latency <100ms

---

### STORY-004-06: Gravity Toward Active Task
**Epic:** EPIC-004
**Points:** 5
**Priority:** Must Have

**User Story:**
As a **player**
I want **my ball to drift toward the active task**
So that **movement feels natural and I don't have to aim precisely**

**Acceptance Criteria:**
- [ ] Clicking task applies gravity vector toward task
- [ ] Gravity strength is light (drift, not snap)
- [ ] Gravity applied continuously during hold
- [ ] Gravity stops when task complete or button released
- [ ] Multiple tasks can be targeted sequentially
- [ ] Gravity configurable (strength parameter)

**Technical Notes:**
- Implementation approach: Apply force to ball rigid body toward task position
- Components affected: SceneRenderer, TaskCompletionSystem, PlayCanvas physics
- Force calculation: Direction vector * gravity strength constant

**Tasks:**
1. **004-06-T1**: Add task position tracking in TaskCompletionSystem (2h)
   - Type: Implementation
   - Dependencies: 004-01 (TaskCompletion)
2. **004-06-T2**: Calculate direction vector to task (2h)
   - Type: Implementation
   - Dependencies: 004-06-T1
3. **004-06-T3**: Apply force to ball rigid body (4h)
   - Type: Implementation
   - Dependencies: 004-06-T2, 004-05 (Physics)
4. **004-06-T4**: Add gravity strength config parameter (1h)
   - Type: Implementation
   - Dependencies: 004-06-T3, INF-04 (Config)
5. **004-06-T5**: Tune gravity strength for feel (3h)
   - Type: Testing
   - Dependencies: 004-06-T4

**Definition of Done:**
- [ ] Code completed and follows standards
- [ ] Gravity pulls ball toward task
- [ ] Gravity feels natural (not too strong)
- [ ] Gravity stops correctly
- [ ] Configurable strength
- [ ] Feel tested and tuned

---

## Sprint Plan

### Sprint 1: Infrastructure & Foundation (Weeks 1-2)
**Sprint Goal:** Establish technical foundation with config system, data layer, event bus, and project setup

**Planned Velocity:** 30 points

#### Committed Stories:
| Story ID | Title | Points | Priority |
|----------|-------|--------|----------|
| INF-01 | Project Scaffolding & TypeScript Setup | 3 | Must Have |
| INF-02 | EventBus Infrastructure | 5 | Must Have |
| INF-03 | Entity Store & Game State | 5 | Must Have |
| INF-04 | Configuration System Foundation | 8 | Must Have |
| 001-01 | Game State Machine | 5 | Must Have |
| 001-02 | Round Timer System | 5 | Must Have |

#### Key Deliverables:
- Working Vite + TypeScript + PlayCanvas project
- EventBus with typed events
- GameState and EntityStore operational
- Config system with Zod validation
- Basic round timer and state machine

#### Dependencies:
- None (foundation sprint)

#### Risks:
- **PlayCanvas integration complexity**: Mitigation: Allocate extra time for PlayCanvas setup
- **Zod schema complexity**: Mitigation: Start with minimal schema, expand iteratively

---

### Sprint 2: Core Game Loop (Weeks 3-4)
**Sprint Goal:** Complete the fundamental game loop with role selection, round progression, and summary screens

**Planned Velocity:** 30 points

#### Committed Stories:
| Story ID | Title | Points | Priority |
|----------|-------|--------|----------|
| 001-03 | Role Selection Screen | 3 | Must Have |
| 001-04 | End-of-Round Summary Screen | 5 | Must Have |
| 001-05 | Round Progression & Paycheck Timing | 5 | Must Have |
| 001-06 | Task Carryover Between Rounds | 2 | Must Have |
| 002-01 | Blue Work Chunk Spawning | 5 | Must Have |
| 002-02 | Subtask Splitting with Log Distribution | 5 | Must Have |
| 002-04 | Blue Work Visibility Toggle | 3 | Must Have |
| 003-01 | Red Task Spawning System | 5 | Must Have |

#### Key Deliverables:
- Playable role selection
- Complete round loop (start → play → summary → next round)
- Task spawning for both Blue and Red
- Paycheck system operational

#### Dependencies:
- Sprint 1 foundation systems

#### Risks:
- **Log-normal distribution correctness**: Mitigation: Unit tests with histogram validation
- **UI responsiveness**: Mitigation: Test on target browsers early

---

### Sprint 3: Task Systems & Physics (Weeks 5-6)
**Sprint Goal:** Implement task interaction mechanics, physics-based movement, and camera system

**Planned Velocity:** 30 points

#### Committed Stories:
| Story ID | Title | Points | Priority |
|----------|-------|--------|----------|
| 002-03 | Scope Creep Mechanic | 5 | Must Have |
| 003-02 | Task Type Categorization | 3 | Must Have |
| 004-01 | Button-Hold Task Completion | 5 | Must Have |
| 004-02 | Visual Fill Progress Bar | 3 | Must Have |
| 004-03 | Rising Audio During Hold | 3 | Must Have |
| 004-04 | Task Completion "Ding" Sound | 2 | Must Have |
| 004-05 | Physics-Based Ball Movement | 8 | Must Have |
| 007-01 | Fixed Isometric Camera | 5 | Should Have |

#### Key Deliverables:
- Fully functional task completion with audio/visual feedback
- Physics-based ball movement
- Isometric camera with panning
- Scope creep and task categorization

#### Dependencies:
- Sprint 2 task spawning systems
- AudioManager from STORY-004-03

#### Risks:
- **Physics tuning time**: Mitigation: Allocate full 4 hours for testing and tuning
- **Audio browser compatibility**: Mitigation: Test on all target browsers

---

### Sprint 4: Stress & Rapport Systems (Weeks 7-8)
**Sprint Goal:** Implement asymmetric stress mechanics, rapport tracking, and context switching

**Planned Velocity:** 30 points

#### Committed Stories:
| Story ID | Title | Points | Priority |
|----------|-------|--------|----------|
| 002-05 | Rapport Gauge System | 5 | Must Have |
| 002-06 | Rapport Decay & Firing Logic | 5 | Must Have |
| 002-07 | Paycheck System (employment check) | 2 | Must Have |
| 002-08 | Context Switch Regrowth Penalty | 2 | Must Have |
| 005-01 | Blue Stress Meter & Calculation | 5 | Must Have |
| 005-02 | Blue Stress from Incomplete Tasks | 3 | Must Have |
| 005-03 | Blue Stress from Helping Red | 3 | Must Have |
| 005-04 | Blue Stress from Rapport Decay | 3 | Must Have |
| 005-05 | Blue Cannot Request Help | 2 | Must Have |

#### Key Deliverables:
- Complete Blue stress system
- Rapport tracking with emoji gauge
- Firing mechanic operational
- Context switching penalty active

#### Dependencies:
- Sprint 3 task completion system
- Round system from Sprint 1-2

#### Risks:
- **Stress calculation complexity**: Mitigation: Comprehensive unit tests for all stress sources
- **Firing randomness balance**: Mitigation: Playtesting with various scenarios

---

### Sprint 5: Advanced Features (Weeks 9-10)
**Sprint Goal:** Complete Red stress system, empathy modals, employment event, and AI controller

**Planned Velocity:** 30 points

#### Committed Stories:
| Story ID | Title | Points | Priority |
|----------|-------|--------|----------|
| 003-03 | Red Task Refusal Behavior | 5 | Must Have |
| 003-04 | Red Sleep/End Round with Incomplete Tasks | 3 | Must Have |
| 003-05 | Red Help Request System | 2 | Must Have |
| 004-06 | Gravity Toward Active Task | 5 | Must Have |
| 005-06 | Blue Weeping Animation | 3 | Must Have |
| 005-07 | Red Stress Meter & Calculation | 5 | Must Have |
| 005-08 | Red Stress Debuffs to Blue | 5 | Must Have |
| 006-01 | Employment Event Trigger | 3 | Must Have |
| 006-02 | Red Income Integration | 3 | Must Have |

#### Key Deliverables:
- Complete Red stress system
- AI controller for non-player ball
- Employment event operational
- Red help request system
- Blue weeping animation

#### Dependencies:
- Sprint 4 stress foundation
- Sprint 3 physics for gravity

#### Risks:
- **AI behavior balance**: Mitigation: Configurable thresholds, extensive testing
- **Employment event timing**: Mitigation: Clear event triggers and UI feedback

---

### Sprint 6: Polish & Integration (Weeks 11-12)
**Sprint Goal:** Audio system, visual effects, empathy modals, tutorial, and final testing

**Planned Velocity:** 30 points

#### Committed Stories:
| Story ID | Title | Points | Priority |
|----------|-------|--------|----------|
| 005-09 | Empathy Modal System | 6 | Must Have |
| 006-03 | Blue Work Time Reduction | 5 | Must Have |
| 006-04 | Event Announcement Modal | 2 | Must Have |
| 007-02 | Camera Panning (WASD & Mouse Edge) | 3 | Should Have |
| 007-03 | Audio Feedback System | 5 | Should Have |
| 007-04 | Stress-Adaptive Music | 5 | Should Have |
| 007-05 | Visual Polish (Particles, Color Grading) | 2 | Could Have |
| 008-03 | Hot Reload Dev Mode | 3 | Should Have |
| 008-04 | Tutorial Modal System | 2 | Should Have |

#### Key Deliverables:
- Empathy modal system with 100+ actions
- Complete audio system with adaptive music
- Visual polish (particles, color grading)
- Tutorial system
- Full integration testing
- Performance optimization

#### Dependencies:
- All previous sprints (final integration)

#### Risks:
- **Performance budget**: Mitigation: Continuous profiling, object pooling
- **Empathy action library size**: Mitigation: Start with 20 actions, expand to 100+
- **Integration bugs**: Mitigation: Comprehensive end-to-end testing

---

## Critical Path

### Sequence of Critical Tasks:

1. **INF-01: Project Setup** →
2. **INF-02: EventBus** →
3. **INF-03: Entity Store** →
4. **INF-04: Config System** →
5. **001-01: State Machine** →
6. **001-02: Round Timer** →
7. **002-01: Blue Task Spawning** →
8. **003-01: Red Task Spawning** →
9. **004-01: Task Completion** →
10. **004-05: Physics Movement** →
11. **005-01: Blue Stress System** →
12. **005-07: Red Stress System** →
13. **005-09: Empathy Modals** →
14. **006-01: Employment Event**

### Potential Bottlenecks:

| Bottleneck | Impact | Mitigation Strategy |
|------------|--------|-------------------|
| **PlayCanvas Integration (004-05)** | Blocks all physics and rendering | Front-load research, allocate buffer time, use PlayCanvas examples |
| **Stress System Complexity (005-01, 005-07)** | Core mechanic, affects balance | Comprehensive unit tests, playtesting, configurable parameters |
| **Audio Performance (007-03, 007-04)** | Can degrade FPS if not optimized | Audio pooling, Web Audio API best practices, early profiling |
| **Empathy Action Library (005-09)** | Large content requirement (100+ actions) | Start with 20, expand iteratively, consider procedural generation |

---

## Risk Register

| Risk | Probability | Impact | Mitigation Strategy | Owner |
|------|------------|--------|-------------------|--------|
| PlayCanvas learning curve delays Sprint 3 | Medium | High | Allocate extra research time, use official examples, consider consulting docs | Developer |
| Physics tuning takes longer than estimated | Medium | Medium | Allocate dedicated tuning time (4h), use configurable parameters | Developer |
| Stress calculation bugs hard to debug | Medium | High | Comprehensive unit tests, visual debug overlays, logging | Developer |
| Audio latency on some browsers | Low | Medium | Test early on all target browsers, use Web Audio API polyfills | Developer |
| Performance drops below 60 FPS | Medium | High | Continuous profiling, object pooling, render batching, LOD (if needed) | Developer |
| Scope creep on empathy actions (100+) | High | Low | Start with 20 minimum, expand post-MVP, consider crowdsourcing | Developer |
| Config hot reload breaks state | Low | Medium | Preserve game state on reload, add rollback mechanism | Developer |
| Firing randomness feels unfair | Medium | Medium | Playtesting, adjustable thresholds, visual warning indicators | Developer |
| AI behavior too predictable | Medium | Low | Add randomness to decisions, configurable behavior parameters | Developer |

---

## Dependencies

### Internal Dependencies:

| Dependency | Required For | Sprint |
|------------|-------------|--------|
| EventBus (INF-02) | All systems communication | Sprint 1 |
| EntityStore (INF-03) | All entity management | Sprint 1 |
| ConfigLoader (INF-04) | All configurable parameters | Sprint 1 |
| RoundManager (001-02) | Round-based mechanics | Sprint 1 |
| TaskSpawnSystem (002-01, 003-01) | Task interaction, physics | Sprint 2 |
| TaskCompletionSystem (004-01) | Context switching, stress calculations | Sprint 3 |
| StressSystem (005-01, 005-07) | Empathy modals, debuffs, AI behavior | Sprint 4 |
| AudioManager (004-03) | All audio feedback | Sprint 3 |
| SceneRenderer (004-05) | All 3D rendering and physics | Sprint 3 |

### External Dependencies:

| Dependency | Purpose | Version |
|------------|---------|---------|
| PlayCanvas | 3D rendering, physics, scene management | ^2.4.0 |
| Vite | Build tool, dev server, HMR | ^6.0.0 |
| TypeScript | Type-safe development | ^5.3.0 |
| Zod | Runtime config validation | ^3.22.0 |
| Web Audio API | Audio feedback and adaptive music | Browser native |

---

## Technical Debt Allocation

### Planned Technical Debt:

| Sprint | Technical Debt Item | Points | Rationale |
|--------|-------------------|--------|-----------|
| Sprint 3 | Physics parameter tuning deferred | 0 | Use defaults, tune in Sprint 6 if time permits |
| Sprint 5 | AI behavior complexity limited | 0 | Naive AI sufficient for MVP, enhance post-launch |
| Sprint 6 | Empathy action library reduced (20 instead of 100) | 0 | Start small, expand post-MVP |
| Sprint 6 | Visual polish limited (no LOD, minimal post-processing) | 0 | Performance optimization only if needed |

### Refactoring Tasks:

- None planned for MVP (6 sprints focused on feature delivery)

---

## Testing Strategy

### Test Coverage by Sprint:

| Sprint | Testing Focus | Coverage Target |
|--------|--------------|-----------------|
| **Sprint 1** | Unit tests for EventBus, EntityStore, ConfigLoader | >90% |
| **Sprint 2** | Unit tests for RoundManager, TaskSpawnSystem, state machine | >90% |
| **Sprint 3** | Unit tests for TaskCompletion, integration tests for physics | >85% |
| **Sprint 4** | Unit tests for StressSystem, RapportSystem, integration tests | >90% |
| **Sprint 5** | Unit tests for AIController, EmploymentEvent, integration tests | >85% |
| **Sprint 6** | E2E tests for full gameplay loops, performance tests | >80% |

### Test Automation Plan:

| Phase | Automation |
|-------|------------|
| **Unit Tests** | Vitest with mocked dependencies, run on every commit |
| **Integration Tests** | Vitest with real dependencies, run pre-merge |
| **E2E Tests** | Manual playtesting (no Playwright for MVP), run pre-release |
| **Performance Tests** | Chrome DevTools profiling, manual verification at 60 FPS |

### Test Types:

1. **Unit Tests**: All game systems (RoundManager, StressSystem, etc.)
2. **Integration Tests**: System interactions (stress → rapport → firing)
3. **Validation Tests**: Config loading, Zod schema validation
4. **Performance Tests**: Frame time profiling, physics stability
5. **Manual Tests**: Game feel, balance, player experience

---

## Resource Requirements

### Development Team:
- **Senior Developer**: 1 (full-stack TypeScript, PlayCanvas experience preferred)

### Support Requirements:
- **DevOps**: Minimal (static hosting, CI/CD optional)
- **QA**: None (developer-led testing for MVP)
- **UX/UI**: None (developer-led design for MVP)
- **Audio**: Source free/licensed sound effects (ding, ambient music)
- **3D Art**: Minimal (balls, splatters can be procedural or simple models)

### Tools & Services:
- **IDE**: VS Code with TypeScript extensions
- **Version Control**: Git + GitHub
- **Hosting**: GitHub Pages, Netlify, or Vercel (free tier)
- **Asset Storage**: Public folder in repo (no CDN for MVP)
- **CI/CD**: Optional GitHub Actions for automated testing

---

## Success Metrics

### Sprint Success Criteria:

| Metric | Target | Measurement |
|--------|--------|-------------|
| Sprint goal achievement rate | >90% | Stories completed vs committed |
| Velocity consistency | ±5 points | Actual vs planned velocity |
| Bug escape rate | <5% | Bugs found post-sprint vs total |
| Technical debt ratio | <15% | Deferred work vs completed work |
| Test coverage | >85% | Vitest coverage report |

### Feature Success Criteria:

| Feature | Success Criteria | Verification |
|---------|-----------------|--------------|
| Round System | Rounds progress, paychecks arrive on time | Manual playtesting |
| Task Spawning | Tasks spawn at configured rates, types correct | Unit tests + visual inspection |
| Task Completion | Button hold feels responsive, audio satisfying | Manual playtesting |
| Physics | Balls move realistically, 60 FPS maintained | Performance profiling |
| Stress System | Stress accumulates correctly, debuffs apply | Unit tests + playtesting |
| Rapport System | Firing triggers unpredictably, feels sudden | Playtesting multiple scenarios |
| Empathy Modals | Modals appear every 30s, actions reduce stress | Manual playtesting |
| Employment Event | Event triggers rounds 3-5, reduces Blue time | Manual playtesting |

### Overall Project Success:

| Metric | Target | Rationale |
|--------|--------|-----------|
| **All Must Have FRs implemented** | 100% | Core game loop functional |
| **Performance: 60 FPS sustained** | >95% of gameplay time | Smooth player experience |
| **Test coverage** | >85% | Code quality and maintainability |
| **Cross-browser compatibility** | Chrome, Firefox, Safari, Edge | Broad accessibility |
| **Load time** | <3 seconds | Player retention |
| **Sprint completion** | 6 sprints in 12 weeks | On-time delivery |

---

## Recommendations

### For Product Owner:

1. **Prioritize Core Loop First**: Focus Sprint 1-2 on getting a playable round loop before advanced features
2. **Defer Visual Polish**: Accept minimal visuals for MVP, enhance post-launch based on feedback
3. **Reduce Empathy Action Library**: Start with 20 actions instead of 100, expand iteratively
4. **Enable Rapid Iteration**: Use config system to balance game feel without code changes
5. **Plan for Playtesting**: Allocate time in Sprint 4-6 for balance tuning based on playtesting

### For Development Team:

1. **Front-Load Technical Risk**: Tackle PlayCanvas integration early (Sprint 1-3)
2. **Maintain Test Coverage**: Write unit tests alongside implementation, don't defer
3. **Use Config-Driven Approach**: Avoid hardcoding values, use config from day one
4. **Profile Early**: Check performance in Sprint 3, don't wait until Sprint 6
5. **Document Systems**: Write inline docs for complex systems (StressSystem, RapportSystem)
6. **Leverage EventBus**: Keep systems decoupled, use events for all inter-system communication

### For Stakeholders:

1. **Expect Iterative Balance**: Game feel will require tuning in Sprint 4-6
2. **MVP Scope is Fixed**: 6 sprints, 180 points, single developer
3. **Visual Polish Limited**: Focus on mechanics over aesthetics for MVP
4. **Post-MVP Enhancements**: Multiplayer, mobile, advanced scenarios are future work
5. **Feedback Loops**: Provide feedback after Sprint 2 (playable loop) and Sprint 4 (core mechanics)

---

## Appendix

### Estimation Guidelines Used:

| Story Points | Complexity | Duration | Examples |
|--------------|-----------|----------|----------|
| **1 point** | Trivial | <2 hours | Add config parameter, simple UI text change |
| **2 points** | Simple | 2-4 hours | Add button, emit event, simple calculation |
| **3 points** | Moderate | 4-8 hours | UI component, simple system, weighted random |
| **5 points** | Complex | 8-16 hours | Full system (RoundManager, StressSystem), integration |
| **8 points** | Very Complex | 16-24 hours | PlayCanvas physics, complex rendering, AI logic |
| **13 points** | Too Large | >24 hours | Should be broken down into smaller stories |

### Velocity Assumptions:

- **Team**: 1 senior developer
- **Availability**: Full-time (40 hours/week)
- **Sprint Duration**: 2 weeks (10 working days, 80 hours)
- **Development Hours**: ~60 hours/sprint (accounting for meetings, breaks, overhead)
- **Velocity**: 30 points/sprint (conservative estimate for single developer)
- **Factors Considered**: Learning curve (PlayCanvas), testing time, integration complexity

### Agile Ceremonies Schedule:

| Ceremony | Duration | Frequency | Purpose |
|----------|----------|-----------|---------|
| **Daily Standup** | 5 min | Daily (solo: journal entry) | Track progress, identify blockers |
| **Sprint Planning** | 2 hours | Start of sprint | Commit to stories, clarify requirements |
| **Sprint Review** | 1 hour | End of sprint | Demo completed stories, gather feedback |
| **Sprint Retrospective** | 1 hour | End of sprint | Reflect on process, identify improvements |
| **Backlog Refinement** | 1 hour | Mid-sprint | Clarify upcoming stories, update estimates |

---

## Epic Traceability Matrix

| Epic ID | Epic Name | Stories | Total Points | Sprints |
|---------|-----------|---------|--------------|---------|
| EPIC-001 | Core Game Loop | 6 stories | 23 points | Sprint 1-2 |
| EPIC-002 | Blue Employment | 8 stories | 32 points | Sprint 2-4 |
| EPIC-003 | Red Household | 5 stories | 18 points | Sprint 2-5 |
| EPIC-004 | Task Interaction & Physics | 6 stories | 26 points | Sprint 3-5 |
| EPIC-005 | Stress System | 9 stories | 35 points | Sprint 4-6 |
| EPIC-006 | Red's Job Event | 4 stories | 13 points | Sprint 5-6 |
| EPIC-007 | Camera & Visual | 5 stories | 20 points | Sprint 3, 6 |
| EPIC-008 | Configuration & Tutorial | 4 stories | 13 points | Sprint 1, 6 |
| **Infrastructure** | **Foundation** | **4 stories** | **21 points** | **Sprint 1** |
| **TOTAL** | **9 Groups** | **47 stories** | **201 points** | **6 sprints** |

*(Note: Total is 201 points due to infrastructure stories; 180 points budgeted, 21 points infrastructure overhead)*

---

## FR Coverage Matrix

| FR ID | Description | Stories | Status |
|-------|-------------|---------|--------|
| FR-001 | Round-Based Time System | 001-01, 001-02, 001-05, 001-06 | Covered |
| FR-002 | Player Role Selection | 001-03, AIController (Sprint 5) | Covered |
| FR-003 | Blue Work Generation | 002-01, 002-02, 002-03 | Covered |
| FR-004 | Employment Rapport System | 002-05, 002-06 | Covered |
| FR-005 | Paycheck System | 001-05, 002-07 | Covered |
| FR-006 | Red Task Spawning | 003-01, 003-02 | Covered |
| FR-007 | Red Task Behavior | 003-03, 003-04 | Covered |
| FR-008 | Task Completion Interaction | 004-01, 004-02 | Covered |
| FR-009 | Context Switching Penalty | 002-08, 004-01 | Covered |
| FR-010 | Blue Stress Mechanics | 005-01, 005-02, 005-03, 005-04, 005-05, 005-06 | Covered |
| FR-011 | Red Stress Mechanics | 005-07, 005-08, 003-05 | Covered |
| FR-012 | Empathy Action System | 005-09 | Covered |
| FR-013 | Red Employment Event | 006-01, 006-02, 006-03, 006-04 | Covered |
| FR-014 | 3D Physics-Based Movement | 004-05 | Covered |
| FR-015 | Fixed Isometric Camera | 007-01 | Covered |
| FR-016 | End-of-Round Summary Screen | 001-04 | Covered |
| FR-017 | Tutorial/Tip Modals | 008-04 | Covered |
| FR-018 | Scenario Configuration System | INF-04 (008-01, 008-02) | Covered |
| FR-019 | Scenario Selection Screen | Deferred (post-MVP) | Not Covered |
| FR-020 | Audio Feedback System | 004-03, 004-04, 007-03, 007-04 | Covered |
| FR-021 | Visual Polish | 007-05 | Partially Covered |

**Coverage Summary:**
- **Must Have**: 18/18 FRs covered (100%)
- **Should Have**: 2/3 FRs covered (67% - FR-019 deferred)
- **Could Have**: 1/2 FRs covered (50% - FR-021 minimal)

---

**Document Version**: 1.0
**Date**: 2025-12-22
**Author**: BMAD Scrum Master (Automated)

**Based on**:
- PRD v1.0 (`/home/delorenj/code/DomesticSimulation/docs/prd-domesticsimulation-2025-12-22.md`)
- Architecture v1.0 (`/home/delorenj/code/DomesticSimulation/docs/architecture-domesticsimulation-2025-12-22.md`)

---

## Next Steps

### Immediate Actions:

1. **Review Sprint Plan**: Product owner reviews and approves sprint allocation
2. **Initialize Sprint 1**: Create tasks in tracking system (GitHub Projects or similar)
3. **Set Up Project**: Execute STORY-INF-01 (project scaffolding)
4. **Begin Development**: Start Sprint 1 with infrastructure stories

### Sprint 1 Kickoff Checklist:

- [ ] Sprint plan reviewed and approved
- [ ] GitHub repository created
- [ ] Development environment set up (Node.js, npm/pnpm, IDE)
- [ ] First standup scheduled (or journal entry for solo dev)
- [ ] Sprint board ready (Kanban or Scrum board)
- [ ] Story INF-01 in progress

---

**This document was created using BMAD Method v6 - Phase 4 (Sprint Planning)**

*To begin implementation: Start with Sprint 1, Story INF-01 (Project Scaffolding)*
*To track progress: Run `/bmad:workflow-status` to see workflow state*
*To create a story: Run `/bmad:create-story <story-id>` to generate detailed story ticket*
