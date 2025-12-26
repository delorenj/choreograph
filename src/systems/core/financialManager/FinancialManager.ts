/**
 * Financial Manager
 *
 * Manages household finances including paychecks, income, expenses, and balance tracking.
 * Integrates with RoundManager to process paychecks on appropriate rounds.
 *
 * Story: 001-04 (Paycheck Cycle Integration)
 * Based on Architecture Document Section 5.2.2 (FinancialManager)
 */

import { EventBus } from '../../../data/events/eventBus';
import type { FinancialState } from '../../../data/entities';

export interface FinancialManagerConfig {
  startingBalance: number;
  bluePaycheck: number;
  redIncome: number;
}

/**
 * FinancialManager tracks income, expenses, and balance
 */
export class FinancialManager {
  private readonly eventBus: EventBus;
  private readonly config: FinancialManagerConfig;
  private state: FinancialState;

  constructor(eventBus: EventBus, config: FinancialManagerConfig) {
    this.eventBus = eventBus;
    this.config = config;

    // Initialize financial state
    this.state = {
      balance: config.startingBalance,
      lastPaycheckAmount: 0,
      totalIncome: 0,
      totalExpenses: 0,
    };
  }

  /**
   * Get current financial state (readonly)
   */
  public getState(): Readonly<FinancialState> {
    return { ...this.state };
  }

  /**
   * Get current balance
   */
  public getBalance(): number {
    return this.state.balance;
  }

  /**
   * Get last paycheck amount (0 if no paycheck last round)
   */
  public getLastPaycheckAmount(): number {
    return this.state.lastPaycheckAmount;
  }

  /**
   * Process Blue Ball paycheck
   * Called by RoundManager on paycheck rounds
   */
  public processBluePaycheck(): void {
    const paycheckAmount = this.config.bluePaycheck;

    // Update state
    this.state.lastPaycheckAmount = paycheckAmount;
    this.state.totalIncome += paycheckAmount;
    this.state.balance += paycheckAmount;

    // Emit event
    this.eventBus.emit('financial:paycheckReceived', {
      amount: paycheckAmount,
      balance: this.state.balance,
    });
  }

  /**
   * Process Red Ball income (after employment event)
   * Called by RoundManager every round after Red gets employed
   */
  public processRedIncome(): void {
    const incomeAmount = this.config.redIncome;

    // Update state (add to last paycheck amount for summary display)
    this.state.lastPaycheckAmount += incomeAmount;
    this.state.totalIncome += incomeAmount;
    this.state.balance += incomeAmount;

    // Emit event
    this.eventBus.emit('financial:redIncomeReceived', {
      amount: incomeAmount,
      balance: this.state.balance,
    });
  }

  /**
   * Clear last paycheck amount (called at start of new round)
   * Reset to 0 so non-paycheck rounds show 0 income
   */
  public clearLastPaycheck(): void {
    this.state.lastPaycheckAmount = 0;
  }

  /**
   * Process expenses (hidden mechanic, not yet implemented)
   * Placeholder for future story implementation
   */
  public processExpenses(amount: number): void {
    this.state.totalExpenses += amount;
    this.state.balance -= amount;

    this.eventBus.emit('financial:expenseIncurred', {
      amount,
      balance: this.state.balance,
    });
  }

  /**
   * Calculate income for a specific round
   * Used by RoundManager to populate round summary
   *
   * @param roundNumber - Round number to calculate income for
   * @param isRedEmployed - Whether Red Ball is currently employed
   * @param paycheckInterval - Number of rounds between Blue paychecks
   * @returns Total income for this round
   */
  public calculateRoundIncome(
    roundNumber: number,
    isRedEmployed: boolean,
    paycheckInterval: number
  ): number {
    let income = 0;

    // Blue paycheck on even-numbered rounds (based on interval)
    const isPaycheckRound = roundNumber % paycheckInterval === 0;
    if (isPaycheckRound) {
      income += this.config.bluePaycheck;
    }

    // Red income every round after employment event
    if (isRedEmployed) {
      income += this.config.redIncome;
    }

    return income;
  }

  /**
   * Process end of round financial updates
   * Called by RoundManager at round end
   *
   * @param roundNumber - Round number that just ended
   * @param isRedEmployed - Whether Red Ball is employed
   * @param paycheckInterval - Paycheck interval from config
   */
  public processRoundEnd(
    roundNumber: number,
    isRedEmployed: boolean,
    paycheckInterval: number
  ): void {
    // Clear previous paycheck
    this.clearLastPaycheck();

    // Process Blue paycheck if applicable
    const isPaycheckRound = roundNumber % paycheckInterval === 0;
    if (isPaycheckRound) {
      this.processBluePaycheck();
    }

    // Process Red income if employed
    if (isRedEmployed) {
      this.processRedIncome();
    }
  }

  /**
   * Reset financial state (for testing or game restart)
   */
  public reset(): void {
    this.state = {
      balance: this.config.startingBalance,
      lastPaycheckAmount: 0,
      totalIncome: 0,
      totalExpenses: 0,
    };
  }
}
