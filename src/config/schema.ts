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

export const RoundConfigSchema = z.object({
  durationSeconds: z.number().min(30).max(600).default(120),
  paycheckInterval: z.number().int().min(1).max(10).default(2),
});

export type RoundConfig = z.infer<typeof RoundConfigSchema>;

// =============================================================================
// BLUE BALL CONFIGURATION
// =============================================================================

export const BlueBallConfigSchema = z.object({
  workSpawnRate: z.number().int().min(1).max(10).default(4),
  subtasksPerChunk: z
    .object({
      min: z.number().int().min(1).max(20).default(4),
      max: z.number().int().min(1).max(20).default(12),
    })
    .default({ min: 4, max: 12 }),
  scopeCreepProbability: z
    .object({
      min: z.number().min(0).max(1).default(0.1),
      max: z.number().min(0).max(1).default(0.2),
    })
    .default({ min: 0.1, max: 0.2 }),
  scopeCreepChunks: z
    .object({
      min: z.number().int().min(1).max(10).default(2),
      max: z.number().int().min(1).max(10).default(5),
    })
    .default({ min: 2, max: 5 }),
  paycheck: z.number().min(0).default(6250),
  contextSwitchRegrowth: z.number().min(0).max(1).default(0.3),
  workVisibility: z.boolean().default(false),
});

export type BlueBallConfig = z.infer<typeof BlueBallConfigSchema>;

// =============================================================================
// RED BALL CONFIGURATION
// =============================================================================

export const RedTaskTypeSchema = z.object({
  type: z.enum(['cleaning', 'cooking', 'childcare', 'errands']),
  weight: z.number().min(0).max(1),
  completionTime: z.number().min(5).max(300),
});

export const RedBallConfigSchema = z.object({
  taskSpawnInterval: z
    .object({
      min: z.number().min(10).max(120).default(30),
      max: z.number().min(10).max(120).default(45),
    })
    .default({ min: 30, max: 45 }),
  taskTypes: z.array(RedTaskTypeSchema).min(1),
});

export type RedTaskType = z.infer<typeof RedTaskTypeSchema>;
export type RedBallConfig = z.infer<typeof RedBallConfigSchema>;

// =============================================================================
// STRESS CONFIGURATION
// =============================================================================

export const StressConfigSchema = z.object({
  blue: z.object({
    incompleteTaskPenalty: z.number().min(0).max(1).default(0.1),
    helpedRedPenalty: z.number().min(0).max(1).default(0.05),
    rapportDecayPenalty: z.number().min(0).max(1).default(0.15),
    overflowDebuffRate: z.number().min(0).max(1).default(0.1),
    weepingThreshold: z.number().min(0).max(1).default(0.9),
  }),
  red: z.object({
    incompleteTaskPenalty: z.number().min(0).max(1).default(0.08),
    taskCompletionReduction: z.number().min(0).max(1).default(0.1),
    blueHelpReduction: z.number().min(0).max(1).default(0.15),
    highStressThreshold: z.number().min(0).max(1).default(0.75),
    sustainedStressRounds: z.number().int().min(1).max(10).default(3),
    blueDebuffCompletionMultiplier: z.number().min(0).max(2).default(0.7),
    blueDebuffRegrowthMultiplier: z.number().min(0).max(5).default(1.5),
  }),
});

export type StressConfig = z.infer<typeof StressConfigSchema>;

// =============================================================================
// RAPPORT CONFIGURATION
// =============================================================================

export const RapportConfigSchema = z.object({
  initialLevel: z.number().min(0).max(100).default(75),
  successBonus: z.number().min(0).max(50).default(5),
  missedDeadlinePenalty: z.number().min(0).max(50).default(10),
  compoundMultiplier: z.number().min(1).max(5).default(1.5),
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

export const EmploymentEventConfigSchema = z.object({
  triggerRound: z
    .object({
      min: z.number().int().min(1).max(20).default(3),
      max: z.number().int().min(1).max(20).default(5),
    })
    .default({ min: 3, max: 5 }),
  redIncome: z.number().min(0).default(400),
  blueWorkTimeReduction: z.number().min(0).max(1).default(0.45),
  enabled: z.boolean().default(true),
});

export type EmploymentEventConfig = z.infer<typeof EmploymentEventConfigSchema>;

// =============================================================================
// UI CONFIGURATION
// =============================================================================

export const UIConfigSchema = z.object({
  showBlueStressMeter: z.boolean().default(true),
  showRedStressMeter: z.boolean().default(true),
  showRapportGauge: z.boolean().default(true),
  showBalance: z.boolean().default(true),
  showRoundTimer: z.boolean().default(true),
  empathyModalInterval: z.number().min(5).max(300).default(30),
});

export type UIConfig = z.infer<typeof UIConfigSchema>;

// =============================================================================
// SCENARIO CONFIGURATION (TOP LEVEL)
// =============================================================================

export const ScenarioConfigSchema = z.object({
  // Metadata
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string(),
  difficulty: z.number().int().min(1).max(5),

  // Configuration Sections
  round: RoundConfigSchema,
  blue: BlueBallConfigSchema,
  red: RedBallConfigSchema,
  stress: StressConfigSchema,
  rapport: RapportConfigSchema,
  employmentEvent: EmploymentEventConfigSchema,
  ui: UIConfigSchema,
});

export type ScenarioConfig = z.infer<typeof ScenarioConfigSchema>;
