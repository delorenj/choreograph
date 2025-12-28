/**
 * Ball Renderer
 *
 * Manages 3D visualization of ball entities in PlayCanvas scene.
 * Subscribes to EntityStore for state changes and updates entity transforms.
 *
 * Architecture: Presentation Layer (Rendering)
 * Dependencies: EntityStore (Data), PlayCanvas (3D Engine)
 */

import * as pc from 'playcanvas';
import { EntityStore } from '../../data/state/entityStore';
import type { BlueBall, RedBall } from '../../data/entities';

export interface BallRendererConfig {
  app: pc.Application;
  entityStore: EntityStore;
}

/**
 * BallRenderer manages PlayCanvas entities for Blue and Red balls
 */
export class BallRenderer {
  private readonly app: pc.Application;
  private readonly entityStore: EntityStore;

  // PlayCanvas entities
  private blueBallEntity: pc.Entity | null = null;
  private redBallEntity: pc.Entity | null = null;

  // Materials
  private blueMaterial: pc.StandardMaterial | null = null;
  private redMaterial: pc.StandardMaterial | null = null;

  constructor(config: BallRendererConfig) {
    this.app = config.app;
    this.entityStore = config.entityStore;

    this.initializeMaterials();
    this.createBallEntities();
    this.subscribeToStateChanges();
  }

  /**
   * Create materials for balls
   */
  private initializeMaterials(): void {
    // Blue ball material
    this.blueMaterial = new pc.StandardMaterial();
    this.blueMaterial.diffuse.set(0.2, 0.4, 0.9); // Bright blue
    this.blueMaterial.emissive.set(0.05, 0.1, 0.2); // Slight glow
    this.blueMaterial.update();

    // Red ball material
    this.redMaterial = new pc.StandardMaterial();
    this.redMaterial.diffuse.set(0.9, 0.2, 0.2); // Bright red
    this.redMaterial.emissive.set(0.2, 0.05, 0.05); // Slight glow
    this.redMaterial.update();
  }

  /**
   * Create ball entities in PlayCanvas scene
   */
  private createBallEntities(): void {
    const state = this.entityStore.getState();

    // Create Blue Ball
    this.blueBallEntity = new pc.Entity('blue-ball');
    this.blueBallEntity.addComponent('model', {
      type: 'sphere',
    });
    this.blueBallEntity.setLocalScale(1, 1, 1); // 1 unit radius

    // Set initial position from state
    const bluePos = state.blueBall.position;
    this.blueBallEntity.setPosition(bluePos.x, bluePos.y, bluePos.z);

    // Apply blue material
    if (
      this.blueMaterial &&
      this.blueBallEntity.model !== undefined &&
      this.blueBallEntity.model !== null
    ) {
      const meshInstances = this.blueBallEntity.model.meshInstances;
      if (meshInstances && meshInstances.length > 0) {
        const meshInstance = meshInstances[0];
        if (meshInstance !== undefined) {
          meshInstance.material = this.blueMaterial;
        }
      }
    }

    // Add rigid body physics to Blue Ball
    this.blueBallEntity.addComponent('rigidbody', {
      type: pc.BODYTYPE_DYNAMIC,
      mass: 1,
      friction: 0.5,
      restitution: 0.3, // Bounces moderately
    });

    // Add collision shape (sphere)
    this.blueBallEntity.addComponent('collision', {
      type: 'sphere',
      radius: 1,
    });

    this.app.root.addChild(this.blueBallEntity);

    // Create Red Ball
    this.redBallEntity = new pc.Entity('red-ball');
    this.redBallEntity.addComponent('model', {
      type: 'sphere',
    });
    this.redBallEntity.setLocalScale(1, 1, 1); // 1 unit radius

    // Set initial position from state
    const redPos = state.redBall.position;
    this.redBallEntity.setPosition(redPos.x, redPos.y, redPos.z);

    // Apply red material
    if (
      this.redMaterial &&
      this.redBallEntity.model !== undefined &&
      this.redBallEntity.model !== null
    ) {
      const meshInstances = this.redBallEntity.model.meshInstances;
      if (meshInstances && meshInstances.length > 0) {
        const meshInstance = meshInstances[0];
        if (meshInstance !== undefined) {
          meshInstance.material = this.redMaterial;
        }
      }
    }

    // Add rigid body physics to Red Ball
    this.redBallEntity.addComponent('rigidbody', {
      type: pc.BODYTYPE_DYNAMIC,
      mass: 1,
      friction: 0.5,
      restitution: 0.3, // Bounces moderately
    });

    // Add collision shape (sphere)
    this.redBallEntity.addComponent('collision', {
      type: 'sphere',
      radius: 1,
    });

    this.app.root.addChild(this.redBallEntity);
  }

  /**
   * Subscribe to EntityStore state changes
   */
  private subscribeToStateChanges(): void {
    // Subscribe to blue ball updates
    this.entityStore.subscribe((state) => {
      this.updateBlueBall(state.blueBall);
    });

    // Subscribe to red ball updates
    this.entityStore.subscribe((state) => {
      this.updateRedBall(state.redBall);
    });
  }

  /**
   * Update Blue Ball visual state
   */
  private updateBlueBall(blueBall: BlueBall): void {
    if (!this.blueBallEntity) return;

    // Update position
    const pos = blueBall.position;
    this.blueBallEntity.setPosition(pos.x, pos.y, pos.z);

    // TODO: Update visual effects based on stress level
    // TODO: Apply player control indicator if isPlayerControlled
  }

  /**
   * Update Red Ball visual state
   */
  private updateRedBall(redBall: RedBall): void {
    if (!this.redBallEntity) return;

    // Update position
    const pos = redBall.position;
    this.redBallEntity.setPosition(pos.x, pos.y, pos.z);

    // TODO: Update visual effects based on stress level
    // TODO: Apply player control indicator if isPlayerControlled
  }

  /**
   * Get Blue Ball entity (for physics integration)
   */
  public getBlueBallEntity(): pc.Entity | null {
    return this.blueBallEntity;
  }

  /**
   * Get Red Ball entity (for physics integration)
   */
  public getRedBallEntity(): pc.Entity | null {
    return this.redBallEntity;
  }

  /**
   * Clean up resources
   */
  public destroy(): void {
    if (this.blueBallEntity) {
      this.blueBallEntity.destroy();
      this.blueBallEntity = null;
    }

    if (this.redBallEntity) {
      this.redBallEntity.destroy();
      this.redBallEntity = null;
    }

    if (this.blueMaterial) {
      this.blueMaterial.destroy();
      this.blueMaterial = null;
    }

    if (this.redMaterial) {
      this.redMaterial.destroy();
      this.redMaterial = null;
    }
  }
}
