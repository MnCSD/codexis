# Codexis - Code as a Hologram

A revolutionary 3D web-based visualization tool that transforms software codebases into immersive, living cities where developers can walk, explore, and interact with their code spatially.

## Project Overview

**Vision**: Transform how developers understand and navigate codebases by representing:
- Functions as rooms
- Classes as buildings  
- Modules/packages as neighborhoods
- Dependencies as animated roads/pipelines

## Tech Stack

- **Frontend**: WebGL/WebGPU (Three.js or Babylon.js)
- **Backend**: AST parsing + dependency analysis + metrics
- **Real-time**: WebSocket layer for interactive edits
- **AI Integration**: Natural language code navigation
- **Build**: Next.js (current setup)

## Key Features to Implement

### Core 3D Visualization
- City layout with districts (modules), buildings (classes), rooms (functions)
- Color-coded domains (UI, API, Database, etc.)
- Dynamic sizing based on code complexity

### Interactive Elements
- Pan/zoom navigation (strategy game style)
- Search teleportation to specific functions
- Drag-and-drop refactoring with AI assistance
- Hover interactions for code references

### Live Animations & Sprites
- Data flow particles through dependency pipelines
- Execution hotspots with pulsing/glowing effects
- Error/warning sprites (red bugs, black smoke for security)
- Test coverage visualization (green vines = covered, grey = untested)

### Environmental Systems
- Lighting for variable scope and visibility
- Weather effects tied to CI/CD status
- Time-lapse mode for commit history exploration

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint

# Run type checking
npm run typecheck
```

## Architecture Notes

- Use GPU-optimized rendering for performance
- Implement dynamic level-of-detail (LOD) for large codebases
- Design modular system for different programming languages
- Plan for real-time synchronization with Git repositories

## Target Use Cases

1. **Developer Onboarding** - Spatial overview of codebase architecture
2. **Code Navigation** - Intuitive exploration vs traditional file trees  
3. **Refactoring** - Visual dependency analysis before changes
4. **Debugging** - Runtime execution visualization
5. **Code Reviews** - Walk stakeholders through changed "neighborhoods"
6. **Education** - Visual metaphors for programming concepts

## Tagline
"Don't read your codebase. Walk through it."