/**
 * Game State Machine
 *
 * Manages game state transitions with explicit transition rules.
 * Emits events to EventBus on state changes.
 *
 * Based on Architecture Document Section 5.3 (State Machine)
 * Story: 001-01 (Game State Machine)
 */

import { EventBus } from '../../../data/events/eventBus';
import { GameState, GameEvent, StateTransitionTable } from './types';

/**
 * State machine error for invalid transitions
 */
export class InvalidTransitionError extends Error {
  constructor(
    public readonly currentState: GameState,
    public readonly event: GameEvent,
    public readonly attemptedState: GameState
  ) {
    super(
      `Invalid transition: Cannot go from ${currentState} to ${attemptedState} via event ${event}`
    );
    this.name = 'InvalidTransitionError';
  }
}

/**
 * GameStateMachine
 *
 * Finite state machine for game flow control.
 * Enforces valid transitions and emits state change events.
 */
export class GameStateMachine {
  private currentState: GameState;
  private readonly eventBus: EventBus;
  private readonly transitionTable: StateTransitionTable;

  constructor(eventBus: EventBus, initialState: GameState = 'LOADING') {
    this.eventBus = eventBus;
    this.currentState = initialState;
    this.transitionTable = this.buildTransitionTable();
  }

  /**
   * Build the state transition table
   * Defines all valid transitions between states
   */
  private buildTransitionTable(): StateTransitionTable {
    return {
      LOADING: ['SCENARIO_SELECT'],
      SCENARIO_SELECT: ['ROLE_SELECT'],
      ROLE_SELECT: ['PLAYING'],
      PLAYING: ['PAUSED', 'EMPATHY_MODAL', 'ROUND_SUMMARY', 'GAME_OVER'],
      PAUSED: ['PLAYING'],
      EMPATHY_MODAL: ['PLAYING'],
      ROUND_SUMMARY: ['PLAYING', 'GAME_OVER'],
      GAME_OVER: ['LOADING'], // Restart
    };
  }

  /**
   * Get current game state
   */
  public getState(): GameState {
    return this.currentState;
  }

  /**
   * Transition to a new state
   *
   * @param event - The event triggering the transition
   * @param newState - The target state
   * @throws InvalidTransitionError if transition is not valid
   */
  public transition(event: GameEvent, newState: GameState): void {
    const validStates = this.transitionTable[this.currentState];

    // Check if transition is valid
    if (!validStates.includes(newState)) {
      throw new InvalidTransitionError(this.currentState, event, newState);
    }

    const previousState = this.currentState;
    this.currentState = newState;

    // Emit state change event to EventBus
    this.eventBus.emit('game:stateChanged', {
      previousState,
      newState,
    });
  }

  /**
   * Check if a transition is valid without executing it
   *
   * @param newState - The target state to check
   * @returns true if transition is valid
   */
  public canTransitionTo(newState: GameState): boolean {
    const validStates = this.transitionTable[this.currentState];
    return validStates.includes(newState);
  }

  /**
   * Get all valid states from current state
   *
   * @returns Array of valid next states
   */
  public getValidTransitions(): GameState[] {
    return [...this.transitionTable[this.currentState]];
  }

  /**
   * Convenience methods for common transitions
   */

  public startGame(): void {
    this.transition(GameEvent.INIT_COMPLETE, 'SCENARIO_SELECT');
  }

  public selectScenario(): void {
    this.transition(GameEvent.SCENARIO_SELECTED, 'ROLE_SELECT');
  }

  public selectRole(): void {
    this.transition(GameEvent.ROLE_SELECTED, 'PLAYING');
  }

  public startRound(): void {
    if (this.currentState === 'ROUND_SUMMARY') {
      this.transition(GameEvent.ROUND_START, 'PLAYING');
    }
  }

  public pause(): void {
    this.transition(GameEvent.PAUSE_REQUESTED, 'PAUSED');
  }

  public resume(): void {
    this.transition(GameEvent.RESUME_REQUESTED, 'PLAYING');
  }

  public showEmpathyModal(): void {
    this.transition(GameEvent.SHOW_EMPATHY, 'EMPATHY_MODAL');
  }

  public dismissEmpathyModal(): void {
    this.transition(GameEvent.EMPATHY_DISMISSED, 'PLAYING');
  }

  public endRound(): void {
    this.transition(GameEvent.ROUND_END, 'ROUND_SUMMARY');
  }

  public dismissSummary(): void {
    this.transition(GameEvent.SUMMARY_DISMISSED, 'PLAYING');
  }

  public triggerGameOver(): void {
    if (this.currentState === 'PLAYING') {
      this.transition(GameEvent.FIRED, 'GAME_OVER');
    } else if (this.currentState === 'ROUND_SUMMARY') {
      this.transition(GameEvent.FIRED, 'GAME_OVER');
    }
  }

  public restart(): void {
    this.transition(GameEvent.RESTART_REQUESTED, 'LOADING');
  }
}
