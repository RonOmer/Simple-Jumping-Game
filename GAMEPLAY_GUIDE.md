# Simple Jumping Game - Gameplay Guide

## 🎮 Controls

| Action | Keys |
|--------|------|
| **Jump** | <kbd>Space</kbd> or <kbd>↑</kbd> |
| **Move Left** | <kbd>←</kbd> or <kbd>A</kbd> |
| **Move Right** | <kbd>→</kbd> or <kbd>D</kbd> |
| **Start Game** | Any key (when not playing) |
| **Reset Game** | <kbd>Space</kbd> (when game over) |

## 🕹️ How to Play

1. **Start**: Press any key to begin the game
2. **Avoid Obstacles**: Use movement and jump to dodge incoming obstacles
3. **Collect Points**: Each obstacle you successfully pass increases your score
4. **Game Over**: If you touch an obstacle, the game ends
5. **Restart**: Press Space to play again after game over

## 📊 Game Mechanics

### Scoring
- **+1 Point**: Each obstacle that passes off-screen without collision
- **Display**: Score shown at top right (5-digit format: 00000)
- **Final Score**: Displayed when game ends

### Difficulty Progression
- Obstacles spawn every 1.6 seconds
- Obstacle heights vary randomly (20-40px) for unpredictability
- Obstacles move at constant speed (220px/second)
- No difficulty scaling - consistent challenge throughout

### Physics
- **Gravity**: 0.6 units per frame (realistic jumping feel)
- **Jump Strength**: 12 units (vertical velocity on jump)
- **Movement Speed**: 5 pixels per frame
- **Delta Time**: Frame-rate independent movement

## 🎯 Tips & Strategies

1. **Timing**: Jump early and land precisely to avoid obstacles
2. **Movement**: Use left/right keys to position yourself optimally
3. **Momentum**: You can move in any direction while jumping
4. **Pattern Recognition**: Obstacles come at regular intervals - anticipate incoming obstacles
5. **Boundary Awareness**: Stay within the game area (player can't leave horizontally)

## 🏆 Challenge Goals

- **Beginner**: Reach a score of 10
- **Intermediate**: Reach a score of 25
- **Expert**: Reach a score of 50
- **Master**: Reach a score of 100+

## 🔧 Technical Details

### Game States
- **Idle**: Game not started (show "Get ready to run!")
- **Running**: Game actively playing
- **Game Over**: Collision occurred (show "Game Over! Final Score: X")

### Collision Detection
- Uses AABB (Axis-Aligned Bounding Box) collision
- Based on visual bounding rectangles
- Checked every frame during gameplay

### Performance
- Optimized delta-time calculations for smooth gameplay
- Efficient obstacle management (removed off-screen objects)
- No memory leaks - proper cleanup on reset

## 📱 Responsive Design
- Game adapts to different screen sizes
- Works on desktop and tablet
- Mobile touch controls can be added in future versions

## 🐛 Known Behaviors

- Player cannot move outside the game area horizontally
- Obstacles cannot be partially avoided - collision is all-or-nothing
- Score only increments when obstacle fully leaves the screen
- Game state resets completely when pressing Space after game over
- All obstacles are cleared on restart

## 🎨 Visual Feedback

- **Player**: Blue rectangle with white eye (left side)
- **Obstacles**: Red/brown rectangles (right side, varying heights)
- **Ground**: Gray line at bottom
- **Score**: Digital display (5 digits, monospace font)
- **Game Over**: Red, bold caption text
- **Smooth Transitions**: Caption color and styling changes smoothly

---

**Enjoy the game! 🎮**
