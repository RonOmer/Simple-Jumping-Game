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
// Store the player's movement and jumping information.
const playerState = {
  x: 0,                // Horizontal position of the player.
  y: 0,                // Height above the ground.
  velocityY: 0,        // Vertical speed.
  speed: 5,            // Horizontal movement speed.
  jumpStrength: 12,    // Initial upward speed when jumping.
  gravity: 0.6,        // Force pulling the player downward.
  isJumping: false,    // Tracks whether the player is in the air.
};
// Store the keyboard controls currently being pressed.
const keys = {
  left: false,
  right: false,
};
// The ground is positioned 24px above the bottom of the game area.
const GROUND_HEIGHT = 24;
// Listen for keyboard input.
document.addEventListener("keydown", (event) => {
  // Prevent the arrow keys and spacebar from scrolling the page.
  if (
    event.code === "ArrowLeft" ||
    event.code === "ArrowRight" ||
    event.code === "ArrowUp" ||
    event.code === "Space"
  ) {
    event.preventDefault();
  }
  // Move left using the left arrow or A key.
  if (event.code === "ArrowLeft" || event.code === "KeyA") {
    keys.left = true;
  }
  // Move right using the right arrow or D key.
  if (event.code === "ArrowRight" || event.code === "KeyD") {
    keys.right = true;
  }
  // Jump using the spacebar or up arrow.
  if (
    (event.code === "Space" || event.code === "ArrowUp") &&
    !playerState.isJumping
  ) {
    playerState.velocityY = playerState.jumpStrength;
    playerState.isJumping = true;
  }
});
// Detect when movement keys are released.
document.addEventListener("keyup", (event) => {
  if (event.code === "ArrowLeft" || event.code === "KeyA") {
    keys.left = false;
  }
  if (event.code === "ArrowRight" || event.code === "KeyD") {
    keys.right = false;
  }
});
// Update the player's horizontal and vertical position.
function updatePlayer() {
  // Move the player horizontally.
  if (keys.left) {
    playerState.x -= playerState.speed;
  }
  if (keys.right) {
    playerState.x += playerState.speed;
  }
  // Prevent the player from leaving the game area.
  const maxX =
    gameElements.area.clientWidth - gameElements.player.offsetWidth;
  playerState.x = Math.max(0, Math.min(playerState.x, maxX));
  // Apply gravity while the player is jumping or falling.
  playerState.velocityY -= playerState.gravity;
  // Update the player's height.
  playerState.y += playerState.velocityY;
  // Keep the player on the ground when the jump ends.
  if (playerState.y <= 0) {
    playerState.y = 0;
    playerState.velocityY = 0;
    playerState.isJumping = false;
  }
  // Update the player's position on the screen.
  gameElements.player.style.left = `${playerState.x}px`;
  // Keep the player's feet above the ground line.
  gameElements.player.style.bottom =
    `${GROUND_HEIGHT + playerState.y}px`;
}
// Run the game animation continuously.
function gameLoop() {
  updatePlayer();
  // Request the next animation frame.
  requestAnimationFrame(gameLoop);
}
// Initialize the player's starting position and start animation.
function startGame() {
  // Check that the required HTML elements exist.
  if (!gameElements.area || !gameElements.player) {
    console.error("The game area or player element could not be found.");
    return;
  }
  // Set the player's initial horizontal position.
  playerState.x = gameElements.area.clientWidth * 0.1;
  // Reset the player's jumping state.
  playerState.y = 0;
  playerState.velocityY = 0;
  playerState.isJumping = false;
  // Position the player relative to the game area.
  gameElements.player.style.position = "absolute";
  gameElements.player.style.left = `${playerState.x}px`;
  gameElements.player.style.bottom = `${GROUND_HEIGHT}px`;
  // Start the animation loop only once.
  if (!gameState.isRunning) {
    gameState.isRunning = true;
    gameLoop();
  }
}
// Start after the HTML document has loaded.
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", startGame);
} else {
  startGame();
}
