/**
 * Example Unit Test
 *
 * Demonstrates Vitest setup and provides a passing test.
 */

import { describe, it, expect } from 'vitest';
import { EventBus } from '@/data/events/eventBus';

describe('EventBus', () => {
  it('should emit and receive events', () => {
    const eventBus = new EventBus();
    let received = false;

    eventBus.on('round:start', () => {
      received = true;
    });

    eventBus.emit('round:start', { roundNumber: 1 });

    expect(received).toBe(true);
  });

  it('should unsubscribe handlers', () => {
    const eventBus = new EventBus();
    let count = 0;

    const unsubscribe = eventBus.on('round:tick', () => {
      count++;
    });

    eventBus.emit('round:tick', { remainingTime: 100 });
    expect(count).toBe(1);

    unsubscribe();

    eventBus.emit('round:tick', { remainingTime: 90 });
    expect(count).toBe(1); // Should not increment after unsubscribe
  });
});
