/**
 * Event Bus
 *
 * Pub/sub event system for decoupled communication between systems.
 * Provides type-safe event handling with optional dev mode logging.
 *
 * Usage:
 * ```typescript
 * const bus = new EventBus({ enableLogging: true });
 *
 * // Subscribe
 * const unsubscribe = bus.on('round:start', (payload) => {
 *   console.log('Round started:', payload.roundNumber);
 * });
 *
 * // Emit
 * bus.emit('round:start', { roundNumber: 1, isPaycheckRound: false });
 *
 * // Unsubscribe
 * unsubscribe();
 * ```
 */

import { GameEventType, GameEventPayload } from './eventTypes';

type EventHandler<T extends GameEventType> = (payload: GameEventPayload[T]) => void;
type Unsubscribe = () => void;

export interface EventBusOptions {
  /**
   * Enable dev mode event logging
   * When true, all emitted events are logged to console
   * Default: false in production, true in development
   */
  enableLogging?: boolean;

  /**
   * Custom logger function
   * If provided, this will be used instead of console.log
   */
  logger?: (event: GameEventType, payload: unknown, handlerCount: number) => void;
}

export class EventBus {
  private handlers: Map<GameEventType, Set<EventHandler<any>>> = new Map();
  private enableLogging: boolean;
  private logger: (event: GameEventType, payload: unknown, handlerCount: number) => void;

  constructor(options: EventBusOptions = {}) {
    // Default to logging in development mode
    this.enableLogging = options.enableLogging ?? import.meta.env.DEV;

    // Default logger
    this.logger =
      options.logger ??
      ((event: GameEventType, payload: unknown, handlerCount: number): void => {
        console.log(
          `[EventBus] ${event}`,
          `(${handlerCount} handler${handlerCount === 1 ? '' : 's'})`,
          payload
        );
      });
  }

  /**
   * Emit an event with payload
   * Notifies all subscribed handlers and logs in dev mode
   */
  emit<T extends GameEventType>(event: T, payload: GameEventPayload[T]): void {
    const eventHandlers = this.handlers.get(event);
    const handlerCount = eventHandlers?.size ?? 0;

    // Log in dev mode
    if (this.enableLogging) {
      this.logger(event, payload, handlerCount);
    }

    // Notify handlers
    if (eventHandlers !== undefined) {
      eventHandlers.forEach((handler) => handler(payload));
    }
  }

  /**
   * Subscribe to an event
   * Returns an unsubscribe function for cleanup
   */
  on<T extends GameEventType>(event: T, handler: EventHandler<T>): Unsubscribe {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }

    const eventHandlers = this.handlers.get(event);
    if (eventHandlers !== undefined) {
      eventHandlers.add(handler);
    }

    return (): void => {
      this.off(event, handler);
    };
  }

  /**
   * Unsubscribe from an event
   */
  off<T extends GameEventType>(event: T, handler: EventHandler<T>): void {
    const eventHandlers = this.handlers.get(event);
    if (eventHandlers !== undefined) {
      eventHandlers.delete(handler);
    }
  }

  /**
   * Get the number of handlers for a specific event
   * Useful for debugging and testing
   */
  getHandlerCount<T extends GameEventType>(event: T): number {
    return this.handlers.get(event)?.size ?? 0;
  }

  /**
   * Get all event types that have at least one handler
   * Useful for debugging
   */
  getActiveEvents(): GameEventType[] {
    return Array.from(this.handlers.keys()).filter(
      (event) => (this.handlers.get(event)?.size ?? 0) > 0
    );
  }

  /**
   * Clear all event handlers (useful for testing)
   */
  clear(): void {
    this.handlers.clear();
  }

  /**
   * Enable or disable event logging at runtime
   */
  setLogging(enabled: boolean): void {
    this.enableLogging = enabled;
  }
}
