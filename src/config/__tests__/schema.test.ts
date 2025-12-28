/**
 * Schema Validation Tests
 *
 * Ensures all configuration schemas validate correctly and reject invalid inputs
 */

import { describe, it, expect } from 'vitest';
import {
  ScenarioConfigSchema,
  RoundConfigSchema,
  BlueBallConfigSchema,
  RedBallConfigSchema,
  RedTaskTypeSchema,
  StressConfigSchema,
  RapportConfigSchema,
  EmploymentEventConfigSchema,
  UIConfigSchema,
  FinancialConfigSchema,
  TutorialConfigSchema,
} from '../schema';
import {
  DEFAULT_SCENARIO,
  DEFAULT_ROUND_CONFIG,
  DEFAULT_BLUE_CONFIG,
  DEFAULT_RED_CONFIG,
  DEFAULT_RED_TASK_TYPES,
  DEFAULT_STRESS_CONFIG,
  DEFAULT_RAPPORT_CONFIG,
  DEFAULT_EMPLOYMENT_EVENT_CONFIG,
  DEFAULT_UI_CONFIG,
  DEFAULT_FINANCIAL_CONFIG,
  DEFAULT_TUTORIAL_CONFIG,
} from '../defaults';

describe('RoundConfigSchema', () => {
  it('should validate valid round config', () => {
    const result = RoundConfigSchema.safeParse(DEFAULT_ROUND_CONFIG);
    expect(result.success).toBe(true);
  });

  it('should reject invalid duration (too short)', () => {
    const result = RoundConfigSchema.safeParse({
      durationSeconds: 10,
      paycheckInterval: 2,
    });
    expect(result.success).toBe(false);
  });

  it('should reject invalid duration (too long)', () => {
    const result = RoundConfigSchema.safeParse({
      durationSeconds: 1000,
      paycheckInterval: 2,
    });
    expect(result.success).toBe(false);
  });

  it('should reject non-integer paycheck interval', () => {
    const result = RoundConfigSchema.safeParse({
      durationSeconds: 120,
      paycheckInterval: 2.5,
    });
    expect(result.success).toBe(false);
  });

  it('should apply defaults for missing fields', () => {
    const result = RoundConfigSchema.parse({});
    expect(result.durationSeconds).toBe(120);
    expect(result.paycheckInterval).toBe(2);
  });
});

describe('BlueBallConfigSchema', () => {
  it('should validate valid blue config', () => {
    const result = BlueBallConfigSchema.safeParse(DEFAULT_BLUE_CONFIG);
    expect(result.success).toBe(true);
  });

  it('should reject invalid work spawn rate', () => {
    const result = BlueBallConfigSchema.safeParse({
      ...DEFAULT_BLUE_CONFIG,
      workSpawnRate: 20,
    });
    expect(result.success).toBe(false);
  });

  it('should reject invalid scope creep probability', () => {
    const result = BlueBallConfigSchema.safeParse({
      ...DEFAULT_BLUE_CONFIG,
      scopeCreepProbability: { min: 1.5, max: 2.0 },
    });
    expect(result.success).toBe(false);
  });

  it('should validate context switch regrowth range', () => {
    const result = BlueBallConfigSchema.safeParse({
      ...DEFAULT_BLUE_CONFIG,
      contextSwitchRegrowth: 0.5,
    });
    expect(result.success).toBe(true);
  });

  it('should reject negative paycheck', () => {
    const result = BlueBallConfigSchema.safeParse({
      ...DEFAULT_BLUE_CONFIG,
      paycheck: -1000,
    });
    expect(result.success).toBe(false);
  });
});

describe('RedBallConfigSchema', () => {
  it('should validate valid red config', () => {
    const result = RedBallConfigSchema.safeParse(DEFAULT_RED_CONFIG);
    expect(result.success).toBe(true);
  });

  it('should reject empty task types array', () => {
    const result = RedBallConfigSchema.safeParse({
      ...DEFAULT_RED_CONFIG,
      taskTypes: [],
    });
    expect(result.success).toBe(false);
  });

  it('should validate all task type enums', () => {
    const validTypes = ['cleaning', 'cooking', 'childcare', 'errands'];
    for (const type of validTypes) {
      const result = RedTaskTypeSchema.safeParse({
        type,
        weight: 0.25,
        completionTime: 30,
      });
      expect(result.success).toBe(true);
    }
  });

  it('should reject invalid task type', () => {
    const result = RedTaskTypeSchema.safeParse({
      type: 'invalid',
      weight: 0.25,
      completionTime: 30,
    });
    expect(result.success).toBe(false);
  });

  it('should reject invalid task weight (out of range)', () => {
    const result = RedTaskTypeSchema.safeParse({
      type: 'cleaning',
      weight: 1.5,
      completionTime: 30,
    });
    expect(result.success).toBe(false);
  });
});

