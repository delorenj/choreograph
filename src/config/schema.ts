/**
 * Zod Schema Definitions
 *
 * Runtime validation schemas for all configuration files.
 * These provide type safety at runtime and serve as documentation.
 *
 * Based on Architecture Document Section 6.3 (Scenario Configuration)
 */

import { z } from 'zod';

// =============================================================================
// ROUND CONFIGURATION
// =============================================================================

/**
 * Round Configuration
 *
 * Controls the timing and pacing of gameplay rounds.
 *
 * @property durationSeconds - Length of each round in seconds (30-600s, default: 120s)
 * @property paycheckInterval - Number of rounds between paychecks (1-10, default: 2)
 *
 * @example
 * ```json
 * {
 *   "durationSeconds": 120,
 *   "paycheckInterval": 2
 * }
 * ```
 */
export const RoundConfigSchema = z.object({
  /** Length of each round in seconds. Range: 30-600s. Default: 120s (2 minutes) */
  durationSeconds: z.number().min(30).max(600).default(120),
  /** Number of rounds between Blue Ball paychecks. Range: 1-10. Default: 2 (biweekly) */
  paycheckInterval: z.number().int().min(1).max(10).default(2),
});

export type RoundConfig = z.infer<typeof RoundConfigSchema>;

// =============================================================================
// BLUE BALL CONFIGURATION
// =============================================================================

/**
 * Blue Ball Employment Configuration
 *
 * Controls work generation, scope creep, income, and context switching penalties
 * for the employed partner (Blue Ball).
 *
 * @property workSpawnRate - Number of work chunks spawned per round (1-10)
 * @property subtasksPerChunk - Range for random subtask generation per chunk
 * @property scopeCreepProbability - Probability range that completed chunks spawn additional work
 * @property scopeCreepChunks - Range for number of additional chunks spawned by scope creep
 * @property paycheck - Dollar amount received every paycheckInterval rounds (≥0)
 * @property contextSwitchRegrowth - Progress loss rate when switching from Blue to Red tasks (0-1)
 * @property workVisibility - Whether Red Ball can see Blue's work (default: false for asymmetry)
 *
 * @example
 * ```json
 * {
 *   "workSpawnRate": 4,
 *   "subtasksPerChunk": { "min": 4, "max": 12 },
 *   "scopeCreepProbability": { "min": 0.1, "max": 0.2 },
 *   "scopeCreepChunks": { "min": 2, "max": 5 },
 *   "paycheck": 6250,
 *   "contextSwitchRegrowth": 0.3,
 *   "workVisibility": false
 * }
 * ```
 */
export const BlueBallConfigSchema = z.object({
  /** Number of work chunks spawned at round start. Range: 1-10. Default: 4 */
  workSpawnRate: z.number().int().min(1).max(10).default(4),
  /** Random range for number of subtasks per work chunk. Range: 1-20. Default: 4-12 */
  subtasksPerChunk: z
    .object({
      min: z.number().int().min(1).max(20).default(4),
      max: z.number().int().min(1).max(20).default(12),
    })
    .default({ min: 4, max: 12 }),
  /** Probability range that completing a chunk triggers scope creep. Range: 0-1 (10-20% default) */
  scopeCreepProbability: z
    .object({
      min: z.number().min(0).max(1).default(0.1),
      max: z.number().min(0).max(1).default(0.2),
    })
    .default({ min: 0.1, max: 0.2 }),
  /** Range for additional work chunks spawned by scope creep. Range: 1-10. Default: 2-5 */
  scopeCreepChunks: z
    .object({
      min: z.number().int().min(1).max(10).default(2),
      max: z.number().int().min(1).max(10).default(5),
    })
    .default({ min: 2, max: 5 }),
  /** Paycheck amount in dollars. Range: ≥0. Default: 6250 (biweekly) */
  paycheck: z.number().min(0).default(6250),
  /** Incomplete Blue task progress decay rate when switching to Red tasks. Range: 0-1 (30% default) */
  contextSwitchRegrowth: z.number().min(0).max(1).default(0.3),
  /** Whether Red Ball can see Blue's work area. Default: false (creates asymmetry) */
  workVisibility: z.boolean().default(false),
});

