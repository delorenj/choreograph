# Product Requirements Document: Choreograph

**Date:** 2025-12-22
**Author:** Jarad DeLorenzo
**Version:** 1.0
**Project Type:** Web Game / Simulation
**Project Level:** Level 3 (Complex)
**Status:** Draft

---

## Document Overview

This Product Requirements Document (PRD) defines the functional and non-functional requirements for Choreograph, a 3D web-based simulation game built with PlayCanvas that uses metaphor and gameplay to illustrate invisible labor dynamics, asymmetric household stress, and employment precarity.

**Related Documents:**
- Product Brief: /home/delorenj/code/choreograph/PRD.md (original transcript)

---

## Executive Summary

Choreograph is an emotional labor simulation game that uses cryptic visual metaphor to reveal invisible work dynamics in households where one partner is employed and the other manages household tasks. Players control either a Blue Ball (employed partner with invisible work) or Red Ball (household manager with visible tasks) in a top-down 3D environment.

The game uses round-based progression (1 round = 1 week), asymmetric stress mechanics, and context-switching penalties to demonstrate how invisible labor, lack of support, and financial precarity create unsustainable household dynamics. Educational empathy modals provide gentle, non-triggering guidance on mutual support.

**Core Innovation:** The game deliberately obscures the metaphor initially (just "blue ball" and "red ball"), allowing players to discover the underlying message through gameplay rather than explicit exposition.

---

## Product Goals

### Business Objectives

1. **Create an experiential simulation** that reveals invisible labor dynamics through gameplay rather than lecture
2. **Provide a cryptic but discoverable metaphor** for household work distribution that encourages empathy
3. **Gamify emotional labor concepts** to make abstract relationship dynamics concrete and understandable
4. **Enable scenario flexibility** through modular configuration to explore different household dynamics

### Success Metrics

