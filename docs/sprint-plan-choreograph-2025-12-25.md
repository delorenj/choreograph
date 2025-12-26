# Sprint Plan: Choreograph

**Date:** 2025-12-25
**Scrum Master:** Jarad DeLorenzo (Steve)
**Project Level:** Level 3 (Complex)
**Total Stories:** 47
**Total Points:** 177
**Planned Sprints:** 7
**Sprint Length:** 2 weeks
**Team Capacity:** 30 points per sprint
**Target Completion:** 14 weeks (3.5 months)

---

## Executive Summary

This sprint plan breaks down the Choreograph project into 7 two-week sprints with 47 user stories totaling 177 story points. The plan follows a progressive build approach, starting with core game loop and configuration foundations in Sprint 1, building out game mechanics in Sprints 2-5, and polishing with audio/visual systems in Sprints 6-7.

**Key Metrics:**
- **Total Stories:** 47
- **Total Points:** 177
- **Sprints:** 7 (2 weeks each)
- **Team Size:** 1 senior developer
- **Team Capacity:** 30 points per sprint
- **Average Sprint Load:** 25.3 points (84% utilization)
- **Target Completion:** April 2025

**Approach:** Foundation-first architecture with config-driven design. All Must Have requirements completed by Sprint 6. Sprint 7 focuses on Should Have/Could Have polish features.

---

## Story Inventory

### EPIC-001: Core Game Loop (23 points)

#### STORY-001: Round Timer System (5 points)

**Epic:** EPIC-001: Core Game Loop
**Priority:** Must Have

**User Story:**
As a player, I want the game to progress in discrete weekly rounds with a visible timer, so that I understand the time pressure and pacing of the simulation.

**Acceptance Criteria:**
- [ ] Round timer advances gameplay state (1 round = 1 week)
- [ ] Timer is displayed in UI
- [ ] Round completion triggers end-of-round summary
- [ ] Incomplete tasks carry over to next round

**Technical Notes:**
Implement RoundManager system (architecture section 7.2), timer UI component, state persistence between rounds.

**Dependencies:** None (foundation system)

---

#### STORY-002: Role Selection Screen (3 points)

**Epic:** EPIC-001: Core Game Loop
**Priority:** Must Have

**User Story:**
As a player, I want to choose Blue Ball or Red Ball at game start, so that I can experience different perspectives of the household dynamic.

**Acceptance Criteria:**
- [ ] Role selection screen appears at game start
- [ ] Player can choose Blue Ball or Red Ball
- [ ] Role selection is visually clear but doesn't reveal metaphor explicitly
- [ ] Choice is stored in game state
- [ ] Player can restart and switch roles from pause menu

**Technical Notes:**
Create role selection UI screen, implement game state initialization based on role choice.

**Dependencies:** None

---

#### STORY-003: AI Opponent System (8 points)

**Epic:** EPIC-001: Core Game Loop
**Priority:** Must Have

**User Story:**
As a player, I want the non-selected ball controlled by naive AI, so that I can experience the full simulation without needing a second player.

**Acceptance Criteria:**
- [ ] Blue AI: completes assigned tasks, helps Red when asked
- [ ] Red AI: completes Red tasks, requests help when stress >75%
- [ ] AI behavior is deterministic and predictable
- [ ] AI actions are visually indicated

**Technical Notes:**
Implement AIController (architecture section 7.4), simple state machine for AI decision-making.

**Dependencies:** STORY-001 (game state system)

---

#### STORY-004: Paycheck Cycle Integration (2 points)

**Epic:** EPIC-001: Core Game Loop
**Priority:** Must Have

**User Story:**
As Blue Ball, I want to receive paychecks every 2 rounds, so that the 2-week employment rhythm is clear.

**Acceptance Criteria:**
- [ ] Paycheck arrives on even-numbered rounds (2, 4, 6, etc.)
- [ ] Summary screen shows different content on paycheck vs non-paycheck rounds
- [ ] Paycheck amount displayed on summary
- [ ] Running balance updated

**Technical Notes:**
Extend RoundManager to track round parity, integrate with financial state.

**Dependencies:** STORY-001 (round system)

---

#### STORY-005: End-of-Round Summary Screen (5 points)

**Epic:** EPIC-001: Core Game Loop
**Priority:** Must Have

**User Story:**
As a player, I want to see a summary after each round showing what happened, so that I can track my progress and understand consequences.

**Acceptance Criteria:**
- [ ] Summary displays Blue/Red tasks completed/total
- [ ] Summary shows stress meter changes for both balls
- [ ] Summary shows rapport change (emoji visualization)
- [ ] Summary shows income (if paycheck round)
- [ ] Summary shows running balance
- [ ] "Continue" button advances to next round
- [ ] "Restart" button resets scenario

**Technical Notes:**
Create summary UI component, gather state from all game systems, implement smooth transitions.

**Dependencies:** STORY-001 (round system), STORY-004 (paycheck)

---

### EPIC-002: Blue Ball Employment Simulation (31 points)

#### STORY-006: Blue Work Tube and Spawning (5 points)

**Epic:** EPIC-002: Blue Ball Employment
**Priority:** Must Have

**User Story:**
As Blue Ball, I want work chunks to spawn from an adjacent room with a solid roof, so that my work is invisible to Red Ball.

**Acceptance Criteria:**
- [ ] Work chunks spawn from "tube" in adjacent room at round start
- [ ] Adjacent room has solid roof (invisible to Red)
- [ ] Work visibility is configurable per scenario (workVisibility setting)
- [ ] Spawn rate is configurable (workSpawnRate)
- [ ] Visual distinction between Blue work and Red tasks

**Technical Notes:**
Implement WorkSpawnSystem (architecture 7.3), create work tube 3D model, implement roof geometry with occlusion.

**Dependencies:** STORY-001 (round system)

---

#### STORY-007: Work Chunk Decomposition (5 points)

**Epic:** EPIC-002: Blue Ball Employment
**Priority:** Must Have

**User Story:**
As Blue Ball, I want work chunks to split into random subtasks, so that the unpredictability of knowledge work is simulated.

**Acceptance Criteria:**
- [ ] Each chunk splits into N subtasks (randomized 4-12 per config)
- [ ] Subtask completion time follows log^e distribution
- [ ] Subtasks displayed as fillable buckets/chunks
- [ ] Completion removes subtask from scene

**Technical Notes:**
Implement TaskDecompositionSystem, log-normal distribution for completion times, subtask entity creation.

