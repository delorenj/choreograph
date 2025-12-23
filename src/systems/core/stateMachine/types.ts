/**
 * State Machine Types
 *
 * Defines game states and events for the finite state machine.
 * Based on Architecture Document Section 5.3 (State Machine)
 */

import { GamePhase } from '../../../data/events/eventTypes';

/**
 * Re-export GamePhase as GameState for clarity in state machine context
 */
export type GameState = GamePhase;

/**
 * Game events that trigger state transitions
 */
export enum GameEvent {
  // Initialization
  INIT_COMPLETE = 'INIT_COMPLETE',
  SCENARIO_SELECTED = 'SCENARIO_SELECTED',
  ROLE_SELECTED = 'ROLE_SELECTED',

  // Gameplay flow
  ROUND_START = 'ROUND_START',
  PAUSE_REQUESTED = 'PAUSE_REQUESTED',
  RESUME_REQUESTED = 'RESUME_REQUESTED',

  // Empathy modal
  SHOW_EMPATHY = 'SHOW_EMPATHY',
  EMPATHY_DISMISSED = 'EMPATHY_DISMISSED',

  // Round end
  ROUND_END = 'ROUND_END',
  SUMMARY_DISMISSED = 'SUMMARY_DISMISSED',

  // Game over
  FIRED = 'FIRED',
  RESTART_REQUESTED = 'RESTART_REQUESTED',
}

/**
 * Valid state transition map
 * Key: Current state, Value: Array of valid next states
 */
export type StateTransitionTable = {
  [key in GameState]: GameState[];
};
