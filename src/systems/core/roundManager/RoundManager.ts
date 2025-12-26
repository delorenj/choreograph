/**
 * Round Manager
 *
 * Controls round-based time progression (1 round = 1 week in game time).
 * Implements interval-based timer with accumulator for accurate timing.
 *
 * Story: 001-02 (Round Timer System)
 * Based on Architecture Document Section 5.2.1 (RoundManager)
 */

import { EventBus } from '../../../data/events/eventBus';
import { Round, RoundPhase, RoundSummary } from '../../../data/entities';
import { GameEvent } from '../stateMachine/types';
import { GameStateMachine } from '../stateMachine/GameStateMachine';
import { FinancialManager } from '../financialManager';

export interface RoundManagerConfig {
  durationSeconds: number;
  paycheckInterval: number;
  paycheckAmount: number;
}

/**
 * RoundManager manages round lifecycle and timer
 */
export class RoundManager {
  private readonly eventBus: EventBus;
  private readonly stateMachine: GameStateMachine;
  private readonly config: RoundManagerConfig;
  private readonly financialManager: FinancialManager;

  private currentRound: Round;
  private timerId: number | null = null;
  private accumulator: number = 0;
  private lastTickTime: number = 0;

  // Constants
  private readonly TICK_INTERVAL = 1000; // 1 second in milliseconds

  constructor(
    eventBus: EventBus,
    stateMachine: GameStateMachine,
    config: RoundManagerConfig,
    financialManager: FinancialManager
  ) {
    this.eventBus = eventBus;
    this.stateMachine = stateMachine;
    this.config = config;
    this.financialManager = financialManager;

    // Initialize with first round
    this.currentRound = this.createRound(1);
  }

  /**
   * Create a new round instance
   */
  private createRound(roundNumber: number): Round {
    return {
      number: roundNumber,
      phase: 'IDLE',
      elapsedTime: 0,
      remainingTime: this.config.durationSeconds,
      isPaycheckRound: roundNumber % this.config.paycheckInterval === 0,
      startedAt: null,
      endedAt: null,
    };
  }

  /**
   * Get current round state (readonly)
   */
  public getRound(): Readonly<Round> {
    return { ...this.currentRound };
  }

  /**
   * Get current round number
   */
  public getRoundNumber(): number {
    return this.currentRound.number;
  }

  /**
   * Get remaining time in seconds
   */
  public getRemainingTime(): number {
    return this.currentRound.remainingTime;
  }

  /**
   * Get elapsed time in seconds
   */
  public getElapsedTime(): number {
    return this.currentRound.elapsedTime;
  }

  /**
   * Check if current round is a paycheck round
   */
  public isPaycheckRound(): boolean {
    return this.currentRound.isPaycheckRound;
  }

  /**
   * Get current round phase
   */
  public getPhase(): RoundPhase {
    return this.currentRound.phase;
  }

  /**
   * Check if timer is currently running
   */
  public isRunning(): boolean {
    return this.currentRound.phase === 'PLAYING';
  }

  /**
   * Check if timer is paused
   */
  public isPaused(): boolean {
    return this.currentRound.phase === 'PAUSED';
  }

  /**
   * Start a new round
   */
  public startRound(): void {
    // Update round state
    this.currentRound.phase = 'PLAYING';
    this.currentRound.startedAt = Date.now();
    this.lastTickTime = Date.now();
    this.accumulator = 0;

    // Start timer
    this.startTimer();

    // Emit round:start event
    this.eventBus.emit('round:start', {
      roundNumber: this.currentRound.number,
      isPaycheckRound: this.currentRound.isPaycheckRound,
    });
  }

  /**
   * Pause the current round
   */
  public pauseRound(): void {
    if (this.currentRound.phase !== 'PLAYING') {
      return;
    }

    this.currentRound.phase = 'PAUSED';
    this.stopTimer();

    // Transition state machine to PAUSED
    this.stateMachine.pause();
  }