**Dependencies:** STORY-006 (work spawning)

---

#### STORY-008: Scope Creep Mechanic (3 points)

**Epic:** EPIC-002: Blue Ball Employment
**Priority:** Must Have

**User Story:**
As Blue Ball, I want some completed chunks to spawn additional chunks unpredictably, so that I experience the frustration of never-ending work.

**Acceptance Criteria:**
- [ ] 10-20% of completed chunks trigger scope creep (configurable: scopeCreepProbability)
- [ ] Scope creep spawns 2-5 additional chunks (configurable: scopeCreepChunks)
- [ ] Scope creep is random and unpredictable
- [ ] Visual/audio indicator when scope creep occurs

**Technical Notes:**
Extend TaskDecompositionSystem with probability-based scope creep, spawn additional work chunks on completion.

**Dependencies:** STORY-007 (chunk decomposition)

---

#### STORY-009: Employment Rapport System (5 points)

**Epic:** EPIC-002: Blue Ball Employment
**Priority:** Must Have

**User Story:**
As Blue Ball, I want my employer relationship tracked ambiguously via emoji gauge, so that job security feels unpredictable.

**Acceptance Criteria:**
- [ ] Rapport gauge displayed as emoji range (😢 😕 😐 🙂 😊)
- [ ] Rapport is NOT shown as numeric percentage
- [ ] Incomplete work at round end reduces rapport
- [ ] Rapport decay accelerates with consecutive misses (compound multiplier)
- [ ] Successful round completion increases rapport slightly

**Technical Notes:**
Implement RapportSystem (architecture 7.5), emoji gauge UI component, exponential decay calculation.

**Dependencies:** STORY-001 (round system)

---

#### STORY-010: Firing Event (3 points)

**Epic:** EPIC-002: Blue Ball Employment
**Priority:** Must Have

**User Story:**
As Blue Ball, I want to experience sudden job loss when rapport is too low, so that employment precarity feels real.

**Acceptance Criteria:**
- [ ] Firing threshold randomized (15-25% rapport per config: firingThreshold)
- [ ] Firing happens without explicit warning (feels sudden)
- [ ] Firing triggers game over or scenario reset modal
- [ ] No more paychecks after firing

**Technical Notes:**
Extend RapportSystem with firing logic, implement game over state, modal UI for firing event.

**Dependencies:** STORY-009 (rapport system)

---

#### STORY-011: Paycheck Income System (5 points)

**Epic:** EPIC-002: Blue Ball Employment
**Priority:** Must Have

**User Story:**
As Blue Ball, I want to receive $6,250 every 2 weeks when employed, so that I can keep the household financially afloat.

**Acceptance Criteria:**
- [ ] $6,250 arrives every 2 rounds if employed
- [ ] No paycheck if fired before paycheck round
- [ ] Visual indicator of paycheck on summary screen
- [ ] Running balance accumulates paychecks (starts at configured startingBalance)
- [ ] Expenses are NOT explicitly shown (hidden mechanic)

**Technical Notes:**
Implement FinancialSystem, balance tracking, paycheck distribution on even rounds.

**Dependencies:** STORY-004 (paycheck cycle), STORY-010 (employment status)

---

#### STORY-012: Context Switching Penalty (5 points)

**Epic:** EPIC-002: Blue Ball Employment
**Priority:** Must Have

**User Story:**
As Blue Ball, I want my incomplete work to regrow when I switch to Red tasks, so that the cost of context switching is viscerally felt.

**Acceptance Criteria:**
- [ ] Switching from incomplete Blue task to Red task triggers regrowth
- [ ] Blue task progress decays at 30% rate (contextSwitchRegrowth config)
- [ ] Decay visualized (task bucket refills)
- [ ] Regrowth continues until Blue task resumed or Red task complete
- [ ] Penalty ONLY applies Blue → Red context switch
- [ ] Visual indicator when penalty active (task pulsing/glowing)

**Technical Notes:**
Implement ContextSwitchSystem, track active task type, apply decay modifier to incomplete Blue tasks.

**Dependencies:** STORY-007 (work chunks), STORY-015 (Red tasks)

---

### EPIC-003: Red Ball Household Simulation (12 points)

#### STORY-013: Red Task Spawning System (5 points)

**Epic:** EPIC-003: Red Ball Household
**Priority:** Must Have

**User Story:**
As a player, I want Red tasks to spawn as visible splotches at predictable rates, so that I understand the routine nature of household labor.

**Acceptance Criteria:**
- [ ] Red tasks spawn at slow, consistent rate (1 per 30-45 seconds, configurable)
- [ ] Tasks categorized: cleaning, cooking, childcare, errands
- [ ] Task types affect visual appearance (different splotch shapes)
- [ ] Spawn locations randomized within bounds
- [ ] Tasks visible to both Blue and Red balls
- [ ] Tasks persist across rounds if incomplete

**Technical Notes:**
Implement TaskSpawnSystem (Red variant), create 4 task type prefabs with distinct visuals.

**Dependencies:** STORY-001 (round system)

---

#### STORY-014: Red Task Type Configuration (2 points)

**Epic:** EPIC-003: Red Ball Household
**Priority:** Must Have

**User Story:**
As a designer, I want Red task types configurable via JSON, so that I can balance task distribution and completion times.

**Acceptance Criteria:**
- [ ] Task types defined in config (type, weight, completionTime)
- [ ] Task spawn probabilities based on weight
- [ ] Completion times vary by task type
- [ ] Config hot-reloadable in dev mode

**Technical Notes:**
Extend scenario config schema (RedTaskType), implement weighted random selection.

**Dependencies:** STORY-013 (task spawning)

---

#### STORY-015: Red Task Refusal Mechanic (3 points)

**Epic:** EPIC-003: Red Ball Household
**Priority:** Must Have

**User Story:**
As Red Ball, I want the ability to refuse tasks when stressed, so that I can simulate realistic overwhelm behavior.

**Acceptance Criteria:**
- [ ] Red (AI or player) can ignore tasks without immediate penalty
- [ ] Task refusal probability increases with Red stress
- [ ] AI Red refuses tasks when stress >60% (probability-based)
- [ ] Player Red can choose to skip tasks
- [ ] Incomplete Red tasks increase Red stress only (no hard penalty)

**Technical Notes:**
Extend AIController with stress-based decision making, player input handling for task selection.

**Dependencies:** STORY-003 (AI system), STORY-026 (Red stress - circular, can be prototyped)

---

