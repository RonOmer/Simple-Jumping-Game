"use strict";
// Select the HTML elements used by the game.
const gameElements = {
  area: document.querySelector("#game-area"),
  player: document.querySelector("#player"),
  obstacles: document.querySelector("#obstacles"),
  ground: document.querySelector("#ground"),
  scoreDisplay: document.querySelector("#score-display"),
};
// Store the current state of the game.
const gameState = {
  isRunning: false,
  isGameOver: false,
  score: 0,
};
// Store the player's movement information.
const playerState = {
  x: 30,             // Horizontal position of the player.
  y: 0,              // Vertical position above the ground.
  velocityY: 0,      // Vertical speed during a jump or fall.
  speed: 5,           // Horizontal movement speed.
  jumpStrength: 12,   // Initial upward speed when jumping.
  gravity: 0.6,       // Force that pulls the player downward.
  isJumping: false,   // Prevents the player from jumping repeatedly in mid-air.
};
// Track which movement keys are currently pressed.
const keys = {
  left: false,
  right: false,
};
// Listen for keys being pressed.
document.addEventListener("keydown", (event) => {
  // Prevent the arrow keys and spacebar from scrolling the page.
  if (
    event.code === "ArrowLeft" ||
    event.code === "ArrowRight" ||
    event.code === "Space"
  ) {
    event.preventDefault();
  }
  // Move left with the left arrow or A key.
  if (event.code === "ArrowLeft" || event.code === "KeyA") {
    keys.left = true;
  }
  // Move right with the right arrow or D key.
  if (event.code === "ArrowRight" || event.code === "KeyD") {
    keys.right = true;
  }
  // Jump with the spacebar or up arrow.
  if (
    (event.code === "Space" || event.code === "ArrowUp") &&
    !playerState.isJumping
  ) {
    playerState.velocityY = playerState.jumpStrength;
    playerState.isJumping = true;
  }
});
// Listen for keys being released.
document.addEventListener("keyup", (event) => {
  if (event.code === "ArrowLeft" || event.code === "KeyA") {
    keys.left = false;
  }
  if (event.code === "ArrowRight" || event.code === "KeyD") {
    keys.right = false;
  }
});
// Update the player's position and apply gravity.
function updatePlayer() {
  // Move the player horizontally according to the pressed keys.
  if (keys.left) {
    playerState.x -= playerState.speed;
  }
  if (keys.right) {
    playerState.x += playerState.speed;
  }
  // Keep the player inside the game area.
  const maxX = gameElements.area.clientWidth - gameElements.player.offsetWidth;
  playerState.x = Math.max(0, Math.min(playerState.x, maxX));
  // Apply gravity by reducing the upward velocity over time.
  playerState.velocityY -= playerState.gravity;
  // Update the player's vertical position.
  playerState.y += playerState.velocityY;
  // Stop the player from falling through the ground.
  if (playerState.y <= 0) {
    playerState.y = 0;
    playerState.velocityY = 0;
    playerState.isJumping = false;
  }
  // Apply the calculated position to the player's HTML element.
  gameElements.player.style.left = `${playerState.x}px`;
  gameElements.player.style.bottom = `${playerState.y}px`;
}
// Run the movement update repeatedly for smooth animation.
function gameLoop() {
  updatePlayer();
  requestAnimationFrame(gameLoop);
}
// Set up the player's initial position and start the animation.
function startGame() {
  // Ensure the game area and player exist before starting.
  if (!gameElements.area || !gameElements.player) {
    console.error("The game area or player element could not be found.");
    return;
  }
  // Position the player at the starting point.
  gameElements.player.style.position = "absolute";
  gameElements.player.style.left = `${playerState.x}px`;
  gameElements.player.style.bottom = "0px";
  // Start the game loop only once.
  if (!gameState.isRunning) {
    gameState.isRunning = true;
    gameLoop();
  }
}
// Start the game after the HTML document has loaded.
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", startGame);
} else {
  startGame();
}
