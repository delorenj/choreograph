/**
 * Configuration Loader
 *
 * Handles loading and validating scenario configurations from JSON files.
 * Provides hot reload support in development mode.
 *
 * Based on Architecture Document Section 5.2.3 (ConfigLoader)
 */

import { ScenarioConfig, ScenarioConfigSchema } from './schema';
import { DEFAULT_SCENARIO } from './defaults';
import type { ScenarioMetadata } from './types';
import { ZodError } from 'zod';

export interface ConfigValidationError {
  field: string;
  message: string;
  value?: unknown;
}

export interface ValidationResult {
  success: boolean;
  errors?: ConfigValidationError[];
  config?: ScenarioConfig;
}

export class ConfigLoader {
  private activeConfig: ScenarioConfig | null = null;
  private hotReloadInterval: number | null = null;
  private lastLoadTime: number = 0;

  /**
   * Load a scenario configuration by ID
   * Validates against Zod schema and provides helpful error messages
   */
  async loadScenario(scenarioId: string): Promise<ScenarioConfig> {
    try {
      const response = await fetch(`/scenarios/${scenarioId}.json`);

      if (!response.ok) {
        if (response.status === 404) {
          console.warn(`Scenario '${scenarioId}' not found. Using default scenario.`);
          this.activeConfig = DEFAULT_SCENARIO;
          return Object.freeze({ ...DEFAULT_SCENARIO });
        }

        throw new Error(`Failed to load scenario: ${scenarioId} (HTTP ${response.status})`);
      }

      const rawConfig = await response.json();
      const validatedConfig = this.validateConfig(rawConfig);

      if (!validatedConfig.success) {
        throw new Error(
          `Invalid scenario configuration:\n${this.formatValidationErrors(validatedConfig.errors!)}`
        );
      }

      this.activeConfig = validatedConfig.config!;
      this.lastLoadTime = Date.now();

      return Object.freeze({ ...validatedConfig.config! });
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Unknown error loading scenario: ${scenarioId}`);
    }
  }

  /**
   * Validate a config object against the schema
   * Returns detailed validation errors
   */
  validateConfig(config: unknown): ValidationResult {
    try {
      const validatedConfig = ScenarioConfigSchema.parse(config);
      return {
        success: true,
        config: validatedConfig,
      };
    } catch (error) {
      if (error instanceof ZodError) {
        const errors: ConfigValidationError[] = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
          value: err.code === 'invalid_type' ? undefined : err,
        }));

        return {
          success: false,
          errors,
        };
      }

      return {
        success: false,
        errors: [
          {
            field: 'unknown',
            message: 'Unknown validation error',
          },
        ],
      };
    }
  }

  /**
   * Format validation errors into readable message
   */
  private formatValidationErrors(errors: ConfigValidationError[]): string {
    return errors.map((err) => `  - ${err.field}: ${err.message}`).join('\n');
  }

  /**
   * Get list of available scenarios
   * Note: In production, this should query a manifest file
   */
  async listScenarios(): Promise<ScenarioMetadata[]> {
    // For now, return built-in scenarios
    // In the future, this could fetch from /scenarios/manifest.json
    const builtInScenarios: ScenarioMetadata[] = [
      {
        id: 'baseline',
        name: 'Baseline',
        description: 'Standard household dynamic with one employed partner',
        difficulty: 2,
      },
    ];

    return builtInScenarios;
  }

  /**
   * Get currently active configuration
   */
  getActiveConfig(): Readonly<ScenarioConfig> {
    if (this.activeConfig === null) {
      throw new Error('No scenario loaded. Call loadScenario() first.');
    }
    return Object.freeze({ ...this.activeConfig });
  }

  /**
   * Hot reload current config (dev mode only)
   * Reloads the current scenario from disk
   */
  async reloadConfig(): Promise<ScenarioConfig> {
    if (this.activeConfig === null) {
      throw new Error('No scenario loaded to reload.');
    }
    return this.loadScenario(this.activeConfig.id);
  }

  /**
   * Enable hot reload polling (dev mode only)
   * Polls the config file and reloads on changes
   * @param intervalMs - Polling interval in milliseconds (default: 2000ms)
   */
  enableHotReload(intervalMs: number = 2000): void {
    if (this.hotReloadInterval !== null) {
      console.warn('Hot reload already enabled');
      return;
    }

    console.log(`Hot reload enabled (polling every ${intervalMs}ms)`);

    // Use globalThis to support both browser and Node environments
    const setInterval =
      typeof globalThis.setInterval !== 'undefined' ? globalThis.setInterval : null;

    if (setInterval === null) {
      console.warn('setInterval not available, hot reload disabled');
      return;
    }

    this.hotReloadInterval = setInterval(async () => {
      if (this.activeConfig === null) {
        return;
      }

      try {
        // Simple polling: fetch config and check if it's different
        const response = await fetch(`/scenarios/${this.activeConfig.id}.json`, {
          cache: 'no-store', // Bypass cache
        });

        if (!response.ok) {
          return;
        }

        const lastModified = response.headers.get('Last-Modified');
        if (lastModified) {
          const modifiedTime = new Date(lastModified).getTime();
          if (modifiedTime > this.lastLoadTime) {
            console.log('Config file changed, reloading...');
            await this.reloadConfig();
            console.log('Config reloaded successfully');
          }
        }
      } catch (error) {
        console.warn('Hot reload check failed:', error);
      }
    }, intervalMs) as unknown as number;
  }

  /**
   * Disable hot reload polling
   */
  disableHotReload(): void {
    if (this.hotReloadInterval !== null) {
      const clearInterval =
        typeof globalThis.clearInterval !== 'undefined' ? globalThis.clearInterval : null;

      if (clearInterval !== null) {
        clearInterval(this.hotReloadInterval);
      }

      this.hotReloadInterval = null;
      console.log('Hot reload disabled');
    }
  }

  /**
   * Load default scenario
   */
  loadDefault(): ScenarioConfig {
    this.activeConfig = DEFAULT_SCENARIO;
    this.lastLoadTime = Date.now();
    return Object.freeze({ ...DEFAULT_SCENARIO });
  }
}
