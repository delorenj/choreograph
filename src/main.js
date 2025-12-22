import * as pc from 'playcanvas';

// Get canvas element
const canvas = document.getElementById('application-canvas');
window.focus();

// Create PlayCanvas application
const app = new pc.Application(canvas, {
    mouse: new pc.Mouse(canvas),
    touch: new pc.TouchDevice(canvas),
    keyboard: new pc.Keyboard(window)
});

// Fill the available space at full resolution
app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
app.setCanvasResolution(pc.RESOLUTION_AUTO);

// Ensure canvas is resized when window changes size
window.addEventListener('resize', () => app.resizeCanvas());

// Create camera entity - positioned for top-down angled view
const camera = new pc.Entity('camera');
camera.addComponent('camera', {
    clearColor: new pc.Color(0.15, 0.15, 0.2),
    farClip: 100
});
app.root.addChild(camera);
camera.setPosition(0, 10, 8);
camera.setEulerAngles(-45, 0, 0);

// Create directional light
const light = new pc.Entity('light');
light.addComponent('light', {
    type: 'directional',
    color: new pc.Color(1, 1, 1),
    intensity: 1
});
app.root.addChild(light);
light.setEulerAngles(45, 30, 0);

// Create floor plane (the "house")
const floor = new pc.Entity('floor');
floor.addComponent('model', {
    type: 'plane'
});
app.root.addChild(floor);
floor.setLocalScale(10, 1, 10);
floor.setPosition(0, 0, 0);

// Create blue ball (player)
const blueBall = new pc.Entity('blueBall');
blueBall.addComponent('model', {
    type: 'sphere'
});
app.root.addChild(blueBall);
blueBall.setPosition(-3, 0.5, 0);
blueBall.setLocalScale(0.8, 0.8, 0.8);

// Create red ball (partner)
const redBall = new pc.Entity('redBall');
redBall.addComponent('model', {
    type: 'sphere'
});
app.root.addChild(redBall);
redBall.setPosition(3, 0.5, 0);
redBall.setLocalScale(0.8, 0.8, 0.8);

// Create materials for the balls
const blueMaterial = new pc.StandardMaterial();
blueMaterial.diffuse.set(0, 0.4, 1); // Bright blue
blueMaterial.update();

const redMaterial = new pc.StandardMaterial();
redMaterial.diffuse.set(1, 0.1, 0.1); // Bright red
redMaterial.update();

const floorMaterial = new pc.StandardMaterial();
floorMaterial.diffuse.set(0.8, 0.8, 0.8); // Light gray
floorMaterial.update();

// Apply materials once models are ready
blueBall.model.meshInstances[0].material = blueMaterial;
redBall.model.meshInstances[0].material = redMaterial;
floor.model.meshInstances[0].material = floorMaterial;

// Simple update loop (will be expanded with game logic)
app.on('update', (dt) => {
    // Game logic will go here
});

// Start the application
app.start();

// Export for potential external access
export { app, blueBall, redBall, floor };
