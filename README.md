# Domestic Simulation

A 3D simulation game exploring domestic work dynamics through an interactive pinball-style environment.

## Overview

This game presents a cryptic visualization of household task management using a top-down angled view with two colored spheres (blue and red) representing different participants. The simulation tracks work tasks, stress levels, and resource management across daily cycles.

## Tech Stack

- **PlayCanvas Engine** (v2.14.4) - WebGL/WebGPU 3D game engine
- **Vite** (v6.4.1) - Build tool and dev server
- **Bun** - Package manager and runtime

## Project Structure

```
DomesticSimulation/
├── src/
│   └── main.js          # Main game initialization and scene setup
├── index.html           # HTML entry point
├── package.json         # Dependencies and scripts
├── vite.config.js       # Vite configuration
└── README.md           # This file
```

## Getting Started

### Prerequisites

- Bun installed (or Node.js 18+)

### Installation

```bash
bun install
```

### Development

Start the dev server:

```bash
bun run dev
```

The application will be available at `http://localhost:3000`

### Build

```bash
bun run build
```

### Preview Production Build

```bash
bun run preview
```

## Current Implementation

The barebones setup includes:

- **Camera**: Top-down angled view positioned for pinball-style gameplay
- **Lighting**: Directional light for basic scene illumination
- **Floor Plane**: 10x10 gray surface representing the "house"
- **Blue Ball**: Sphere at (-3, 0.5, 0) representing one participant
- **Red Ball**: Sphere at (3, 0.5, 0) representing the other participant

## Next Steps

- Implement task generation system (work chunks, household tasks)
- Add physics for ball movement
- Create stress meter UI
- Implement day/round cycling
- Add paycheck system
- Create task completion mechanics
- Build UI overlays for game state

## References

- [PlayCanvas Engine API](https://api.playcanvas.com/engine/)
- [PlayCanvas Examples](https://playcanvas.github.io)
- [Building with PlayCanvas - MDN](https://developer.mozilla.org/en-US/docs/Games/Techniques/3D_on_the_web/Building_up_a_basic_demo_with_PlayCanvas/engine)
- [Basic Materials Tutorial](https://developer.playcanvas.com/tutorials/basic-materials/)