#### STORY-016: Red Sleep Mechanic (2 points)

**Epic:** EPIC-003: Red Ball Household
**Priority:** Must Have

**User Story:**
As Red Ball, I want to end the round even with tasks remaining, so that I'm not forced to complete everything.

**Acceptance Criteria:**
- [ ] Red can trigger round end via "sleep" button
- [ ] Round ends immediately (no penalty for incomplete Red tasks)
- [ ] Incomplete tasks carry over to next round
- [ ] Stress increases from incomplete tasks (indirect consequence)

**Technical Notes:**
Add "End Round" UI button for Red player, extend RoundManager to support early termination.

**Dependencies:** STORY-001 (round system)

---

### EPIC-004: Task Interaction & Physics (17 points)

#### STORY-017: Button-Hold Task Completion (5 points)

**Epic:** EPIC-004: Task Interaction
**Priority:** Must Have

**User Story:**
As a player, I want to complete tasks via button hold with visual feedback, so that task completion feels deliberate and satisfying.

**Acceptance Criteria:**
- [ ] Hold spacebar/click to work on task (not tap)
- [ ] Visual circular fill bar shows progress
- [ ] Fill bar appears above active task
- [ ] Rising audio pitch during hold (increasing tension)
- [ ] Satisfying "ding" sound on completion
- [ ] Releasing button before complete cancels progress (no partial credit)

**Technical Notes:**
Implement TaskInteractionSystem, progress bar UI component, audio feedback system.

**Dependencies:** STORY-007 (Blue work), STORY-013 (Red tasks)

---

#### STORY-018: Task Completion Audio Feedback (3 points)

**Epic:** EPIC-004: Task Interaction
**Priority:** Must Have

**User Story:**
As a player, I want audio cues during task completion, so that I receive satisfying feedback.

**Acceptance Criteria:**
- [ ] Rising pitch audio during button hold
- [ ] Satisfying "ding" sound on completion (3-5 variations to avoid repetition)
- [ ] Audio cues are distinct for Blue vs Red tasks
- [ ] Volume respects user settings

**Technical Notes:**
Integrate Web Audio API or Howler.js, create audio asset pipeline, implement pitch modulation.

**Dependencies:** STORY-017 (task interaction)

---

#### STORY-019: Physics-Based Ball Movement (3 points)

**Epic:** EPIC-004: Task Interaction
**Priority:** Must Have

**User Story:**
As a player, I want balls to move with realistic physics, so that the simulation feels natural and responsive.

**Acceptance Criteria:**
- [ ] Ball physics use PlayCanvas rigid body system
- [ ] Balls bounce realistically on collision
- [ ] Balls roll/tumble with appropriate friction
- [ ] Movement feels responsive (<100ms input latency)
- [ ] Physics calculations run at 60Hz

**Technical Notes:**
Configure PlayCanvas rigid body components, tune physics parameters (mass, friction, restitution).

**Dependencies:** None (PlayCanvas core feature)

---

#### STORY-020: Task Gravity Mechanic (3 points)

**Epic:** EPIC-004: Task Interaction
**Priority:** Must Have

**User Story:**
As a player, I want my ball to gravitate toward the active task, so that movement feels natural and guided.

**Acceptance Criteria:**
- [ ] Clicking task applies light gravity vector toward task
- [ ] Gravity strength is subtle (natural drift, not snap-to)
- [ ] Ball gravitates during button hold
- [ ] Multiple task gravities don't conflict (latest selected wins)

**Technical Notes:**
Implement gravity vector application in physics system, smooth force application.

**Dependencies:** STORY-019 (physics system), STORY-017 (task interaction)

---

#### STORY-021: Task Completion Visual Feedback (3 points)

**Epic:** EPIC-004: Task Interaction
**Priority:** Must Have

**User Story:**
As a player, I want visual feedback when completing tasks, so that progress feels rewarding.

**Acceptance Criteria:**
- [ ] Task completion removes visual splotch/chunk
- [ ] Smooth fade-out animation (200-300ms)
- [ ] Particle effect on completion (configurable per task type)
- [ ] Progress bar fills smoothly during hold

**Technical Notes:**
Implement particle system, create completion animations, integrate with TaskInteractionSystem.

**Dependencies:** STORY-017 (task interaction)

---

### EPIC-005: Asymmetric Stress System (32 points)

#### STORY-022: Blue Stress Meter (5 points)

**Epic:** EPIC-005: Asymmetric Stress
**Priority:** Must Have

**User Story:**
As Blue Ball, I want my stress to accumulate from workload and lack of support, so that the burden of invisible labor is tracked.

**Acceptance Criteria:**
- [ ] Blue stress meter displayed as fill bar (blue color)
- [ ] Stress increases from incomplete Blue tasks (+10% per task, configurable)
- [ ] Stress increases when helping Red (+5% per Red task, configurable)
- [ ] Stress increases from rapport decay (+15% per level, configurable)
- [ ] Stress does NOT naturally decrease
- [ ] Stress meter is always visible

**Technical Notes:**
Implement StressSystem (Blue variant, architecture 7.6), stress meter UI component.

**Dependencies:** STORY-007 (Blue tasks), STORY-009 (rapport)

---

#### STORY-023: Blue Cannot Request Help (1 point)

**Epic:** EPIC-005: Asymmetric Stress
**Priority:** Must Have

**User Story:**
As Blue Ball, I want no mechanism to request help from Red, so that the asymmetry of support is clear.

**Acceptance Criteria:**
- [ ] No "request help" button for Blue player
- [ ] Blue AI never requests help (design constraint)
- [ ] UI explicitly lacks help request feature for Blue
- [ ] Red can still choose to help voluntarily

**Technical Notes:**
Ensure AIController and UI systems exclude help request for Blue role.

**Dependencies:** STORY-003 (AI system)

---

#### STORY-024: Blue Weeping Animation (2 points)

**Epic:** EPIC-005: Asymmetric Stress
**Priority:** Must Have

**User Story:**
As Blue Ball, I want to visibly weep when stress is ≥90%, so that my emotional state is communicated.

**Acceptance Criteria:**
- [ ] Ball avatar weeps when stress ≥90% (weepingThreshold config)
- [ ] Weeping is continuous while above threshold
- [ ] Weeping animation is subtle but noticeable
- [ ] Animation loops smoothly

**Technical Notes:**
Create weeping particle effect (tears), trigger based on stress threshold.

**Dependencies:** STORY-022 (Blue stress meter)

---

