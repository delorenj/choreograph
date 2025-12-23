/**
 * Main Entry Point
 *
 * Composition root for the application.
 * Initializes all layers and starts the game.
 */

import * as pc from 'playcanvas';

// Import layers (placeholder imports for now)
// These imports ensure all layers are included in the build
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as config from './config';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as data from './data';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as systems from './systems';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as presentation from './presentation';

/**
 * Initialize the PlayCanvas application
 */
function initializePlayCanvas(): pc.Application {
  const canvas = document.getElementById('application-canvas') as HTMLCanvasElement;

  if (canvas === null) {
    throw new Error('Canvas element not found');
  }

  window.focus();

  // Create PlayCanvas application
  const app = new pc.Application(canvas, {
    mouse: new pc.Mouse(canvas),
    touch: new pc.TouchDevice(canvas),
    keyboard: new pc.Keyboard(window),
  });

  // Fill the available space at full resolution
  app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
  app.setCanvasResolution(pc.RESOLUTION_AUTO);

  // Ensure canvas is resized when window changes size
  window.addEventListener('resize', () => {
    app.resizeCanvas();
  });

  return app;
}

/**
 * Create basic scene (temporary - will be replaced with proper renderer)
 */
function createBasicScene(app: pc.Application): void {
  // Create camera entity - positioned for top-down angled view
  const camera = new pc.Entity('camera');
  camera.addComponent('camera', {
    clearColor: new pc.Color(0.15, 0.15, 0.2),
    farClip: 100,
  });
  app.root.addChild(camera);
  camera.setPosition(0, 10, 8);
  camera.setEulerAngles(-45, 0, 0);

  // Create directional light
  const light = new pc.Entity('light');
  light.addComponent('light', {
    type: 'directional',
    color: new pc.Color(1, 1, 1),
    intensity: 1,
  });
  app.root.addChild(light);
  light.setEulerAngles(45, 30, 0);

  // Create floor plane
  const floor = new pc.Entity('floor');
  floor.addComponent('model', {
    type: 'plane',
  });
  app.root.addChild(floor);
  floor.setLocalScale(10, 1, 10);
  floor.setPosition(0, 0, 0);

  // Create materials
  const floorMaterial = new pc.StandardMaterial();
  floorMaterial.diffuse.set(0.8, 0.8, 0.8);
  floorMaterial.update();

  // Apply materials once models are ready
  if (
    floor.model !== undefined &&
    floor.model !== null &&
    floor.model.meshInstances !== null &&
    floor.model.meshInstances.length > 0
  ) {
    const meshInstance = floor.model.meshInstances[0];
    if (meshInstance !== undefined) {
      meshInstance.material = floorMaterial;
    }
  }
}

/**
 * Main initialization function
 */
async function main(): Promise<void> {
  console.warn('Initializing Choreograph...');

  try {
    // Initialize PlayCanvas
    const app = initializePlayCanvas();

    // Create basic scene
    createBasicScene(app);

    // Start the application
    app.start();

    console.warn('Choreograph initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Choreograph:', error);
    throw error;
  }
}

// Start the application
main().catch((error) => {
  console.error('Fatal error:', error);
});
