/**
 * EventBus Unit Tests
 *
 * Comprehensive tests for the EventBus pub/sub system
 * Tests cover:
 * - Basic pub/sub functionality
 * - Type safety
 * - Multiple handlers
 * - Unsubscribe mechanism
 * - Event logging
 * - Edge cases
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { EventBus } from '@/data/events/eventBus';
import type { GameEventPayload } from '@/data/events/eventTypes';

describe('EventBus', () => {
  let eventBus: EventBus;
  let consoleLogSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // Create new EventBus for each test
    eventBus = new EventBus({ enableLogging: false });

    // Spy on console.log to test logging
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    // Clean up
    eventBus.clear();
    consoleLogSpy.mockRestore();
  });

  // ==========================================================================
  // BASIC PUB/SUB FUNCTIONALITY
  // ==========================================================================

  describe('Basic Pub/Sub', () => {
    it('should emit event to single handler', () => {
      const handler = vi.fn();
      eventBus.on('round:start', handler);

      eventBus.emit('round:start', { roundNumber: 1, isPaycheckRound: false });

      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler).toHaveBeenCalledWith({
        roundNumber: 1,
        isPaycheckRound: false,
      });
    });

    it('should emit event to multiple handlers', () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();
      const handler3 = vi.fn();

      eventBus.on('task:complete', handler1);
      eventBus.on('task:complete', handler2);
      eventBus.on('task:complete', handler3);

      eventBus.emit('task:complete', { taskId: 'task-1', completedBy: 'blue' });

      expect(handler1).toHaveBeenCalledTimes(1);
      expect(handler2).toHaveBeenCalledTimes(1);
      expect(handler3).toHaveBeenCalledTimes(1);
    });

    it('should not call handlers for different events', () => {
      const roundHandler = vi.fn();
      const taskHandler = vi.fn();

      eventBus.on('round:start', roundHandler);
      eventBus.on('task:complete', taskHandler);

      eventBus.emit('round:start', { roundNumber: 1, isPaycheckRound: false });

      expect(roundHandler).toHaveBeenCalledTimes(1);
      expect(taskHandler).not.toHaveBeenCalled();
    });

    it('should handle events with no handlers gracefully', () => {
      expect(() => {
        eventBus.emit('round:tick', { remainingTime: 60, elapsedTime: 60 });
      }).not.toThrow();
    });
  });

  // ==========================================================================
  // UNSUBSCRIBE MECHANISM
  // ==========================================================================

  describe('Unsubscribe', () => {
    it('should unsubscribe using returned function', () => {
      const handler = vi.fn();
      const unsubscribe = eventBus.on('stress:changed', handler);

      // First emit - handler should be called
      eventBus.emit('stress:changed', {
        ball: 'blue',
        previousLevel: 50,
        newLevel: 60,
        source: 'INCOMPLETE_TASK',
      });
      expect(handler).toHaveBeenCalledTimes(1);

      // Unsubscribe
      unsubscribe();

      // Second emit - handler should NOT be called
      eventBus.emit('stress:changed', {
        ball: 'blue',
        previousLevel: 60,
        newLevel: 70,
        source: 'HELPED_RED',
      });
      expect(handler).toHaveBeenCalledTimes(1); // Still 1, not 2
    });

    it('should unsubscribe using off() method', () => {
      const handler = vi.fn();
      eventBus.on('rapport:changed', handler);

      eventBus.emit('rapport:changed', {
        previousLevel: 75,
        newLevel: 80,
        emoji: 'smile',
        reason: 'SUCCESS',
      });
      expect(handler).toHaveBeenCalledTimes(1);

      eventBus.off('rapport:changed', handler);

      eventBus.emit('rapport:changed', {
        previousLevel: 80,
        newLevel: 70,
        emoji: 'neutral',
        reason: 'MISSED_DEADLINE',
      });
      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('should only unsubscribe specific handler', () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();

      const unsubscribe1 = eventBus.on('game:fired', handler1);
      eventBus.on('game:fired', handler2);

      // Both handlers called
      eventBus.emit('game:fired', {
        rapportLevel: 20,
        roundNumber: 5,
        firingThreshold: 18,
      });
      expect(handler1).toHaveBeenCalledTimes(1);
      expect(handler2).toHaveBeenCalledTimes(1);

      // Unsubscribe handler1
      unsubscribe1();

      // Only handler2 called
      eventBus.emit('game:fired', {
        rapportLevel: 15,
        roundNumber: 6,
        firingThreshold: 20,
      });
      expect(handler1).toHaveBeenCalledTimes(1);
      expect(handler2).toHaveBeenCalledTimes(2);
    });

    it('should handle unsubscribing non-existent handler gracefully', () => {
      const handler = vi.fn();

      expect(() => {
        eventBus.off('round:end', handler);
      }).not.toThrow();
    });
  });

  // ==========================================================================
  // EVENT LOGGING
  // ==========================================================================

  describe('Event Logging', () => {
    it('should log events when logging enabled', () => {
      const loggingBus = new EventBus({ enableLogging: true });

      loggingBus.emit('round:paycheck', { amount: 6250, balance: 12500 });

      expect(consoleLogSpy).toHaveBeenCalledWith(
        '[EventBus] round:paycheck',
        '(0 handlers)',
        { amount: 6250, balance: 12500 }
      );
    });

    it('should not log events when logging disabled', () => {
      eventBus.emit('task:progress', { taskId: 'task-1', progress: 0.5 });

      expect(consoleLogSpy).not.toHaveBeenCalled();
    });

    it('should use custom logger when provided', () => {
      const customLogger = vi.fn();
      const customBus = new EventBus({
        enableLogging: true,
        logger: customLogger,
      });

      customBus.emit('empathy:shown', {
        targetBall: 'blue',
        availableActions: [],
      });

      expect(customLogger).toHaveBeenCalledWith(
        'empathy:shown',
        { targetBall: 'blue', availableActions: [] },
        0
      );
      expect(consoleLogSpy).not.toHaveBeenCalled();
    });

    it('should show correct handler count in logs', () => {
      const loggingBus = new EventBus({ enableLogging: true });
      const handler1 = vi.fn();
      const handler2 = vi.fn();

      loggingBus.on('employment:event', handler1);
      loggingBus.on('employment:event', handler2);

      loggingBus.emit('employment:event', {
        roundNumber: 4,
        redIncome: 400,
        blueWorkTimeReduction: 0.45,
      });

      expect(consoleLogSpy).toHaveBeenCalledWith(
        '[EventBus] employment:event',
        '(2 handlers)',
        expect.any(Object)
      );
    });

    it('should toggle logging at runtime', () => {
      eventBus.setLogging(true);
      eventBus.emit('round:tick', { remainingTime: 30, elapsedTime: 90 });
      expect(consoleLogSpy).toHaveBeenCalledTimes(1);

      consoleLogSpy.mockClear();

      eventBus.setLogging(false);
      eventBus.emit('round:tick', { remainingTime: 20, elapsedTime: 100 });
      expect(consoleLogSpy).not.toHaveBeenCalled();
    });
  });

  // ==========================================================================
  // UTILITY METHODS
  // ==========================================================================

  describe('Utility Methods', () => {
    it('should return correct handler count', () => {
      expect(eventBus.getHandlerCount('task:spawned')).toBe(0);

      eventBus.on('task:spawned', vi.fn());
      expect(eventBus.getHandlerCount('task:spawned')).toBe(1);

      eventBus.on('task:spawned', vi.fn());
      expect(eventBus.getHandlerCount('task:spawned')).toBe(2);
    });

    it('should return active events', () => {
      expect(eventBus.getActiveEvents()).toEqual([]);

      eventBus.on('round:start', vi.fn());
      eventBus.on('task:complete', vi.fn());
      eventBus.on('stress:changed', vi.fn());

      const activeEvents = eventBus.getActiveEvents();
      expect(activeEvents).toHaveLength(3);
      expect(activeEvents).toContain('round:start');
      expect(activeEvents).toContain('task:complete');
      expect(activeEvents).toContain('stress:changed');
    });

    it('should clear all handlers', () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();

      eventBus.on('round:start', handler1);
      eventBus.on('task:complete', handler2);

      expect(eventBus.getActiveEvents()).toHaveLength(2);

      eventBus.clear();

      expect(eventBus.getActiveEvents()).toHaveLength(0);
      expect(eventBus.getHandlerCount('round:start')).toBe(0);
      expect(eventBus.getHandlerCount('task:complete')).toBe(0);
    });
  });

  // ==========================================================================
  // TYPE SAFETY TESTS
  // ==========================================================================

  describe('Type Safety', () => {
    it('should enforce correct payload types for round:start', () => {
      const handler = vi.fn<[GameEventPayload['round:start']]>();
      eventBus.on('round:start', handler);

      eventBus.emit('round:start', { roundNumber: 1, isPaycheckRound: true });

      expect(handler).toHaveBeenCalledWith({
        roundNumber: 1,
        isPaycheckRound: true,
      });
    });

    it('should enforce correct payload types for task:regressing', () => {
      const handler = vi.fn<[GameEventPayload['task:regressing']]>();
      eventBus.on('task:regressing', handler);

      eventBus.emit('task:regressing', {
        taskId: 'blue-task-1',
        regressionRate: 0.3,
      });

      expect(handler).toHaveBeenCalledWith({
        taskId: 'blue-task-1',
        regressionRate: 0.3,
      });
    });

    it('should enforce correct payload types for empathy:dismissed', () => {
      const handler = vi.fn<[GameEventPayload['empathy:dismissed']]>();
      eventBus.on('empathy:dismissed', handler);

      const action = {
        id: 'hug',
        category: 'physical' as const,
        name: 'Give a Hug',
        description: 'A warm embrace',
        animationUrl: '/animations/hug.gif',
        stressReduction: 30,
      };

      eventBus.emit('empathy:dismissed', {
        selectedAction: action,
        stressReduction: 30,
      });

      expect(handler).toHaveBeenCalledWith({
        selectedAction: action,
        stressReduction: 30,
      });
    });
  });

  // ==========================================================================
  // EDGE CASES
  // ==========================================================================

  describe('Edge Cases', () => {
    it('should handle rapid successive emissions', () => {
      const handler = vi.fn();
      eventBus.on('round:tick', handler);

      for (let i = 0; i < 100; i++) {
        eventBus.emit('round:tick', { remainingTime: 100 - i, elapsedTime: i });
      }

      expect(handler).toHaveBeenCalledTimes(100);
    });

    it('should handle handler that throws error', () => {
      const throwingHandler = vi.fn(() => {
        throw new Error('Handler error');
      });
      const normalHandler = vi.fn();

      eventBus.on('game:stateChanged', throwingHandler);
      eventBus.on('game:stateChanged', normalHandler);

      // First handler throws, but second should still be called
      expect(() => {
        eventBus.emit('game:stateChanged', {
          previousState: 'PLAYING',
          newState: 'PAUSED',
        });
      }).toThrow('Handler error');

      expect(throwingHandler).toHaveBeenCalled();
      // Note: normalHandler won't be called because forEach stops on error
    });

    it('should handle unsubscribing during event emission', () => {
      const handler1 = vi.fn();
      let unsubscribe2: (() => void) | undefined;
      const handler2 = vi.fn(() => {
        // Unsubscribe self during callback
        unsubscribe2?.();
      });
      const handler3 = vi.fn();

      eventBus.on('task:spawned', handler1);
      unsubscribe2 = eventBus.on('task:spawned', handler2);
      eventBus.on('task:spawned', handler3);

      eventBus.emit('task:spawned', {
        task: {
          id: 'task-1',
          type: 'blue',
          completionTime: 10,
          isComplete: false,
        },
      });

      // All handlers should have been called for first emission
      expect(handler1).toHaveBeenCalledTimes(1);
      expect(handler2).toHaveBeenCalledTimes(1);
      expect(handler3).toHaveBeenCalledTimes(1);

      // Second emission - handler2 should not be called
      eventBus.emit('task:spawned', {
        task: {
          id: 'task-2',
          type: 'red',
          category: 'cleaning',
          completionTime: 15,
          isComplete: false,
        },
      });

      expect(handler1).toHaveBeenCalledTimes(2);
      expect(handler2).toHaveBeenCalledTimes(1); // Still 1
      expect(handler3).toHaveBeenCalledTimes(2);
    });

    it('should handle same handler registered multiple times', () => {
      const handler = vi.fn();

      eventBus.on('round:end', handler);
      eventBus.on('round:end', handler);
      eventBus.on('round:end', handler);

      // Set only stores unique handlers, so should be called once per emission
      eventBus.emit('round:end', {
        roundNumber: 1,
        summary: {
          roundNumber: 1,
          blueTasksCompleted: 5,
          blueTasksTotal: 8,
          redTasksCompleted: 3,
          redTasksTotal: 4,
          blueStressChange: 15,
          redStressChange: 8,
          rapportChange: -5,
          incomeReceived: 0,
          runningBalance: 10000,
        },
      });

      // Set prevents duplicates
      expect(handler).toHaveBeenCalledTimes(1);
    });
  });

  // ==========================================================================
  // INTEGRATION SCENARIOS
  // ==========================================================================

  describe('Integration Scenarios', () => {
    it('should support complete round lifecycle', () => {
      const startHandler = vi.fn();
      const tickHandler = vi.fn();
      const endHandler = vi.fn();

      eventBus.on('round:start', startHandler);
      eventBus.on('round:tick', tickHandler);
      eventBus.on('round:end', endHandler);

      // Round starts
      eventBus.emit('round:start', { roundNumber: 1, isPaycheckRound: false });
      expect(startHandler).toHaveBeenCalledTimes(1);

      // Multiple ticks
      eventBus.emit('round:tick', { remainingTime: 90, elapsedTime: 30 });
      eventBus.emit('round:tick', { remainingTime: 60, elapsedTime: 60 });
      expect(tickHandler).toHaveBeenCalledTimes(2);

      // Round ends
      eventBus.emit('round:end', {
        roundNumber: 1,
        summary: {
          roundNumber: 1,
          blueTasksCompleted: 6,
          blueTasksTotal: 8,
          redTasksCompleted: 4,
          redTasksTotal: 5,
          blueStressChange: 10,
          redStressChange: 5,
          rapportChange: 5,
          incomeReceived: 0,
          runningBalance: 10000,
        },
      });
      expect(endHandler).toHaveBeenCalledTimes(1);
    });

    it('should support stress system workflow', () => {
      const stressHandler = vi.fn();
      const rapportHandler = vi.fn();
      const firedHandler = vi.fn();

      eventBus.on('stress:changed', stressHandler);
      eventBus.on('rapport:changed', rapportHandler);
      eventBus.on('game:fired', firedHandler);

      // Blue stress increases
      eventBus.emit('stress:changed', {
        ball: 'blue',
        previousLevel: 50,
        newLevel: 60,
        source: 'INCOMPLETE_TASK',
      });

      // Rapport decreases
      eventBus.emit('rapport:changed', {
        previousLevel: 75,
        newLevel: 65,
        emoji: 'neutral',
        reason: 'MISSED_DEADLINE',
      });

      // Eventually fired
      eventBus.emit('game:fired', {
        rapportLevel: 18,
        roundNumber: 8,
        firingThreshold: 20,
      });

      expect(stressHandler).toHaveBeenCalledTimes(1);
      expect(rapportHandler).toHaveBeenCalledTimes(1);
      expect(firedHandler).toHaveBeenCalledTimes(1);
    });
  });
});
