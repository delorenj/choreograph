/**
 * Event Type Definitions
 *
 * All game events and their payload types.
 * Used for type-safe event bus communication.
 *
 * Based on Architecture Document Section 8.1 (Event Contracts)
 */

// =============================================================================
// EVENT TYPES
// =============================================================================

/**
 * Union type of all possible game events
 * 13 core events covering rounds, tasks, stress, rapport, empathy, employment, and game state
 */
export type GameEventType =
  // Round Events (4)
  | 'round:start'
  | 'round:end'
  | 'round:tick'
  | 'round:paycheck'
  // Task Events (4)
  | 'task:spawned'
  | 'task:progress'
  | 'task:complete'
  | 'task:regressing'
  // Stress Events (1)
  | 'stress:changed'
  // Rapport Events (1)
  | 'rapport:changed'
  // Empathy Events (2)
  | 'empathy:shown'
  | 'empathy:dismissed'
  // Employment Events (1)
  | 'employment:event'
  // Game Events (2)
  | 'game:fired'
  | 'game:stateChanged';

// =============================================================================
// SUPPORTING TYPES
// =============================================================================

// Import entity types from central entity definitions
import type {
  RoundSummary,
  BlueTask,
  RedTask,
  EmpathyAction,
} from '../entities';

/**
 * Game state phases
 */
export type GamePhase =
  | 'LOADING'
  | 'SCENARIO_SELECT'
  | 'ROLE_SELECT'
  | 'PLAYING'
  | 'PAUSED'
  | 'EMPATHY_MODAL'
  | 'ROUND_SUMMARY'
  | 'GAME_OVER';

// =============================================================================
// EVENT PAYLOADS
// =============================================================================

/**
 * Mapped type defining payload for each event type
 * TypeScript will infer correct payload type based on event type
 */
export interface GameEventPayload {
  // Round Events
  'round:start': {
    roundNumber: number;
    isPaycheckRound: boolean;
  };
  'round:end': {
    roundNumber: number;
    summary: RoundSummary;
  };
  'round:tick': {
    remainingTime: number;
    elapsedTime: number;
  };
  'round:paycheck': {
    amount: number;
    balance: number;
  };

  // Task Events
  'task:spawned': {
    task: BlueTask | RedTask;
  };
  'task:progress': {
    taskId: string;
    progress: number; // 0-1
  };
  'task:complete': {
    taskId: string;
    completedBy: 'blue' | 'red';
  };
  'task:regressing': {
    taskId: string;
    regressionRate: number; // context switch penalty (0.3 = 30% regrowth)
  };

  // Stress Events
  'stress:changed': {
    ball: 'blue' | 'red';
    previousLevel: number; // 0-200 (can overflow)
    newLevel: number;
    source:
      | 'INCOMPLETE_TASK'
      | 'HELPED_RED'
      | 'RAPPORT_DECAY'
      | 'SUSTAINED_RED_STRESS';
  };

  // Rapport Events
  'rapport:changed': {
    previousLevel: number; // 0-100
    newLevel: number;
    emoji: 'cry' | 'frown' | 'neutral' | 'smile' | 'happy';
    reason: 'SUCCESS' | 'MISSED_DEADLINE' | 'COMPOUND_PENALTY';
  };

  // Empathy Events
  'empathy:shown': {
    targetBall: 'blue' | 'red';
    availableActions: EmpathyAction[];
  };
  'empathy:dismissed': {
    selectedAction: EmpathyAction | null;
    stressReduction: number;
  };

  // Employment Events
  'employment:event': {
    roundNumber: number;
    redIncome: number; // $400/round
    blueWorkTimeReduction: number; // 0.45 = 45%
  };

  // Game Events
  'game:fired': {
    rapportLevel: number;
    roundNumber: number;
    firingThreshold: number; // randomized 15-25
  };
  'game:stateChanged': {
    previousState: GamePhase;
    newState: GamePhase;
  };
}
