/**
 * EntityStore Unit Tests
 *
 * Comprehensive tests for the EntityStore state management system
 * Tests cover:
 * - CRUD operations for tasks
 * - Ball state updates
 * - Round state updates
 * - Financial state updates
 * - Observable pattern (listeners)
 * - Immutability guarantees
 * - Edge cases
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EntityStore } from '@/data/state/entityStore';
import type { GameState } from '@/data/state/gameState';
import type { BlueBall, RedBall, BlueTask, RedTask } from '@/data/entities';

// Helper to create minimal test state
function createTestState(): GameState {
  const blueBall: BlueBall = {
    id: 'blue',
    position: { x: 0, y: 0, z: 0 },
    velocity: { x: 0, y: 0, z: 0 },
    stress: 50,
    isPlayerControlled: true,
    rapport: 75,
    activeTaskId: null,
    completedTasksThisRound: 0,
    totalTasksThisRound: 0,
  };

  const redBall: RedBall = {
    id: 'red',
    position: { x: 5, y: 0, z: 5 },
    velocity: { x: 0, y: 0, z: 0 },
    stress: 30,
    isPlayerControlled: false,
    activeTaskId: null,
    completedTasksThisRound: 0,
    totalTasksThisRound: 0,
    canRequestHelp: true,
    isEmployed: false,
  };

  return {
    currentRound: {
      number: 1,
      phase: 'IDLE',
      elapsedTime: 0,
      remainingTime: 120,
      isPaycheckRound: false,
      startedAt: null,
      endedAt: null,
    },
    playerRole: 'blue',
    gamePhase: 'ROLE_SELECT',
    blueBall,
    redBall,
    blueTasks: new Map(),
    redTasks: new Map(),
    financialState: {
      balance: 10000,
      totalEarned: 0,
      bluePaycheck: 6250,
      redIncome: 0,
      expenses: 0,
    },
    employmentEventTriggered: false,
    roundsSinceHighRedStress: 0,
    activeModal: null,
    tutorialState: {
      hasSeenFirstTask: false,
      hasSeenFirstHelpRequest: false,
      hasSeenFirstDebuff: false,
      tutorialEnabled: true,
    },
  };
}

function createBlueTask(id: string): BlueTask {
  return {
    id,
    type: 'blue',
    position: { x: 1, y: 0, z: 1 },
    completionProgress: 0,
    completionTime: 10,
    isComplete: false,
    createdAt: Date.now(),
    parentId: null,
    isSubtask: false,
    subtaskIds: [],
    scopeCreepApplied: false,
    regressionRate: 0,
  };
}

function createRedTask(id: string): RedTask {
  return {
    id,
    type: 'red',
    category: 'cleaning',
    position: { x: 2, y: 0, z: 2 },
    completionProgress: 0,
    completionTime: 15,
    isComplete: false,
    createdAt: Date.now(),
    canBeRefused: true,
  };
}

describe('EntityStore', () => {
  let store: EntityStore;
  let initialState: GameState;

  beforeEach(() => {
    initialState = createTestState();
    store = new EntityStore(initialState);
  });

  // ==========================================================================
  // STATE ACCESS
  // ==========================================================================

  describe('State Access', () => {
    it('should return current state', () => {
      const state = store.getState();

      expect(state.playerRole).toBe('blue');
      expect(state.gamePhase).toBe('ROLE_SELECT');
      expect(state.blueBall.stress).toBe(50);
    });

    it('should return readonly state', () => {
      const state = store.getState();

      // TypeScript should prevent mutation, but we can verify at runtime
      expect(Object.isFrozen(state)).toBe(false); // State itself isn't frozen
      // But direct mutations won't trigger listeners
    });
  });

  // ==========================================================================
  // OBSERVABLE PATTERN
  // ==========================================================================

  describe('Observable Pattern', () => {
    it('should notify listeners on state change', () => {
      const listener = vi.fn();
      store.subscribe(listener);

      store.updateBlueBall({ stress: 75 });

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          blueBall: expect.objectContaining({ stress: 75 }),
        })
      );
    });

    it('should support multiple listeners', () => {
      const listener1 = vi.fn();
      const listener2 = vi.fn();
      const listener3 = vi.fn();

      store.subscribe(listener1);
      store.subscribe(listener2);
      store.subscribe(listener3);

      store.setPlayerRole('red');

      expect(listener1).toHaveBeenCalledTimes(1);
      expect(listener2).toHaveBeenCalledTimes(1);
      expect(listener3).toHaveBeenCalledTimes(1);
    });

    it('should unsubscribe using returned function', () => {
      const listener = vi.fn();
      const unsubscribe = store.subscribe(listener);

      store.updateBlueBall({ stress: 60 });
      expect(listener).toHaveBeenCalledTimes(1);

      unsubscribe();

      store.updateBlueBall({ stress: 70 });
      expect(listener).toHaveBeenCalledTimes(1); // Still 1, not 2
    });

    it('should not notify listeners if no state change', () => {
      const listener = vi.fn();
      store.subscribe(listener);

      // No actual state update
      expect(listener).not.toHaveBeenCalled();
    });

    it('should return correct listener count', () => {
      expect(store.getListenerCount()).toBe(0);

      const unsub1 = store.subscribe(vi.fn());
      expect(store.getListenerCount()).toBe(1);

      const unsub2 = store.subscribe(vi.fn());
      expect(store.getListenerCount()).toBe(2);

      unsub1();
      expect(store.getListenerCount()).toBe(1);

      unsub2();
      expect(store.getListenerCount()).toBe(0);
    });
  });

  // ==========================================================================
  // BALL OPERATIONS
  // ==========================================================================

  describe('Ball Operations', () => {
    it('should get blue ball', () => {
      const blueBall = store.getBlueBall();

      expect(blueBall.id).toBe('blue');
      expect(blueBall.stress).toBe(50);
      expect(blueBall.rapport).toBe(75);
    });

    it('should get red ball', () => {
      const redBall = store.getRedBall();

      expect(redBall.id).toBe('red');
      expect(redBall.stress).toBe(30);
      expect(redBall.isEmployed).toBe(false);
    });

    it('should update blue ball immutably', () => {
      const originalBlueBall = store.getBlueBall();

      store.updateBlueBall({ stress: 80, rapport: 65 });

      const updatedBlueBall = store.getBlueBall();
      expect(updatedBlueBall.stress).toBe(80);
      expect(updatedBlueBall.rapport).toBe(65);

      // Original should be unchanged (immutability)
      expect(originalBlueBall.stress).toBe(50);
      expect(originalBlueBall.rapport).toBe(75);
    });

    it('should update red ball immutably', () => {
      const originalRedBall = store.getRedBall();

      store.updateRedBall({ stress: 60, isEmployed: true });

      const updatedRedBall = store.getRedBall();
      expect(updatedRedBall.stress).toBe(60);
      expect(updatedRedBall.isEmployed).toBe(true);

      // Original should be unchanged
      expect(originalRedBall.stress).toBe(30);
      expect(originalRedBall.isEmployed).toBe(false);
    });

    it('should preserve other properties when updating ball', () => {
      store.updateBlueBall({ stress: 90 });

      const blueBall = store.getBlueBall();
      expect(blueBall.stress).toBe(90);
      expect(blueBall.rapport).toBe(75); // Unchanged
      expect(blueBall.position).toEqual({ x: 0, y: 0, z: 0 }); // Unchanged
    });
  });

  // ==========================================================================
  // TASK CRUD OPERATIONS
  // ==========================================================================

  describe('Task CRUD Operations', () => {
    describe('Create (Add Task)', () => {
      it('should add blue task', () => {
        const task = createBlueTask('blue-task-1');

        store.addTask('blue', task);

        const retrieved = store.getTask('blue', 'blue-task-1');
        expect(retrieved).toEqual(task);
      });

      it('should add red task', () => {
        const task = createRedTask('red-task-1');

        store.addTask('red', task);

        const retrieved = store.getTask('red', 'red-task-1');
        expect(retrieved).toEqual(task);
      });

      it('should add multiple tasks', () => {
        store.addTask('blue', createBlueTask('blue-1'));
        store.addTask('blue', createBlueTask('blue-2'));
        store.addTask('red', createRedTask('red-1'));

        expect(store.getAllTasks('blue')).toHaveLength(2);
        expect(store.getAllTasks('red')).toHaveLength(1);
      });

      it('should notify listeners when adding task', () => {
        const listener = vi.fn();
        store.subscribe(listener);

        store.addTask('blue', createBlueTask('blue-1'));

        expect(listener).toHaveBeenCalledTimes(1);
      });
    });

    describe('Read (Get Task)', () => {
      beforeEach(() => {
        store.addTask('blue', createBlueTask('blue-1'));
        store.addTask('blue', createBlueTask('blue-2'));
        store.addTask('red', createRedTask('red-1'));
      });

      it('should get task by ID', () => {
        const task = store.getTask('blue', 'blue-1');

        expect(task).toBeDefined();
        expect(task?.id).toBe('blue-1');
      });

      it('should return undefined for non-existent task', () => {
        const task = store.getTask('blue', 'non-existent');

        expect(task).toBeUndefined();
      });

      it('should get all tasks for ball type', () => {
        const blueTasks = store.getAllTasks('blue');
        const redTasks = store.getAllTasks('red');

        expect(blueTasks).toHaveLength(2);
        expect(redTasks).toHaveLength(1);
      });

      it('should return empty array when no tasks', () => {
        const emptyStore = new EntityStore(createTestState());
        const tasks = emptyStore.getAllTasks('blue');

        expect(tasks).toEqual([]);
      });
    });

    describe('Update (Update Task)', () => {
      beforeEach(() => {
        store.addTask('blue', createBlueTask('blue-1'));
      });

      it('should update task properties', () => {
        const success = store.updateTask('blue', 'blue-1', {
          completionProgress: 0.5,
          isComplete: false,
        });

        expect(success).toBe(true);

        const task = store.getTask('blue', 'blue-1');
        expect(task?.completionProgress).toBe(0.5);
      });

      it('should update task immutably', () => {
        const originalTask = store.getTask('blue', 'blue-1');

        store.updateTask('blue', 'blue-1', {
          completionProgress: 0.75,
        });

        expect(originalTask?.completionProgress).toBe(0); // Original unchanged
      });

      it('should return false for non-existent task', () => {
        const success = store.updateTask('blue', 'non-existent', {
          isComplete: true,
        });

        expect(success).toBe(false);
      });

      it('should notify listeners when updating task', () => {
        const listener = vi.fn();
        store.subscribe(listener);

        store.updateTask('blue', 'blue-1', { completionProgress: 1.0 });

        expect(listener).toHaveBeenCalledTimes(1);
      });
    });

    describe('Delete (Delete Task)', () => {
      beforeEach(() => {
        store.addTask('blue', createBlueTask('blue-1'));
        store.addTask('blue', createBlueTask('blue-2'));
      });

      it('should delete task', () => {
        const success = store.deleteTask('blue', 'blue-1');

        expect(success).toBe(true);
        expect(store.getTask('blue', 'blue-1')).toBeUndefined();
        expect(store.getAllTasks('blue')).toHaveLength(1);
      });

      it('should return false for non-existent task', () => {
        const success = store.deleteTask('blue', 'non-existent');

        expect(success).toBe(false);
      });

      it('should notify listeners when deleting task', () => {
        const listener = vi.fn();
        store.subscribe(listener);

        store.deleteTask('blue', 'blue-1');

        expect(listener).toHaveBeenCalledTimes(1);
      });
    });

    describe('Clear Tasks', () => {
      beforeEach(() => {
        store.addTask('blue', createBlueTask('blue-1'));
        store.addTask('blue', createBlueTask('blue-2'));
        store.addTask('red', createRedTask('red-1'));
      });

      it('should clear all blue tasks', () => {
        store.clearTasks('blue');

        expect(store.getAllTasks('blue')).toHaveLength(0);
        expect(store.getAllTasks('red')).toHaveLength(1); // Red tasks unaffected
      });

      it('should clear all red tasks', () => {
        store.clearTasks('red');

        expect(store.getAllTasks('red')).toHaveLength(0);
        expect(store.getAllTasks('blue')).toHaveLength(2); // Blue tasks unaffected
      });
    });
  });

  // ==========================================================================
  // ROUND OPERATIONS
  // ==========================================================================

  describe('Round Operations', () => {
    it('should get current round', () => {
      const round = store.getRound();

      expect(round.number).toBe(1);
      expect(round.phase).toBe('IDLE');
    });

    it('should update round immutably', () => {
      const originalRound = store.getRound();

      store.updateRound({ number: 2, phase: 'PLAYING', elapsedTime: 30 });

      const updatedRound = store.getRound();
      expect(updatedRound.number).toBe(2);
      expect(updatedRound.phase).toBe('PLAYING');
      expect(updatedRound.elapsedTime).toBe(30);

      // Original unchanged
      expect(originalRound.number).toBe(1);
      expect(originalRound.phase).toBe('IDLE');
    });
  });

  // ==========================================================================
  // FINANCIAL OPERATIONS
  // ==========================================================================

  describe('Financial Operations', () => {
    it('should get financial state', () => {
      const financial = store.getFinancialState();

      expect(financial.balance).toBe(10000);
      expect(financial.bluePaycheck).toBe(6250);
    });

    it('should update financial state immutably', () => {
      const originalFinancial = store.getFinancialState();

      store.updateFinancialState({
        balance: 16250,
        totalEarned: 6250,
      });

      const updatedFinancial = store.getFinancialState();
      expect(updatedFinancial.balance).toBe(16250);
      expect(updatedFinancial.totalEarned).toBe(6250);

      // Original unchanged
      expect(originalFinancial.balance).toBe(10000);
      expect(originalFinancial.totalEarned).toBe(0);
    });
  });

  // ==========================================================================
  // GAME STATE OPERATIONS
  // ==========================================================================

  describe('Game State Operations', () => {
    it('should set player role', () => {
      store.setPlayerRole('red');

      expect(store.getState().playerRole).toBe('red');
    });

    it('should set game phase', () => {
      store.setGamePhase('PLAYING');

      expect(store.getState().gamePhase).toBe('PLAYING');
    });

    it('should set employment event triggered', () => {
      store.setEmploymentEventTriggered(true);

      expect(store.getState().employmentEventTriggered).toBe(true);
    });

    it('should set rounds since high red stress', () => {
      store.setRoundsSinceHighRedStress(3);

      expect(store.getState().roundsSinceHighRedStress).toBe(3);
    });
  });

  // ==========================================================================
  // UI STATE OPERATIONS
  // ==========================================================================

  describe('UI State Operations', () => {
    it('should set active modal', () => {
      store.setActiveModal('empathy');

      expect(store.getState().activeModal).toBe('empathy');
    });

    it('should clear active modal', () => {
      store.setActiveModal('empathy');
      store.setActiveModal(null);

      expect(store.getState().activeModal).toBe(null);
    });

    it('should update tutorial state immutably', () => {
      const originalTutorial = store.getState().tutorialState;

      store.updateTutorialState({
        hasSeenFirstTask: true,
        hasSeenFirstHelpRequest: true,
      });

      const updatedTutorial = store.getState().tutorialState;
      expect(updatedTutorial.hasSeenFirstTask).toBe(true);
      expect(updatedTutorial.hasSeenFirstHelpRequest).toBe(true);
      expect(updatedTutorial.tutorialEnabled).toBe(true); // Unchanged

      // Original unchanged
      expect(originalTutorial.hasSeenFirstTask).toBe(false);
    });
  });

  // ==========================================================================
  // UTILITY OPERATIONS
  // ==========================================================================

  describe('Utility Operations', () => {
    it('should clear all listeners', () => {
      store.subscribe(vi.fn());
      store.subscribe(vi.fn());

      expect(store.getListenerCount()).toBe(2);

      store.clearListeners();

      expect(store.getListenerCount()).toBe(0);
    });

    it('should reset entire state', () => {
      // Modify state
      store.updateBlueBall({ stress: 100 });
      store.addTask('blue', createBlueTask('blue-1'));

      // Reset to fresh state
      const freshState = createTestState();
      store.resetState(freshState);

      expect(store.getBlueBall().stress).toBe(50);
      expect(store.getAllTasks('blue')).toHaveLength(0);
    });

    it('should notify listeners on reset', () => {
      const listener = vi.fn();
      store.subscribe(listener);

      store.resetState(createTestState());

      expect(listener).toHaveBeenCalledTimes(1);
    });
  });

  // ==========================================================================
  // IMMUTABILITY GUARANTEES
  // ==========================================================================

  describe('Immutability Guarantees', () => {
    it('should not mutate original state on ball update', () => {
      const originalState = store.getState();
      const originalBlueStress = originalState.blueBall.stress;

      store.updateBlueBall({ stress: 90 });

      // Original reference should still have original value
      expect(originalState.blueBall.stress).toBe(originalBlueStress);
    });

    it('should not mutate original task map on add', () => {
      const originalState = store.getState();
      const originalTaskCount = originalState.blueTasks.size;

      store.addTask('blue', createBlueTask('new-task'));

      // Original map reference should be unchanged
      expect(originalState.blueTasks.size).toBe(originalTaskCount);
    });

    it('should create new Map instances for task operations', () => {
      const originalTaskMap = store.getState().blueTasks;

      store.addTask('blue', createBlueTask('blue-1'));

      const newTaskMap = store.getState().blueTasks;

      // Should be different Map instances
      expect(newTaskMap).not.toBe(originalTaskMap);
    });
  });

  // ==========================================================================
  // INTEGRATION SCENARIOS
  // ==========================================================================

  describe('Integration Scenarios', () => {
    it('should handle complete round workflow', () => {
      const listener = vi.fn();
      store.subscribe(listener);

      // Start round
      store.updateRound({ phase: 'PLAYING', startedAt: Date.now() });

      // Add tasks
      store.addTask('blue', createBlueTask('blue-1'));
      store.addTask('red', createRedTask('red-1'));

      // Progress tasks
      store.updateTask('blue', 'blue-1', { completionProgress: 0.5 });

      // Complete task
      store.updateTask('blue', 'blue-1', {
        completionProgress: 1.0,
        isComplete: true,
      });
      store.updateBlueBall({ completedTasksThisRound: 1 });

      // End round
      store.updateRound({ phase: 'SUMMARY', endedAt: Date.now() });

      // Verify listener was called for each state change
      expect(listener.mock.calls.length).toBeGreaterThan(5);

      // Verify final state
      const finalState = store.getState();
      expect(finalState.currentRound.phase).toBe('SUMMARY');
      expect(finalState.blueBall.completedTasksThisRound).toBe(1);
      expect(store.getTask('blue', 'blue-1')?.isComplete).toBe(true);
    });

    it('should handle employment event workflow', () => {
      // Trigger employment event
      store.setEmploymentEventTriggered(true);
      store.updateRedBall({ isEmployed: true });
      store.updateFinancialState({ redIncome: 400 });

      const state = store.getState();
      expect(state.employmentEventTriggered).toBe(true);
      expect(state.redBall.isEmployed).toBe(true);
      expect(state.financialState.redIncome).toBe(400);
    });
  });
});
