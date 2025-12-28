/**
 * Main Entry Point
 *
 * Composition root for the application.
 * Initializes all layers and starts the game.
 */

import * as pc from 'playcanvas';

// Import layers
import { ConfigLoader } from './config/loader';
import { EventBus } from './data/events/eventBus';
import { EntityStore } from './data/state/entityStore';
import { GameStateMachine } from './systems/core/stateMachine/GameStateMachine';
import { RoundManager } from './systems/core/roundManager';
import { FinancialManager } from './systems/core/financialManager';
import { UIManager } from './presentation/ui';
import { BallRenderer } from './presentation/rendering';
import { InputController } from './systems/input';
import type { GameState } from './data/state/gameState';
import type { RoundManagerConfig } from './systems/core/roundManager';
import type { FinancialManagerConfig } from './systems/core/financialManager';

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
  // Create camera entity - positioned for isometric view at 35° angle (STORY-033)
  const camera = new pc.Entity('camera');
  camera.addComponent('camera', {
    clearColor: new pc.Color(0.15, 0.15, 0.2),
    farClip: 100,
  });
  app.root.addChild(camera);
  // Position for 35° isometric view (fixed, no zoom/rotation)
  camera.setPosition(0, 12, 12);
  camera.setEulerAngles(-35, 0, 0);

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

  // Add static physics to floor
  floor.addComponent('rigidbody', {
    type: pc.BODYTYPE_STATIC,
    friction: 0.5,
    restitution: 0.2,
  });

  // Add box collision (plane collision uses box with minimal height)
  floor.addComponent('collision', {
    type: 'box',
    halfExtents: new pc.Vec3(10, 0.1, 10), // Large flat surface
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
 * Initialize game systems (Data + Systems layers)
 */
async function initializeGameSystems(): Promise<{
  eventBus: EventBus;
  stateMachine: GameStateMachine;
  entityStore: EntityStore;
  financialManager: FinancialManager;
  roundManager: RoundManager;
  uiManager: UIManager;
}> {
  // Load configuration
  const configLoader = new ConfigLoader();
  const config = configLoader.loadDefault();

  // Initialize Data layer
  const eventBus = new EventBus();
  const stateMachine = new GameStateMachine(eventBus, 'LOADING');

  // Create initial game state
  const initialState: GameState = {
    currentRound: {
      number: 1,
      phase: 'IDLE',
      elapsedTime: 0,
      remainingTime: config.round.durationSeconds,
      isPaycheckRound: false,
      startedAt: null,
      endedAt: null,
    },
    playerRole: 'blue', // Default, will be set by role selection
    gamePhase: 'LOADING',
    blueBall: {
      id: 'blue',
      position: { x: -2, y: 1, z: 0 },
      velocity: { x: 0, y: 0, z: 0 },
      stress: 0,
      isPlayerControlled: false, // Will be updated based on role selection
      rapport: 100, // Start with full employment rapport
      activeTaskId: null,
      completedTasksThisRound: 0,
      totalTasksThisRound: 0,
    },
    redBall: {
      id: 'red',
      position: { x: 2, y: 1, z: 0 },
      velocity: { x: 0, y: 0, z: 0 },
      stress: 0,
      isPlayerControlled: false, // Will be updated based on role selection
      activeTaskId: null,
      completedTasksThisRound: 0,
      totalTasksThisRound: 0,
      canRequestHelp: true,
      isEmployed: false, // Will be set when employment event triggers
    },
    blueTasks: new Map(),
    redTasks: new Map(),
    financialState: {
      balance: config.financial.startingBalance,
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
      tutorialEnabled: config.tutorial.enabled,
    },
  };

  const entityStore = new EntityStore(initialState);

  // Initialize Systems layer
  // Create FinancialManager
  const financialConfig: FinancialManagerConfig = {
    startingBalance: config.financial.startingBalance,
    bluePaycheck: config.blue.paycheck,
    redIncome: 0, // Will be configured in future stories (employment event)
  };
  const financialManager = new FinancialManager(eventBus, financialConfig);

  // Create RoundManager
  const roundConfig: RoundManagerConfig = {
    durationSeconds: config.round.durationSeconds,
    paycheckInterval: config.round.paycheckInterval,
    paycheckAmount: config.blue.paycheck,
  };
  const roundManager = new RoundManager(eventBus, stateMachine, roundConfig, financialManager);

  // Initialize Presentation layer (UI)
  const uiManager = new UIManager(eventBus, stateMachine, entityStore);

  // Wire up summary dismissal to continue to next round
  eventBus.on('summary:dismissed', () => {
    roundManager.continueToNextRound();
  });

  // Wire up role selection to start first round
  eventBus.on('role:selected', () => {
    roundManager.startRound();
  });

  // Transition to role selection
  stateMachine.startGame(); // LOADING -> SCENARIO_SELECT
  stateMachine.selectScenario(); // SCENARIO_SELECT -> ROLE_SELECT

  return {
    eventBus,
    stateMachine,
    entityStore,
    financialManager,
    roundManager,
    uiManager,
  };
}

/**
 * Main initialization function
 */
async function main(): Promise<void> {
  console.warn('Initializing Choreograph...');

  try {
    // Initialize game systems first
    const gameSystems = await initializeGameSystems();

    // Initialize PlayCanvas
    const app = initializePlayCanvas();

    // Create basic scene
    createBasicScene(app);

    // Initialize rendering layer (3D visualization)
    const ballRenderer = new BallRenderer({
      app,
      entityStore: gameSystems.entityStore,
    });

    // Initialize input controller for player movement
    const inputController = new InputController({
      app,
      entityStore: gameSystems.entityStore,
      blueBallEntity: ballRenderer.getBlueBallEntity(),
      redBallEntity: ballRenderer.getRedBallEntity(),
      moveForce: 10, // Configurable force magnitude
    });

    // Start the application
    app.start();

    console.warn('Choreograph initialized successfully');
    console.warn('Game systems:', {
      eventBus: gameSystems.eventBus,
      stateMachine: gameSystems.stateMachine,
      currentState: gameSystems.stateMachine.getState(),
      ballRenderer,
      inputController,
    });
  } catch (error) {
    console.error('Failed to initialize Choreograph:', error);
    throw error;
  }
}

// Start the application
main().catch((error) => {
  console.error('Fatal error:', error);
});
