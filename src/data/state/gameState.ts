/**
 * Game State
 *
 * Central game state structure.
 * Observable and immutable (modified through EntityStore).
 *
 * Based on Architecture Document Section 6.2 (Game State Structure)
 */

import { BlueBall, RedBall, Task, Round, FinancialState } from '../entities';
import { GamePhase } from '../events/eventTypes';

/**
 * Tutorial state tracking
 */
export interface TutorialState {
  hasSeenFirstTask: boolean;
  hasSeenFirstHelpRequest: boolean;
  hasSeenFirstDebuff: boolean;
  tutorialEnabled: boolean;
}

/**
 * Modal types that can be displayed
 */
export type ModalType = 'empathy' | 'tutorial' | 'summary' | 'employment_event';

/**
 * Complete game state
 * All mutations should go through EntityStore to maintain observability
 */
export interface GameState {
  // Core State
  currentRound: Round;
  playerRole: 'blue' | 'red';
  gamePhase: GamePhase;

  // Entities
  blueBall: BlueBall;
  redBall: RedBall;
  blueTasks: Map<string, Task>;
  redTasks: Map<string, Task>;

  // Systems State
  financialState: FinancialState;
  employmentEventTriggered: boolean;
  roundsSinceHighRedStress: number; // For Blue debuff calculation

  // UI State
  activeModal: ModalType | null;
  tutorialState: TutorialState;
}