export type BlueBallConfig = z.infer<typeof BlueBallConfigSchema>;

// =============================================================================
// RED BALL CONFIGURATION
// =============================================================================

/**
 * Red Task Type Definition
 *
 * Defines a category of household task with weighted spawn probability and completion time.
 *
 * @property type - Task category: cleaning, cooking, childcare, or errands
 * @property weight - Spawn probability weight (0-1, sum across all types should ≈1.0)
 * @property completionTime - Seconds required to complete this task type (5-300s)
 */
export const RedTaskTypeSchema = z.object({
  /** Task category. Must be one of: cleaning, cooking, childcare, errands */
  type: z.enum(['cleaning', 'cooking', 'childcare', 'errands']),
  /** Relative spawn probability weight. Range: 0-1. Weights across all task types should sum to ≈1.0 */
  weight: z.number().min(0).max(1),
  /** Time in seconds to complete this task type. Range: 5-300s */
  completionTime: z.number().min(5).max(300),
});

/**
 * Red Ball Household Task Configuration
 *
 * Controls household task spawning rates and types for the home-focused partner (Red Ball).
 *
 * @property taskSpawnInterval - Random range for seconds between task spawns (10-120s)
 * @property taskTypes - Array of task type definitions (must have at least 1)
 *
 * @example
 * ```json
 * {
 *   "taskSpawnInterval": { "min": 30, "max": 45 },
 *   "taskTypes": [
 *     { "type": "cleaning", "weight": 0.3, "completionTime": 20 },
 *     { "type": "cooking", "weight": 0.3, "completionTime": 30 }
 *   ]
 * }
 * ```
 */
export const RedBallConfigSchema = z.object({
  /** Random range for seconds between task spawns. Range: 10-120s. Default: 30-45s */
  taskSpawnInterval: z
    .object({
      min: z.number().min(10).max(120).default(30),
      max: z.number().min(10).max(120).default(45),
    })
    .default({ min: 30, max: 45 }),
  /** Array of task type definitions. Must have at least 1 task type defined. */
  taskTypes: z.array(RedTaskTypeSchema).min(1),
});

export type RedTaskType = z.infer<typeof RedTaskTypeSchema>;
export type RedBallConfig = z.infer<typeof RedBallConfigSchema>;

// =============================================================================
// STRESS CONFIGURATION
// =============================================================================

/**
 * Asymmetric Stress System Configuration
 *
 * Controls stress accumulation, debuffs, and cross-partner effects.
 * Blue stress accumulates without relief, while Red stress can be reduced.
 *
 * @property blue - Blue Ball (employed partner) stress mechanics
 * @property red - Red Ball (household partner) stress mechanics and debuffs to Blue
 *
 * @example
 * ```json
 * {
 *   "blue": {
 *     "incompleteTaskPenalty": 0.1,
 *     "helpedRedPenalty": 0.05,
 *     "rapportDecayPenalty": 0.15,
 *     "overflowDebuffRate": 0.1,
 *     "weepingThreshold": 0.9
 *   },
 *   "red": {
 *     "incompleteTaskPenalty": 0.08,
 *     "taskCompletionReduction": 0.1,
 *     "blueHelpReduction": 0.15,
 *     "highStressThreshold": 0.75,
 *     "sustainedStressRounds": 3,
 *     "blueDebuffCompletionMultiplier": 0.7,
 *     "blueDebuffRegrowthMultiplier": 1.5
 *   }
 * }
 * ```
 */
