/**
 * CONFIG LAYER
 *
 * Responsible for loading, validating, and providing access to game configuration.
 * This layer has no dependencies on other layers.
 *
 * Dependencies: None (bottom layer)
 */

// Types
export type { ScenarioMetadata } from './types';
export type {
  ScenarioConfig,
  RoundConfig,
  BlueBallConfig,
  RedBallConfig,
  RedTaskType,
  StressConfig,
  RapportConfig,
  EmploymentEventConfig,
  UIConfig,
} from './schema';

// Schemas
export {
  ScenarioConfigSchema,
  RoundConfigSchema,
  BlueBallConfigSchema,
  RedBallConfigSchema,
  RedTaskTypeSchema,
  StressConfigSchema,
  RapportConfigSchema,
  EmploymentEventConfigSchema,
  UIConfigSchema,
} from './schema';

// Loader and Validation
export { ConfigLoader } from './loader';
export type { ConfigValidationError, ValidationResult } from './loader';

// Defaults
export {
  DEFAULT_SCENARIO,
  DEFAULT_ROUND_CONFIG,
  DEFAULT_BLUE_CONFIG,
  DEFAULT_RED_CONFIG,
  DEFAULT_RED_TASK_TYPES,
  DEFAULT_STRESS_CONFIG,
  DEFAULT_RAPPORT_CONFIG,
  DEFAULT_EMPLOYMENT_EVENT_CONFIG,
  DEFAULT_UI_CONFIG,
} from './defaults';
