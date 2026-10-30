# Simple Jumping Game 🎮

A fun, responsive web-based jumping game built with vanilla HTML, CSS, and JavaScript.

## 🎯 Overview

This is a complete implementation of a jumping game as specified in the AIFD assignment. The game features:
- Player character that can jump and move left/right
- Randomly spawned obstacles to avoid
- Real-time score tracking
- Physics-based jumping with gravity
- Responsive design for all screen sizes
- Clean, maintainable, refactored code

## 🎮 How to Play

### Controls
- **Jump**: Press `Space` or `↑` Arrow
- **Move Left**: Press `←` Arrow or `A`
- **Move Right**: Press `→` Arrow or `D`
- **Start Game**: Press any key when idle
- **Restart**: Press `Space` after game over

### Objective
Avoid obstacles for as long as possible and rack up points by successfully passing obstacles!

## ⭐ Features

### Core Features
- ✅ Character movement (left, right, jump)
- ✅ Realistic jumping physics with gravity
- ✅ Obstacle generation at regular intervals
- ✅ Collision detection
- ✅ Score tracking and display
- ✅ Game over detection and handling
- ✅ Game reset functionality

### Enhanced Features
- 🆕 **Randomized obstacles** - Varying heights (20-40px) for increased difficulty
- 🆕 **Visual feedback** - Game over text turns red and bold
- 🆕 **Smooth transitions** - Polished UI animations
- 🆕 **Better instructions** - Comprehensive control guide

## 📊 Project Stats

| Metric | Value |
|--------|-------|
| Total Lines of Code | 220 |
| Comments | 0 (self-documenting) |
| Functions | 20+ |
| External Dependencies | None |
| Refactor Reduction | 289 → 220 lines (-24%) |

## 📁 File Structure

```
├── index.html              # Game HTML structure
├── style.css               # Game styling (responsive design)
├── script.js               # Game logic (220 lines, refactored)
├── README.md               # This file
├── IMPLEMENTATION_SUMMARY.md  # Feature checklist & implementation details
├── GAMEPLAY_GUIDE.md       # Detailed gameplay instructions
└── CODE_STRUCTURE.md       # Code architecture & design decisions
```

## 🚀 Getting Started

### Running the Game
1. Open `index.html` in any modern web browser
2. Press any key to start playing
3. Use the controls to jump and move
4. Avoid obstacles to survive longer
5. Press Space to restart after game over

### Browser Support
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Any browser supporting ES6+ JavaScript

## 🎨 Game Design

### Visual Elements
- **Player**: Blue rectangle with white eye (left side)
- **Obstacles**: Red/brown rectangles with varying heights
- **Ground**: Gray line at bottom
- **Background**: Gradient sky effect

### Game Mechanics
| Mechanic | Value |
|----------|-------|
| Jump Strength | 12 units |
| Gravity | 0.6 units/frame |
| Movement Speed | 5 pixels/frame |
| Obstacle Speed | 220 pixels/second |
| Spawn Interval | 1600 milliseconds |
| Min Obstacle Height | 20 pixels |
| Max Obstacle Height | 40 pixels |

## 💻 Code Quality

### Highlights
- ✅ **No external dependencies** - Pure vanilla JavaScript
- ✅ **Responsive design** - Works on mobile and desktop
- ✅ **Performance optimized** - Delta time calculations for smooth gameplay
- ✅ **Clean architecture** - Clear separation of concerns
- ✅ **Self-documenting** - Removed comments, clear function names
- ✅ **Memory efficient** - Proper cleanup of DOM elements
- ✅ **Collision detection** - AABB algorithm using native APIs

### Code Organization
- **State Management**: Organized objects for game, player, controls
- **Physics**: Gravity and velocity-based movement
- **Input Handling**: Keyboard event listeners
- **Game Loop**: RequestAnimationFrame for smooth animation
- **Collision Detection**: Efficient AABB algorithm

## 🔧 Development

### Key Functions

**Game Control**
- `initialiseGame()` - Set up game
- `gameLoop(timestamp)` - Main animation loop
- `endGame()` - Handle game over
- `resetGame()` - Reset game state

**Player Control**
- `handleKeyDown()` - Process input
- `movePlayer()` - Update player position
- `jump()` - Make player jump
- `applyGravity()` - Apply physics

**Obstacle Management**
- `createObstacle()` - Create obstacle
- `generateObstacles()` - Spawn obstacles
- `moveObstacles()` - Move obstacles
- `removeObstacles()` - Clean up and score

**Collision & Scoring**
- `isColliding()` - Check single collision
- `checkCollisions()` - Check all obstacles
- `updateScoreDisplay()` - Update UI

## 📈 Performance

- **Frame Rate**: Supports 60 FPS gameplay
- **Memory**: Efficient obstacle management with cleanup
- **Responsiveness**: Delta-time independent physics
- **Collision**: Optimized AABB algorithm

## 🎓 Learning Resources

See the included documentation:
- **GAMEPLAY_GUIDE.md** - How to play and strategies
- **CODE_STRUCTURE.md** - Architecture and design patterns
- **IMPLEMENTATION_SUMMARY.md** - Complete feature list

## 📝 Refactoring Summary

### Changes Made
1. **Removed all comments** (35 → 0 lines)
2. **Reduced code size** (289 → 220 lines, -24%)
3. **Improved readability** through clear naming
4. **Added randomized obstacles** for variety
5. **Enhanced visual feedback** on game over
6. **Implemented game reset** functionality

### Code Quality Improvements
- Self-documenting function names
- Consistent code formatting
- Logical function organization
- Removed redundant code
- Optimized variable usage

## 🎯 Assignment Completion

### Screenshot 1-2 Requirements
✅ All implemented and verified:
- HTML Structure
- CSS Styling
- JavaScript Logic
- Character Movement
- Gravity System
- Obstacle Generation
- Obstacle Movement
- Collision Detection
- Scoring System
- Game Over Handling

### Step 4 - Lorenzo Requirements
✅ All implemented and verified:
- Final score display
- Game-ending behavior
- JavaScript logic integration

### Refactoring Requirements
✅ All completed:
- Comments removed from all files
- Code reduced by 24%
- Readability maintained
- Functionality preserved

## 🚀 Future Enhancements

The code structure supports easy addition of:
- Sound effects and music
- Visual effects and particles
- Difficulty scaling over time
- High score tracking (localStorage)
- Power-ups and special items
- Multiple lives system
- Different game modes/levels

## 📄 License

This project is part of the AIFD course assignment.

## ✨ Credits

Built with vanilla JavaScript, HTML, and CSS.
- Architecture designed for maintainability and extensibility
- Responsive design for all devices
- Performance optimized for smooth gameplay

---

**Ready to play? Open `index.html` in your browser and start jumping! 🎮**