export const StressConfigSchema = z.object({
  blue: z.object({
    /** Stress increase per incomplete Blue task at round end. Range: 0-1 (10% default) */
    incompleteTaskPenalty: z.number().min(0).max(1).default(0.1),
    /** Stress increase when helping Red with tasks. Range: 0-1 (5% default) */
    helpedRedPenalty: z.number().min(0).max(1).default(0.05),
    /** Stress increase per rapport level lost. Range: 0-1 (15% default) */
    rapportDecayPenalty: z.number().min(0).max(1).default(0.15),
    /** Task completion slowdown per 10% stress overflow. Range: 0-1 (10% default = 100% slower at 200% stress) */
    overflowDebuffRate: z.number().min(0).max(1).default(0.1),
    /** Stress threshold that triggers weeping animation. Range: 0-1 (90% default) */
    weepingThreshold: z.number().min(0).max(1).default(0.9),
  }),
  red: z.object({
    /** Stress increase per incomplete Red task at round end. Range: 0-1 (8% default) */
    incompleteTaskPenalty: z.number().min(0).max(1).default(0.08),
    /** Stress decrease per completed Red task. Range: 0-1 (10% default) */
    taskCompletionReduction: z.number().min(0).max(1).default(0.1),
    /** Stress decrease when Blue helps with Red tasks. Range: 0-1 (15% default) */
    blueHelpReduction: z.number().min(0).max(1).default(0.15),
    /** Stress threshold considered "high" for debuff triggers. Range: 0-1 (75% default) */
    highStressThreshold: z.number().min(0).max(1).default(0.75),
    /** Consecutive rounds of high stress required to trigger debuffs. Range: 1-10 (3 default) */
    sustainedStressRounds: z.number().int().min(1).max(10).default(3),
    /** Blue task completion speed multiplier during sustained Red stress. Range: 0-2 (0.7 = 30% slower) */
    blueDebuffCompletionMultiplier: z.number().min(0).max(2).default(0.7),
    /** Blue task regrowth rate multiplier during sustained Red stress. Range: 0-5 (1.5 = 50% faster regrowth) */
    blueDebuffRegrowthMultiplier: z.number().min(0).max(5).default(1.5),
  }),
});

export type StressConfig = z.infer<typeof StressConfigSchema>;

// =============================================================================
// RAPPORT CONFIGURATION
// =============================================================================

/**
 * Employment Rapport System Configuration
 *
 * Controls Blue Ball's relationship with employer, job security, and firing mechanics.
 * Rapport is shown as emoji gauge (😢 😕 😐 🙂 😊) not as numeric percentage.
 */
export const RapportConfigSchema = z.object({
  /** Starting rapport level (0-100, shown as emoji). Default: 75 (🙂) */
  initialLevel: z.number().min(0).max(100).default(75),
  /** Rapport increase per successful round completion. Range: 0-50. Default: 5 */
  successBonus: z.number().min(0).max(50).default(5),
  /** Rapport decrease per incomplete round. Range: 0-50. Default: 10 */
  missedDeadlinePenalty: z.number().min(0).max(50).default(10),
  /** Decay multiplier for consecutive missed rounds (exponential). Range: 1-5. Default: 1.5 */
  compoundMultiplier: z.number().min(1).max(5).default(1.5),
  /** Random range for rapport threshold that triggers firing. Range: 0-50. Default: 15-25 */
  firingThreshold: z
    .object({
      min: z.number().min(0).max(50).default(15),
      max: z.number().min(0).max(50).default(25),
    })
    .default({ min: 15, max: 25 }),
});

export type RapportConfig = z.infer<typeof RapportConfigSchema>;

// =============================================================================
// EMPLOYMENT EVENT CONFIGURATION
// =============================================================================

/**
 * Red's Employment Event Configuration
 *
 * Controls when and how Red Ball gets a part-time job, creating a difficulty spike.
 */
export const EmploymentEventConfigSchema = z.object({
  /** Random range for round number when event triggers. Range: 1-20. Default: 3-5 */
  triggerRound: z
    .object({
      min: z.number().int().min(1).max(20).default(3),
      max: z.number().int().min(1).max(20).default(5),
    })
    .default({ min: 3, max: 5 }),
  /** Red's part-time income per round after employment. Range: ≥0. Default: 400 */
  redIncome: z.number().min(0).default(400),
  /** Reduction in Blue's available work time after Red employment. Range: 0-1 (45% default) */
  blueWorkTimeReduction: z.number().min(0).max(1).default(0.45),
  /** Whether this event is enabled for this scenario. Default: true */
  enabled: z.boolean().default(true),
});

export type EmploymentEventConfig = z.infer<typeof EmploymentEventConfigSchema>;

