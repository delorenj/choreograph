/**
 * Input Controller
 *
 * Handles keyboard/mouse input and applies forces to player-controlled ball.
 * Maps WASD keys to movement forces on the physics-enabled ball entity.
 *
 * Architecture: Systems Layer (Input)
 * Dependencies: PlayCanvas, BallRenderer (for entity access)
 */

import * as pc from 'playcanvas';
import { EntityStore } from '../../data/state/entityStore';

export interface InputControllerConfig {
  app: pc.Application;
  entityStore: EntityStore;
  blueBallEntity: pc.Entity | null;
  redBallEntity: pc.Entity | null;
  moveForce?: number; // Force magnitude for movement (default: 10)
}

/**
 * InputController manages player input and applies physics forces
 */
export class InputController {
  private readonly app: pc.Application;
  private readonly entityStore: EntityStore;
  private blueBallEntity: pc.Entity | null;
  private redBallEntity: pc.Entity | null;
  private readonly moveForce: number;

  // Input state
  private keys: { [key: string]: boolean } = {};

  constructor(config: InputControllerConfig) {
    this.app = config.app;
    this.entityStore = config.entityStore;
    this.blueBallEntity = config.blueBallEntity;
    this.redBallEntity = config.redBallEntity;
    this.moveForce = config.moveForce || 10;

    this.initializeInput();
    this.startUpdateLoop();
  }

  /**
   * Initialize keyboard input listeners
   */
  private initializeInput(): void {
    if (this.app.keyboard) {
      // Track key down
      this.app.keyboard.on(pc.EVENT_KEYDOWN, (event: pc.KeyboardEvent) => {
        if (event.key !== null) {
          this.keys[event.key] = true;
          // Prevent browser default behavior (e.g., Firefox quick-find)
          if (event.event) {
            event.event.preventDefault();
          }
        }
      });

      // Track key up
      this.app.keyboard.on(pc.EVENT_KEYUP, (event: pc.KeyboardEvent) => {
        if (event.key !== null) {
          this.keys[event.key] = false;
          // Prevent browser default behavior
          if (event.event) {
            event.event.preventDefault();
          }
        }
      });
    }

    // Attach keyboard to the canvas element to ensure it receives events
    if (this.app.keyboard && this.app.graphicsDevice.canvas) {
      this.app.keyboard.attach(this.app.graphicsDevice.canvas);

      // Make canvas focusable and focus it
      const canvas = this.app.graphicsDevice.canvas;
      canvas.setAttribute('tabindex', '1');
      canvas.focus();

      console.warn('[InputController] Keyboard attached to canvas and focused');
    } else {
      console.error('[InputController] Failed to attach keyboard - canvas not available');
    }
  }

  /**
   * Start the update loop to apply forces based on input
   */
  private startUpdateLoop(): void {
    this.app.on('update', (dt: number) => {
      this.updatePlayerMovement(dt);
    });
  }

  /**
   * Update player-controlled ball movement based on input
   */
  private updatePlayerMovement(dt: number): void {
    const state = this.entityStore.getState();
    const playerRole = state.playerRole;

    // Determine which ball is player-controlled
    const playerBall = playerRole === 'blue' ? this.blueBallEntity : this.redBallEntity;

    if (!playerBall || !playerBall.rigidbody) {
      return; // No player ball or no physics component
    }

    // Calculate movement force based on input
    const forceX = this.getHorizontalInput();
    const forceZ = this.getVerticalInput();

    // Apply force if there's input
    if (forceX !== 0 || forceZ !== 0) {
      const force = new pc.Vec3(forceX * this.moveForce, 0, forceZ * this.moveForce);
      playerBall.rigidbody.applyForce(force);

      // Debug: Log first few movement inputs
      if (!this.hasLoggedMovement) {
        console.warn('[InputController] Applying force:', { forceX, forceZ, playerRole });
        this.hasLoggedMovement = true;
      }
    }
  }

  private hasLoggedMovement = false;

  /**
   * Get horizontal input (-1 to 1)
   * A/Left = -1, D/Right = 1
   */
  private getHorizontalInput(): number {
    let input = 0;

    if (this.keys[pc.KEY_A] || this.keys[pc.KEY_LEFT]) {
      input -= 1;
    }
    if (this.keys[pc.KEY_D] || this.keys[pc.KEY_RIGHT]) {
      input += 1;
    }

    return input;
  }

  /**
   * Get vertical input (-1 to 1)
   * W/Up = -1 (forward in isometric view), S/Down = 1
   */
  private getVerticalInput(): number {
    let input = 0;

    if (this.keys[pc.KEY_W] || this.keys[pc.KEY_UP]) {
      input -= 1;
    }
    if (this.keys[pc.KEY_S] || this.keys[pc.KEY_DOWN]) {
      input += 1;
    }

    return input;
  }

  /**
   * Update ball entity references (called when rendering changes)
   */
  public updateBallEntities(blueBall: pc.Entity | null, redBall: pc.Entity | null): void {
    this.blueBallEntity = blueBall;
    this.redBallEntity = redBall;
  }

  /**
   * Clean up resources
   */
  public destroy(): void {
    // Remove keyboard listeners
    if (this.app.keyboard) {
      this.app.keyboard.off(pc.EVENT_KEYDOWN);
      this.app.keyboard.off(pc.EVENT_KEYUP);
    }

    // Remove update loop
    this.app.off('update');
  }
}