#### STORY-025: Blue Stress Overflow Debuffs (3 points)

**Epic:** EPIC-005: Asymmetric Stress
**Priority:** Must Have

**User Story:**
As Blue Ball, I want stress >100% to slow my task completion, so that the spiral of overwhelm is mechanically represented.

**Acceptance Criteria:**
- [ ] Stress >100% applies debuff: 10% slower per 10% overflow (overflowDebuffRate config)
- [ ] Debuff affects Blue task completion time
- [ ] Debuff is visually indicated (slower progress bar fill)
- [ ] Debuff compounds (200% stress = 100% slower = 2x time)

**Technical Notes:**
Extend StressSystem with overflow calculation, apply completion time modifier to TaskInteractionSystem.

**Dependencies:** STORY-022 (Blue stress), STORY-017 (task interaction)

---

#### STORY-026: Red Stress Meter (3 points)

**Epic:** EPIC-005: Asymmetric Stress
**Priority:** Must Have

**User Story:**
As Red Ball, I want my stress to accumulate from incomplete household tasks, so that my burden is tracked.

**Acceptance Criteria:**
- [ ] Red stress meter displayed as fill bar (red/pink color)
- [ ] Stress increases from incomplete Red tasks (+8% per task, configurable)
- [ ] Red stress CAN be reduced by completing tasks (-10% per task, configurable)
- [ ] Red stress reduced when Blue helps (-15% per Blue-completed task, configurable)
- [ ] Stress meter is always visible

**Technical Notes:**
Implement StressSystem (Red variant), stress meter UI component.

**Dependencies:** STORY-013 (Red tasks)

---

#### STORY-027: Red Help Request System (5 points)

**Epic:** EPIC-005: Asymmetric Stress
**Priority:** Must Have

**User Story:**
As Red Ball, I want to request Blue's help when stressed, so that I can reduce my own stress burden.

**Acceptance Criteria:**
- [ ] Help request probability based on Red stress (linear: 0% at 0 stress, 90% at 90% stress)
- [ ] Red player can manually request help via button
- [ ] Red AI requests help automatically based on probability
- [ ] Help request is visually indicated to Blue player
- [ ] Blue (AI or player) can choose to respond

**Technical Notes:**
Implement help request UI, extend AIController with help request logic.

**Dependencies:** STORY-026 (Red stress), STORY-003 (AI system)

---

#### STORY-028: Red Stress Debuffs to Blue (5 points)

**Epic:** EPIC-005: Asymmetric Stress
**Priority:** Must Have

**User Story:**
As Red Ball, I want my sustained high stress to apply debuffs to Blue, so that my stress indirectly affects the household.

**Acceptance Criteria:**
- [ ] Sustained high Red stress (≥75% for 3+ consecutive rounds, configurable) applies debuffs
- [ ] Blue debuffs: 30% slower Blue task completion (blueDebuffCompletionMultiplier config)
- [ ] Blue debuffs: 50% faster Blue task regrowth (blueDebuffRegrowthMultiplier config)
- [ ] Debuffs persist while Red stress remains high
- [ ] Debuffs removed when Red stress drops below threshold

**Technical Notes:**
Extend StressSystem with sustained stress tracking, apply modifiers to TaskInteractionSystem and ContextSwitchSystem.

**Dependencies:** STORY-026 (Red stress), STORY-012 (context switch)

---

#### STORY-029: Empathy Action Modals (8 points)

**Epic:** EPIC-005: Asymmetric Stress
**Priority:** Must Have

**User Story:**
As a player, I want to see periodic empathy action suggestions, so that I learn simple ways Red could support Blue.

**Acceptance Criteria:**
- [ ] Modal appears every 30 seconds (empathyModalInterval config)
- [ ] Modal pauses game (time stops)
- [ ] Modal contains 2-3 second looping animation
- [ ] Actions are simple, non-sexual (hug, compliment, "thank you", help offer)
- [ ] Red player can perform action via button press
- [ ] Performing action reduces Blue stress by 25-40%
- [ ] Red AI has 10% probability of performing action
- [ ] Library contains 100+ unique actions (categorized: physical, verbal, service)
- [ ] Modal can be dismissed without action (no penalty)

**Technical Notes:**
Implement EmpathySystem, modal UI component, animation asset pipeline, stress reduction on action.

**Dependencies:** STORY-022 (Blue stress)

---

### EPIC-006: Red's Job Event (10 points)

#### STORY-030: Red Employment Event Trigger (3 points)

**Epic:** EPIC-006: Red's Job Event
**Priority:** Must Have

**User Story:**
As Red Ball, I want to get a part-time job after several rounds, so that I feel like I'm contributing financially.

**Acceptance Criteria:**
- [ ] Event triggers after round 3, 4, or 5 (randomized, configurable: triggerRound)
- [ ] Event only triggers if enabled in config (employmentEvent.enabled)
- [ ] Event announced via modal: "Red got a part-time job!"
- [ ] Modal explains income and time implications

**Technical Notes:**
Implement EmploymentEventSystem, modal UI, event trigger logic.

**Dependencies:** STORY-001 (round system)

---

#### STORY-031: Red Part-Time Income (2 points)

**Epic:** EPIC-006: Red's Job Event
**Priority:** Must Have

**User Story:**
As Red Ball, I want to earn $400/round after getting the job, so that I contribute to household finances.

**Acceptance Criteria:**
- [ ] Red earns $400/round starting next round after event (redIncome config)
- [ ] Red income added to paycheck summary (separate line item)
- [ ] Running balance reflects Red income
- [ ] Income continues every round while employed

**Technical Notes:**
Extend FinancialSystem with Red income tracking, update summary UI.

**Dependencies:** STORY-030 (employment event), STORY-011 (financial system)

---

#### STORY-032: Blue Work Time Reduction (5 points)

**Epic:** EPIC-006: Red's Job Event
**Priority:** Must Have

**User Story:**
As Blue Ball, I want my available work time cut when Red gets a job, so that I experience the increased burden.

**Acceptance Criteria:**
- [ ] Blue's work time reduced by 45% (blueWorkTimeReduction config)
- [ ] Reduction simulated via faster round timer OR less time per task
- [ ] Red tasks continue spawning at same rate (no reduction)
- [ ] Difficulty spike is noticeable but gradual (ramps over 2 rounds)
- [ ] Blue must handle both Blue tasks + Red tasks or face consequences

**Technical Notes:**
Extend RoundManager or TaskInteractionSystem with time modifier, apply only to Blue tasks.

