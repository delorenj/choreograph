/**
 * Configuration Type Definitions
 *
 * These types define the structure of game configuration.
 */

export interface ScenarioMetadata {
  id: string;
  name: string;
  description: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
}
