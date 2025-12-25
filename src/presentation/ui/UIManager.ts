/**
 * UIManager
 *
 * Manages all DOM-based UI overlays (role selection, summary, modals).
 * Observes game state and shows/hides UI elements accordingly.
 *
 * Story: 001-03 (Role Selection Screen)
 * Based on Architecture Document Section 5.4 (UI Layer)
 */

import { EventBus } from '../../data/events/eventBus';
import { GameStateMachine } from '../../systems/core/stateMachine/GameStateMachine';
import { EntityStore } from '../../data/state/entityStore';

export interface UIManagerConfig {
  rootElement?: HTMLElement;
}

/**
 * UIManager handles all DOM-based UI
 */
export class UIManager {
  private readonly eventBus: EventBus;
  private readonly stateMachine: GameStateMachine;
  private readonly entityStore: EntityStore;
  private readonly rootElement: HTMLElement;

  // UI Elements
  private roleSelectionOverlay: HTMLElement | null = null;

  constructor(
    eventBus: EventBus,
    stateMachine: GameStateMachine,
    entityStore: EntityStore,
    config: UIManagerConfig = {}
  ) {
    this.eventBus = eventBus;
    this.stateMachine = stateMachine;
    this.entityStore = entityStore;
    this.rootElement = config.rootElement || document.body;

    this.initializeUI();
    this.subscribeToEvents();
  }

  /**
   * Initialize all UI elements
   */
  private initializeUI(): void {
    this.createRoleSelectionOverlay();
  }

  /**
   * Subscribe to relevant game events
   */
  private subscribeToEvents(): void {
    // Listen for state changes to show/hide UI
    this.eventBus.on('game:stateChanged', ({ newState }) => {
      this.updateUI(newState);
    });
  }

  /**
   * Update UI visibility based on game state
   */
  private updateUI(gameState: string): void {
    switch (gameState) {
      case 'ROLE_SELECT':
        this.showRoleSelection();
        break;
      case 'PLAYING':
      case 'PAUSED':
      case 'EMPATHY_MODAL':
      case 'ROUND_SUMMARY':
      case 'GAME_OVER':
        this.hideRoleSelection();
        break;
      default:
        break;
    }
  }

  /**
   * Create the role selection overlay
   */
  private createRoleSelectionOverlay(): void {
    const overlay = document.createElement('div');
    overlay.id = 'role-selection-overlay';
    overlay.className = 'ui-overlay';
    overlay.style.display = 'none'; // Hidden by default

    overlay.innerHTML = `
      <div class="role-selection-container">
        <h1 class="role-selection-title">Choose Your Role</h1>
        <div class="role-selection-buttons">
          <button
            id="select-blue-ball"
            class="role-button role-button-blue"
            aria-label="Play as Blue Ball">
            <div class="role-button-icon">🔵</div>
            <div class="role-button-text">Play as Blue Ball</div>
            <div class="role-button-subtitle">Employment Simulation</div>
          </button>
          <button
            id="select-red-ball"
            class="role-button role-button-red"
            aria-label="Play as Red Ball">
            <div class="role-button-icon">🔴</div>
            <div class="role-button-text">Play as Red Ball</div>
            <div class="role-button-subtitle">Household Simulation</div>
          </button>
        </div>
      </div>
    `;

    this.rootElement.appendChild(overlay);
    this.roleSelectionOverlay = overlay;

    // Attach event listeners
    const blueButton = overlay.querySelector('#select-blue-ball');
    const redButton = overlay.querySelector('#select-red-ball');

    if (blueButton) {
      blueButton.addEventListener('click', () => this.selectRole('blue'));
    }

    if (redButton) {
      redButton.addEventListener('click', () => this.selectRole('red'));
    }
  }

  /**
   * Handle role selection
   */
  private selectRole(role: 'blue' | 'red'): void {
    // Update player role in entity store
    this.entityStore.setPlayerRole(role);

    // Update ball AI flags based on selection
    if (role === 'blue') {
      this.entityStore.updateBlueBall({ isAI: false });
      this.entityStore.updateRedBall({ isAI: true });
    } else {
      this.entityStore.updateBlueBall({ isAI: true });
      this.entityStore.updateRedBall({ isAI: false });
    }

    // Emit role selection event
    this.eventBus.emit('role:selected', { role });

    // Transition state machine to PLAYING
    this.stateMachine.selectRole();
  }

  /**
   * Show role selection overlay
   */
  private showRoleSelection(): void {
    if (this.roleSelectionOverlay) {
      this.roleSelectionOverlay.style.display = 'flex';
    }
  }

  /**
   * Hide role selection overlay
   */
  private hideRoleSelection(): void {
    if (this.roleSelectionOverlay) {
      this.roleSelectionOverlay.style.display = 'none';
    }
  }

  /**
   * Show role selection (public method for restart)
   */
  public showRoleSelectionScreen(): void {
    this.showRoleSelection();
  }

  /**
   * Destroy UI manager and clean up
   */
  public destroy(): void {
    // Remove all UI elements
    if (this.roleSelectionOverlay) {
      this.roleSelectionOverlay.remove();
      this.roleSelectionOverlay = null;
    }
  }
}