  /**
   * Resume a paused round
   */
  public resumeRound(): void {
    if (this.currentRound.phase !== 'PAUSED') {
      return;
    }

    this.currentRound.phase = 'PLAYING';
    this.lastTickTime = Date.now();
    this.accumulator = 0;
    this.startTimer();

    // Transition state machine back to PLAYING
    this.stateMachine.resume();
  }

  /**
   * End the current round
   * @param summary Round summary data
   */
  public endRound(summary: RoundSummary): void {
    this.stopTimer();

    this.currentRound.phase = 'SUMMARY';
    this.currentRound.endedAt = Date.now();

    // Emit round:end event
    this.eventBus.emit('round:end', {
      roundNumber: this.currentRound.number,
      summary,
    });

    // Transition state machine to ROUND_SUMMARY
    this.stateMachine.endRound();
  }

  /**
   * Continue to next round (called after summary is dismissed)
   */
  public continueToNextRound(): void {
    // Transition state machine from ROUND_SUMMARY back to PLAYING
    this.stateMachine.dismissSummary();

    // Create next round
    const nextRoundNumber = this.currentRound.number + 1;
    this.currentRound = this.createRound(nextRoundNumber);

    // Start the new round
    this.startRound();
  }

  /**
   * Force end round immediately (for testing or special cases)
   */
  public forceEndRound(): void {
    const summary: RoundSummary = {
      roundNumber: this.currentRound.number,
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

    this.endRound(summary);
  }

  /**
   * Start the timer interval
   */
  private startTimer(): void {
    if (this.timerId !== null) {
      return; // Already running
    }

    // Use setInterval for timer ticks
    this.timerId = window.setInterval(() => {
      this.tick();
    }, this.TICK_INTERVAL);
  }

  /**
   * Stop the timer interval
   */
  private stopTimer(): void {
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  /**
   * Timer tick - called every second
   * Uses accumulator pattern for accuracy
   */
  private tick(): void {
    if (this.currentRound.phase !== 'PLAYING') {
      return;
    }

    const now = Date.now();
    const deltaTime = (now - this.lastTickTime) / 1000; // Convert to seconds
    this.lastTickTime = now;

    this.accumulator += deltaTime;

    // Process accumulated seconds
    while (this.accumulator >= 1.0) {
      this.accumulator -= 1.0;
      this.processSecond();
    }
  }

  /**
   * Process one second of game time
   */
  private processSecond(): void {
    // Update round timers
    this.currentRound.elapsedTime += 1;
    this.currentRound.remainingTime = Math.max(
      0,
      this.config.durationSeconds - this.currentRound.elapsedTime
    );

    // Emit tick event
    this.eventBus.emit('round:tick', {
      remainingTime: this.currentRound.remainingTime,
      elapsedTime: this.currentRound.elapsedTime,
    });

    // Check if round should end
    if (this.currentRound.remainingTime <= 0) {
      this.handleTimeExpired();
    }
  }

  /**
   * Handle timer expiration
   */
  private handleTimeExpired(): void {
    this.stopTimer();

    // Process financial updates for the round
    // Note: isRedEmployed will be properly tracked in future stories
    const isRedEmployed = false; // Placeholder - will be integrated with game state
    this.financialManager.processRoundEnd(
      this.currentRound.number,
      isRedEmployed,
      this.config.paycheckInterval
    );

    // Get financial state for summary
    const financialState = this.financialManager.getState();

    // Will be replaced with actual summary calculation in future stories
    const summary: RoundSummary = {
      roundNumber: this.currentRound.number,
      blueTasksCompleted: 0,
      blueTasksTotal: 0,
      redTasksCompleted: 0,
      redTasksTotal: 0,
      blueStressChange: 0,
      redStressChange: 0,
      rapportChange: 0,
      incomeReceived: financialState.lastPaycheckAmount,
      runningBalance: financialState.balance,
    };

    this.endRound(summary);
  }

  /**
   * Clean up resources (call when destroying RoundManager)
   */
  public destroy(): void {
    this.stopTimer();
  }
}
