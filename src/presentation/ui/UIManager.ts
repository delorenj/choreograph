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
  private timerDisplay: HTMLElement | null = null;
  private roundSummaryOverlay: HTMLElement | null = null;

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
    this.createTimerDisplay();
    this.createRoundSummaryOverlay();
  }

  /**
   * Subscribe to relevant game events
   */
  private subscribeToEvents(): void {
    // Listen for state changes to show/hide UI
    this.eventBus.on('game:stateChanged', ({ newState }) => {
      this.updateUI(newState);
    });

    // Listen for timer ticks to update display
    this.eventBus.on('round:tick', ({ remainingTime, elapsedTime }) => {
      this.updateTimerDisplay(remainingTime);
    });

    // Listen for round start to show timer
    this.eventBus.on('round:start', ({ roundNumber, isPaycheckRound }) => {
      this.showTimerDisplay();
      this.updateRoundInfo(roundNumber, isPaycheckRound);
    });

    // Listen for round end to show summary
    this.eventBus.on('round:end', ({ roundNumber, summary }) => {
      this.hideTimerDisplay();
      this.showRoundSummary(summary);
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

    // Update ball player control flags based on selection
    if (role === 'blue') {
      this.entityStore.updateBlueBall({ isPlayerControlled: true });
      this.entityStore.updateRedBall({ isPlayerControlled: false });
    } else {
      this.entityStore.updateBlueBall({ isPlayerControlled: false });
      this.entityStore.updateRedBall({ isPlayerControlled: true });
    }

    // Emit role selection event
    this.eventBus.emit('role:selected', { role });

    // Transition state machine to PLAYING
    this.stateMachine.selectRole();
  }

  /**
   * Create the timer display HUD
   */
  private createTimerDisplay(): void {
    const timerHUD = document.createElement('div');
    timerHUD.id = 'timer-hud';
    timerHUD.className = 'timer-hud';
    timerHUD.style.display = 'none'; // Hidden until round starts

    timerHUD.innerHTML = `
      <div class="timer-container">
        <div class="timer-header">
          <span class="round-label">Round <span id="round-number">1</span></span>
          <span class="paycheck-indicator" id="paycheck-indicator" style="display: none;">💵 Paycheck Round</span>
        </div>
        <div class="timer-display">
          <span class="timer-label">Time Remaining:</span>
          <span class="timer-value" id="timer-value">2:00</span>
        </div>
      </div>
    `;

    this.rootElement.appendChild(timerHUD);
    this.timerDisplay = timerHUD;
  }

  /**
   * Update timer display with remaining time
   */
  private updateTimerDisplay(remainingSeconds: number): void {
    if (!this.timerDisplay) return;

    const timerValue = this.timerDisplay.querySelector('#timer-value');
    if (!timerValue) return;

    // Format as MM:SS
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    timerValue.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

    // Add warning class when time is running low
    if (remainingSeconds <= 30 && remainingSeconds > 10) {
      timerValue.classList.add('timer-warning');
      timerValue.classList.remove('timer-critical');
    } else if (remainingSeconds <= 10) {
      timerValue.classList.add('timer-critical');
      timerValue.classList.remove('timer-warning');
    } else {
      timerValue.classList.remove('timer-warning', 'timer-critical');
    }
  }

  /**
   * Update round info display
   */
  private updateRoundInfo(roundNumber: number, isPaycheckRound: boolean): void {
    if (!this.timerDisplay) return;

    const roundNumberSpan = this.timerDisplay.querySelector('#round-number');
    const paycheckIndicator = this.timerDisplay.querySelector('#paycheck-indicator');

    if (roundNumberSpan) {
      roundNumberSpan.textContent = roundNumber.toString();
    }

    if (paycheckIndicator) {
      paycheckIndicator.style.display = isPaycheckRound ? 'inline' : 'none';
    }
  }

  /**
   * Show timer display
   */
  private showTimerDisplay(): void {
    if (this.timerDisplay) {
      this.timerDisplay.style.display = 'block';
    }
  }

  /**
   * Hide timer display
   */
  private hideTimerDisplay(): void {
    if (this.timerDisplay) {
      this.timerDisplay.style.display = 'none';
    }
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
   * Create the round summary overlay
   */
  private createRoundSummaryOverlay(): void {
    const overlay = document.createElement('div');
    overlay.id = 'round-summary-overlay';
    overlay.className = 'ui-overlay';
    overlay.style.display = 'none'; // Hidden by default

    overlay.innerHTML = `
      <div class="round-summary-container">
        <h2 class="round-summary-title">
          Round <span id="summary-round-number">1</span> Complete
          <span class="paycheck-badge" id="summary-paycheck-badge" style="display: none;">💵 Paycheck!</span>
        </h2>
        <div class="round-summary-content">
          <div class="summary-section">
            <h3>Blue Ball (Employment)</h3>
            <p>Tasks Completed: <span id="blue-tasks-completed">0</span> / <span id="blue-tasks-total">0</span></p>
            <p>Stress Change: <span id="blue-stress-change">0</span></p>
          </div>
          <div class="summary-section">
            <h3>Red Ball (Household)</h3>
            <p>Tasks Completed: <span id="red-tasks-completed">0</span> / <span id="red-tasks-total">0</span></p>
            <p>Stress Change: <span id="red-stress-change">0</span></p>
          </div>
          <div class="summary-section">
            <h3>Relationship</h3>
            <p>Rapport Change: <span id="rapport-change">0</span></p>
          </div>
          <div class="summary-section">
            <h3>Finances</h3>
            <p id="income-line">
              <span id="income-label">Income Received:</span>
              $<span id="income-received">0</span>
            </p>
            <p>Current Balance: $<span id="running-balance">0</span></p>
          </div>
        </div>
        <button
          id="continue-to-next-round"
          class="continue-button"
          aria-label="Continue to next round">
          Continue to Next Round
        </button>
      </div>
    `;

    this.rootElement.appendChild(overlay);
    this.roundSummaryOverlay = overlay;

    // Attach event listener
    const continueButton = overlay.querySelector('#continue-to-next-round');
    if (continueButton) {
      continueButton.addEventListener('click', () => this.dismissRoundSummary());
    }
  }

  /**
   * Show round summary with data
   */
  private showRoundSummary(summary: any): void {
    if (!this.roundSummaryOverlay) return;

    // Determine if this is a paycheck round (income > 0)
    const isPaycheckRound = summary.incomeReceived > 0;

    // Update summary data
    const elements = {
      summaryRoundNumber: this.roundSummaryOverlay.querySelector('#summary-round-number'),
      paycheckBadge: this.roundSummaryOverlay.querySelector(
        '#summary-paycheck-badge'
      ) as HTMLElement,
      blueTasksCompleted: this.roundSummaryOverlay.querySelector('#blue-tasks-completed'),
      blueTasksTotal: this.roundSummaryOverlay.querySelector('#blue-tasks-total'),
      redTasksCompleted: this.roundSummaryOverlay.querySelector('#red-tasks-completed'),
      redTasksTotal: this.roundSummaryOverlay.querySelector('#red-tasks-total'),
      blueStressChange: this.roundSummaryOverlay.querySelector('#blue-stress-change'),
      redStressChange: this.roundSummaryOverlay.querySelector('#red-stress-change'),
      rapportChange: this.roundSummaryOverlay.querySelector('#rapport-change'),
      incomeLabel: this.roundSummaryOverlay.querySelector('#income-label'),
      incomeLine: this.roundSummaryOverlay.querySelector('#income-line') as HTMLElement,
      incomeReceived: this.roundSummaryOverlay.querySelector('#income-received'),
      runningBalance: this.roundSummaryOverlay.querySelector('#running-balance'),
    };

    if (elements.summaryRoundNumber) {
      elements.summaryRoundNumber.textContent = summary.roundNumber.toString();
    }

    // Show/hide paycheck badge
    if (elements.paycheckBadge) {
      elements.paycheckBadge.style.display = isPaycheckRound ? 'inline' : 'none';
    }

    // Update income line visibility and label
    if (elements.incomeLine) {
      // Only show income line on paycheck rounds
      elements.incomeLine.style.display = isPaycheckRound ? 'block' : 'none';
    }
    if (elements.incomeLabel) {
      elements.incomeLabel.textContent = isPaycheckRound
        ? 'Paycheck Received:'
        : 'Income Received:';
    }

    if (elements.blueTasksCompleted) {
      elements.blueTasksCompleted.textContent = summary.blueTasksCompleted.toString();
    }
    if (elements.blueTasksTotal) {
      elements.blueTasksTotal.textContent = summary.blueTasksTotal.toString();
    }
    if (elements.redTasksCompleted) {
      elements.redTasksCompleted.textContent = summary.redTasksCompleted.toString();
    }
    if (elements.redTasksTotal) {
      elements.redTasksTotal.textContent = summary.redTasksTotal.toString();
    }
    if (elements.blueStressChange) {
      const change = summary.blueStressChange;
      elements.blueStressChange.textContent = change >= 0 ? `+${change}` : change.toString();
    }
    if (elements.redStressChange) {
      const change = summary.redStressChange;
      elements.redStressChange.textContent = change >= 0 ? `+${change}` : change.toString();
    }
    if (elements.rapportChange) {
      const change = summary.rapportChange;
      elements.rapportChange.textContent = change >= 0 ? `+${change}` : change.toString();
    }
    if (elements.incomeReceived) {
      elements.incomeReceived.textContent = summary.incomeReceived.toString();
    }
    if (elements.runningBalance) {
      elements.runningBalance.textContent = summary.runningBalance.toString();
    }

    // Show the overlay
    this.roundSummaryOverlay.style.display = 'flex';
  }

  /**
   * Hide round summary
   */
  private hideRoundSummary(): void {
    if (this.roundSummaryOverlay) {
      this.roundSummaryOverlay.style.display = 'none';
    }
  }

  /**
   * Dismiss round summary and continue to next round
   */
  private dismissRoundSummary(): void {
    this.hideRoundSummary();

    // Emit event to signal summary dismissed
    this.eventBus.emit('summary:dismissed', {});
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
    if (this.timerDisplay) {
      this.timerDisplay.remove();
      this.timerDisplay = null;
    }
    if (this.roundSummaryOverlay) {
      this.roundSummaryOverlay.remove();
      this.roundSummaryOverlay = null;
    }
  }
}
