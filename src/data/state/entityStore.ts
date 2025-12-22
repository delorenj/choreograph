/**
 * Entity Store
 *
 * Centralized entity storage with observable state pattern.
 * Manages balls, tasks, and other game entities with immutable updates.
 *
 * Usage:
 * ```typescript
 * const store = new EntityStore(initialState);
 *
 * // Subscribe to changes
 * const unsubscribe = store.subscribe((state) => {
 *   console.log('State changed:', state);
 * });
 *
 * // Update state (immutable)
 * store.updateBlueBall({ stress: 75 });
 *
 * // Add task
 * store.addTask('blue', newBlueTask);
 *
 * // Get state
 * const currentState = store.getState();
 * ```
 */

import { GameState, TutorialState, ModalType } from './gameState';
import { BlueBall, RedBall, Task, Round, FinancialState } from '../entities';
import { GamePhase } from '../events/eventTypes';

type StateListener = (state: Readonly<GameState>) => void;

/**
 * Partial updates for each entity type
 */
export type BlueBallUpdate = Partial<Omit<BlueBall, 'id'>>;
export type RedBallUpdate = Partial<Omit<RedBall, 'id'>>;
export type RoundUpdate = Partial<Round>;
export type FinancialStateUpdate = Partial<FinancialState>;
export type TutorialStateUpdate = Partial<TutorialState>;

/**
 * EntityStore manages all game entities with observable state pattern
 */
export class EntityStore {
  private state: GameState;
  private listeners: Set<StateListener> = new Set();

  constructor(initialState: GameState) {
    this.state = initialState;
  }

  // ==========================================================================
  // STATE ACCESS
  // ==========================================================================

  /**
   * Get current state (readonly to prevent direct mutation)
   */
  getState(): Readonly<GameState> {
    return this.state;
  }

