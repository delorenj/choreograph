/**
 * FinancialManager Unit and Integration Tests
 *
 * Tests for household financial management including paychecks, income tracking, and balance updates.
 * Story: 001-04 (Paycheck Cycle Integration)
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { FinancialManager, FinancialManagerConfig } from '../FinancialManager';
import { EventBus } from '../../../../data/events/eventBus';

describe('FinancialManager', () => {
  let financialManager: FinancialManager;
  let eventBus: EventBus;
  let emitSpy: ReturnType<typeof vi.fn>;
  let config: FinancialManagerConfig;

  beforeEach(() => {
    eventBus = new EventBus();
    emitSpy = vi.spyOn(eventBus, 'emit');

    config = {
      startingBalance: 10000,
      bluePaycheck: 6250,
      redIncome: 0,
    };

    financialManager = new FinancialManager(eventBus, config);
  });

  describe('Initialization', () => {
    it('should initialize with starting balance', () => {
      const state = financialManager.getState();
      expect(state.balance).toBe(10000);
      expect(state.lastPaycheckAmount).toBe(0);
      expect(state.totalIncome).toBe(0);
      expect(state.totalExpenses).toBe(0);
    });

    it('should return readonly state', () => {
      const state1 = financialManager.getState();
      const state2 = financialManager.getState();
      expect(state1).toEqual(state2);
      expect(state1).not.toBe(state2); // Different instances
    });

    it('should initialize balance accessor', () => {
      expect(financialManager.getBalance()).toBe(10000);
    });
  });

  describe('Blue Ball Paycheck Processing', () => {
    it('should process Blue Ball paycheck correctly', () => {
      financialManager.processBluePaycheck();

      const state = financialManager.getState();
      expect(state.lastPaycheckAmount).toBe(6250);
      expect(state.totalIncome).toBe(6250);
      expect(state.balance).toBe(16250); // 10000 + 6250
    });

    it('should emit paycheckReceived event', () => {
      financialManager.processBluePaycheck();

      expect(emitSpy).toHaveBeenCalledWith('financial:paycheckReceived', {
        amount: 6250,
        balance: 16250,
      });
    });

    it('should accumulate multiple paychecks', () => {
      financialManager.processBluePaycheck();
      financialManager.clearLastPaycheck();
      financialManager.processBluePaycheck();

      const state = financialManager.getState();
      expect(state.totalIncome).toBe(12500); // 6250 * 2
      expect(state.balance).toBe(22500); // 10000 + 12500
    });

    it('should track last paycheck amount', () => {
      financialManager.processBluePaycheck();
      expect(financialManager.getLastPaycheckAmount()).toBe(6250);

      financialManager.clearLastPaycheck();
      expect(financialManager.getLastPaycheckAmount()).toBe(0);

      financialManager.processBluePaycheck();
      expect(financialManager.getLastPaycheckAmount()).toBe(6250);
    });
  });

  describe('Red Ball Income Processing', () => {
    beforeEach(() => {
      // Update config to include Red income
      config.redIncome = 3125;
      financialManager = new FinancialManager(eventBus, config);
      emitSpy.mockClear();
    });

    it('should process Red Ball income correctly', () => {
      financialManager.processRedIncome();

      const state = financialManager.getState();
      expect(state.lastPaycheckAmount).toBe(3125);
      expect(state.totalIncome).toBe(3125);
      expect(state.balance).toBe(13125); // 10000 + 3125
    });

    it('should emit redIncomeReceived event', () => {
      financialManager.processRedIncome();

      expect(emitSpy).toHaveBeenCalledWith('financial:redIncomeReceived', {
        amount: 3125,
        balance: 13125,
      });
    });

    it('should add Red income to existing paycheck', () => {
      financialManager.processBluePaycheck();
      emitSpy.mockClear();

      financialManager.processRedIncome();

      const state = financialManager.getState();
      expect(state.lastPaycheckAmount).toBe(9375); // 6250 + 3125
      expect(state.totalIncome).toBe(9375);
      expect(state.balance).toBe(19375); // 10000 + 6250 + 3125
    });
  });

  describe('Round End Processing', () => {
    it('should process paycheck round correctly', () => {
      const roundNumber = 2; // Even number = paycheck round
      const isRedEmployed = false;
      const paycheckInterval = 2;

      financialManager.processRoundEnd(roundNumber, isRedEmployed, paycheckInterval);

      const state = financialManager.getState();
      expect(state.lastPaycheckAmount).toBe(6250);
      expect(state.balance).toBe(16250);
    });

    it('should process non-paycheck round correctly', () => {
      const roundNumber = 1; // Odd number = no paycheck
      const isRedEmployed = false;
      const paycheckInterval = 2;

      financialManager.processRoundEnd(roundNumber, isRedEmployed, paycheckInterval);

      const state = financialManager.getState();
      expect(state.lastPaycheckAmount).toBe(0);
      expect(state.balance).toBe(10000); // No change
    });

    it('should clear previous paycheck before processing', () => {
      // Round 2: paycheck
      financialManager.processRoundEnd(2, false, 2);
      expect(financialManager.getLastPaycheckAmount()).toBe(6250);

      // Round 3: no paycheck
      financialManager.processRoundEnd(3, false, 2);
      expect(financialManager.getLastPaycheckAmount()).toBe(0);
    });

    it('should handle Red employment with paycheck round', () => {
      config.redIncome = 3125;
      financialManager = new FinancialManager(eventBus, config);

      const roundNumber = 2; // Paycheck round
      const isRedEmployed = true;
      const paycheckInterval = 2;

      financialManager.processRoundEnd(roundNumber, isRedEmployed, paycheckInterval);

      const state = financialManager.getState();
      expect(state.lastPaycheckAmount).toBe(9375); // 6250 + 3125
      expect(state.balance).toBe(19375); // 10000 + 9375
    });

    it('should handle Red employment with non-paycheck round', () => {
      config.redIncome = 3125;
      financialManager = new FinancialManager(eventBus, config);

      const roundNumber = 3; // Non-paycheck round
      const isRedEmployed = true;
      const paycheckInterval = 2;

      financialManager.processRoundEnd(roundNumber, isRedEmployed, paycheckInterval);

      const state = financialManager.getState();
      expect(state.lastPaycheckAmount).toBe(3125); // Only Red income
      expect(state.balance).toBe(13125); // 10000 + 3125
    });
  });

  describe('Round Income Calculation', () => {
    it('should calculate income for paycheck round (no Red employment)', () => {
      const income = financialManager.calculateRoundIncome(2, false, 2);
      expect(income).toBe(6250); // Blue paycheck only
    });

    it('should calculate income for non-paycheck round (no Red employment)', () => {
      const income = financialManager.calculateRoundIncome(1, false, 2);
      expect(income).toBe(0); // No income
    });

    it('should calculate income for paycheck round with Red employment', () => {
      config.redIncome = 3125;
      financialManager = new FinancialManager(eventBus, config);

      const income = financialManager.calculateRoundIncome(2, true, 2);
      expect(income).toBe(9375); // 6250 + 3125
    });

    it('should calculate income for non-paycheck round with Red employment', () => {
      config.redIncome = 3125;
      financialManager = new FinancialManager(eventBus, config);

      const income = financialManager.calculateRoundIncome(3, true, 2);
      expect(income).toBe(3125); // Red income only
    });

    it('should respect paycheck interval', () => {
      // Interval of 3 means paycheck on rounds 3, 6, 9, etc.
      expect(financialManager.calculateRoundIncome(1, false, 3)).toBe(0);
      expect(financialManager.calculateRoundIncome(2, false, 3)).toBe(0);
      expect(financialManager.calculateRoundIncome(3, false, 3)).toBe(6250);
      expect(financialManager.calculateRoundIncome(4, false, 3)).toBe(0);
      expect(financialManager.calculateRoundIncome(6, false, 3)).toBe(6250);
    });
  });

  describe('Expense Processing', () => {
    it('should process expenses correctly', () => {
      financialManager.processExpenses(500);

      const state = financialManager.getState();
      expect(state.totalExpenses).toBe(500);
      expect(state.balance).toBe(9500); // 10000 - 500
    });

    it('should emit expenseIncurred event', () => {
      financialManager.processExpenses(500);

      expect(emitSpy).toHaveBeenCalledWith('financial:expenseIncurred', {
        amount: 500,
        balance: 9500,
      });
    });

    it('should accumulate multiple expenses', () => {
      financialManager.processExpenses(300);
      financialManager.processExpenses(200);

      const state = financialManager.getState();
      expect(state.totalExpenses).toBe(500);
      expect(state.balance).toBe(9500);
    });
  });

  describe('State Reset', () => {
    it('should reset to initial state', () => {
      // Make some changes
      financialManager.processBluePaycheck();
      financialManager.processExpenses(1000);

      // Reset
      financialManager.reset();

      const state = financialManager.getState();
      expect(state.balance).toBe(10000);
      expect(state.lastPaycheckAmount).toBe(0);
      expect(state.totalIncome).toBe(0);
      expect(state.totalExpenses).toBe(0);
    });
  });

  describe('Integration: Multi-Round Paycheck Cycle', () => {
    it('should correctly process 4 rounds with biweekly paychecks', () => {
      const paycheckInterval = 2;
      const isRedEmployed = false;

      // Round 1: No paycheck
      financialManager.processRoundEnd(1, isRedEmployed, paycheckInterval);
      expect(financialManager.getBalance()).toBe(10000);
      expect(financialManager.getLastPaycheckAmount()).toBe(0);

      // Round 2: Paycheck
      financialManager.processRoundEnd(2, isRedEmployed, paycheckInterval);
      expect(financialManager.getBalance()).toBe(16250);
      expect(financialManager.getLastPaycheckAmount()).toBe(6250);

      // Round 3: No paycheck
      financialManager.processRoundEnd(3, isRedEmployed, paycheckInterval);
      expect(financialManager.getBalance()).toBe(16250);
      expect(financialManager.getLastPaycheckAmount()).toBe(0);

      // Round 4: Paycheck
      financialManager.processRoundEnd(4, isRedEmployed, paycheckInterval);
      expect(financialManager.getBalance()).toBe(22500);
      expect(financialManager.getLastPaycheckAmount()).toBe(6250);

      const finalState = financialManager.getState();
      expect(finalState.totalIncome).toBe(12500); // 2 paychecks
      expect(finalState.totalExpenses).toBe(0);
    });

    it('should correctly process rounds with Red employment event on round 3', () => {
      config.redIncome = 3125;
      financialManager = new FinancialManager(eventBus, config);
      const paycheckInterval = 2;

      // Round 1: No paycheck, no Red employment
      financialManager.processRoundEnd(1, false, paycheckInterval);
      expect(financialManager.getBalance()).toBe(10000);

      // Round 2: Paycheck, no Red employment
      financialManager.processRoundEnd(2, false, paycheckInterval);
      expect(financialManager.getBalance()).toBe(16250);

      // Round 3: No paycheck, Red gets employed
      financialManager.processRoundEnd(3, true, paycheckInterval);
      expect(financialManager.getBalance()).toBe(19375); // 16250 + 3125
      expect(financialManager.getLastPaycheckAmount()).toBe(3125);

      // Round 4: Paycheck + Red income
      financialManager.processRoundEnd(4, true, paycheckInterval);
      expect(financialManager.getBalance()).toBe(28750); // 19375 + 6250 + 3125
      expect(financialManager.getLastPaycheckAmount()).toBe(9375);

      const finalState = financialManager.getState();
      expect(finalState.totalIncome).toBe(18750); // 6250*2 + 3125*2
    });
  });
});