**Dependencies:** STORY-030 (employment event), STORY-001 (round system)

---

### EPIC-007: Camera & Visual Systems (28 points)

#### STORY-033: Fixed Isometric Camera (2 points)

**Epic:** EPIC-007: Camera & Visual Systems
**Priority:** Should Have

**User Story:**
As a player, I want a fixed isometric camera angle, so that the game has a consistent visual style.

**Acceptance Criteria:**
- [ ] Camera locked at 35° isometric angle
- [ ] No camera rotation (fixed orientation)
- [ ] No camera zoom (fixed distance)
- [ ] Full game area ~90% visible from center

**Technical Notes:**
Configure PlayCanvas camera component, set fixed transform.

**Dependencies:** None (PlayCanvas core feature)

---

#### STORY-034: Camera Panning (3 points)

**Epic:** EPIC-007: Camera & Visual Systems
**Priority:** Should Have

**User Story:**
As a player, I want to pan the camera smoothly, so that I can view the entire play area.

**Acceptance Criteria:**
- [ ] Smooth panning via mouse at screen edges (10px margin)
- [ ] Smooth panning via WASD keys
- [ ] Panning speed is comfortable (configurable)
- [ ] Panning is smooth (no jitter)

**Technical Notes:**
Implement CameraController, edge detection for mouse panning, WASD input handling.

**Dependencies:** STORY-033 (camera setup)

---

#### STORY-035: Audio Feedback System (5 points)

**Epic:** EPIC-007: Camera & Visual Systems
**Priority:** Should Have

**User Story:**
As a player, I want audio cues for key events, so that I receive multi-sensory feedback.

**Acceptance Criteria:**
- [ ] Stress meter increase has subtle audio cue (low ominous note)
- [ ] Stress meter decrease has subtle positive cue (light chime)
- [ ] Paycheck arrival has positive sound (cash register/coin)
- [ ] Rapport decrease has subtle negative sound (descending notes)
- [ ] All audio can be muted via settings
- [ ] Volume sliders for music/SFX (independent control)

**Technical Notes:**
Extend audio system with event-based sound effects, audio settings UI.

**Dependencies:** STORY-018 (audio system foundation)

---

#### STORY-036: Adaptive Background Music (8 points)

**Epic:** EPIC-007: Camera & Visual Systems
**Priority:** Should Have

**User Story:**
As a player, I want background music to adapt to stress levels, so that the emotional tone matches the gameplay state.

**Acceptance Criteria:**
- [ ] 0-30% combined stress: Calm, peaceful ambient
- [ ] 30-60% stress: Slightly tense, faster tempo
- [ ] 60-90% stress: Tense, driving rhythm
- [ ] 90%+ stress: Chaotic, overwhelming
- [ ] Smooth transitions between music layers (no abrupt cuts)
- [ ] Music respects volume settings

**Technical Notes:**
Implement layered music system, dynamic mixing based on stress levels.

**Dependencies:** STORY-022 (Blue stress), STORY-026 (Red stress)

---

#### STORY-037: Task Completion Particles (3 points)

**Epic:** EPIC-007: Camera & Visual Systems
**Priority:** Could Have

**User Story:**
As a player, I want particle effects on task completion, so that success feels rewarding.

**Acceptance Criteria:**
- [ ] Task completion spawns particle effect (confetti, sparkles)
- [ ] Particle effect varies by task type
- [ ] Particles are performant (60 FPS maintained)
- [ ] Particles respect visual quality settings

**Technical Notes:**
Create particle effect prefabs, integrate with TaskInteractionSystem.

**Dependencies:** STORY-021 (visual feedback)

---

#### STORY-038: Stress-Based Color Grading (5 points)

**Epic:** EPIC-007: Camera & Visual Systems
**Priority:** Could Have

**User Story:**
As a player, I want the screen color to shift based on stress, so that the emotional tone is reinforced visually.

**Acceptance Criteria:**
- [ ] Screen color grading shifts based on combined stress
- [ ] Low stress: Warm, saturated colors
- [ ] High stress: Cool, desaturated colors
- [ ] Smooth transitions (no jarring shifts)
- [ ] Post-processing effects: subtle bloom, color correction

**Technical Notes:**
Implement PlayCanvas post-processing effects, dynamic color grading based on stress state.

**Dependencies:** STORY-022 (Blue stress), STORY-026 (Red stress)

---

#### STORY-039: Ball Emissive Glow (2 points)

**Epic:** EPIC-007: Camera & Visual Systems
**Priority:** Could Have

**User Story:**
As a player, I want balls to glow subtly based on stress, so that their emotional state is visually communicated.

**Acceptance Criteria:**
- [ ] Balls have subtle emissive glow (blue/red)
- [ ] Glow intensity pulsates with stress level
- [ ] Glow is performant (no FPS impact)

**Technical Notes:**
Add emissive material to ball entities, animate emission intensity based on stress.

**Dependencies:** STORY-022 (Blue stress), STORY-026 (Red stress)

---

### EPIC-008: Configuration & Tutorial (24 points)

#### STORY-040: Scenario Configuration Schema (3 points)

**Epic:** EPIC-008: Configuration & Tutorial
**Priority:** Must Have

**User Story:**
As a developer, I want all game parameters defined in JSON schema, so that scenarios are modular and configurable.

**Acceptance Criteria:**
- [ ] Scenario configs in JSON format (`/scenarios/*.json`)
- [ ] Schema includes all configurable parameters (round length, spawn rates, stress thresholds, etc.)
- [ ] Config validation on load (errors shown if invalid)
- [ ] No hardcoded magic numbers in game logic
- [ ] Config hot-reloading in dev mode

**Technical Notes:**
Define comprehensive Zod schema (ScenarioConfigSchema), implement config loader, validation system. **NOTE:** Schema already exists in src/config/schema.ts - formalize integration.

**Dependencies:** None (architecture foundation)

---

#### STORY-041: Default Scenario Configuration (1 point)

**Epic:** EPIC-008: Configuration & Tutorial
**Priority:** Must Have

**User Story:**
As a developer, I want sensible default values for all parameters, so that the game works out-of-box.

**Acceptance Criteria:**
- [ ] DEFAULT_SCENARIO provides complete fallback values
- [ ] Defaults match "Baseline" scenario from PRD
- [ ] All systems function with defaults only
- [ ] Defaults are documented

**Technical Notes:**
Define DEFAULT_SCENARIO constant with all required values. **NOTE:** Defaults already exist in src/config/defaults.ts - formalize integration.

