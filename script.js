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
  positionY: 0,       // Current vertical position of the player.
  velocityY: 0,       // Current vertical speed.
  jumpStrength: 12,   // Strength of the jump.
  gravity: 0.6,       // Gravity pulls the player downward.
  isJumping: false,   // True while the player is in the air.
};
// Store the keyboard input state.
const keys = {
  left: false,
  right: false,
};
// Movement settings.
const movement = {
  speed: 5,
};

// Obstacle settings
const obstacleSettings = {
  speed: 220,
  interval: 1600,
  elapsedTime: 0,
  lastFrameTime: null,
};


// Check that the required HTML elements exist before starting.
if (
  gameElements.area &&
  gameElements.player &&
  gameElements.obstacles &&
  gameElements.ground &&
  gameElements.scoreDisplay
) {
  initialiseGame();
} else {
  console.error(
    "Game could not start. Please check the element IDs in index.html."
  );
}
// Set up the game and keyboard controls.
function initialiseGame() {
  // Start the game when the player presses a movement key.
  document.addEventListener("keydown", handleKeyDown);
  // Stop movement when the player releases a key.
  document.addEventListener("keyup", handleKeyUp);
  // Prevent the page from scrolling when Space is pressed.
  window.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
      event.preventDefault();
    }
  });
  // Display the initial score.
  updateScoreDisplay();
  // Draw the player at the starting position.
  updatePlayerPosition();
}
// Handle keys pressed by the player.
function handleKeyDown(event) {
  // Start the game when a movement key is pressed.
  if (!gameState.isRunning && !gameState.isGameOver) {
    gameState.isRunning = true;
    requestAnimationFrame(gameLoop);
  }
  // Move the player to the left.
  if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
    keys.left = true;
  }
  // Move the player to the right.
  if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
    keys.right = true;
  }
  // Jump when Space or the Up Arrow is pressed.
  if (
    event.code === "Space" ||
    event.key === "ArrowUp"
  ) {
    jump();
  }
}
// Handle keys released by the player.
function handleKeyUp(event) {
  // Stop moving left when the key is released.
  if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
    keys.left = false;
  }
  // Stop moving right when the key is released.
  if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
    keys.right = false;
  }
}
// Make the player jump.
function jump() {
  // Allow jumping only when the player is on the ground.
  if (!playerState.isJumping && !gameState.isGameOver) {
    playerState.velocityY = playerState.jumpStrength;
    playerState.isJumping = true;
  }
}
// Update the player's horizontal position.
function movePlayer() {
  const areaWidth = gameElements.area.clientWidth;
  const playerWidth = gameElements.player.offsetWidth;
  // Read the player's current horizontal position.
  let positionX = gameElements.player.offsetLeft;
  // Move left when the left key is pressed.
  if (keys.left) {
    positionX -= movement.speed;
  }
  // Move right when the right key is pressed.
  if (keys.right) {
    positionX += movement.speed;
  }
  // Keep the player inside the game area.
  positionX = Math.max(
    0,
    Math.min(positionX, areaWidth - playerWidth)
  );
  // Apply the new horizontal position.
  gameElements.player.style.left = `${positionX}px`;
}
// Apply gravity and update the player's vertical position.
function applyGravity() {
  // Gravity gradually reduces the upward velocity.
  playerState.velocityY -= playerState.gravity;
  // Update the player's vertical position.
  playerState.positionY += playerState.velocityY;
  // Stop the player from falling through the ground.
  if (playerState.positionY <= 0) {
    playerState.positionY = 0;
    playerState.velocityY = 0;
    playerState.isJumping = false;
  }
  // Update the player's position on the screen.
  updatePlayerPosition();
}
// Update the player's visual vertical position.
function updatePlayerPosition() {
  // The player starts at the bottom of the game area.
  // A positive positionY moves the player upward.
  gameElements.player.style.bottom =
    `${30 + playerState.positionY}px`;
}
// Update the score shown in the HTML.
function updateScoreDisplay() {
  // Display the score as five digits, for example 00000.
  gameElements.scoreDisplay.value =
    String(gameState.score).padStart(5, "0");
}

// Create a new obstacle
function createObstacle() {
  const obstacle = document.createElement("div");

  obstacle.classList.add("obstacle");
  obstacle.style.right = "auto";
  obstacle.style.left = `${gameElements.area.clientWidth}px`;

  gameElements.obstacles.appendChild(obstacle);
}

// Generate obstacles at regular intervals
function generateObstacles(deltaTime) {
  obstacleSettings.elapsedTime += deltaTime;

  if (obstacleSettings.elapsedTime >= obstacleSettings.interval) {
    createObstacle();
    obstacleSettings.elapsedTime = 0;
  }
}

// Move obstacles from right to left
function moveObstacles(deltaTime) {
  const obstacles = gameElements.obstacles.children;
  const distance = obstacleSettings.speed * deltaTime / 1000;

  for (const obstacle of obstacles) {
    let positionX = parseFloat(obstacle.style.left);

    positionX -= distance;
    obstacle.style.left = `${positionX}px`;
  }
}

// Remove obstacles that leave the game area
function removeObstacles() {
  const obstacles = gameElements.obstacles.children;

  for (const obstacle of Array.from(obstacles)) {
    if (obstacle.offsetLeft + obstacle.offsetWidth < 0) {
      obstacle.remove();
      gameState.score++;
      updateScoreDisplay();
    }
  }
}

// Check collision between player and one obstacle
function isColliding(obstacle) {
  const playerRect = gameElements.player.getBoundingClientRect();
  const obstacleRect = obstacle.getBoundingClientRect();

  return (
    playerRect.left < obstacleRect.right &&
    playerRect.right > obstacleRect.left &&
    playerRect.top < obstacleRect.bottom &&
    playerRect.bottom > obstacleRect.top
  );
}

// Check all obstacles for collisions
function checkCollisions() {
  const obstacles = gameElements.obstacles.children;

  for (const obstacle of obstacles) {
    if (isColliding(obstacle)) {
      endGame();
      return;
    }
  }
}

// Stop the game and display the final score
function endGame() {
  gameState.isRunning = false;
  gameState.isGameOver = true;

  keys.left = false;
  keys.right = false;

  const caption = document.querySelector(".game-caption");

  caption.textContent =
    `Game Over! Final Score: ${gameState.score}`;
}


// Main game loop: update movement and jumping continuously.
function gameLoop(timestamp) {
  // Stop updating if the game is not running.
  if (!gameState.isRunning || gameState.isGameOver) {
    return;
  }

  
  if (obstacleSettings.lastFrameTime === null) {
    obstacleSettings.lastFrameTime = timestamp;
  }

  const deltaTime = timestamp - obstacleSettings.lastFrameTime;
  obstacleSettings.lastFrameTime = timestamp;


  // Update horizontal movement.
  movePlayer();
  // Update jumping and gravity.
  applyGravity();

  generateObstacles(deltaTime);
  moveObstacles(deltaTime);
  removeObstacles();
  checkCollisions();

  // Continue the game on the next animation frame.
  // requestAnimationFrame(gameLoop);

  // Continue the game on the next animation frame if the game is still running.
  if (gameState.isRunning) {
    requestAnimationFrame(gameLoop);
  }

}
