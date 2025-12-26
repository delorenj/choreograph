/**
 * Default Configuration Values
 *
 * Fallback values used when configuration is incomplete.
 * All game parameters should have sensible defaults.
 *
 * Based on Architecture Document Section 6.3 (Scenario Configuration)
 */

import type {
  RoundConfig,
  BlueBallConfig,
  RedBallConfig,
  StressConfig,
  RapportConfig,
  EmploymentEventConfig,
  UIConfig,
  FinancialConfig,
  TutorialConfig,
  ScenarioConfig,
  RedTaskType,
} from './schema';

// =============================================================================
// ROUND DEFAULTS
// =============================================================================

export const DEFAULT_ROUND_CONFIG: RoundConfig = {
  durationSeconds: 120,
  paycheckInterval: 2,
};

// =============================================================================
// BLUE BALL DEFAULTS
// =============================================================================

export const DEFAULT_BLUE_CONFIG: BlueBallConfig = {
  workSpawnRate: 4,
  subtasksPerChunk: {
    min: 4,
    max: 12,
  },
  scopeCreepProbability: {
    min: 0.1,
    max: 0.2,
  },
  scopeCreepChunks: {
    min: 2,
    max: 5,
  },
  paycheck: 6250,
  contextSwitchRegrowth: 0.3,
  workVisibility: false,
};

// =============================================================================
// RED BALL DEFAULTS
// =============================================================================

export const DEFAULT_RED_TASK_TYPES: RedTaskType[] = [
  {
    type: 'cleaning',
    weight: 0.3,
    completionTime: 20,
  },
  {
    type: 'cooking',
    weight: 0.3,
    completionTime: 30,
  },
  {
    type: 'childcare',
    weight: 0.25,
    completionTime: 40,
  },
  {
    type: 'errands',
    weight: 0.15,
    completionTime: 25,
  },
];

export const DEFAULT_RED_CONFIG: RedBallConfig = {
  taskSpawnInterval: {
    min: 30,
    max: 45,
  },
  taskTypes: DEFAULT_RED_TASK_TYPES,
};

// =============================================================================
// STRESS DEFAULTS
// =============================================================================

export const DEFAULT_STRESS_CONFIG: StressConfig = {
  blue: {
    incompleteTaskPenalty: 0.1,
    helpedRedPenalty: 0.05,
    rapportDecayPenalty: 0.15,
    overflowDebuffRate: 0.1,
    weepingThreshold: 0.9,
  },
  red: {
    incompleteTaskPenalty: 0.08,
    taskCompletionReduction: 0.1,
    blueHelpReduction: 0.15,
    highStressThreshold: 0.75,
    sustainedStressRounds: 3,
    blueDebuffCompletionMultiplier: 0.7,
    blueDebuffRegrowthMultiplier: 1.5,
  },
};

// =============================================================================
// RAPPORT DEFAULTS
// =============================================================================

export const DEFAULT_RAPPORT_CONFIG: RapportConfig = {
  initialLevel: 75,
  successBonus: 5,
  missedDeadlinePenalty: 10,
  compoundMultiplier: 1.5,
  firingThreshold: {
    min: 15,
    max: 25,
  },
};

// =============================================================================
// EMPLOYMENT EVENT DEFAULTS
// =============================================================================

export const DEFAULT_EMPLOYMENT_EVENT_CONFIG: EmploymentEventConfig = {
  triggerRound: {
    min: 3,
    max: 5,
  },
  redIncome: 400,
  blueWorkTimeReduction: 0.45,
  enabled: true,
};

// =============================================================================
// UI DEFAULTS
// =============================================================================

export const DEFAULT_UI_CONFIG: UIConfig = {
  showBlueStressMeter: true,
  showRedStressMeter: true,
  showRapportGauge: true,
  showBalance: true,
  showRoundTimer: true,
  empathyModalInterval: 30,
};

// =============================================================================
// FINANCIAL DEFAULTS
// =============================================================================

export const DEFAULT_FINANCIAL_CONFIG: FinancialConfig = {
  startingBalance: 10000,
};

// =============================================================================
// TUTORIAL DEFAULTS
// =============================================================================

export const DEFAULT_TUTORIAL_CONFIG: TutorialConfig = {
  enabled: true,
};

// =============================================================================
// COMPLETE SCENARIO DEFAULTS
// =============================================================================

export const DEFAULT_SCENARIO: ScenarioConfig = {
  id: 'baseline',
  name: 'Baseline',
  description: 'Standard household dynamic with one employed partner',
  difficulty: 2,
  round: DEFAULT_ROUND_CONFIG,
  blue: DEFAULT_BLUE_CONFIG,
  red: DEFAULT_RED_CONFIG,
  stress: DEFAULT_STRESS_CONFIG,
  rapport: DEFAULT_RAPPORT_CONFIG,
  employmentEvent: DEFAULT_EMPLOYMENT_EVENT_CONFIG,
  ui: DEFAULT_UI_CONFIG,
  financial: DEFAULT_FINANCIAL_CONFIG,
  tutorial: DEFAULT_TUTORIAL_CONFIG,
};