  /**
   * Subscribe to state changes
   * Returns unsubscribe function
   */
  subscribe(listener: StateListener): () => void {
    this.listeners.add(listener);

    return (): void => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Notify all listeners of state change
   */
  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.state));
  }

  /**
   * Update state immutably and notify listeners
   */
  private updateState(updates: Partial<GameState>): void {
    this.state = {
      ...this.state,
      ...updates,
    };
    this.notifyListeners();
  }

  // ==========================================================================
  // BALL OPERATIONS
  // ==========================================================================

  /**
   * Get Blue Ball
   */
  getBlueBall(): Readonly<BlueBall> {
    return this.state.blueBall;
  }

  /**
   * Get Red Ball
   */
  getRedBall(): Readonly<RedBall> {
    return this.state.redBall;
  }

  /**
   * Update Blue Ball (immutable)
   */
  updateBlueBall(updates: BlueBallUpdate): void {
    this.updateState({
      blueBall: {
        ...this.state.blueBall,
        ...updates,
      },
    });
  }

  /**
   * Update Red Ball (immutable)
   */
  updateRedBall(updates: RedBallUpdate): void {
    this.updateState({
      redBall: {
        ...this.state.redBall,
        ...updates,
      },
    });
  }

  // ==========================================================================
  // TASK OPERATIONS (CRUD)
  // ==========================================================================

  /**
   * Add a task (Create)
   */
  addTask(ballType: 'blue' | 'red', task: Task): void {
    const tasksMap = ballType === 'blue' ? this.state.blueTasks : this.state.redTasks;
    const newTasksMap = new Map(tasksMap);
    newTasksMap.set(task.id, task);

    this.updateState({
      [ballType === 'blue' ? 'blueTasks' : 'redTasks']: newTasksMap,
    });
  }

  /**
   * Get a task by ID (Read)
   */
  getTask(ballType: 'blue' | 'red', taskId: string): Readonly<Task> | undefined {
    const tasksMap = ballType === 'blue' ? this.state.blueTasks : this.state.redTasks;
    return tasksMap.get(taskId);
  }

  /**
   * Get all tasks for a ball type (Read)
   */
  getAllTasks(ballType: 'blue' | 'red'): ReadonlyArray<Readonly<Task>> {
    const tasksMap = ballType === 'blue' ? this.state.blueTasks : this.state.redTasks;
    return Array.from(tasksMap.values());
  }

  /**
   * Update a task (Update)
   * Updates are type-safe - only properties that exist on the task can be updated
   */
  updateTask(
    ballType: 'blue' | 'red',
    taskId: string,
    updates: Partial<Omit<Task, 'type'>> // Can't change type
  ): boolean {
    const tasksMap = ballType === 'blue' ? this.state.blueTasks : this.state.redTasks;
    const existingTask = tasksMap.get(taskId);

    if (existingTask === undefined) {
      return false;
    }

    const newTasksMap = new Map(tasksMap);
    // Type assertion is safe because we're only updating properties that exist on both types
    newTasksMap.set(taskId, {
      ...existingTask,
      ...updates,
    } as Task);

    this.updateState({
      [ballType === 'blue' ? 'blueTasks' : 'redTasks']: newTasksMap,
    });

    return true;
  }

  /**
   * Delete a task (Delete)
   */
  deleteTask(ballType: 'blue' | 'red', taskId: string): boolean {
    const tasksMap = ballType === 'blue' ? this.state.blueTasks : this.state.redTasks;

    if (!tasksMap.has(taskId)) {
      return false;
    }

    const newTasksMap = new Map(tasksMap);
    newTasksMap.delete(taskId);

    this.updateState({
      [ballType === 'blue' ? 'blueTasks' : 'redTasks']: newTasksMap,
    });

    return true;
  }

  /**
   * Clear all tasks for a ball type
   */
  clearTasks(ballType: 'blue' | 'red'): void {
    this.updateState({
      [ballType === 'blue' ? 'blueTasks' : 'redTasks']: new Map(),
    });
  }

  // ==========================================================================
  // ROUND OPERATIONS
  // ==========================================================================

  /**
   * Get current round
   */
  getRound(): Readonly<Round> {
    return this.state.currentRound;
  }

  /**
   * Update round (immutable)
   */
  updateRound(updates: RoundUpdate): void {
    this.updateState({
      currentRound: {
        ...this.state.currentRound,
        ...updates,
      },
    });
  }

  // ==========================================================================
  // FINANCIAL OPERATIONS
  // ==========================================================================

  /**
   * Get financial state
   */
  getFinancialState(): Readonly<FinancialState> {
    return this.state.financialState;
  }

  /**
   * Update financial state (immutable)
   */
  updateFinancialState(updates: FinancialStateUpdate): void {
    this.updateState({
      financialState: {
        ...this.state.financialState,
        ...updates,
      },
    });
  }

  // ==========================================================================
  // GAME STATE OPERATIONS
  // ==========================================================================

  /**
   * Set player role
   */
  setPlayerRole(role: 'blue' | 'red'): void {
    this.updateState({ playerRole: role });
  }

  /**
   * Set game phase
   */
  setGamePhase(phase: GamePhase): void {
    this.updateState({ gamePhase: phase });
  }

  /**
   * Set employment event triggered
   */
  setEmploymentEventTriggered(triggered: boolean): void {
    this.updateState({ employmentEventTriggered: triggered });
  }

  /**
   * Set rounds since high red stress
   */
  setRoundsSinceHighRedStress(rounds: number): void {
    this.updateState({ roundsSinceHighRedStress: rounds });
  }

  // ==========================================================================
  // UI STATE OPERATIONS
  // ==========================================================================

  /**
   * Set active modal
   */
  setActiveModal(modal: ModalType | null): void {
    this.updateState({ activeModal: modal });
  }

  /**
   * Update tutorial state (immutable)
   */
  updateTutorialState(updates: TutorialStateUpdate): void {
    this.updateState({
      tutorialState: {
        ...this.state.tutorialState,
        ...updates,
      },
    });
  }

  // ==========================================================================
  // UTILITY OPERATIONS
  // ==========================================================================

  /**
   * Get listener count (useful for debugging)
   */
  getListenerCount(): number {
    return this.listeners.size;
  }

  /**
   * Clear all listeners (useful for testing)
   */
  clearListeners(): void {
    this.listeners.clear();
  }

  /**
   * Reset entire state (useful for testing)
   */
  resetState(newState: GameState): void {
    this.state = newState;
    this.notifyListeners();
  }
}