describe('StressConfigSchema', () => {
  it('should validate valid stress config', () => {
    const result = StressConfigSchema.safeParse(DEFAULT_STRESS_CONFIG);
    expect(result.success).toBe(true);
  });

  it('should reject invalid blue stress penalties (out of range)', () => {
    const result = StressConfigSchema.safeParse({
      ...DEFAULT_STRESS_CONFIG,
      blue: {
        ...DEFAULT_STRESS_CONFIG.blue,
        incompleteTaskPenalty: 1.5,
      },
    });
    expect(result.success).toBe(false);
  });

  it('should reject invalid red sustained stress rounds', () => {
    const result = StressConfigSchema.safeParse({
      ...DEFAULT_STRESS_CONFIG,
      red: {
        ...DEFAULT_STRESS_CONFIG.red,
        sustainedStressRounds: 0,
      },
    });
    expect(result.success).toBe(false);
  });

  it('should validate weeping threshold range', () => {
    const result = StressConfigSchema.safeParse({
      ...DEFAULT_STRESS_CONFIG,
      blue: {
        ...DEFAULT_STRESS_CONFIG.blue,
        weepingThreshold: 0.85,
      },
    });
    expect(result.success).toBe(true);
  });
});

describe('RapportConfigSchema', () => {
  it('should validate valid rapport config', () => {
    const result = RapportConfigSchema.safeParse(DEFAULT_RAPPORT_CONFIG);
    expect(result.success).toBe(true);
  });

  it('should reject invalid initial level (out of range)', () => {
    const result = RapportConfigSchema.safeParse({
      ...DEFAULT_RAPPORT_CONFIG,
      initialLevel: 150,
    });
    expect(result.success).toBe(false);
  });

  it('should reject invalid firing threshold', () => {
    const result = RapportConfigSchema.safeParse({
      ...DEFAULT_RAPPORT_CONFIG,
      firingThreshold: { min: 60, max: 70 },
    });
    expect(result.success).toBe(false);
  });

  it('should validate compound multiplier range', () => {
    const result = RapportConfigSchema.safeParse({
      ...DEFAULT_RAPPORT_CONFIG,
      compoundMultiplier: 2.5,
    });
    expect(result.success).toBe(true);
  });
});

describe('EmploymentEventConfigSchema', () => {
  it('should validate valid employment event config', () => {
    const result = EmploymentEventConfigSchema.safeParse(DEFAULT_EMPLOYMENT_EVENT_CONFIG);
    expect(result.success).toBe(true);
  });

  it('should reject invalid trigger round range', () => {
    const result = EmploymentEventConfigSchema.safeParse({
      ...DEFAULT_EMPLOYMENT_EVENT_CONFIG,
      triggerRound: { min: 25, max: 30 },
    });
    expect(result.success).toBe(false);
  });

  it('should reject negative red income', () => {
    const result = EmploymentEventConfigSchema.safeParse({
      ...DEFAULT_EMPLOYMENT_EVENT_CONFIG,
      redIncome: -100,
    });
    expect(result.success).toBe(false);
  });

  it('should validate work time reduction range', () => {
    const result = EmploymentEventConfigSchema.safeParse({
      ...DEFAULT_EMPLOYMENT_EVENT_CONFIG,
      blueWorkTimeReduction: 0.6,
    });
    expect(result.success).toBe(true);
  });
});

describe('UIConfigSchema', () => {
  it('should validate valid UI config', () => {
    const result = UIConfigSchema.safeParse(DEFAULT_UI_CONFIG);
    expect(result.success).toBe(true);
  });

  it('should accept all boolean toggles', () => {
    const result = UIConfigSchema.safeParse({
      showBlueStressMeter: false,
      showRedStressMeter: false,
      showRapportGauge: false,
      showBalance: false,
      showRoundTimer: false,
      empathyModalInterval: 60,
    });
    expect(result.success).toBe(true);
  });

  it('should reject invalid empathy modal interval (too short)', () => {
    const result = UIConfigSchema.safeParse({
      ...DEFAULT_UI_CONFIG,
      empathyModalInterval: 2,
    });
    expect(result.success).toBe(false);
  });

  it('should reject invalid empathy modal interval (too long)', () => {
    const result = UIConfigSchema.safeParse({
      ...DEFAULT_UI_CONFIG,
      empathyModalInterval: 500,
    });
    expect(result.success).toBe(false);
  });
});

