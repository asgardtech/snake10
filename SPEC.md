# Snake Game – Project Plan

## Vision
Build a classic browser-based Snake game using vanilla JavaScript and HTML5 Canvas. The player controls a snake that grows by eating food, must avoid colliding with walls and itself, and earns points for each food consumed. Desktop-only, minimal feature set with clean, functional UI.

## Goals
- Implement core Snake gameplay loop with grid-based movement
- Fixed tick-rate engine (10 moves/sec recommended) for predictable, fair gameplay
- Collision detection (walls, self)
- Score tracking and game-over state
- Clean restart/play-again flow
- Responsive canvas rendering at 60 FPS

## Non-goals
- Mobile or touch controls
- Sound or music
- Leaderboards or persistent storage
- Multiplayer or online play
- Power-ups, obstacles, or level progression
- Animations or visual polish beyond basic rendering

## Initial Tech Stack
- **Language:** Vanilla JavaScript (ES6+)
- **Rendering:** HTML5 Canvas 2D
- **Build Tool:** None (single HTML file, optional simple dev server)
- **Browser:** Modern evergreen browsers (Chrome, Firefox, Safari, Edge)
- **Version Control:** Git

## First Milestone
1. **Game Engine Setup**
   - Canvas initialization and sizing
   - Game loop with fixed tick rate (10 ticks/sec) + 60 FPS render loop
   - State management (snake position/direction, food position, score, game state)

2. **Core Gameplay**
   - Snake grid-based movement (direction queue to handle rapid input)
   - Food spawning (random grid position, not on snake)
   - Collision detection (walls, self)
   - Score increment on food consume, grow snake by 1 segment

3. **UI & Input**
   - Keyboard input (arrow keys or WASD)
   - Game-over screen with score and restart button
   - Current score display
   - Start state (prompt to begin)

4. **Testing & Polish**
   - Manual gameplay testing across browsers
   - Edge case handling (rapid input, wall collisions)
   - Code cleanup and comments

## Open Questions
- None—ready to scope and build!

## Recommended Architecture
- **index.html:** Single entry point with canvas and minimal markup
- **game.js:** Core game engine (Game class with update/render methods)
- **input.js:** Keyboard event handling (optional: separate input controller)
- **render.js:** Canvas drawing utilities (optional: separate render layer)

## Next Steps
1. Create project folder and git repo
2. Build HTML structure with canvas
3. Implement game loop (tick + render)
4. Code snake movement and collision logic
5. Add UI elements and input handling
6. Test and iterate
