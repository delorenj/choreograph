/**
 * UIManager Unit Tests
 *
 * Tests for role selection UI, state management, and event handling.
 * Story: 001-03 (Role Selection Screen)
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { UIManager } from '../UIManager';
import { EventBus } from '../../../data/events/eventBus';
import { GameStateMachine } from '../../../systems/core/stateMachine/GameStateMachine';
import { EntityStore } from '../../../data/state/entityStore';
import type { GameState } from '../../../data/state/gameState';

describe('UIManager', () => {
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

  describe('Initialization', () => {
    it('should create role selection overlay on initialization', () => {
      const overlay = rootElement.querySelector('#role-selection-overlay');
      expect(overlay).not.toBeNull();
    });

    it('should hide role selection overlay by default', () => {
      const overlay = rootElement.querySelector('#role-selection-overlay') as HTMLElement;
      expect(overlay.style.display).toBe('none');
    });

    it('should create blue ball button', () => {
      const blueButton = rootElement.querySelector('#select-blue-ball');
      expect(blueButton).not.toBeNull();
      expect(blueButton?.textContent).toContain('Play as Blue Ball');
    });

    it('should create red ball button', () => {
      const redButton = rootElement.querySelector('#select-red-ball');
      expect(redButton).not.toBeNull();
      expect(redButton?.textContent).toContain('Play as Red Ball');
    });

    it('should have accessible button labels', () => {
      const blueButton = rootElement.querySelector('#select-blue-ball');
      const redButton = rootElement.querySelector('#select-red-ball');

      expect(blueButton?.getAttribute('aria-label')).toBe('Play as Blue Ball');
      expect(redButton?.getAttribute('aria-label')).toBe('Play as Red Ball');
    });
  });

  describe('State Changes', () => {
    it('should show role selection when transitioning to ROLE_SELECT', () => {
      // Transition to ROLE_SELECT state
      stateMachine.startGame(); // LOADING -> SCENARIO_SELECT
      stateMachine.selectScenario(); // SCENARIO_SELECT -> ROLE_SELECT

      const overlay = rootElement.querySelector('#role-selection-overlay') as HTMLElement;
      expect(overlay.style.display).toBe('flex');
    });

    it('should hide role selection when transitioning to PLAYING', () => {
      // First show it
      stateMachine.startGame();
      stateMachine.selectScenario();

      // Then transition to PLAYING
      stateMachine.selectRole();

      const overlay = rootElement.querySelector('#role-selection-overlay') as HTMLElement;
      expect(overlay.style.display).toBe('none');
    });

    it('should hide role selection when transitioning to PAUSED', () => {
      // Show role selection
      stateMachine.startGame();
      stateMachine.selectScenario();

      // Go to PLAYING first, then PAUSED
      stateMachine.selectRole();
      stateMachine.pause();

      const overlay = rootElement.querySelector('#role-selection-overlay') as HTMLElement;
      expect(overlay.style.display).toBe('none');
    });
  });

  describe('Role Selection - Blue Ball', () => {
    it('should set playerRole to blue when blue button clicked', () => {
      const blueButton = rootElement.querySelector('#select-blue-ball') as HTMLButtonElement;

      blueButton.click();

      expect(entityStore.getState().playerRole).toBe('blue');
    });

    it('should set blue ball isAI to false when blue selected', () => {
      const blueButton = rootElement.querySelector('#select-blue-ball') as HTMLButtonElement;

      blueButton.click();

      expect(entityStore.getState().blueBall.isAI).toBe(false);
    });

    it('should set red ball isAI to true when blue selected', () => {
      const blueButton = rootElement.querySelector('#select-blue-ball') as HTMLButtonElement;

      blueButton.click();

      expect(entityStore.getState().redBall.isAI).toBe(true);
    });

    it('should emit role:selected event when blue button clicked', () => {
      const roleSelectedSpy = vi.fn();
      eventBus.on('role:selected', roleSelectedSpy);

      const blueButton = rootElement.querySelector('#select-blue-ball') as HTMLButtonElement;
      blueButton.click();

      expect(roleSelectedSpy).toHaveBeenCalledWith({ role: 'blue' });
    });

    it('should transition to PLAYING state when blue button clicked', () => {
      // Setup state machine in ROLE_SELECT
      stateMachine.startGame();
      stateMachine.selectScenario();

      const blueButton = rootElement.querySelector('#select-blue-ball') as HTMLButtonElement;
      blueButton.click();

      expect(stateMachine.getState()).toBe('PLAYING');
    });
  });

  describe('Role Selection - Red Ball', () => {
    it('should set playerRole to red when red button clicked', () => {
      const redButton = rootElement.querySelector('#select-red-ball') as HTMLButtonElement;

      redButton.click();

      expect(entityStore.getState().playerRole).toBe('red');
    });

    it('should set red ball isAI to false when red selected', () => {
      const redButton = rootElement.querySelector('#select-red-ball') as HTMLButtonElement;

      redButton.click();

      expect(entityStore.getState().redBall.isAI).toBe(false);
    });

    it('should set blue ball isAI to true when red selected', () => {
      const redButton = rootElement.querySelector('#select-red-ball') as HTMLButtonElement;

      redButton.click();

      expect(entityStore.getState().blueBall.isAI).toBe(true);
    });

    it('should emit role:selected event when red button clicked', () => {
      const roleSelectedSpy = vi.fn();
      eventBus.on('role:selected', roleSelectedSpy);

      const redButton = rootElement.querySelector('#select-red-ball') as HTMLButtonElement;
      redButton.click();

      expect(roleSelectedSpy).toHaveBeenCalledWith({ role: 'red' });
    });

    it('should transition to PLAYING state when red button clicked', () => {
      // Setup state machine in ROLE_SELECT
      stateMachine.startGame();
      stateMachine.selectScenario();

      const redButton = rootElement.querySelector('#select-red-ball') as HTMLButtonElement;
      redButton.click();

      expect(stateMachine.getState()).toBe('PLAYING');
    });
  });

  describe('Restart Functionality', () => {
    it('should have public method to show role selection', () => {
      expect(typeof uiManager.showRoleSelectionScreen).toBe('function');
    });

    it('should show role selection when showRoleSelectionScreen called', () => {
      uiManager.showRoleSelectionScreen();

      const overlay = rootElement.querySelector('#role-selection-overlay') as HTMLElement;
      expect(overlay.style.display).toBe('flex');
    });

    it('should allow re-selection after restart', () => {
      // First selection
      const blueButton = rootElement.querySelector('#select-blue-ball') as HTMLButtonElement;
      blueButton.click();
      expect(entityStore.getState().playerRole).toBe('blue');

      // Show role selection again (simulating restart)
      uiManager.showRoleSelectionScreen();

      // Second selection
      const redButton = rootElement.querySelector('#select-red-ball') as HTMLButtonElement;
      redButton.click();
      expect(entityStore.getState().playerRole).toBe('red');
    });
  });

  describe('Cleanup', () => {
    it('should remove overlay when destroyed', () => {
      uiManager.destroy();

      const overlay = rootElement.querySelector('#role-selection-overlay');
      expect(overlay).toBeNull();
    });
  });

  describe('Visual Elements', () => {
    it('should have role selection title', () => {
      const title = rootElement.querySelector('.role-selection-title');
      expect(title).not.toBeNull();
      expect(title?.textContent).toContain('Choose Your Role');
    });

    it('should have blue ball icon', () => {
      const blueIcon = rootElement.querySelector('#select-blue-ball .role-button-icon');
      expect(blueIcon).not.toBeNull();
      expect(blueIcon?.textContent).toBe('🔵');
    });

    it('should have red ball icon', () => {
      const redIcon = rootElement.querySelector('#select-red-ball .role-button-icon');
      expect(redIcon).not.toBeNull();
      expect(redIcon?.textContent).toBe('🔴');
    });

    it('should have blue ball subtitle', () => {
      const blueSubtitle = rootElement.querySelector('#select-blue-ball .role-button-subtitle');
      expect(blueSubtitle).not.toBeNull();
      expect(blueSubtitle?.textContent).toContain('Employment Simulation');
    });

    it('should have red ball subtitle', () => {
      const redSubtitle = rootElement.querySelector('#select-red-ball .role-button-subtitle');
      expect(redSubtitle).not.toBeNull();
      expect(redSubtitle?.textContent).toContain('Household Simulation');
    });
  });
});