1. **Player engagement:** Average session duration >15 minutes, indicating players are discovering the metaphor
2. **Empathy action interaction:** >30% of players engage with empathy modals (don't just dismiss)
3. **Scenario completion:** >50% of players complete at least 10 rounds
4. **Educational impact:** Post-play survey shows increased understanding of invisible labor (qualitative)
5. **Technical performance:** 60 FPS maintained on target hardware, <3 second load time

---

## Functional Requirements

Functional Requirements (FRs) define **what** the system does - specific features and behaviors.

Each requirement includes:
- **ID**: Unique identifier (FR-001, FR-002, etc.)
- **Priority**: Must Have / Should Have / Could Have / Won't Have (MoSCoW)
- **Description**: What the system should do
- **Acceptance Criteria**: How to verify it's complete

---

### Core Game Loop

### FR-001: Round-Based Time System

**Priority:** Must Have

**Description:**
Game progresses in discrete rounds. Each round represents 1 week. Paycheck arrives every 2 rounds (every 2 weeks). Incomplete tasks carry over between rounds. Round completion triggers summary screen.

**Acceptance Criteria:**
- [ ] Round timer advances gameplay state
- [ ] Each round represents 1 week of game time
- [ ] Round completion triggers end-of-round summary screen
- [ ] Incomplete Blue tasks carry over to next round
- [ ] Incomplete Red tasks carry over to next round
- [ ] Paycheck arrives on even-numbered rounds (rounds 2, 4, 6, etc.)
- [ ] Summary screen shows different content on paycheck rounds vs non-paycheck rounds

**Dependencies:** None (foundation system)

---

### FR-002: Player Role Selection

**Priority:** Must Have

**Description:**
At game start, player chooses to play as Blue Ball or Red Ball. AI controls the other ball using naive deterministic strategy. Player can restart and switch roles.

**Acceptance Criteria:**
- [ ] Role selection screen appears at game start
- [ ] Player can choose Blue Ball or Red Ball
- [ ] AI behavior for Blue Ball: completes assigned tasks, helps Red when asked
- [ ] AI behavior for Red Ball: completes Red tasks, requests help when stress >75%
- [ ] Player can restart game and switch roles from pause menu
- [ ] Role selection is clear but doesn't explicitly reveal metaphor

**Dependencies:** None

---

### Blue Ball Employment System

### FR-003: Blue Work Generation

**Priority:** Must Have

**Description:**
Blue receives work chunks from adjacent room with solid roof (invisible to Red, visible to Blue). Each chunk splits into random subtasks with log-distributed completion times. Some completed chunks split into additional chunks (scope creep).

**Acceptance Criteria:**
- [ ] Work chunks spawn from "tube" in adjacent room at round start
- [ ] Adjacent room has solid roof making contents invisible to Red Ball
- [ ] Work visibility is togglable per scenario configuration
- [ ] Each chunk splits into N subtasks where N is randomized (4-12 subtasks)
- [ ] Subtask completion time follows log^e distribution (most quick, rare long tasks)
- [ ] 10-20% of completed chunks split into 2-5 additional chunks (scope creep)
- [ ] Scope creep is random and unpredictable
- [ ] All Blue work is visually distinct from Red tasks (different color/shape)

**Dependencies:** FR-001 (round system), FR-008 (task interaction)

---

### FR-004: Employment Rapport System

**Priority:** Must Have

**Description:**
Blue's relationship with employer tracked via ambiguous "rapport" gauge displayed as emoji (frowny/smiley face, not numeric). Repeated missed deadlines lower rapport. Firing happens unpredictably when rapport is too low, simulating sudden job loss.

**Acceptance Criteria:**
- [ ] Rapport gauge displayed as ambiguous emoji range (😢 😕 😐 🙂 😊)
- [ ] Rapport gauge is NOT numeric (no percentage shown)
- [ ] Incomplete Blue work at round end reduces rapport
- [ ] Rapport decay accelerates with consecutive missed deadlines (compounds)
- [ ] Firing threshold is randomized around low rapport (15-25% rapport)
- [ ] Firing happens without explicit warning (feels sudden)
- [ ] Firing triggers game over or scenario reset
- [ ] Rapport increases slightly on successful round completion (all tasks done)

**Dependencies:** FR-001, FR-003

---

### FR-005: Paycheck System

**Priority:** Must Have

**Description:**
Blue receives binary income: $6,250 every 2 weeks (every 2 rounds) if employed, $0 if fired. Amount is insufficient to cover all expenses (hidden financial stress mechanic, not explicitly shown in UI).

**Acceptance Criteria:**
- [ ] Paycheck of $6,250 arrives every 2 rounds (rounds 2, 4, 6, etc.) if employed
- [ ] No paycheck arrives if rapport drops to firing threshold before paycheck round
- [ ] Visual indicator of paycheck arrival on summary screen
- [ ] Running total balance displayed (starts at $0, accumulates paychecks)
- [ ] Expenses are NOT explicitly shown (hidden mechanic)
- [ ] Balance is sufficient for 3-4 rounds, then starts deficit (simulates not enough income)
- [ ] No explicit "game over" from low balance, just increasing stress

**Dependencies:** FR-004 (employment status)

---

### FR-009: Context Switching Penalty

**Priority:** Must Have

**Description:**
Switching from incomplete Blue task to Red task incurs harsh penalty: Blue task progress "regrows" (decays) while working on Red tasks, simulating real-life context switching cost and 20-minute refocus time.

**Acceptance Criteria:**
- [ ] Switching from incomplete Blue task to Red task triggers regrowth mechanic
- [ ] Blue task progress decays at 30% rate while working on Red task
- [ ] Decay is visualized (task bucket refills)
- [ ] Regrowth continues until Blue task is resumed or Red task is complete
- [ ] Penalty does NOT apply when switching between Blue tasks
- [ ] Penalty does NOT apply when switching between Red tasks
- [ ] Penalty ONLY applies Blue → Red context switch
- [ ] Visual indicator when penalty is active (e.g., Blue task pulsing/glowing)

**Dependencies:** FR-003, FR-006, FR-008

---

### Red Ball Household System

### FR-006: Red Task Spawning

**Priority:** Must Have

**Description:**
Red tasks spawn as visible splotches/splatter around environment at slow, consistent rate. Tasks represent household work (cleaning, meals, kid activities). Spawn rate is predictable, simulating routine household labor.

**Acceptance Criteria:**
- [ ] Red tasks spawn at predictable, slow rate (1 task per 30-45 seconds)
- [ ] Visual representation as colorful splotches/splatter (red/pink/orange)
- [ ] Task types categorized: cleaning, cooking, childcare, errands
- [ ] Task type affects visual appearance (different splatter shapes)
- [ ] Spawn locations randomized within game area bounds
- [ ] Tasks visible to both Blue and Red balls
- [ ] Spawn rate is configurable per scenario
- [ ] Tasks persist across rounds if not completed

**Dependencies:** FR-001

---

### FR-007: Red Task Behavior

**Priority:** Must Have

**Description:**
Red can refuse to complete tasks, especially when stressed. Red can choose to sleep (end round) even with tasks remaining. No direct consequences for incomplete Red tasks besides stress accumulation and indirect Blue debuffs.

**Acceptance Criteria:**
- [ ] Red (AI or player) can ignore tasks without immediate penalty
- [ ] Task refusal probability increases with Red stress level
- [ ] Red can end round (sleep) with tasks remaining
- [ ] Incomplete Red tasks increase Red stress meter
- [ ] Incomplete Red tasks have NO hard penalty (no game over, no loss condition)
- [ ] Incomplete Red tasks indirectly affect Blue via stress-based debuffs (see FR-011)
- [ ] AI Red Ball refuses tasks when stress >60% (probability-based)

**Dependencies:** FR-001, FR-006, FR-011 (stress system)

---

### Task Interaction Mechanics

### FR-008: Task Completion Interaction

**Priority:** Must Have

**Description:**
Tasks completed via button HOLD (not press) with visual fill animation and rising audio feedback. Satisfying "ding" sound effect on completion. Ball gravitates toward active task.

**Acceptance Criteria:**
- [ ] Hold spacebar/click (not tap) to work on task
- [ ] Visual circular fill bar shows progress during hold
- [ ] Fill bar appears above active task
- [ ] Rising audio pitch plays during hold (increasing tension)
- [ ] Satisfying "ding" sound effect plays on completion
- [ ] Ball gravitates toward active task during hold (light physics pull)
- [ ] Task completion removes visual splotch/chunk from environment
- [ ] Releasing button before complete cancels progress (no partial credit)

**Dependencies:** FR-014 (physics system)

---

### Stress System

### FR-010: Blue Stress Mechanics

**Priority:** Must Have

**Description:**
Blue accumulates stress from workload, missed deadlines, helping Red, and rapport decay. Blue cannot request help (asymmetric mechanic). High stress causes visible weeping animation on avatar.

**Acceptance Criteria:**
- [ ] Blue stress meter increases from incomplete Blue tasks at round end (+10% per incomplete task)
- [ ] Blue stress increases when helping Red while own Blue tasks pending (+5% per Red task completed)
- [ ] Blue stress increases from rapport decay (+15% per rapport level lost)
- [ ] Blue cannot request help from Red (no "request help" button/mechanic)
- [ ] Ball avatar continuously weeps when stress meter ≥90%
- [ ] Stress does NOT naturally decrease (only via empathy actions, see FR-012)
- [ ] Stress meter displayed as fill bar (blue color, ominous when full)
- [ ] Stress >100% adds debuffs: 10% slower task completion per 10% overflow

**Dependencies:** FR-003, FR-004, FR-006, FR-009

---

### FR-011: Red Stress Mechanics

**Priority:** Must Have

**Description:**
Red accumulates stress from incomplete household tasks. High Red stress increases help requests to Blue. Sustained high Red stress applies debuffs to Blue (slower completion, increased regrowth).

**Acceptance Criteria:**
- [ ] Red stress meter increases from incomplete Red tasks at round end (+8% per incomplete task)
- [ ] Red stress increases probability of help requests (linear relationship)
- [ ] Help request probability: 0% at 0% stress, 50% at 50% stress, 90% at 90% stress
- [ ] Sustained high Red stress (≥75% for 3+ consecutive rounds) applies debuffs to Blue
- [ ] Blue debuffs from Red stress: 30% slower Blue task completion, 50% faster Blue task regrowth
- [ ] Red stress CAN be reduced by completing Red tasks (-10% per task)
- [ ] Red stress reduced when Blue helps with Red tasks (-15% per Blue-completed Red task)
- [ ] Red stress meter displayed as fill bar (red/pink color)

**Dependencies:** FR-006, FR-007, FR-010

---

### FR-012: Empathy Action System

**Priority:** Must Have

**Description:**
Every 30 seconds, game pauses with cute modal showing simple empathy actions Red can perform to reduce Blue's stress significantly. Actions include hugs, compliments, appreciation gestures. Library of 100+ actions.

**Acceptance Criteria:**
- [ ] Modal appears every 30 seconds during active gameplay
- [ ] Modal pauses game (time stops)
- [ ] Modal contains looping 2-3 second animation of empathy action
- [ ] Actions are simple, obvious, non-sexual (hug, compliment, "thank you", help offer)
- [ ] Red player can choose to perform action via button press
- [ ] Performing action reduces Blue stress by 25-40% (significant impact)
- [ ] Red AI has 10% probability of performing action (simulating low empathy)
- [ ] Library contains 100+ unique empathy actions with distinct animations
- [ ] Actions are categorized: physical affection, verbal affirmation, acts of service
- [ ] Modal can be dismissed without action (no penalty)

**Dependencies:** FR-010, FR-011

---

### Mid-Game Event

### FR-013: Red Employment Event

**Priority:** Must Have

**Description:**
After 3-5 rounds, Red gets a part-time job earning $400/round. Red's job cuts Blue's available work time by 40-50%. Red tasks continue spawning at same rate, forcing Blue to handle both workloads or face debuffs/rapport loss.

**Acceptance Criteria:**
- [ ] Event triggers after round 3, 4, or 5 (randomized timing)
- [ ] Event announced via modal: "Red got a part-time job!"
- [ ] Red earns $400/round starting next round
- [ ] Red income added to paycheck summary (separate line item)
- [ ] Blue's work time reduced by 45% (simulated via faster round timer or less time per task)
- [ ] Red tasks continue spawning at same rate (no reduction)
- [ ] Blue must complete own Blue tasks + assist with Red tasks to avoid consequences
- [ ] Failure to balance workloads increases stress for both balls
- [ ] Difficulty spike is noticeable but gradual (ramps over 2 rounds)

**Dependencies:** FR-001, FR-003, FR-005, FR-006, FR-010, FR-011

---

### Visual & Presentation

### FR-014: 3D Physics-Based Movement

**Priority:** Must Have

**Description:**
Balls move with realistic 3D physics (bounce, roll, collision). Clicking task applies light gravity vector toward task, creating natural movement. Physics powered by PlayCanvas engine.

**Acceptance Criteria:**
- [ ] Ball physics use PlayCanvas built-in rigid body physics
- [ ] Clicking task applies gravity vector toward task coordinates
- [ ] Gravity strength is light (natural drift, not snap-to)
- [ ] Balls bounce realistically on collision with walls/obstacles
- [ ] Balls roll/tumble with appropriate friction
- [ ] Movement feels responsive (<100ms input latency)
- [ ] Physics calculations run at 60Hz (stable physics simulation)

**Dependencies:** None (PlayCanvas core feature)

---

### FR-015: Fixed Isometric Camera

**Priority:** Must Have

**Description:**
Camera fixed at isometric pinball-style angle (30-45° from top-down). Smooth panning allowed via edge-of-screen mouse or WASD. No rotation or zoom.

**Acceptance Criteria:**
- [ ] Camera locked at 35° isometric angle
- [ ] Smooth panning via mouse at screen edges (10px margin)
- [ ] Smooth panning via WASD keys (alternative control)
- [ ] No camera rotation (fixed orientation)
- [ ] No camera zoom (fixed distance)
- [ ] Full game area visible with minimal panning (90% visible from center)
- [ ] Panning speed is comfortable (not too fast/slow)

**Dependencies:** None

---

### FR-016: End-of-Round Summary Screen

**Priority:** Must Have

**Description:**
Summary screen displays round results with clever exposition. Shows tasks completed, stress levels, rapport changes, income. Provides opportunity for narrative hints without being explicit.

**Acceptance Criteria:**
- [ ] Summary appears at end of each round (after round timer expires)
- [ ] Displays: Blue tasks completed/total, Red tasks completed/total
- [ ] Displays: Blue stress meter change, Red stress meter change
- [ ] Displays: Rapport change (emoji shift visualization)
- [ ] Displays: Income received (on paycheck rounds only)
- [ ] Displays: Running balance total
- [ ] Includes subtle exposition text hinting at metaphor (e.g., "Blue felt overwhelmed juggling invisible work")
- [ ] "Continue" button advances to next round
- [ ] "Restart" button available to reset scenario

**Dependencies:** FR-001

---

### FR-017: Tutorial/Tip Modals

**Priority:** Should Have

**Description:**
Short, cute animated modals provide non-triggering education on gameplay mechanics and underlying themes. Appear at key moments (first task, first help request, first debuff).

**Acceptance Criteria:**
- [ ] Modals appear at key tutorial moments (round 1 start, first task, first help request, first debuff)
- [ ] Animations are cute, 2-3 second loops, non-threatening visual style
- [ ] Language is gentle, educational, not preachy or accusatory
- [ ] Modals can be dismissed via button press
- [ ] Tutorial can be disabled in settings (for replay)
- [ ] Tutorial state persists (don't repeat dismissed tips)

**Dependencies:** None

---

### Configuration & Modularity

### FR-018: Scenario Configuration System

**Priority:** Should Have

**Description:**
Game supports multiple scriptable scenarios with configurable parameters defined in JSON/YAML files. All gauges/meters are modular and individually togglable. Values exposed as variables (not hardcoded).

**Acceptance Criteria:**
- [ ] Scenarios defined in JSON or YAML config files (`/scenarios/*.json`)
- [ ] Configurable parameters include:
  - Round length (time limit per round)
  - Blue/Red task spawn rates
  - Stress threshold values
  - Debuff intensity multipliers
  - AI behavior probabilities
  - Rapport decay rates
  - Income amounts
  - Work visibility toggles
- [ ] All gauges/meters are modular (can be hidden/shown per scenario)
- [ ] No hardcoded magic numbers in game logic (all values from config)
- [ ] Config hot-reloading in dev mode (change file, reload, see changes)
- [ ] Config validation on load (errors shown if invalid)

**Dependencies:** None (architecture decision)

---

### FR-019: Scenario Selection Screen

**Priority:** Could Have

**Description:**
Players can choose from predefined scenarios before game start (e.g., "Baseline", "Red Has Job", "Both Working", "Single Parent"). Each scenario loads different configuration parameters.

**Acceptance Criteria:**
- [ ] Scenario selection screen appears before role selection
- [ ] Each scenario has name, short description, difficulty indicator (stars)
- [ ] Scenarios include:
  - "Baseline" (one employed, one household manager)
  - "Red Gets Job" (mid-game event enabled)
  - "Both Working" (both have employment, both have household tasks)
  - "Single Parent" (one ball, double workload)
- [ ] Scenario selection loads appropriate config file
- [ ] Default scenario is "Baseline"

**Dependencies:** FR-018

---

### Polish & Feedback

### FR-020: Audio Feedback System

**Priority:** Should Have

**Description:**
Satisfying audio cues for task completion, stress events, paycheck arrival, rapport changes. Background music adapts to stress levels (calm → tense).

**Acceptance Criteria:**
- [ ] Task completion "ding" is satisfying, varied (3-5 variations to avoid repetition)
- [ ] Stress meter increase has subtle audio cue (low ominous note)
- [ ] Stress meter decrease has subtle positive cue (light chime)
- [ ] Paycheck arrival has positive sound (cash register or coin sound)
- [ ] Rapport decrease has subtle negative sound (descending notes)
- [ ] Background music adapts to combined stress levels:
  - 0-30% stress: Calm, peaceful ambient
  - 30-60% stress: Slightly tense, faster tempo
  - 60-90% stress: Tense, driving rhythm
  - 90%+ stress: Chaotic, overwhelming
- [ ] All audio can be muted via settings
- [ ] Volume sliders for music/SFX (independent control)

**Dependencies:** FR-010, FR-011

---

### FR-021: Visual Polish

**Priority:** Could Have

**Description:**
Visual enhancements including particle effects on task completion, smooth transitions between screens, color grading shifts based on stress levels, subtle emissive glow on balls.

**Acceptance Criteria:**
- [ ] Task completion spawns particle effect (confetti, sparkles, appropriate to task type)
- [ ] Screen color grading shifts based on combined stress (warm → cool → desaturated)
- [ ] Smooth fade transitions between screens (200-300ms)
- [ ] Balls have subtle emissive glow (blue/red, pulsates with stress)
- [ ] UI elements have smooth hover/press animations
- [ ] Post-processing effects: subtle bloom, color correction

**Dependencies:** FR-010, FR-011

---

## Non-Functional Requirements

Non-Functional Requirements (NFRs) define **how** the system performs - quality attributes and constraints.

---

### NFR-001: Performance - Frame Rate

**Priority:** Must Have

**Description:**
Game maintains 60 FPS on modern desktop browsers with integrated graphics (Intel HD 620 equivalent or better).

**Acceptance Criteria:**
- [ ] 60 FPS sustained on Chrome, Firefox, Safari (latest 2 versions)
- [ ] Tested on Intel integrated graphics (HD 620 or equivalent)
- [ ] No frame drops during task completion animations
- [ ] No frame drops during particle effects
- [ ] Physics simulation stable at 60Hz

**Rationale:** Smooth physics and animations are critical for satisfying gameplay. Poor performance would undermine the emotional impact.

---

### NFR-002: Modularity - Configuration-Driven

**Priority:** Must Have

**Description:**
All game parameters (spawn rates, stress thresholds, task types, etc.) are defined in external JSON/YAML configuration files, not hardcoded in source.

**Acceptance Criteria:**
- [ ] Scenario configs are JSON/YAML format
- [ ] Changing parameters requires no code changes (just config edit)
- [ ] Hot-reloading of configs in dev mode (instant preview)
- [ ] Config schema documented with examples

**Rationale:** Enables easy scenario creation, balancing, and experimentation without engineering effort. Aligns with modular architecture preferences.

---

### NFR-003: Browser Compatibility

**Priority:** Should Have

**Description:**
Game runs on modern desktop browsers (Chrome, Firefox, Safari, Edge). Mobile support is out of scope for MVP.

**Acceptance Criteria:**
- [ ] Tested on Chrome 120+, Firefox 120+, Safari 17+, Edge 120+
- [ ] WebGL 2.0 support required
- [ ] No mobile/tablet support required for MVP
- [ ] Desktop browser window minimum 1280x720

**Rationale:** Focus on desktop experience for MVP. Mobile introduces complexity (touch controls, performance constraints) that can be addressed post-launch.

---

### NFR-004: Maintainability - Code Structure

**Priority:** Should Have

**Description:**
Codebase follows modular architecture with clear separation of concerns: data models, game systems (logic), rendering (presentation). TypeScript with strict typing.

**Acceptance Criteria:**
- [ ] TypeScript codebase with `strict: true` in tsconfig
- [ ] Separation of concerns:
  - Data models (types, interfaces)
  - Game systems (task spawning, stress calculation, round management)
  - Rendering (PlayCanvas scene, UI, animations)
- [ ] Component interfaces documented
- [ ] No circular dependencies
- [ ] Linting with ESLint, formatting with Prettier

**Rationale:** Aligns with layered abstraction and strict typing architectural preferences. Enables easier testing, debugging, and future feature additions.

---

### NFR-005: Development Velocity

**Priority:** Should Have

**Description:**
PlayCanvas editor supports rapid iteration with live preview and automated asset pipeline.

**Acceptance Criteria:**
- [ ] Changes visible in live preview within 2 seconds (hot module reload)
- [ ] Asset imports (3D models, sounds, textures) automated via pipeline
- [ ] No manual build steps required for preview
- [ ] Source control integration (Git-friendly project structure)

**Rationale:** Fast iteration is critical for game feel. Slow preview cycles would hinder polish and balancing.

---

## Epics

Epics are logical groupings of related functionality that will be broken down into user stories during sprint planning (Phase 4).

Each epic maps to multiple functional requirements and will generate 2-10 stories.

---

### EPIC-001: Core Game Loop

**Description:**
Implements the fundamental round-based time system (1 round = 1 week), role selection, and end-of-round summary screens that drive the entire gameplay experience.

**Functional Requirements:**
- FR-001: Round-Based Time System
- FR-002: Player Role Selection
- FR-016: End-of-Round Summary Screen

**Story Count Estimate:** 5-7 stories

**Priority:** Must Have

**Business Value:**
Foundation for all other game systems. Without a working game loop, nothing else functions. Establishes the weekly rhythm and paycheck cadence (every 2 weeks).

---

### EPIC-002: Blue Ball Employment Simulation

**Description:**
Complete employment system including invisible work generation from tube, rapport tracking with employer, context-switching penalties, and binary income mechanics.

**Functional Requirements:**
- FR-003: Blue Work Generation
- FR-004: Employment Rapport System
- FR-005: Paycheck System
- FR-009: Context Switching Penalty

**Story Count Estimate:** 6-8 stories

**Priority:** Must Have

**Business Value:**
Core metaphor for invisible labor and employment precarity. The hidden work, ambiguous rapport gauge, and sudden firing simulate real-world job insecurity. Critical for message delivery.

---

### EPIC-003: Red Ball Household Simulation

**Description:**
Household task spawning system with visible tasks, stress-based refusal mechanics, and consequence-free incompletion (only indirect stress effects).

**Functional Requirements:**
- FR-006: Red Task Spawning
- FR-007: Red Task Behavior

**Story Count Estimate:** 4-5 stories

**Priority:** Must Have

**Business Value:**
Represents the visible but undervalued household labor that contrasts with Blue's invisible work. Red's ability to refuse tasks without direct penalty highlights the asymmetry.

---

### EPIC-004: Task Interaction & Physics

**Description:**
Button-hold task completion mechanics with satisfying audio/visual feedback, 3D physics-based ball movement toward tasks, and gravity-based navigation.

**Functional Requirements:**
- FR-008: Task Completion Interaction
- FR-014: 3D Physics-Based Movement

**Story Count Estimate:** 5-6 stories

**Priority:** Must Have

**Business Value:**
Makes the game feel satisfying to play. Poor interaction mechanics would undermine the message. The deliberate button-hold creates weight and intentionality.

---

### EPIC-005: Asymmetric Stress System

**Description:**
Dual stress meters with asymmetric mechanics: Blue cannot request help, Red can. Sustained high Red stress applies debuffs to Blue. Empathy action modals provide gentle education.

**Functional Requirements:**
- FR-010: Blue Stress Mechanics
- FR-011: Red Stress Mechanics
- FR-012: Empathy Action System

**Story Count Estimate:** 7-9 stories

**Priority:** Must Have

**Business Value:**
The emotional core of the game. Stress asymmetry reveals the central tension and unfairness. Empathy modals provide actionable guidance without preaching.

---

### EPIC-006: Red's Job Event

**Description:**
Mid-game event (rounds 3-5) where Red gets part-time job earning $400/round, reducing Blue's work time by 45% while Red tasks continue spawning.

**Functional Requirements:**
- FR-013: Red Employment Event

**Story Count Estimate:** 3-4 stories

**Priority:** Must Have

**Business Value:**
Demonstrates how "helping" can paradoxically increase Blue's burden. Key narrative beat that shifts difficulty and reveals the fragility of the system.

---

### EPIC-007: Camera & Visual Systems

**Description:**
Fixed isometric camera with smooth panning, visual polish (particles, color grading, transitions), and adaptive audio feedback system.

**Functional Requirements:**
- FR-015: Fixed Isometric Camera
- FR-020: Audio Feedback System
- FR-021: Visual Polish

**Story Count Estimate:** 5-7 stories

**Priority:** Should Have

**Business Value:**
Polish makes the game professional and engaging. Audio/visual feedback reinforces emotional beats. Stress-adaptive music heightens immersion.

---

### EPIC-008: Configuration & Tutorial

**Description:**
Modular scenario configuration system allowing easy creation of new scenarios via JSON/YAML, plus gentle tutorial/tip modals for education.

**Functional Requirements:**
- FR-017: Tutorial/Tip Modals
- FR-018: Scenario Configuration System
- FR-019: Scenario Selection Screen

**Story Count Estimate:** 6-8 stories

**Priority:** Should Have

**Business Value:**
Configuration enables easy balancing and scenario expansion without code changes. Tutorials ensure message lands gently without triggering defensive reactions.

---

## User Stories (High-Level)

User stories follow the format: "As a [user type], I want [goal] so that [benefit]."

These are preliminary stories. Detailed stories will be created in Phase 4 (Implementation).

---

### EPIC-001: Core Game Loop

- As a **player**, I want to **select which ball to control at game start**, so that **I can experience different perspectives of the household dynamic**.
- As a **player**, I want to **progress through week-long rounds**, so that **I can see how stress and tasks accumulate over time**.
- As a **player**, I want to **view a summary screen after each round**, so that **I can understand what happened and track my progress**.

---

### EPIC-002: Blue Ball Employment Simulation

- As **Blue Ball**, I want **work chunks to arrive invisibly through my tube**, so that **Red Ball cannot see my workload**.
- As **Blue Ball**, I want **my employer rapport to decay when I miss deadlines**, so that **I feel the pressure of invisible job insecurity**.
- As **Blue Ball**, I want to **receive $6,250 every 2 weeks if employed**, so that **I can keep the household financially stable** (even though it's not quite enough).
- As **Blue Ball**, I want **task progress to regrow when I context-switch to Red tasks**, so that **I feel the cost of helping with household work**.

---

### EPIC-003: Red Ball Household Simulation

- As **Red Ball**, I want **household tasks to spawn visibly around the environment**, so that **both balls can see the work that needs doing**.
- As **Red Ball**, I want to **refuse tasks when stressed**, so that **I can simulate realistic overwhelm behavior**.
- As **Red Ball**, I want to **sleep even with tasks remaining**, so that **I'm not forced to complete everything**.

---

### EPIC-004: Task Interaction & Physics

- As a **player**, I want to **hold a button to complete tasks**, so that **task completion feels deliberate and satisfying**.
- As a **player**, I want **my ball to gravitate toward active tasks**, so that **movement feels natural and responsive**.
- As a **player**, I want to **hear and see satisfying feedback when completing tasks**, so that **progress feels rewarding**.

---

### EPIC-005: Asymmetric Stress System

- As **Blue Ball**, I want **my stress to increase from workload and helping Red**, so that **I feel the burden of invisible labor**.
- As **Blue Ball**, I want to **have no way to request help**, so that **the asymmetry of support is clear**.
- As **Red Ball**, I want to **request Blue's help when stressed**, so that **I can reduce my own stress burden**.
- As a **player**, I want to **see periodic empathy action modals**, so that **I learn simple ways Red could support Blue**.

---

### EPIC-006: Red's Job Event

- As **Red Ball**, I want to **get a part-time job earning $400/week after several rounds**, so that **I feel like I'm contributing financially**.
- As **Blue Ball**, I want **my work time cut in half when Red gets a job**, so that **I experience the increased burden of losing support**.
- As **Blue Ball**, I want **Red's household tasks to continue spawning despite Red's job**, so that **I must handle both workloads or face consequences**.

---

### EPIC-007: Camera & Visual Systems

- As a **player**, I want a **fixed isometric camera with smooth panning**, so that **I can see the entire play area comfortably**.
- As a **player**, I want **audio cues for task completion and stress events**, so that **I receive constant feedback on my actions**.
- As a **player**, I want **visual polish like particles and color grading**, so that **the game feels professional and immersive**.

---

### EPIC-008: Configuration & Tutorial

- As a **designer/developer**, I want **all game parameters configurable via external files**, so that **I can balance and create scenarios without code changes**.
- As a **player**, I want **gentle tutorial modals at key moments**, so that **I understand mechanics without feeling lectured**.
- As a **player**, I want to **select from multiple scenarios**, so that **I can explore different household dynamics**.

---

## User Personas

### Persona 1: Blue Ball (Employed Partner)

**Demographics:** Working professional, sole income earner, 30-45 years old

**Goals:**
- Maintain employment to support household financially
- Complete invisible work before deadlines
- Manage stress without support system

**Pain Points:**
- Work is invisible to partner
- No way to request help
- Context-switching destroys productivity
- Job security is ambiguous and precarious
- Income barely covers expenses

**Behavior:**
- Must prioritize Blue tasks to avoid firing
- Helping Red increases own stress
- Cannot express stress or request support
- Experiences compound stress from multiple sources

---

### Persona 2: Red Ball (Household Manager)

**Demographics:** Household manager (employed or not), 30-45 years old

**Goals:**
- Complete household tasks (cleaning, cooking, childcare)
- Reduce personal stress
- Contribute financially (after getting job)

**Pain Points:**
- Tasks are visible but undervalued
- Stress has no direct consequences (can be ignored)
- Getting job increases household burden on partner

**Behavior:**
- Can request help when stressed
- Can refuse tasks without penalty
- Can end round with tasks incomplete
- May not notice partner's invisible stress

---

## User Flows

### Flow 1: Game Start → First Round → Summary

1. Player launches game
2. Player selects scenario (or uses default "Baseline")
3. Player selects role (Blue Ball or Red Ball)
4. Game initializes: Blue work spawns from tube, Red tasks begin spawning
5. Round timer starts (1 week countdown)
6. Player completes tasks via button hold
7. Empathy modal appears at 30-second intervals
8. Round timer expires
9. Summary screen shows:
   - Tasks completed (Blue/Red)
   - Stress changes
   - Rapport change (Blue only)
   - Income (if round 2, 4, 6, etc.)
10. Player clicks "Continue" to next round

---

### Flow 2: Blue Ball Experience (Typical Round)

1. Round starts, Blue work chunks spawn from tube
2. Blue chunks split into 4-12 subtasks (random)
3. Player begins completing Blue tasks via button hold
4. Red requests help (if Red stress >75%)
5. Player must decide: ignore request (Red stress increases) or help (Blue tasks regrow)
6. If helping Red: Blue task progress decays at 30% rate (context switch penalty)
7. Player returns to Blue tasks, must rebuild lost progress
8. Round ends
9. Summary shows:
   - Blue tasks incomplete → Rapport decreases
   - Blue stress increases (incomplete tasks + helping Red)
   - No paycheck (odd-numbered round)
10. Next round, stress carries over, more tasks spawn

---

### Flow 3: Red Ball Experience (Typical Round)

1. Round starts, Red tasks spawn slowly and consistently
2. Player completes Red tasks via button hold
3. Stress increases if tasks pile up
4. Player can request Blue's help (if stress >50%)
5. Blue (AI) helps with Red tasks, reducing Red stress
6. Player can choose to sleep (end round) even with tasks remaining
7. Round ends
8. Summary shows:
   - Red tasks incomplete → Red stress increases
   - Blue stress increased (helped with Red tasks)
   - Paycheck arrives (if even-numbered round)
10. Next round, tasks carry over

---

### Flow 4: Red Gets Job Event

1. Player reaches round 3, 4, or 5
2. Modal announces: "Red got a part-time job!"
3. Starting next round:
   - Red earns $400/round
   - Blue's work time reduced by 45% (faster round timer or reduced task time)
   - Red tasks continue spawning at same rate
4. Blue must now complete Blue tasks + help with Red tasks in less time
5. Stress accelerates, rapport becomes harder to maintain
6. Player experiences difficulty spike

---

## Dependencies

### Internal Dependencies

- **PlayCanvas Engine:** 3D rendering, physics, asset management
- **TypeScript Build System:** Compilation, bundling, hot reload
- **Scenario Config Files:** JSON/YAML definitions for game parameters
- **Asset Pipeline:** 3D models (balls, environment), textures, audio files

### External Dependencies

- **PlayCanvas Cloud Editor:** Development environment, asset hosting
- **Web Browser:** Chrome/Firefox/Safari/Edge (WebGL 2.0 support)
- **Audio Library:** Web Audio API or Howler.js for adaptive music
- **Animation System:** PlayCanvas animation component or custom tweening

---

## Assumptions

1. **PlayCanvas Capability:** PlayCanvas can handle physics simulation, particle effects, and audio at 60 FPS on target hardware.
2. **Player Literacy:** Players have basic understanding of game controls (mouse/keyboard, button hold mechanics).
3. **Session Length:** Players will engage for 15-30 minutes per session (10-20 rounds).
4. **Discovery Over Explanation:** Players will discover the underlying metaphor through gameplay without explicit exposition.
5. **Emotional Safety:** Tutorial modals and gentle language will reduce defensive reactions.
6. **Configurability:** JSON/YAML configs can express all game parameters without code changes.
7. **AI Simplicity:** Naive deterministic AI for non-player ball is sufficient for single-player experience.

---

## Out of Scope

The following are explicitly NOT included in the MVP:

1. **Multiplayer:** Two human players controlling Blue/Red simultaneously (potential future enhancement).
2. **Mobile/Tablet Support:** Touch controls, responsive layouts, mobile performance optimization (MVP is desktop-only).
3. **Narrative Dialogue:** Explicit story text, dialogue trees, or character exposition (metaphor is discovered, not explained).
4. **Saving/Loading:** Mid-session save/load functionality (sessions are designed to be completable in 15-30 minutes).
5. **Leaderboards/Achievements:** Competitive features, score tracking, achievement systems.
6. **Customization:** Ball skins, environment themes, cosmetic unlocks.
7. **Additional Scenarios (MVP):** Only "Baseline" and "Red Gets Job" scenarios included in MVP. "Both Working" and "Single Parent" are future enhancements.
8. **Localization:** Multi-language support (English-only for MVP).
9. **Accessibility (Advanced):** Screen reader support, colorblind modes, motor disability accommodations (basic accessibility only).

---

## Open Questions

1. **Round Timer Visibility:** Should the round timer be explicitly shown as a countdown, or subtly indicated (e.g., day/night cycle, UI elements)?
2. **Firing Animation:** How should Blue's firing be visualized? (Modal, cutscene, abrupt game over screen?)
3. **Empathy Action Variety:** Should empathy actions be categorized (physical, verbal, acts of service) or random?
4. **Balance Tuning:** What are the exact spawn rates, stress thresholds, and debuff multipliers that create optimal difficulty curve? (Requires playtesting.)
5. **Scenario Progression:** Should scenarios unlock sequentially ("Baseline" → "Red Gets Job" → "Both Working"), or all available from start?
6. **AI Difficulty:** Should AI have difficulty settings (Easy AI helps more often, Hard AI ignores requests)?

---

## Approval & Sign-off

### Stakeholders

- **Product Owner:** Jarad DeLorenzo
- **Engineering Lead:** Jarad DeLorenzo
- **Design Lead:** TBD
- **QA Lead:** TBD

### Approval Status

- [ ] Product Owner
- [ ] Engineering Lead
- [ ] Design Lead
- [ ] QA Lead

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-12-22 | Jarad DeLorenzo | Initial PRD created from braindump transcript |

---

## Next Steps

### Phase 3: Architecture

Run `/bmad:architecture` to create system architecture based on these requirements.

The architecture will address:
- All functional requirements (21 FRs)
- All non-functional requirements (5 NFRs)
- Technical stack decisions (PlayCanvas, TypeScript, config format)
- Data models (Task, Round, StressState, RapportState, etc.)
- Game systems architecture (TaskSpawnSystem, StressSystem, RoundManager, etc.)
- Asset pipeline and scene structure

### Phase 4: Sprint Planning

After architecture is complete, run `/bmad:sprint-planning` to:
- Break 8 epics into 40-60 detailed user stories
- Estimate story complexity (story points)
- Plan sprint iterations (2-week sprints)
- Begin implementation

---

**This document was created using BMAD Method v6 - Phase 2 (Planning)**

*To continue: Run `/bmad:workflow-status` to see your progress and next recommended workflow.*

---

## Appendix A: Requirements Traceability Matrix

| Epic ID | Epic Name | Functional Requirements | Story Count (Est.) |
|---------|-----------|-------------------------|-------------------|
| EPIC-001 | Core Game Loop | FR-001, FR-002, FR-016 | 5-7 stories |
| EPIC-002 | Blue Ball Employment Simulation | FR-003, FR-004, FR-005, FR-009 | 6-8 stories |
| EPIC-003 | Red Ball Household Simulation | FR-006, FR-007 | 4-5 stories |
| EPIC-004 | Task Interaction & Physics | FR-008, FR-014 | 5-6 stories |
| EPIC-005 | Asymmetric Stress System | FR-010, FR-011, FR-012 | 7-9 stories |
| EPIC-006 | Red's Job Event | FR-013 | 3-4 stories |
| EPIC-007 | Camera & Visual Systems | FR-015, FR-020, FR-021 | 5-7 stories |
| EPIC-008 | Configuration & Tutorial | FR-017, FR-018, FR-019 | 6-8 stories |
| **TOTAL** | **8 Epics** | **21 Functional Requirements** | **41-54 stories** |

---

## Appendix B: Prioritization Details

### Functional Requirements Breakdown

**Must Have (18 FRs):**
- FR-001, FR-002, FR-003, FR-004, FR-005, FR-006, FR-007, FR-008, FR-009, FR-010, FR-011, FR-012, FR-013, FR-014, FR-015, FR-016

**Should Have (3 FRs):**
- FR-017, FR-018, FR-020

**Could Have (2 FRs):**
- FR-019, FR-021

**Won't Have (MVP):**
- Multiplayer, mobile support, advanced accessibility (see "Out of Scope")

---

### Non-Functional Requirements Breakdown

**Must Have (2 NFRs):**
- NFR-001 (Performance - 60 FPS)
- NFR-002 (Modularity - Configuration-Driven)

**Should Have (3 NFRs):**
- NFR-003 (Browser Compatibility)
- NFR-004 (Code Structure)
- NFR-005 (Development Velocity)

---

### Epic Priority Summary

**Must Have (6 Epics):**
- EPIC-001: Core Game Loop
- EPIC-002: Blue Ball Employment Simulation
- EPIC-003: Red Ball Household Simulation
- EPIC-004: Task Interaction & Physics
- EPIC-005: Asymmetric Stress System
- EPIC-006: Red's Job Event

**Should Have (2 Epics):**
- EPIC-007: Camera & Visual Systems
- EPIC-008: Configuration & Tutorial

---

**Prioritization Rationale:**

**Must Have** requirements are critical for the core game experience and message delivery. Without these, the game does not function or communicate its intended meaning.

**Should Have** requirements enhance polish, modularity, and ease of use but can be partially deferred if necessary to hit MVP.

**Could Have** requirements provide additional value (scenario selection, visual polish) but are not essential for initial release.

This prioritization ensures MVP delivers the core emotional labor simulation while allowing flexibility in polish and configurability features.