**Dependencies:** STORY-040 (schema)

---

#### STORY-042: Configuration Modularity (3 points)

**Epic:** EPIC-008: Configuration & Tutorial
**Priority:** Should Have

**User Story:**
As a designer, I want all gauges/meters individually togglable, so that I can customize UI per scenario.

**Acceptance Criteria:**
- [ ] UI elements respect config toggles (showBlueStressMeter, showRedStressMeter, showRapportGauge, showBalance, showRoundTimer)
- [ ] Hidden UI elements don't affect gameplay (only visibility)
- [ ] Config changes reflected without code changes

**Technical Notes:**
Implement UI visibility bindings to config, conditional rendering based on UIConfig.

**Dependencies:** STORY-040 (schema)

---

#### STORY-043: Tutorial Modal System (5 points)

**Epic:** EPIC-008: Configuration & Tutorial
**Priority:** Should Have

**User Story:**
As a new player, I want tutorial modals at key moments, so that I understand mechanics without feeling lectured.

**Acceptance Criteria:**
- [ ] Modals appear at key tutorial moments (round 1 start, first task, first help request, first debuff)
- [ ] Animations are cute, 2-3 second loops, non-threatening
- [ ] Language is gentle, educational, not preachy
- [ ] Modals can be dismissed via button
- [ ] Tutorial can be disabled in settings (tutorial.enabled config)
- [ ] Tutorial state persists (don't repeat dismissed tips)

**Technical Notes:**
Implement TutorialSystem, modal UI component, tutorial state persistence.

**Dependencies:** None

---

#### STORY-044: First Task Tutorial (2 points)

**Epic:** EPIC-008: Configuration & Tutorial
**Priority:** Should Have

**User Story:**
As a new player, I want guidance on how to complete my first task, so that I understand the button-hold mechanic.

**Acceptance Criteria:**
- [ ] Modal appears when first task spawns
- [ ] Explains button-hold mechanic with visual demo
- [ ] Can be dismissed without blocking gameplay
- [ ] Only shows once per player (state persisted)

**Technical Notes:**
Extend TutorialSystem with first-task trigger, create modal content.

**Dependencies:** STORY-043 (tutorial system)

---

#### STORY-045: First Help Request Tutorial (2 points)

**Epic:** EPIC-008: Configuration & Tutorial
**Priority:** Should Have

**User Story:**
As a new player, I want guidance when I first encounter a help request, so that I understand the asymmetry.

**Acceptance Criteria:**
- [ ] Modal appears on first help request (Red → Blue)
- [ ] Explains help request mechanic and consequences
- [ ] Can be dismissed without blocking gameplay
- [ ] Only shows once per player

**Technical Notes:**
Extend TutorialSystem with help-request trigger.

**Dependencies:** STORY-043 (tutorial system), STORY-027 (help request)

---

#### STORY-046: Scenario Selection Screen (5 points)

**Epic:** EPIC-008: Configuration & Tutorial
**Priority:** Could Have

**User Story:**
As a player, I want to choose from predefined scenarios, so that I can explore different household dynamics.

**Acceptance Criteria:**
- [ ] Scenario selection screen appears before role selection
- [ ] Each scenario has name, description, difficulty indicator (stars)
- [ ] Scenarios include: "Baseline", "Red Gets Job" (MVP), "Both Working" (future), "Single Parent" (future)
- [ ] Scenario selection loads appropriate config file
- [ ] Default scenario is "Baseline"

**Technical Notes:**
Create scenario selection UI, implement scenario loading system, define scenario manifest.

**Dependencies:** STORY-040 (config schema)

---

#### STORY-047: Config Hot-Reload Dev Mode (3 points)

**Epic:** EPIC-008: Configuration & Tutorial
**Priority:** Should Have

**User Story:**
As a developer, I want config changes to reflect immediately, so that I can iterate quickly on balancing.

**Acceptance Criteria:**
- [ ] Changing config file triggers reload (file watcher in dev mode)
- [ ] Config reload doesn't reset game state (preserves round, stress, etc.)
- [ ] Config errors shown in dev console
- [ ] Hot reload only active in dev mode (not production)

**Technical Notes:**
Implement file watcher for config directory, reload mechanism that preserves state.

**Dependencies:** STORY-040 (config schema)

---

## Sprint Allocation

### Sprint 1 (Weeks 1-2) - **27 points / 30 capacity (90%)**

**Goal:** Establish core game loop foundation, configuration system, and basic task interaction

**Stories:**
- STORY-040: Scenario Configuration Schema - 3 points (Infrastructure)
- STORY-041: Default Scenario Configuration - 1 point (Infrastructure)
- STORY-001: Round Timer System - 5 points (Must Have)
- STORY-002: Role Selection Screen - 3 points (Must Have)
- STORY-004: Paycheck Cycle Integration - 2 points (Must Have)
- STORY-017: Button-Hold Task Completion - 5 points (Must Have)
- STORY-019: Physics-Based Ball Movement - 3 points (Must Have)
- STORY-020: Task Gravity Mechanic - 3 points (Must Have)
- STORY-033: Fixed Isometric Camera - 2 points (Should Have)

**Total:** 27 points (90% utilization)

**Dependencies:** None (foundation sprint)

**Risks:** PlayCanvas learning curve if unfamiliar with physics system

---

### Sprint 2 (Weeks 3-4) - **26 points / 30 capacity (87%)**

**Goal:** Complete task interaction feedback and implement work spawning for both balls

**Stories:**
- STORY-018: Task Completion Audio Feedback - 3 points (Must Have)
- STORY-021: Task Completion Visual Feedback - 3 points (Must Have)
- STORY-006: Blue Work Tube and Spawning - 5 points (Must Have)
- STORY-007: Work Chunk Decomposition - 5 points (Must Have)
- STORY-008: Scope Creep Mechanic - 3 points (Must Have)
- STORY-013: Red Task Spawning System - 5 points (Must Have)
- STORY-014: Red Task Type Configuration - 2 points (Must Have)

**Total:** 26 points (87% utilization)

**Dependencies:** Sprint 1 (task interaction foundation, round system)

**Risks:** Task spawning balancing may require iteration

---

### Sprint 3 (Weeks 5-6) - **26 points / 30 capacity (87%)**

**Goal:** Complete Blue employment mechanics and financial tracking

**Stories:**
- STORY-009: Employment Rapport System - 5 points (Must Have)
- STORY-010: Firing Event - 3 points (Must Have)
- STORY-011: Paycheck Income System - 5 points (Must Have)
- STORY-012: Context Switching Penalty - 5 points (Must Have)
- STORY-015: Red Task Refusal Mechanic - 3 points (Must Have)
- STORY-016: Red Sleep Mechanic - 2 points (Must Have)
- STORY-042: Configuration Modularity - 3 points (Should Have)

**Total:** 26 points (87% utilization)

**Dependencies:** Sprint 1 (round system), Sprint 2 (task systems)

**Risks:** Context switching penalty may be complex to visualize effectively

---

### Sprint 4 (Weeks 7-8) - **26 points / 30 capacity (87%)**

**Goal:** Implement asymmetric stress mechanics for both balls

**Stories:**
- STORY-022: Blue Stress Meter - 5 points (Must Have)
- STORY-023: Blue Cannot Request Help - 1 point (Must Have)
- STORY-024: Blue Weeping Animation - 2 points (Must Have)
- STORY-025: Blue Stress Overflow Debuffs - 3 points (Must Have)
- STORY-026: Red Stress Meter - 3 points (Must Have)
- STORY-027: Red Help Request System - 5 points (Must Have)
- STORY-028: Red Stress Debuffs to Blue - 5 points (Must Have)
- STORY-034: Camera Panning - 3 points (Should Have)

**Total:** 26 points (87% utilization)

**Dependencies:** Sprint 2 (task systems), Sprint 3 (employment system)

**Risks:** Stress balance tuning will require playtesting

---

### Sprint 5 (Weeks 9-10) - **23 points / 30 capacity (77%)**

**Goal:** Complete AI opponent system and empathy mechanics

**Stories:**
- STORY-003: AI Opponent System - 8 points (Must Have)
- STORY-029: Empathy Action Modals - 8 points (Must Have)
- STORY-005: End-of-Round Summary Screen - 5 points (Must Have)
- STORY-044: First Task Tutorial - 2 points (Should Have)
- STORY-045: First Help Request Tutorial - 2 points (Should Have)

**Total:** 23 points (77% utilization)

**Dependencies:** Sprint 4 (stress system), Sprint 3 (employment), Sprint 2 (tasks)

**Risks:** AI behavior balancing, empathy action library creation (100+ actions)

---

### Sprint 6 (Weeks 11-12) - **23 points / 30 capacity (77%)**

**Goal:** Implement Red's job event and complete audio systems

**Stories:**
- STORY-030: Red Employment Event Trigger - 3 points (Must Have)
- STORY-031: Red Part-Time Income - 2 points (Must Have)
- STORY-032: Blue Work Time Reduction - 5 points (Must Have)
- STORY-035: Audio Feedback System - 5 points (Should Have)
- STORY-036: Adaptive Background Music - 8 points (Should Have)

**Total:** 23 points (77% utilization)

**Dependencies:** Sprint 3 (financial system), Sprint 4 (stress system)

**Risks:** Adaptive music implementation complexity, balancing post-job difficulty spike

---

### Sprint 7 (Weeks 13-14) - **26 points / 30 capacity (87%)**

**Goal:** Visual polish, tutorial system, and scenario selection

**Stories:**
- STORY-043: Tutorial Modal System - 5 points (Should Have)
- STORY-037: Task Completion Particles - 3 points (Could Have)
- STORY-038: Stress-Based Color Grading - 5 points (Could Have)
- STORY-039: Ball Emissive Glow - 2 points (Could Have)
- STORY-046: Scenario Selection Screen - 5 points (Could Have)
- STORY-047: Config Hot-Reload Dev Mode - 3 points (Should Have)

**Total:** 26 points (87% utilization)

**Dependencies:** All previous sprints (polish and finishing touches)

**Risks:** Polish may reveal needed adjustments to earlier systems

---

## Epic Traceability

| Epic ID | Epic Name | Stories | Total Points | Sprints |
|---------|-----------|---------|--------------|---------|
| EPIC-001 | Core Game Loop | STORY-001, 002, 003, 004, 005 | 23 points | 1, 5 |
| EPIC-002 | Blue Ball Employment | STORY-006, 007, 008, 009, 010, 011, 012 | 31 points | 2, 3 |
| EPIC-003 | Red Ball Household | STORY-013, 014, 015, 016 | 12 points | 2, 3 |
| EPIC-004 | Task Interaction & Physics | STORY-017, 018, 019, 020, 021 | 17 points | 1, 2 |
| EPIC-005 | Asymmetric Stress | STORY-022, 023, 024, 025, 026, 027, 028, 029 | 32 points | 4, 5 |
| EPIC-006 | Red's Job Event | STORY-030, 031, 032 | 10 points | 6 |
| EPIC-007 | Camera & Visual | STORY-033, 034, 035, 036, 037, 038, 039 | 28 points | 1, 4, 6, 7 |
| EPIC-008 | Config & Tutorial | STORY-040, 041, 042, 043, 044, 045, 046, 047 | 24 points | 1, 3, 5, 7 |

---

## Requirements Coverage

| FR ID | FR Name | Stories | Sprint |
|-------|---------|---------|--------|
| FR-001 | Round-Based Time System | STORY-001, 004 | 1 |
| FR-002 | Player Role Selection | STORY-002 | 1 |
| FR-003 | Blue Work Generation | STORY-006, 007 | 2 |
| FR-004 | Employment Rapport System | STORY-009, 010 | 3 |
| FR-005 | Paycheck System | STORY-011 | 3 |
| FR-006 | Red Task Spawning | STORY-013, 014 | 2 |
| FR-007 | Red Task Behavior | STORY-015, 016 | 3 |
| FR-008 | Task Completion Interaction | STORY-017, 018, 021 | 1, 2 |
| FR-009 | Context Switching Penalty | STORY-012 | 3 |
| FR-010 | Blue Stress Mechanics | STORY-022, 023, 024, 025 | 4 |
| FR-011 | Red Stress Mechanics | STORY-026, 027, 028 | 4 |
| FR-012 | Empathy Action System | STORY-029 | 5 |
| FR-013 | Red Employment Event | STORY-030, 031, 032 | 6 |
| FR-014 | 3D Physics-Based Movement | STORY-019, 020 | 1 |
| FR-015 | Fixed Isometric Camera | STORY-033, 034 | 1, 4 |
| FR-016 | End-of-Round Summary | STORY-005 | 5 |
| FR-017 | Tutorial/Tip Modals | STORY-043, 044, 045 | 5, 7 |
| FR-018 | Scenario Config System | STORY-040, 041, 042, 047 | 1, 3, 7 |
| FR-019 | Scenario Selection | STORY-046 | 7 |
| FR-020 | Audio Feedback | STORY-035, 036 | 6 |
| FR-021 | Visual Polish | STORY-037, 038, 039 | 7 |

**Coverage:** All 21 FRs covered by 47 stories ✓

---

## Risks and Mitigation

### High Priority Risks

**1. PlayCanvas Physics Learning Curve**
- **Risk:** If unfamiliar with PlayCanvas physics, ball movement and gravity mechanics may take longer than estimated
- **Mitigation:** Allocate extra experimentation time in Sprint 1, consult PlayCanvas docs and community forums, prototype physics early

**2. Stress System Balance**
- **Risk:** Finding optimal stress thresholds and debuff values requires extensive playtesting
- **Mitigation:** Start playtesting in Sprint 4, leverage config-driven design to iterate parameters without code changes, gather early feedback

**3. Empathy Action Library Scale**
- **Risk:** Creating 100+ unique empathy actions with animations is content-heavy
- **Mitigation:** Start with 20-30 core actions in Sprint 5, categorize and expand library during Sprint 7 polish, consider procedural variations

**4. AI Behavior Tuning**
- **Risk:** Naive deterministic AI may feel too predictable or frustrating to play against
- **Mitigation:** Make all AI probabilities configurable, gather playtesting feedback in Sprint 5, iterate behavior patterns

### Medium Priority Risks

**1. Audio Asset Creation**
- **Risk:** Adaptive music system requires layered audio tracks and professional sound design
- **Mitigation:** Use placeholder audio in Sprint 6 MVP, commission or source production audio post-launch

**2. Task Spawning Balance**
- **Risk:** Work chunk decomposition and Red task spawn rates need careful tuning for engaging gameplay
- **Mitigation:** Make all spawn rates configurable via JSON, playtest extensively in Sprints 2-3, iterate based on feedback

**3. Context Switch Visualization**
- **Risk:** Making the regrowth penalty feel clear and fair is challenging
- **Mitigation:** Prototype multiple visualization approaches in Sprint 3 (pulsing, progress bar decay, color shifts), user test best option

### Low Priority Risks

**1. Browser Compatibility**
- **Risk:** PlayCanvas should handle cross-browser rendering, but edge cases may exist
- **Mitigation:** Test on Chrome, Firefox, Safari regularly starting Sprint 1, address issues incrementally

**2. Performance on Integrated Graphics**
- **Risk:** NFR-001 requires 60 FPS on Intel HD 620 equivalent or better
- **Mitigation:** Profile performance early in Sprint 2, optimize particle effects and post-processing if bottlenecks arise

---

## Dependencies

### External Dependencies
- **PlayCanvas Cloud Editor:** Development environment, asset hosting, live preview
- **Audio Assets:** Music tracks (layered for adaptive system), SFX library - can use placeholder/royalty-free initially
- **3D Models:** Ball entities, environment geometry, task splotch prefabs - can start with primitives

### Technical Dependencies
- **WebGL 2.0:** Browser support (Chrome 120+, Firefox 120+, Safari 17+, Edge 120+)
- **Web Audio API:** Required for adaptive music system (Sprint 6)

### Internal Story Dependencies
All critical dependencies are respected in sprint allocation:
- **Sprint 1 Foundation** (round system, config, physics) enables all subsequent work
- **Sprint 2 Task Systems** enable Sprint 3 employment and financial systems
- **Sprint 4 Stress Systems** enable Sprint 5 AI and empathy mechanics
- **Sprint 6 Red's Job Event** depends on Sprints 3-4 (financial tracking + stress mechanics)
- **Sprint 7 Polish** depends on all core systems being functional

---

## Definition of Done

For a story to be considered complete:

- [ ] Code implemented and committed to version control
- [ ] Unit tests written and passing (≥80% coverage for systems)
- [ ] Integration tests passing (end-to-end flow tests)
- [ ] Code reviewed (self-review + checklist validation)
- [ ] Configuration schema updated (if new parameters added)
- [ ] Documentation updated (code comments, architecture doc if significant)
- [ ] Deployed to dev environment (PlayCanvas live preview)
- [ ] All acceptance criteria validated and checked off
- [ ] No known critical bugs or regressions
- [ ] Performance profiled (60 FPS maintained on target hardware)

**Story-Specific Criteria:**
- **UI Stories:** Responsive design tested, accessibility basics (keyboard navigation)
- **Audio Stories:** Volume respects settings, no audio clipping or distortion
- **Physics Stories:** No physics glitches, stable simulation at 60Hz
- **Config Stories:** Hot-reload works in dev mode, validation errors are clear

---

## Next Steps

### Immediate Actions

**Begin Sprint 1 (Starting Today):**

1. **Set up development environment:**
   - PlayCanvas project initialized
   - Git repository configured
   - Vite build system configured (if needed)
   - TypeScript strict mode enabled

2. **Start with infrastructure stories:**
   - STORY-040: Scenario Configuration Schema (formalize existing schema.ts)
   - STORY-041: Default Scenario Configuration (formalize existing defaults.ts)

3. **Implement core foundation:**
   - STORY-001: Round Timer System
   - STORY-002: Role Selection Screen

### Sprint Cadence

**Sprint Rhythm (2-week sprints):**
- **Week 1, Monday:** Sprint planning (review stories, clarify acceptance criteria)
- **Week 1-2, Daily:** Development work, daily check-ins (self-standup)
- **Week 2, Friday:** Sprint review (demo completed stories)
- **Week 2, Friday:** Sprint retrospective (what went well, what to improve)
- **Week 2, Friday:** Sprint planning for next sprint

**Recommended Daily Flow:**
1. Review current story acceptance criteria
2. Implement + test incrementally
3. Commit frequently (small, focused commits)
4. Mark acceptance criteria as completed
5. Update sprint status when story is done

### To Start Next Story

Run `/create-story STORY-001` to generate detailed story document, or run `/dev-story STORY-001` to start implementing immediately.

**Recommended Starting Story:** STORY-001 (Round Timer System) - foundation for all game mechanics.

---

**This plan was created using BMAD Method v6 - Phase 4 (Sprint Planning)**

*To check progress: Run `/bmad:workflow-status`*
*To implement a story: Run `/dev-story STORY-XXX`*
*To create story docs: Run `/create-story STORY-XXX`*