// =============================================================================
// UI CONFIGURATION
// =============================================================================

/**
 * UI Element Visibility Configuration
 *
 * Controls which UI elements are shown to the player. Toggles visibility without affecting gameplay logic.
 */
export const UIConfigSchema = z.object({
  /** Show Blue Ball stress meter. Default: true */
  showBlueStressMeter: z.boolean().default(true),
  /** Show Red Ball stress meter. Default: true */
  showRedStressMeter: z.boolean().default(true),
  /** Show employer rapport gauge (emoji). Default: true */
  showRapportGauge: z.boolean().default(true),
  /** Show financial balance. Default: true */
  showBalance: z.boolean().default(true),
  /** Show round timer countdown. Default: true */
  showRoundTimer: z.boolean().default(true),
  /** Seconds between empathy action suggestion modals. Range: 5-300s. Default: 30s */
  empathyModalInterval: z.number().min(5).max(300).default(30),
});

export type UIConfig = z.infer<typeof UIConfigSchema>;

// =============================================================================
// FINANCIAL CONFIGURATION
// =============================================================================

/**
 * Financial System Configuration
 *
 * Controls starting balance and financial tracking.
 */
export const FinancialConfigSchema = z.object({
  /** Starting household balance in dollars. Range: ≥0. Default: 10000 */
  startingBalance: z.number().min(0).default(10000),
});

export type FinancialConfig = z.infer<typeof FinancialConfigSchema>;

// =============================================================================
// TUTORIAL CONFIGURATION
// =============================================================================

/**
 * Tutorial System Configuration
 *
 * Controls whether tutorial modals and tips are shown to the player.
 */
export const TutorialConfigSchema = z.object({
  /** Whether tutorial modals are enabled. Default: true */
  enabled: z.boolean().default(true),
});

export type TutorialConfig = z.infer<typeof TutorialConfigSchema>;

// =============================================================================
// SCENARIO CONFIGURATION (TOP LEVEL)
// =============================================================================

/**
 * Complete Scenario Configuration
 *
 * Top-level configuration object containing all game parameters for a specific scenario.
 * All parameters are config-driven with no hardcoded magic numbers in game logic.
 *
 * @property id - Unique scenario identifier (used for file loading)
 * @property name - Human-readable scenario name
 * @property description - Scenario description shown in selection screen
 * @property difficulty - Difficulty rating (1-5 stars)
 * @property round - Round timing and paycheck interval configuration
 * @property blue - Blue Ball employment and work generation configuration
 * @property red - Red Ball household task configuration
 * @property stress - Asymmetric stress system configuration for both balls
 * @property rapport - Employment rapport and firing mechanics configuration
 * @property employmentEvent - Red's employment event trigger and effects
 * @property ui - UI element visibility toggles
 * @property financial - Financial system configuration
 * @property tutorial - Tutorial modal configuration
 *
 * @example See /scenarios/baseline.json for complete example
 */
export const ScenarioConfigSchema = z.object({
  /** Unique scenario identifier. Must match JSON filename. */
  id: z.string().min(1),
  /** Human-readable scenario name. */
  name: z.string().min(1),
  /** Scenario description for selection screen. */
  description: z.string(),
  /** Difficulty rating shown as stars (1-5). Default: 2 */
  difficulty: z.number().int().min(1).max(5),

  /** Round timing and progression configuration */
  round: RoundConfigSchema,
  /** Blue Ball (employed partner) configuration */
  blue: BlueBallConfigSchema,
  /** Red Ball (household partner) configuration */
  red: RedBallConfigSchema,
  /** Asymmetric stress system configuration */
  stress: StressConfigSchema,
  /** Employment rapport and job security configuration */
  rapport: RapportConfigSchema,
  /** Red's employment event configuration */
  employmentEvent: EmploymentEventConfigSchema,
  /** UI visibility toggles */
  ui: UIConfigSchema,
  /** Financial system configuration */
  financial: FinancialConfigSchema,
  /** Tutorial system configuration */
  tutorial: TutorialConfigSchema,
});

export type ScenarioConfig = z.infer<typeof ScenarioConfigSchema>;
