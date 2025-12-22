/**
 * Entity Type Definitions
 *
 * Core entity types for the game (balls, tasks, rounds, etc.)
 * Based on Architecture Document Section 6.1 (Data Entities)
 */

// =============================================================================
// COMMON TYPES
// =============================================================================

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

// =============================================================================
// BALL ENTITIES
// =============================================================================

/**
 * Base Ball interface with common properties
 */
export interface BaseBall {
  id: 'blue' | 'red';
  position: Vector3;
  velocity: Vector3;
  stress: number; // 0-200 (can overflow)
  isPlayerControlled: boolean;
}

/**
 * Blue Ball - Employed ball with invisible work
 */
export interface BlueBall extends BaseBall {
  id: 'blue';
  rapport: number; // 0-100 (employment gauge)
  activeTaskId: string | null; // Currently working on
  completedTasksThisRound: number;
  totalTasksThisRound: number;
}

/**
 * Red Ball - Household manager with visible tasks
 */
export interface RedBall extends BaseBall {
  id: 'red';
  activeTaskId: string | null;
  completedTasksThisRound: number;
  totalTasksThisRound: number;
  canRequestHelp: boolean;
  isEmployed: boolean; // After employment event
}

// =============================================================================
// TASK ENTITIES
// =============================================================================

/**
 * Base Task interface
 */
export interface BaseTask {
  id: string;
  position: Vector3;
  completionProgress: number; // 0-1
  completionTime: number; // seconds to complete
  isComplete: boolean;
  createdAt: number; // timestamp
}

/**
 * Blue Task - Invisible work chunks
 */
export interface BlueTask extends BaseTask {
  type: 'blue';
  parentId: string | null; // Chunk ID if this is a subtask
  isSubtask: boolean;
  subtaskIds: string[]; // If this is a parent chunk
  scopeCreepApplied: boolean;
  regressionRate: number; // Context switch penalty (0.3 = 30% regrowth)
}

/**
 * Red Task - Visible household tasks
 */
export interface RedTask extends BaseTask {
  type: 'red';
  category: 'cleaning' | 'cooking' | 'childcare' | 'errands';
  canBeRefused: boolean;
}

// =============================================================================
// ROUND ENTITIES
// =============================================================================

export type RoundPhase = 'IDLE' | 'PLAYING' | 'PAUSED' | 'SUMMARY';

export interface Round {
  number: number; // 1-indexed
  phase: RoundPhase;
  elapsedTime: number; // seconds
  remainingTime: number; // seconds
  isPaycheckRound: boolean; // even-numbered rounds
  startedAt: number | null; // timestamp
  endedAt: number | null; // timestamp
}

export interface RoundSummary {
  roundNumber: number;
  blueTasksCompleted: number;
  blueTasksTotal: number;
  redTasksCompleted: number;
  redTasksTotal: number;
  blueStressChange: number;
  redStressChange: number;
  rapportChange: number;
  incomeReceived: number;
  runningBalance: number;
}

// =============================================================================
// FINANCIAL ENTITIES
// =============================================================================

export interface FinancialState {
  balance: number;
  totalEarned: number;
  bluePaycheck: number; // $6,250 every 2 rounds
  redIncome: number; // $400/round after employment event
  expenses: number; // Hidden, causes deficit
}

// =============================================================================
// EMPATHY ENTITIES
// =============================================================================

export interface EmpathyAction {
  id: string;
  category: 'physical' | 'verbal' | 'service';
  name: string;
  description: string;
  animationUrl: string;
  stressReduction: number; // 25-40%
}

// =============================================================================
// HELPER TYPES
// =============================================================================

/**
 * Union type of all task types
 */
export type Task = BlueTask | RedTask;

/**
 * Union type of all ball types
 */
export type Ball = BlueBall | RedBall;
