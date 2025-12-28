/**
 * ConfigLoader Tests
 *
 * Ensures configuration loading, validation, and hot-reload functionality works correctly
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ConfigLoader } from '../loader';
import { DEFAULT_SCENARIO } from '../defaults';

// Mock fetch for testing
global.fetch = vi.fn();

describe('ConfigLoader', () => {
  let loader: ConfigLoader;

  beforeEach(() => {
    loader = new ConfigLoader();
    vi.clearAllMocks();
  });

  describe('loadScenario', () => {
    it('should load valid scenario from JSON file', async () => {
      const mockScenario = { ...DEFAULT_SCENARIO, id: 'test' };

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockScenario,
      });

      const config = await loader.loadScenario('test');

      expect(config.id).toBe('test');
      expect(global.fetch).toHaveBeenCalledWith('/scenarios/test.json');
    });

    it('should fall back to default scenario when file not found', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      const config = await loader.loadScenario('nonexistent');

      expect(config.id).toBe(DEFAULT_SCENARIO.id);
      expect(config).toEqual(DEFAULT_SCENARIO);
    });

    it('should throw error on non-404 fetch failure', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(loader.loadScenario('test')).rejects.toThrow('Failed to load scenario');
    });

    it('should throw error on invalid scenario config', async () => {
      const invalidConfig = {
        id: 'test',
        // Missing required fields
      };

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => invalidConfig,
      });

      await expect(loader.loadScenario('test')).rejects.toThrow('Invalid scenario configuration');
    });

    it('should return frozen config object', async () => {
      const mockScenario = { ...DEFAULT_SCENARIO };

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockScenario,
      });

      const config = await loader.loadScenario('baseline');

      expect(Object.isFrozen(config)).toBe(true);
    });
  });

  describe('validateConfig', () => {
    it('should validate correct config', () => {
      const result = loader.validateConfig(DEFAULT_SCENARIO);

      expect(result.success).toBe(true);
      expect(result.config).toBeDefined();
      expect(result.errors).toBeUndefined();
    });

    it('should return errors for invalid config', () => {
      const invalidConfig = {
        id: 'test',
        name: 'Test',
        description: 'Test',
        difficulty: 10, // Invalid: out of range
      };

      const result = loader.validateConfig(invalidConfig);

      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors!.length).toBeGreaterThan(0);
    });

    it('should provide detailed field-level errors', () => {
      const invalidConfig = {
        ...DEFAULT_SCENARIO,
        round: {
          durationSeconds: 5, // Invalid: too short
          paycheckInterval: 2,
        },
      };

      const result = loader.validateConfig(invalidConfig);

      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors!.some((e) => e.field.includes('durationSeconds'))).toBe(true);
    });

    it('should handle missing required fields', () => {
      const incompleteConfig = {
        id: 'test',
        // Missing name, description, difficulty, and all other required sections
      };

      const result = loader.validateConfig(incompleteConfig);

      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors!.length).toBeGreaterThan(0);
    });
  });

  describe('getActiveConfig', () => {
    it('should throw error when no config loaded', () => {
      expect(() => loader.getActiveConfig()).toThrow('No scenario loaded');
    });

    it('should return active config after loading', async () => {
      const mockScenario = { ...DEFAULT_SCENARIO };

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockScenario,
      });

      await loader.loadScenario('baseline');
      const config = loader.getActiveConfig();

      expect(config).toBeDefined();
      expect(config.id).toBe('baseline');
    });

    it('should return readonly config', async () => {
      const mockScenario = { ...DEFAULT_SCENARIO };

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockScenario,
      });

      await loader.loadScenario('baseline');
      const config = loader.getActiveConfig();

      expect(Object.isFrozen(config)).toBe(true);
    });
  });

  describe('loadDefault', () => {
    it('should load default scenario', () => {
      const config = loader.loadDefault();

      expect(config).toEqual(DEFAULT_SCENARIO);
      expect(config.id).toBe('baseline');
    });

    it('should make default config active', () => {
      loader.loadDefault();
      const active = loader.getActiveConfig();

      expect(active).toEqual(DEFAULT_SCENARIO);
    });

    it('should return frozen config', () => {
      const config = loader.loadDefault();

      expect(Object.isFrozen(config)).toBe(true);
    });
  });

  describe('listScenarios', () => {
    it('should return list of available scenarios', async () => {
      const scenarios = await loader.listScenarios();

      expect(Array.isArray(scenarios)).toBe(true);
      expect(scenarios.length).toBeGreaterThan(0);
    });

    it('should include baseline scenario', async () => {
      const scenarios = await loader.listScenarios();

      const baseline = scenarios.find((s) => s.id === 'baseline');
      expect(baseline).toBeDefined();
      expect(baseline?.name).toBe('Baseline');
    });

    it('should return scenario metadata', async () => {
      const scenarios = await loader.listScenarios();

      for (const scenario of scenarios) {
        expect(scenario).toHaveProperty('id');
        expect(scenario).toHaveProperty('name');
        expect(scenario).toHaveProperty('description');
        expect(scenario).toHaveProperty('difficulty');
      }
    });
  });

  describe('reloadConfig', () => {
    it('should throw error when no config loaded', async () => {
      await expect(loader.reloadConfig()).rejects.toThrow('No scenario loaded to reload');
    });

    it('should reload current scenario', async () => {
      const mockScenario = { ...DEFAULT_SCENARIO };

      // First load
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockScenario,
      });

      await loader.loadScenario('baseline');

      // Reload
      const updatedScenario = {
        ...DEFAULT_SCENARIO,
        description: 'Updated description',
      };

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => updatedScenario,
      });

      const reloaded = await loader.reloadConfig();

      expect(reloaded.description).toBe('Updated description');
    });
  });

  describe('hot reload', () => {
    it('should enable hot reload without errors', () => {
      loader.loadDefault();

      expect(() => loader.enableHotReload(1000)).not.toThrow();
    });

    it('should disable hot reload without errors', () => {
      loader.loadDefault();
      loader.enableHotReload(1000);

      expect(() => loader.disableHotReload()).not.toThrow();
    });

    it('should warn when enabling hot reload twice', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      loader.loadDefault();
      loader.enableHotReload(1000);
      loader.enableHotReload(1000);

      expect(consoleSpy).toHaveBeenCalledWith('Hot reload already enabled');

      consoleSpy.mockRestore();
      loader.disableHotReload();
    });
  });
});

describe('ConfigLoader Integration', () => {
  it('should handle complete workflow: load -> validate -> get', async () => {
    const loader = new ConfigLoader();
    const mockScenario = { ...DEFAULT_SCENARIO };

    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => mockScenario,
    });

    // Load scenario
    const loaded = await loader.loadScenario('baseline');
    expect(loaded.id).toBe('baseline');

    // Get active config
    const active = loader.getActiveConfig();
    expect(active.id).toBe('baseline');

    // Validate it matches
    expect(active).toEqual(loaded);
  });

  it('should merge partial config with defaults via schema', () => {
    const loader = new ConfigLoader();
    const partialConfig = {
      id: 'partial',
      name: 'Partial',
      description: 'Partial config',
      difficulty: 1,
      round: {}, // Empty round config should get defaults
      blue: DEFAULT_SCENARIO.blue,
      red: DEFAULT_SCENARIO.red,
      stress: DEFAULT_SCENARIO.stress,
      rapport: DEFAULT_SCENARIO.rapport,
      employmentEvent: DEFAULT_SCENARIO.employmentEvent,
      ui: DEFAULT_SCENARIO.ui,
      financial: DEFAULT_SCENARIO.financial,
      tutorial: DEFAULT_SCENARIO.tutorial,
    };

    const result = loader.validateConfig(partialConfig);

    expect(result.success).toBe(true);
    expect(result.config!.round.durationSeconds).toBe(120); // Default value
    expect(result.config!.round.paycheckInterval).toBe(2); // Default value
  });
});