describe('FinancialConfigSchema', () => {
  it('should validate valid financial config', () => {
    const result = FinancialConfigSchema.safeParse(DEFAULT_FINANCIAL_CONFIG);
    expect(result.success).toBe(true);
  });

  it('should reject negative starting balance', () => {
    const result = FinancialConfigSchema.safeParse({
      startingBalance: -1000,
    });
    expect(result.success).toBe(false);
  });

  it('should accept zero starting balance', () => {
    const result = FinancialConfigSchema.safeParse({
      startingBalance: 0,
    });
    expect(result.success).toBe(true);
  });
});

describe('TutorialConfigSchema', () => {
  it('should validate valid tutorial config', () => {
    const result = TutorialConfigSchema.safeParse(DEFAULT_TUTORIAL_CONFIG);
    expect(result.success).toBe(true);
  });

  it('should accept disabled tutorial', () => {
    const result = TutorialConfigSchema.safeParse({
      enabled: false,
    });
    expect(result.success).toBe(true);
  });
});

describe('ScenarioConfigSchema', () => {
  it('should validate complete default scenario', () => {
    const result = ScenarioConfigSchema.safeParse(DEFAULT_SCENARIO);
    expect(result.success).toBe(true);
  });

  it('should require id field', () => {
    const { id, ...withoutId } = DEFAULT_SCENARIO;
    const result = ScenarioConfigSchema.safeParse(withoutId);
    expect(result.success).toBe(false);
  });

  it('should require name field', () => {
    const { name, ...withoutName } = DEFAULT_SCENARIO;
    const result = ScenarioConfigSchema.safeParse(withoutName);
    expect(result.success).toBe(false);
  });

  it('should validate difficulty range', () => {
    const validDifficulties = [1, 2, 3, 4, 5];
    for (const difficulty of validDifficulties) {
      const result = ScenarioConfigSchema.safeParse({
        ...DEFAULT_SCENARIO,
        difficulty,
      });
      expect(result.success).toBe(true);
    }
  });

  it('should reject invalid difficulty (out of range)', () => {
    const result = ScenarioConfigSchema.safeParse({
      ...DEFAULT_SCENARIO,
      difficulty: 6,
    });
    expect(result.success).toBe(false);
  });

  it('should validate all nested config sections', () => {
    const config = {
      id: 'test',
      name: 'Test Scenario',
      description: 'Test description',
      difficulty: 3,
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

    const result = ScenarioConfigSchema.safeParse(config);
    expect(result.success).toBe(true);
  });
});

describe('Default Configuration Validation', () => {
  it('should validate all default configs match their schemas', () => {
    expect(RoundConfigSchema.safeParse(DEFAULT_ROUND_CONFIG).success).toBe(true);
    expect(BlueBallConfigSchema.safeParse(DEFAULT_BLUE_CONFIG).success).toBe(true);
    expect(RedBallConfigSchema.safeParse(DEFAULT_RED_CONFIG).success).toBe(true);
    expect(StressConfigSchema.safeParse(DEFAULT_STRESS_CONFIG).success).toBe(true);
    expect(RapportConfigSchema.safeParse(DEFAULT_RAPPORT_CONFIG).success).toBe(true);
    expect(EmploymentEventConfigSchema.safeParse(DEFAULT_EMPLOYMENT_EVENT_CONFIG).success).toBe(
      true
    );
    expect(UIConfigSchema.safeParse(DEFAULT_UI_CONFIG).success).toBe(true);
    expect(FinancialConfigSchema.safeParse(DEFAULT_FINANCIAL_CONFIG).success).toBe(true);
    expect(TutorialConfigSchema.safeParse(DEFAULT_TUTORIAL_CONFIG).success).toBe(true);
    expect(ScenarioConfigSchema.safeParse(DEFAULT_SCENARIO).success).toBe(true);
  });

  it('should validate all default red task types', () => {
    for (const taskType of DEFAULT_RED_TASK_TYPES) {
      const result = RedTaskTypeSchema.safeParse(taskType);
      expect(result.success).toBe(true);
    }
  });

  it('should ensure red task type weights sum to reasonable value', () => {
    const totalWeight = DEFAULT_RED_TASK_TYPES.reduce((sum, task) => sum + task.weight, 0);
    // Allow some flexibility in total weight (should be close to 1.0)
    expect(totalWeight).toBeGreaterThan(0.95);
    expect(totalWeight).toBeLessThanOrEqual(1.0);
  });
});
