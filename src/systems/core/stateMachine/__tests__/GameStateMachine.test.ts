/**
 * GameStateMachine Unit Tests
 *
 * Tests for state machine transitions, validation, and error handling.
 * Story: 001-01 (Game State Machine)
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GameStateMachine, InvalidTransitionError } from '../GameStateMachine';
import { GameEvent } from '../types';
import { EventBus } from '../../../../data/events/eventBus';

describe('GameStateMachine', () => {
  let stateMachine: GameStateMachine;
  let eventBus: EventBus;
  let emitSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    eventBus = new EventBus();
    emitSpy = vi.spyOn(eventBus, 'emit');
    stateMachine = new GameStateMachine(eventBus);
  });

  describe('Initialization', () => {
    it('should start in LOADING state by default', () => {
      expect(stateMachine.getState()).toBe('LOADING');
    });

    it('should accept custom initial state', () => {
      const customMachine = new GameStateMachine(eventBus, 'PLAYING');
      expect(customMachine.getState()).toBe('PLAYING');
    });
  });

  describe('Valid Transitions', () => {
    it('should transition from LOADING to SCENARIO_SELECT', () => {
      stateMachine.transition(GameEvent.INIT_COMPLETE, 'SCENARIO_SELECT');
      expect(stateMachine.getState()).toBe('SCENARIO_SELECT');
    });

    it('should transition from SCENARIO_SELECT to ROLE_SELECT', () => {
      stateMachine.transition(GameEvent.INIT_COMPLETE, 'SCENARIO_SELECT');
      stateMachine.transition(GameEvent.SCENARIO_SELECTED, 'ROLE_SELECT');
      expect(stateMachine.getState()).toBe('ROLE_SELECT');
    });

    it('should transition from ROLE_SELECT to PLAYING', () => {
      stateMachine.transition(GameEvent.INIT_COMPLETE, 'SCENARIO_SELECT');
      stateMachine.transition(GameEvent.SCENARIO_SELECTED, 'ROLE_SELECT');
      stateMachine.transition(GameEvent.ROLE_SELECTED, 'PLAYING');
      expect(stateMachine.getState()).toBe('PLAYING');
    });

    it('should transition from PLAYING to PAUSED', () => {
      stateMachine = new GameStateMachine(eventBus, 'PLAYING');
      stateMachine.transition(GameEvent.PAUSE_REQUESTED, 'PAUSED');
      expect(stateMachine.getState()).toBe('PAUSED');
    });

    it('should transition from PAUSED back to PLAYING', () => {
      stateMachine = new GameStateMachine(eventBus, 'PAUSED');
      stateMachine.transition(GameEvent.RESUME_REQUESTED, 'PLAYING');
      expect(stateMachine.getState()).toBe('PLAYING');
    });

    it('should transition from PLAYING to EMPATHY_MODAL', () => {
      stateMachine = new GameStateMachine(eventBus, 'PLAYING');
      stateMachine.transition(GameEvent.SHOW_EMPATHY, 'EMPATHY_MODAL');
      expect(stateMachine.getState()).toBe('EMPATHY_MODAL');
    });

    it('should transition from EMPATHY_MODAL back to PLAYING', () => {
      stateMachine = new GameStateMachine(eventBus, 'EMPATHY_MODAL');
      stateMachine.transition(GameEvent.EMPATHY_DISMISSED, 'PLAYING');
      expect(stateMachine.getState()).toBe('PLAYING');
    });

    it('should transition from PLAYING to ROUND_SUMMARY', () => {
      stateMachine = new GameStateMachine(eventBus, 'PLAYING');
      stateMachine.transition(GameEvent.ROUND_END, 'ROUND_SUMMARY');
      expect(stateMachine.getState()).toBe('ROUND_SUMMARY');
    });

    it('should transition from ROUND_SUMMARY back to PLAYING', () => {
      stateMachine = new GameStateMachine(eventBus, 'ROUND_SUMMARY');
      stateMachine.transition(GameEvent.SUMMARY_DISMISSED, 'PLAYING');
      expect(stateMachine.getState()).toBe('PLAYING');
    });

    it('should transition from PLAYING to GAME_OVER', () => {
      stateMachine = new GameStateMachine(eventBus, 'PLAYING');
      stateMachine.transition(GameEvent.FIRED, 'GAME_OVER');
      expect(stateMachine.getState()).toBe('GAME_OVER');
    });

    it('should transition from ROUND_SUMMARY to GAME_OVER', () => {
      stateMachine = new GameStateMachine(eventBus, 'ROUND_SUMMARY');
      stateMachine.transition(GameEvent.FIRED, 'GAME_OVER');
      expect(stateMachine.getState()).toBe('GAME_OVER');
    });

    it('should transition from GAME_OVER to LOADING (restart)', () => {
      stateMachine = new GameStateMachine(eventBus, 'GAME_OVER');
      stateMachine.transition(GameEvent.RESTART_REQUESTED, 'LOADING');
      expect(stateMachine.getState()).toBe('LOADING');
    });
  });

  describe('Invalid Transitions', () => {
    it('should throw error for invalid transition from LOADING to PLAYING', () => {
      expect(() => {
        stateMachine.transition(GameEvent.ROLE_SELECTED, 'PLAYING');
      }).toThrow(InvalidTransitionError);
    });

    it('should throw error for invalid transition from PLAYING to LOADING', () => {
      stateMachine = new GameStateMachine(eventBus, 'PLAYING');
      expect(() => {
        stateMachine.transition(GameEvent.RESTART_REQUESTED, 'LOADING');
      }).toThrow(InvalidTransitionError);
    });

    it('should throw error for invalid transition from PAUSED to GAME_OVER', () => {
      stateMachine = new GameStateMachine(eventBus, 'PAUSED');
      expect(() => {
        stateMachine.transition(GameEvent.FIRED, 'GAME_OVER');
      }).toThrow(InvalidTransitionError);
    });

    it('should include current state, event, and attempted state in error', () => {
      try {
        stateMachine.transition(GameEvent.FIRED, 'GAME_OVER');
        expect.fail('Should have thrown InvalidTransitionError');
      } catch (error) {
        expect(error).toBeInstanceOf(InvalidTransitionError);
        const err = error as InvalidTransitionError;
        expect(err.currentState).toBe('LOADING');
        expect(err.event).toBe(GameEvent.FIRED);
        expect(err.attemptedState).toBe('GAME_OVER');
      }
    });
  });

  describe('Event Emission', () => {
    it('should emit game:stateChanged event on valid transition', () => {
      stateMachine.transition(GameEvent.INIT_COMPLETE, 'SCENARIO_SELECT');

      expect(emitSpy).toHaveBeenCalledWith('game:stateChanged', {
        previousState: 'LOADING',
        newState: 'SCENARIO_SELECT',
      });
    });

    it('should not emit event on invalid transition', () => {
      try {
        stateMachine.transition(GameEvent.FIRED, 'GAME_OVER');
      } catch {
        // Expected to throw
      }

      expect(emitSpy).not.toHaveBeenCalled();
    });

    it('should emit event for each transition in sequence', () => {
      stateMachine.transition(GameEvent.INIT_COMPLETE, 'SCENARIO_SELECT');
      stateMachine.transition(GameEvent.SCENARIO_SELECTED, 'ROLE_SELECT');
      stateMachine.transition(GameEvent.ROLE_SELECTED, 'PLAYING');

      expect(emitSpy).toHaveBeenCalledTimes(3);
    });
  });

  describe('Validation Methods', () => {
    it('canTransitionTo should return true for valid transitions', () => {
      expect(stateMachine.canTransitionTo('SCENARIO_SELECT')).toBe(true);
    });

    it('canTransitionTo should return false for invalid transitions', () => {
      expect(stateMachine.canTransitionTo('PLAYING')).toBe(false);
    });

    it('getValidTransitions should return all valid next states', () => {
      const validStates = stateMachine.getValidTransitions();
      expect(validStates).toEqual(['SCENARIO_SELECT']);
    });

    it('getValidTransitions should return correct states for PLAYING', () => {
      stateMachine = new GameStateMachine(eventBus, 'PLAYING');
      const validStates = stateMachine.getValidTransitions();
      expect(validStates).toContain('PAUSED');
      expect(validStates).toContain('EMPATHY_MODAL');
      expect(validStates).toContain('ROUND_SUMMARY');
      expect(validStates).toContain('GAME_OVER');
      expect(validStates).toHaveLength(4);
    });
  });

  describe('Convenience Methods', () => {
    it('startGame should transition to SCENARIO_SELECT', () => {
      stateMachine.startGame();
      expect(stateMachine.getState()).toBe('SCENARIO_SELECT');
    });

    it('selectScenario should transition to ROLE_SELECT', () => {
      stateMachine.startGame();
      stateMachine.selectScenario();
      expect(stateMachine.getState()).toBe('ROLE_SELECT');
    });

    it('selectRole should transition to PLAYING', () => {
      stateMachine.startGame();
      stateMachine.selectScenario();
      stateMachine.selectRole();
      expect(stateMachine.getState()).toBe('PLAYING');
    });

    it('pause should transition to PAUSED', () => {
      stateMachine = new GameStateMachine(eventBus, 'PLAYING');
      stateMachine.pause();
      expect(stateMachine.getState()).toBe('PAUSED');
    });

    it('resume should transition back to PLAYING', () => {
      stateMachine = new GameStateMachine(eventBus, 'PAUSED');
      stateMachine.resume();
      expect(stateMachine.getState()).toBe('PLAYING');
    });

    it('showEmpathyModal should transition to EMPATHY_MODAL', () => {
      stateMachine = new GameStateMachine(eventBus, 'PLAYING');
      stateMachine.showEmpathyModal();
      expect(stateMachine.getState()).toBe('EMPATHY_MODAL');
    });

    it('dismissEmpathyModal should transition back to PLAYING', () => {
      stateMachine = new GameStateMachine(eventBus, 'EMPATHY_MODAL');
      stateMachine.dismissEmpathyModal();
      expect(stateMachine.getState()).toBe('PLAYING');
    });

    it('endRound should transition to ROUND_SUMMARY', () => {
      stateMachine = new GameStateMachine(eventBus, 'PLAYING');
      stateMachine.endRound();
      expect(stateMachine.getState()).toBe('ROUND_SUMMARY');
    });

    it('dismissSummary should transition back to PLAYING', () => {
      stateMachine = new GameStateMachine(eventBus, 'ROUND_SUMMARY');
      stateMachine.dismissSummary();
      expect(stateMachine.getState()).toBe('PLAYING');
    });

    it('startRound should work from ROUND_SUMMARY', () => {
      stateMachine = new GameStateMachine(eventBus, 'ROUND_SUMMARY');
      stateMachine.startRound();
      expect(stateMachine.getState()).toBe('PLAYING');
    });

    it('triggerGameOver should work from PLAYING', () => {
      stateMachine = new GameStateMachine(eventBus, 'PLAYING');
      stateMachine.triggerGameOver();
      expect(stateMachine.getState()).toBe('GAME_OVER');
    });

    it('triggerGameOver should work from ROUND_SUMMARY', () => {
      stateMachine = new GameStateMachine(eventBus, 'ROUND_SUMMARY');
      stateMachine.triggerGameOver();
      expect(stateMachine.getState()).toBe('GAME_OVER');
    });

    it('restart should transition to LOADING', () => {
      stateMachine = new GameStateMachine(eventBus, 'GAME_OVER');
      stateMachine.restart();
      expect(stateMachine.getState()).toBe('LOADING');
    });
  });

  describe('Complete Flow', () => {
    it('should handle complete game flow from start to game over', () => {
      // Start
      stateMachine.startGame();
      expect(stateMachine.getState()).toBe('SCENARIO_SELECT');

      // Select scenario and role
      stateMachine.selectScenario();
      stateMachine.selectRole();
      expect(stateMachine.getState()).toBe('PLAYING');

      // Play a round
      stateMachine.endRound();
      expect(stateMachine.getState()).toBe('ROUND_SUMMARY');

      stateMachine.dismissSummary();
      expect(stateMachine.getState()).toBe('PLAYING');

      // Show empathy modal
      stateMachine.showEmpathyModal();
      expect(stateMachine.getState()).toBe('EMPATHY_MODAL');

      stateMachine.dismissEmpathyModal();
      expect(stateMachine.getState()).toBe('PLAYING');

      // Game over
      stateMachine.triggerGameOver();
      expect(stateMachine.getState()).toBe('GAME_OVER');

      // Restart
      stateMachine.restart();
      expect(stateMachine.getState()).toBe('LOADING');

      // Verify all events were emitted (9 transitions total)
      expect(emitSpy).toHaveBeenCalledTimes(9);
    });
  });
});
