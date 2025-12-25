/**
 * Role Selection Integration Tests
 *
 * Tests the complete role selection flow from game start to PLAYING state.
 * Story: 001-03 (Role Selection Screen)
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { UIManager } from '../UIManager';
import { EventBus } from '../../../data/events/eventBus';
import { GameStateMachine } from '../../../systems/core/stateMachine/GameStateMachine';
import { EntityStore } from '../../../data/state/entityStore';
import type { GameState } from '../../../data/state/gameState';

describe('Role Selection Integration', () => {
  let uiManager: UIManager;
  let eventBus: EventBus;
  let stateMachine: GameStateMachine;
  let entityStore: EntityStore;
  let rootElement: HTMLElement;

  // Create initial game state for tests
  const createInitialState = (): GameState => ({
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
    gamePhase: 'LOADING',
    blueBall: {
      id: 'blue',
      role: 'blue',
      position: { x: -2, y: 1, z: 0 },
      velocity: { x: 0, y: 0, z: 0 },
      stress: 0,
      currentTask: null,
      isAI: true,
    },
    redBall: {
      id: 'red',
      role: 'red',
      position: { x: 2, y: 1, z: 0 },
      velocity: { x: 0, y: 0, z: 0 },
      stress: 0,
      currentTask: null,
      isAI: true,
    },
    blueTasks: new Map(),
    redTasks: new Map(),
    financialState: {
      balance: 10000,
      lastPaycheckAmount: 0,
      totalIncome: 0,
      totalExpenses: 0,
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
  });

  beforeEach(() => {
    // Create test root element
    rootElement = document.createElement('div');
    document.body.appendChild(rootElement);

    // Initialize dependencies
    eventBus = new EventBus();
    stateMachine = new GameStateMachine(eventBus, 'LOADING');
    entityStore = new EntityStore(createInitialState());

    // Create UIManager with test root
    uiManager = new UIManager(eventBus, stateMachine, entityStore, {
      rootElement,
    });
  });

  afterEach(() => {
    uiManager.destroy();
    document.body.removeChild(rootElement);
  });

  describe('Complete Blue Ball Selection Flow', () => {
    it('should complete entire flow: LOADING -> ROLE_SELECT -> Blue selection -> PLAYING', () => {
      // Step 1: Verify initial state
      expect(stateMachine.getState()).toBe('LOADING');
      expect(entityStore.getState().playerRole).toBe('blue');
      expect(entityStore.getState().blueBall.isAI).toBe(true);
      expect(entityStore.getState().redBall.isAI).toBe(true);

      // Step 2: UI overlay should be hidden initially
      const overlay = rootElement.querySelector(
        '#role-selection-overlay'
      ) as HTMLElement;
      expect(overlay.style.display).toBe('none');

      // Step 3: Transition to ROLE_SELECT
      stateMachine.startGame(); // LOADING -> SCENARIO_SELECT
      stateMachine.selectScenario(); // SCENARIO_SELECT -> ROLE_SELECT

      // Step 4: Verify state and UI overlay is now shown
      expect(stateMachine.getState()).toBe('ROLE_SELECT');
      expect(overlay.style.display).toBe('flex');

      // Step 5: Click blue ball button
      const blueButton = rootElement.querySelector(
        '#select-blue-ball'
      ) as HTMLButtonElement;
      blueButton.click();

      // Step 6: Verify complete state after selection
      expect(entityStore.getState().playerRole).toBe('blue');
      expect(entityStore.getState().blueBall.isAI).toBe(false);
      expect(entityStore.getState().redBall.isAI).toBe(true);
      expect(stateMachine.getState()).toBe('PLAYING');

      // Step 7: Verify UI overlay is hidden
      expect(overlay.style.display).toBe('none');
    });
  });

  describe('Complete Red Ball Selection Flow', () => {
    it('should complete entire flow: LOADING -> ROLE_SELECT -> Red selection -> PLAYING', () => {
      // Step 1: Verify initial state
      expect(stateMachine.getState()).toBe('LOADING');
      expect(entityStore.getState().playerRole).toBe('blue');
      expect(entityStore.getState().blueBall.isAI).toBe(true);
      expect(entityStore.getState().redBall.isAI).toBe(true);

      // Step 2: UI overlay should be hidden initially
      const overlay = rootElement.querySelector(
        '#role-selection-overlay'
      ) as HTMLElement;
      expect(overlay.style.display).toBe('none');

      // Step 3: Transition to ROLE_SELECT
      stateMachine.startGame(); // LOADING -> SCENARIO_SELECT
      stateMachine.selectScenario(); // SCENARIO_SELECT -> ROLE_SELECT

      // Step 4: Verify state and UI overlay is now shown
      expect(stateMachine.getState()).toBe('ROLE_SELECT');
      expect(overlay.style.display).toBe('flex');

      // Step 5: Click red ball button
      const redButton = rootElement.querySelector(
        '#select-red-ball'
      ) as HTMLButtonElement;
      redButton.click();

      // Step 6: Verify complete state after selection
      expect(entityStore.getState().playerRole).toBe('red');
      expect(entityStore.getState().blueBall.isAI).toBe(true);
      expect(entityStore.getState().redBall.isAI).toBe(false);
      expect(stateMachine.getState()).toBe('PLAYING');

      // Step 7: Verify UI overlay is hidden
      expect(overlay.style.display).toBe('none');
    });
  });

  describe('Event Emission During Flow', () => {
    it('should emit role:selected event with correct payload', () => {
      // Track all emitted events
      const emittedEvents: Array<{ event: string; payload: unknown }> = [];

      eventBus.on('role:selected', (payload) => {
        emittedEvents.push({ event: 'role:selected', payload });
      });

      // Transition to ROLE_SELECT and select blue
      stateMachine.startGame();
      stateMachine.selectScenario();

      const blueButton = rootElement.querySelector(
        '#select-blue-ball'
      ) as HTMLButtonElement;
      blueButton.click();

      // Verify role:selected event was emitted
      expect(emittedEvents).toHaveLength(1);
      expect(emittedEvents[0]).toEqual({
        event: 'role:selected',
        payload: { role: 'blue' },
      });
    });

    it('should emit game:stateChanged events during transitions', () => {
      const stateChanges: string[] = [];

      eventBus.on('game:stateChanged', ({ newState }) => {
        stateChanges.push(newState);
      });

      // Complete flow
      stateMachine.startGame();
      stateMachine.selectScenario();

      const blueButton = rootElement.querySelector(
        '#select-blue-ball'
      ) as HTMLButtonElement;
      blueButton.click();

      // Verify state transitions
      expect(stateChanges).toEqual([
        'SCENARIO_SELECT', // LOADING -> SCENARIO_SELECT
        'ROLE_SELECT', // SCENARIO_SELECT -> ROLE_SELECT
        'PLAYING', // ROLE_SELECT -> PLAYING
      ]);
    });
  });

  describe('Re-selection After Restart', () => {
    it('should allow changing role selection after restart', () => {
      // Initial flow: select blue
      stateMachine.startGame();
      stateMachine.selectScenario();

      const blueButton = rootElement.querySelector(
        '#select-blue-ball'
      ) as HTMLButtonElement;
      blueButton.click();

      expect(entityStore.getState().playerRole).toBe('blue');
      expect(entityStore.getState().blueBall.isAI).toBe(false);
      expect(stateMachine.getState()).toBe('PLAYING');

      // Simulate restart by showing role selection again
      uiManager.showRoleSelectionScreen();

      const overlay = rootElement.querySelector(
        '#role-selection-overlay'
      ) as HTMLElement;
      expect(overlay.style.display).toBe('flex');

      // Second selection: choose red
      const redButton = rootElement.querySelector(
        '#select-red-ball'
      ) as HTMLButtonElement;
      redButton.click();

      // Verify role changed
      expect(entityStore.getState().playerRole).toBe('red');
      expect(entityStore.getState().blueBall.isAI).toBe(true);
      expect(entityStore.getState().redBall.isAI).toBe(false);
    });
  });
});
