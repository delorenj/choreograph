/**
 * RoundManager Unit Tests
 *
 * Tests for round timer, pause/resume, event emission, and round transitions.
 * Story: 001-02 (Round Timer System)
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { RoundManager, RoundManagerConfig } from '../RoundManager';
import { EventBus } from '../../../../data/events/eventBus';
import { GameStateMachine } from '../../stateMachine/GameStateMachine';
import { FinancialManager, FinancialManagerConfig } from '../../financialManager';
import { RoundSummary } from '../../../../data/entities';

describe('RoundManager', () => {
  let roundManager: RoundManager;
  let eventBus: EventBus;
  let stateMachine: GameStateMachine;
  let financialManager: FinancialManager;
  let emitSpy: ReturnType<typeof vi.fn>;
  let config: RoundManagerConfig;

  beforeEach(() => {
    // Use fake timers for predictable timer behavior
    vi.useFakeTimers();

    eventBus = new EventBus();
    stateMachine = new GameStateMachine(eventBus, 'PLAYING');
    emitSpy = vi.spyOn(eventBus, 'emit');

    // Create FinancialManager
    const financialConfig: FinancialManagerConfig = {
      startingBalance: 10000,
      bluePaycheck: 6250,
      redIncome: 0,
    };
    financialManager = new FinancialManager(eventBus, financialConfig);

    config = {
      durationSeconds: 120,
      paycheckInterval: 2,
      paycheckAmount: 6250,
    };

    roundManager = new RoundManager(eventBus, stateMachine, config, financialManager);
  });

  afterEach(() => {
    roundManager.destroy();
    vi.useRealTimers();
  });

  describe('Initialization', () => {
    it('should initialize with round 1', () => {
      expect(roundManager.getRoundNumber()).toBe(1);
    });

    it('should initialize in IDLE phase', () => {
      expect(roundManager.getPhase()).toBe('IDLE');
    });

    it('should initialize with full duration remaining', () => {
      expect(roundManager.getRemainingTime()).toBe(120);
      expect(roundManager.getElapsedTime()).toBe(0);
    });

    it('should not be running initially', () => {
      expect(roundManager.isRunning()).toBe(false);
    });

    it('should correctly identify paycheck rounds', () => {
      expect(roundManager.isPaycheckRound()).toBe(false); // Round 1

      // Advance to round 2
      const summary: RoundSummary = {
        roundNumber: 1,
        blueTasksCompleted: 0,
        blueTasksTotal: 0,
        redTasksCompleted: 0,
        redTasksTotal: 0,
        blueStressChange: 0,
        redStressChange: 0,
        rapportChange: 0,
        incomeReceived: 0,
        runningBalance: 0,
      };
      roundManager.endRound(summary);
      roundManager.continueToNextRound();

      expect(roundManager.getRoundNumber()).toBe(2);
      expect(roundManager.isPaycheckRound()).toBe(true); // Round 2 is paycheck round
    });
  });

  describe('Starting a Round', () => {
    it('should transition to PLAYING phase', () => {
      roundManager.startRound();
      expect(roundManager.getPhase()).toBe('PLAYING');
      expect(roundManager.isRunning()).toBe(true);
    });

    it('should emit round:start event', () => {
      roundManager.startRound();

      expect(emitSpy).toHaveBeenCalledWith('round:start', {
        roundNumber: 1,
        isPaycheckRound: false,
      });
    });

    it('should start timer when round starts', () => {
      roundManager.startRound();

      // Advance time by 1 second
      vi.advanceTimersByTime(1000);

      // Should emit tick event
      expect(emitSpy).toHaveBeenCalledWith('round:tick', {
        remainingTime: 119,
        elapsedTime: 1,
      });
    });
  });

  describe('Timer Tick Events', () => {
    beforeEach(() => {
      roundManager.startRound();
      emitSpy.mockClear(); // Clear start event
    });

    it('should emit round:tick event every second', () => {
      vi.advanceTimersByTime(1000);
      expect(emitSpy).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(1000);
      expect(emitSpy).toHaveBeenCalledTimes(2);

      vi.advanceTimersByTime(1000);
      expect(emitSpy).toHaveBeenCalledTimes(3);
    });

    it('should update remainingTime on each tick', () => {
      vi.advanceTimersByTime(1000);
      expect(roundManager.getRemainingTime()).toBe(119);

      vi.advanceTimersByTime(1000);
      expect(roundManager.getRemainingTime()).toBe(118);

      vi.advanceTimersByTime(5000);
      expect(roundManager.getRemainingTime()).toBe(113);
    });

    it('should update elapsedTime on each tick', () => {
      vi.advanceTimersByTime(1000);
      expect(roundManager.getElapsedTime()).toBe(1);

      vi.advanceTimersByTime(1000);
      expect(roundManager.getElapsedTime()).toBe(2);

      vi.advanceTimersByTime(5000);
      expect(roundManager.getElapsedTime()).toBe(7);
    });

    it('should emit tick with correct payload', () => {
      vi.advanceTimersByTime(1000);

      expect(emitSpy).toHaveBeenCalledWith('round:tick', {
        remainingTime: 119,
        elapsedTime: 1,
      });
    });
  });

  describe('Pause and Resume', () => {
    beforeEach(() => {
      roundManager.startRound();
      emitSpy.mockClear();
    });

    it('should pause timer', () => {
      roundManager.pauseRound();

      expect(roundManager.getPhase()).toBe('PAUSED');
      expect(roundManager.isPaused()).toBe(true);
      expect(roundManager.isRunning()).toBe(false);
    });

    it('should stop emitting ticks when paused', () => {
      vi.advanceTimersByTime(2000); // 2 ticks
      const tickCountBeforePause = emitSpy.mock.calls.filter(
        (call) => call[0] === 'round:tick'
      ).length;

      roundManager.pauseRound();
      vi.advanceTimersByTime(5000); // No new ticks should occur

      const tickCountAfterPause = emitSpy.mock.calls.filter(
        (call) => call[0] === 'round:tick'
      ).length;

      expect(tickCountAfterPause).toBe(tickCountBeforePause);
    });

    it('should preserve time when paused', () => {
      vi.advanceTimersByTime(5000);
      const elapsedBeforePause = roundManager.getElapsedTime();
      const remainingBeforePause = roundManager.getRemainingTime();

      roundManager.pauseRound();
      vi.advanceTimersByTime(10000); // Time should not advance

      expect(roundManager.getElapsedTime()).toBe(elapsedBeforePause);
      expect(roundManager.getRemainingTime()).toBe(remainingBeforePause);
    });

    it('should resume timer from paused state', () => {
      vi.advanceTimersByTime(5000);
      roundManager.pauseRound();

      const elapsedAtPause = roundManager.getElapsedTime();

      roundManager.resumeRound();
      expect(roundManager.getPhase()).toBe('PLAYING');
      expect(roundManager.isRunning()).toBe(true);

      vi.advanceTimersByTime(3000);
      expect(roundManager.getElapsedTime()).toBe(elapsedAtPause + 3);
    });

    it('should call stateMachine.pause() when pausing', () => {
      const pauseSpy = vi.spyOn(stateMachine, 'pause');
      roundManager.pauseRound();

      expect(pauseSpy).toHaveBeenCalled();
    });

    it('should call stateMachine.resume() when resuming', () => {
      roundManager.pauseRound();
      const resumeSpy = vi.spyOn(stateMachine, 'resume');

      roundManager.resumeRound();
      expect(resumeSpy).toHaveBeenCalled();
    });
  });

  describe('Round End', () => {
    it('should trigger round end when timer expires', () => {
      roundManager.startRound();
      emitSpy.mockClear();

      // Advance to end of round
      vi.advanceTimersByTime(120000); // 120 seconds

      // Should emit round:end event
      expect(emitSpy).toHaveBeenCalledWith(
        'round:end',
        expect.objectContaining({
          roundNumber: 1,
          summary: expect.any(Object),
        })
      );
    });

    it('should stop timer when round ends', () => {
      roundManager.startRound();

      vi.advanceTimersByTime(120000); // End round
      emitSpy.mockClear();

      // No more ticks should occur
      vi.advanceTimersByTime(5000);

      const tickCount = emitSpy.mock.calls.filter((call) => call[0] === 'round:tick').length;
      expect(tickCount).toBe(0);
    });

    it('should transition to SUMMARY phase', () => {
      roundManager.startRound();

      vi.advanceTimersByTime(120000);

      expect(roundManager.getPhase()).toBe('SUMMARY');
    });

    it('should call stateMachine.endRound() when round ends', () => {
      roundManager.startRound();
      const endRoundSpy = vi.spyOn(stateMachine, 'endRound');

      vi.advanceTimersByTime(120000);

      expect(endRoundSpy).toHaveBeenCalled();
    });

    it('should set remainingTime to 0 when expired', () => {
      roundManager.startRound();

      vi.advanceTimersByTime(120000);

      expect(roundManager.getRemainingTime()).toBe(0);
    });
  });

  describe('Manual Round End', () => {
    it('should allow manually ending a round', () => {
      roundManager.startRound();

      const summary: RoundSummary = {
        roundNumber: 1,
        blueTasksCompleted: 5,
        blueTasksTotal: 10,
        redTasksCompleted: 3,
        redTasksTotal: 8,
        blueStressChange: 15,
        redStressChange: 10,
        rapportChange: -5,
        incomeReceived: 0,
        runningBalance: 5000,
      };

      roundManager.endRound(summary);

      expect(roundManager.getPhase()).toBe('SUMMARY');

      expect(emitSpy).toHaveBeenCalledWith('round:end', {
        roundNumber: 1,
        summary,
      });
    });

    it('should support forceEndRound for testing', () => {
      roundManager.startRound();
      vi.advanceTimersByTime(5000);

      roundManager.forceEndRound();

      expect(roundManager.getPhase()).toBe('SUMMARY');
    });
  });

  describe('Round Transitions', () => {
    it('should advance to next round', () => {
      roundManager.startRound();

      const summary: RoundSummary = {
        roundNumber: 1,
        blueTasksCompleted: 0,
        blueTasksTotal: 0,
        redTasksCompleted: 0,
        redTasksTotal: 0,
        blueStressChange: 0,
        redStressChange: 0,
        rapportChange: 0,
        incomeReceived: 0,
        runningBalance: 0,
      };

      roundManager.endRound(summary);
      roundManager.continueToNextRound();

      expect(roundManager.getRoundNumber()).toBe(2);
      expect(roundManager.getPhase()).toBe('PLAYING');
      expect(roundManager.getElapsedTime()).toBe(0);
      expect(roundManager.getRemainingTime()).toBe(120);
    });

    it('should emit round:start for next round', () => {
      roundManager.startRound();

      const summary: RoundSummary = {
        roundNumber: 1,
        blueTasksCompleted: 0,
        blueTasksTotal: 0,
        redTasksCompleted: 0,
        redTasksTotal: 0,
        blueStressChange: 0,
        redStressChange: 0,
        rapportChange: 0,
        incomeReceived: 0,
        runningBalance: 0,
      };

      roundManager.endRound(summary);
      emitSpy.mockClear();

      roundManager.continueToNextRound();

      expect(emitSpy).toHaveBeenCalledWith('round:start', {
        roundNumber: 2,
        isPaycheckRound: true, // Round 2 is paycheck round
      });
    });
  });

  describe('Configuration Integration', () => {
    it('should use configured round duration', () => {
      const customConfig: RoundManagerConfig = {
        durationSeconds: 60,
        paycheckInterval: 2,
        paycheckAmount: 6250,
      };

      const customManager = new RoundManager(
        eventBus,
        stateMachine,
        customConfig,
        financialManager
      );

      customManager.startRound();
      expect(customManager.getRemainingTime()).toBe(60);

      vi.advanceTimersByTime(60000);
      expect(customManager.getPhase()).toBe('SUMMARY');

      customManager.destroy();
    });

    it('should use configured paycheck interval', () => {
      const customConfig: RoundManagerConfig = {
        durationSeconds: 120,
        paycheckInterval: 3, // Every 3 rounds
        paycheckAmount: 6250,
      };

      const customManager = new RoundManager(
        eventBus,
        stateMachine,
        customConfig,
        financialManager
      );

      expect(customManager.isPaycheckRound()).toBe(false); // Round 1

      const summary: RoundSummary = {
        roundNumber: 1,
        blueTasksCompleted: 0,
        blueTasksTotal: 0,
        redTasksCompleted: 0,
        redTasksTotal: 0,
        blueStressChange: 0,
        redStressChange: 0,
        rapportChange: 0,
        incomeReceived: 0,
        runningBalance: 0,
      };

      customManager.startRound();
      customManager.endRound(summary);
      customManager.continueToNextRound();
      expect(customManager.isPaycheckRound()).toBe(false); // Round 2

      customManager.endRound(summary);
      customManager.continueToNextRound();
      expect(customManager.isPaycheckRound()).toBe(true); // Round 3

      customManager.destroy();
    });
  });

  describe('Timer Accuracy', () => {
    it('should handle accumulated time correctly', () => {
      roundManager.startRound();

      // Simulate irregular tick intervals (accumulator pattern)
      vi.advanceTimersByTime(1100); // 1.1 seconds
      expect(roundManager.getElapsedTime()).toBe(1);

      vi.advanceTimersByTime(900); // 0.9 seconds (total 2.0)
      expect(roundManager.getElapsedTime()).toBe(2);

      vi.advanceTimersByTime(1500); // 1.5 seconds (total 3.5)
      expect(roundManager.getElapsedTime()).toBe(3);
    });

    it('should not drift over many ticks', () => {
      roundManager.startRound();

      // Advance 10 seconds
      vi.advanceTimersByTime(10000);

      expect(roundManager.getElapsedTime()).toBe(10);
      expect(roundManager.getRemainingTime()).toBe(110);
    });
  });

  describe('Edge Cases', () => {
    it('should not pause if not running', () => {
      // IDLE phase
      roundManager.pauseRound();
      expect(roundManager.getPhase()).toBe('IDLE');
    });

    it('should not resume if not paused', () => {
      roundManager.startRound();
      roundManager.resumeRound();
      expect(roundManager.getPhase()).toBe('PLAYING');
    });

    it('should handle destroy cleanup', () => {
      roundManager.startRound();
      roundManager.destroy();

      // Timer should be stopped
      emitSpy.mockClear();
      vi.advanceTimersByTime(5000);

      const tickCount = emitSpy.mock.calls.filter((call) => call[0] === 'round:tick').length;
      expect(tickCount).toBe(0);
    });

    it('should get round as readonly copy', () => {
      const round1 = roundManager.getRound();
      const round2 = roundManager.getRound();

      expect(round1).toEqual(round2);
      expect(round1).not.toBe(round2); // Different instances
    });
  });

  describe('Complete Round Flow', () => {
    it('should handle complete round lifecycle', () => {
      // Start round 1
      roundManager.startRound();
      expect(roundManager.getRoundNumber()).toBe(1);
      expect(roundManager.getPhase()).toBe('PLAYING');

      // Play for 5 seconds
      vi.advanceTimersByTime(5000);
      expect(roundManager.getElapsedTime()).toBe(5);

      // Pause
      roundManager.pauseRound();
      expect(roundManager.getPhase()).toBe('PAUSED');

      // Resume
      roundManager.resumeRound();
      expect(roundManager.getPhase()).toBe('PLAYING');

      // Complete round
      vi.advanceTimersByTime(115000); // Total 120 seconds

      expect(roundManager.getPhase()).toBe('SUMMARY');

      // Continue to next round
      roundManager.continueToNextRound();
      expect(roundManager.getRoundNumber()).toBe(2);
      expect(roundManager.getPhase()).toBe('PLAYING');
      expect(roundManager.isPaycheckRound()).toBe(true);
    });
  });
});
