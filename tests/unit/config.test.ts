/**
 * Configuration System Tests
 *
 * Tests for Zod schemas, ConfigLoader, validation, and hot reload.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  ScenarioConfigSchema,
  RoundConfigSchema,
  BlueBallConfigSchema,
  RedBallConfigSchema,
  StressConfigSchema,
  RapportConfigSchema,
  EmploymentEventConfigSchema,
  UIConfigSchema,
} from '../../src/config/schema';
import { ConfigLoader } from '../../src/config/loader';
import {
  DEFAULT_SCENARIO,
  DEFAULT_ROUND_CONFIG,
  DEFAULT_BLUE_CONFIG,
  DEFAULT_RED_CONFIG,
  DEFAULT_STRESS_CONFIG,
} from '../../src/config/defaults';

// =============================================================================
// SCHEMA VALIDATION TESTS
// =============================================================================

describe('RoundConfigSchema', () => {
  it('should validate valid round config', () => {
    const validConfig = {
      durationSeconds: 120,
      paycheckInterval: 2,
    };

    const result = RoundConfigSchema.parse(validConfig);
    expect(result).toEqual(validConfig);
  });

  it('should apply default values', () => {
    const result = RoundConfigSchema.parse({});
    expect(result.durationSeconds).toBe(120);
    expect(result.paycheckInterval).toBe(2);
  });

  it('should reject invalid duration', () => {
    expect(() =>
      RoundConfigSchema.parse({ durationSeconds: 10 })
    ).toThrow();
  });

  it('should reject invalid paycheck interval', () => {
    expect(() =>
      RoundConfigSchema.parse({ paycheckInterval: 0 })
    ).toThrow();
  });
});

describe('BlueBallConfigSchema', () => {
  it('should validate valid blue ball config', () => {
    const result = BlueBallConfigSchema.parse(DEFAULT_BLUE_CONFIG);
    expect(result.workSpawnRate).toBe(4);
    expect(result.paycheck).toBe(6250);
  });

  it('should apply default values', () => {
    const result = BlueBallConfigSchema.parse({});
    expect(result.workSpawnRate).toBe(4);
    expect(result.contextSwitchRegrowth).toBe(0.3);
    expect(result.workVisibility).toBe(false);
  });

  it('should reject invalid work spawn rate', () => {
    expect(() =>
      BlueBallConfigSchema.parse({ workSpawnRate: 0 })
    ).toThrow();
  });

  it('should reject invalid context switch regrowth', () => {
    expect(() =>
      BlueBallConfigSchema.parse({ contextSwitchRegrowth: 1.5 })
    ).toThrow();
  });
});

describe('RedBallConfigSchema', () => {
  it('should validate valid red ball config', () => {
    const result = RedBallConfigSchema.parse(DEFAULT_RED_CONFIG);
    expect(result.taskTypes).toHaveLength(4);
    expect(result.taskSpawnInterval.min).toBe(30);
  });

  it('should reject empty task types', () => {
    expect(() =>
      RedBallConfigSchema.parse({ taskTypes: [] })
    ).toThrow();
  });

  it('should validate task type weights', () => {
    const validConfig = {
      taskTypes: [
        { type: 'cleaning', weight: 0.5, completionTime: 20 },
      ],
    };

    const result = RedBallConfigSchema.parse(validConfig);
    expect(result.taskTypes[0]?.weight).toBe(0.5);
  });
});

describe('StressConfigSchema', () => {
  it('should validate valid stress config', () => {
    const result = StressConfigSchema.parse(DEFAULT_STRESS_CONFIG);
    expect(result.blue.incompleteTaskPenalty).toBe(0.1);
    expect(result.red.highStressThreshold).toBe(0.75);
  });

  it('should apply default values', () => {
    const result = StressConfigSchema.parse({ blue: {}, red: {} });
    expect(result.blue.weepingThreshold).toBe(0.9);
    expect(result.red.sustainedStressRounds).toBe(3);
  });

  it('should reject invalid penalty values', () => {
    expect(() =>
      StressConfigSchema.parse({
        blue: { incompleteTaskPenalty: 2.0 },
        red: {},
      })
    ).toThrow();
  });
});

describe('RapportConfigSchema', () => {
  it('should validate valid rapport config', () => {
    const validConfig = {
      initialLevel: 75,
      successBonus: 5,
      missedDeadlinePenalty: 10,
      compoundMultiplier: 1.5,
      firingThreshold: { min: 15, max: 25 },
    };

    const result = RapportConfigSchema.parse(validConfig);
    expect(result.initialLevel).toBe(75);
  });

  it('should apply default values', () => {
    const result = RapportConfigSchema.parse({});
    expect(result.initialLevel).toBe(75);
    expect(result.firingThreshold.min).toBe(15);
  });
});

describe('EmploymentEventConfigSchema', () => {
  it('should validate valid employment event config', () => {
    const validConfig = {
      triggerRound: { min: 3, max: 5 },
      redIncome: 400,
      blueWorkTimeReduction: 0.45,
      enabled: true,
    };

    const result = EmploymentEventConfigSchema.parse(validConfig);
    expect(result.enabled).toBe(true);
  });

  it('should apply default values', () => {
    const result = EmploymentEventConfigSchema.parse({});
    expect(result.redIncome).toBe(400);
    expect(result.blueWorkTimeReduction).toBe(0.45);
  });
});

describe('UIConfigSchema', () => {
  it('should validate valid UI config', () => {
    const validConfig = {
      showBlueStressMeter: true,
      showRedStressMeter: false,
      showRapportGauge: true,
      showBalance: true,
      showRoundTimer: true,
      empathyModalInterval: 30,
    };

    const result = UIConfigSchema.parse(validConfig);
    expect(result.showRedStressMeter).toBe(false);
  });

  it('should apply default values', () => {
    const result = UIConfigSchema.parse({});
    expect(result.showBlueStressMeter).toBe(true);
    expect(result.empathyModalInterval).toBe(30);
  });
});

describe('ScenarioConfigSchema', () => {
  it('should validate complete scenario config', () => {
    const result = ScenarioConfigSchema.parse(DEFAULT_SCENARIO);

    expect(result.id).toBe('baseline');
    expect(result.name).toBe('Baseline');
    expect(result.difficulty).toBe(2);
    expect(result.round).toBeDefined();
    expect(result.blue).toBeDefined();
    expect(result.red).toBeDefined();
    expect(result.stress).toBeDefined();
    expect(result.rapport).toBeDefined();
    expect(result.employmentEvent).toBeDefined();
    expect(result.ui).toBeDefined();
  });

  it('should reject missing required fields', () => {
    expect(() =>
      ScenarioConfigSchema.parse({
        id: 'test',
        name: 'Test',
      })
    ).toThrow();
  });

  it('should reject invalid difficulty', () => {
    expect(() =>
      ScenarioConfigSchema.parse({
        ...DEFAULT_SCENARIO,
        difficulty: 6,
      })
    ).toThrow();
  });
});

// =============================================================================
// CONFIG LOADER TESTS
// =============================================================================

describe('ConfigLoader', () => {
  let loader: ConfigLoader;

  beforeEach(() => {
    loader = new ConfigLoader();
    vi.clearAllMocks();
  });

  describe('loadDefault()', () => {
    it('should load default scenario', () => {
      const config = loader.loadDefault();

      expect(config.id).toBe('baseline');
      expect(config.name).toBe('Baseline');
      expect(config.difficulty).toBe(2);
    });

    it('should freeze returned config', () => {
      const config = loader.loadDefault();

      expect(Object.isFrozen(config)).toBe(true);
    });

    it('should allow getting active config after load', () => {
      loader.loadDefault();
      const activeConfig = loader.getActiveConfig();

      expect(activeConfig.id).toBe('baseline');
    });
  });

  describe('validateConfig()', () => {
    it('should validate valid config', () => {
      const result = loader.validateConfig(DEFAULT_SCENARIO);

      expect(result.success).toBe(true);
      expect(result.config).toBeDefined();
      expect(result.errors).toBeUndefined();
    });

    it('should return errors for invalid config', () => {
      const invalidConfig = {
        id: 'test',
        name: 'Test',
        difficulty: 10, // Invalid: > 5
      };

      const result = loader.validateConfig(invalidConfig);

      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors!.length).toBeGreaterThan(0);
    });

    it('should provide field paths in errors', () => {
      const invalidConfig = {
        ...DEFAULT_SCENARIO,
        round: {
          durationSeconds: 10, // Invalid: < 30
        },
      };

      const result = loader.validateConfig(invalidConfig);

      expect(result.success).toBe(false);
      expect(
        result.errors?.some((err) =>
          err.field.includes('round.durationSeconds')
        )
      ).toBe(true);
    });

    it('should handle missing required fields', () => {
      const invalidConfig = {
        id: 'test',
      };

      const result = loader.validateConfig(invalidConfig);

      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
    });
  });

  describe('getActiveConfig()', () => {
    it('should throw if no config loaded', () => {
      expect(() => loader.getActiveConfig()).toThrow(
        'No scenario loaded'
      );
    });

    it('should return active config after load', () => {
      loader.loadDefault();
      const config = loader.getActiveConfig();

      expect(config).toBeDefined();
      expect(config.id).toBe('baseline');
    });

    it('should return readonly config', () => {
      loader.loadDefault();
      const config = loader.getActiveConfig();

      // TypeScript ensures readonly, runtime verification
      expect(typeof config).toBe('object');
    });
  });

  describe('listScenarios()', () => {
    it('should return list of scenarios', async () => {
      const scenarios = await loader.listScenarios();

      expect(Array.isArray(scenarios)).toBe(true);
      expect(scenarios.length).toBeGreaterThan(0);
    });

    it('should return baseline scenario metadata', async () => {
      const scenarios = await loader.listScenarios();
      const baseline = scenarios.find((s) => s.id === 'baseline');

      expect(baseline).toBeDefined();
      expect(baseline?.name).toBe('Baseline');
      expect(baseline?.difficulty).toBe(2);
    });
  });

  describe('hot reload', () => {
    it('should enable hot reload without errors', () => {
      loader.loadDefault();

      expect(() => loader.enableHotReload(1000)).not.toThrow();
    });

    it('should warn if hot reload already enabled', () => {
      const consoleSpy = vi.spyOn(console, 'warn');
      loader.loadDefault();

      loader.enableHotReload(1000);
      loader.enableHotReload(1000); // Second call

      expect(consoleSpy).toHaveBeenCalledWith(
        'Hot reload already enabled'
      );

      loader.disableHotReload();
      consoleSpy.mockRestore();
    });

    it('should disable hot reload', () => {
      loader.loadDefault();
      loader.enableHotReload(1000);

      expect(() => loader.disableHotReload()).not.toThrow();
    });

    it('should handle disable when not enabled', () => {
      expect(() => loader.disableHotReload()).not.toThrow();
    });
  });
});

// =============================================================================
// DEFAULT VALUES TESTS
// =============================================================================

describe('Default Values', () => {
  it('should have all required round defaults', () => {
    expect(DEFAULT_ROUND_CONFIG.durationSeconds).toBe(120);
    expect(DEFAULT_ROUND_CONFIG.paycheckInterval).toBe(2);
  });

  it('should have all required blue defaults', () => {
    expect(DEFAULT_BLUE_CONFIG.workSpawnRate).toBe(4);
    expect(DEFAULT_BLUE_CONFIG.paycheck).toBe(6250);
    expect(DEFAULT_BLUE_CONFIG.contextSwitchRegrowth).toBe(0.3);
  });

  it('should have all required red defaults', () => {
    expect(DEFAULT_RED_CONFIG.taskTypes).toHaveLength(4);
    expect(DEFAULT_RED_CONFIG.taskSpawnInterval.min).toBe(30);
  });

  it('should have all required stress defaults', () => {
    expect(DEFAULT_STRESS_CONFIG.blue.weepingThreshold).toBe(0.9);
    expect(DEFAULT_STRESS_CONFIG.red.highStressThreshold).toBe(0.75);
  });

  it('should have complete scenario defaults', () => {
    expect(DEFAULT_SCENARIO.id).toBe('baseline');
    expect(DEFAULT_SCENARIO.round).toBeDefined();
    expect(DEFAULT_SCENARIO.blue).toBeDefined();
    expect(DEFAULT_SCENARIO.red).toBeDefined();
    expect(DEFAULT_SCENARIO.stress).toBeDefined();
    expect(DEFAULT_SCENARIO.rapport).toBeDefined();
    expect(DEFAULT_SCENARIO.employmentEvent).toBeDefined();
    expect(DEFAULT_SCENARIO.ui).toBeDefined();
  });
});
