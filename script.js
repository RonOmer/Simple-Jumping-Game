"use strict";

const gameElements = {
  area: document.querySelector("#game-area"),
  player: document.querySelector("#player"),
  obstacles: document.querySelector("#obstacles"),
  ground: document.querySelector("#ground"),
  scoreDisplay: document.querySelector("#score-display"),
  caption: document.querySelector(".game-caption"),
};

const gameState = {
  isRunning: false,
  isGameOver: false,
  score: 0,
};

const playerState = {
  positionY: 0,
  velocityY: 0,
  jumpStrength: 12,
  gravity: 0.6,
  isJumping: false,
};

const keys = {
  left: false,
  right: false,
};

const movement = {
  speed: 5,
};

const obstacleSettings = {
  speed: 220,
  interval: 1600,
  elapsedTime: 0,
  lastFrameTime: null,
  minHeight: 20,
  maxHeight: 40,
};

if (gameElements.area && gameElements.player && gameElements.obstacles && 
    gameElements.ground && gameElements.scoreDisplay) {
  initialiseGame();
}

function initialiseGame() {
  document.addEventListener("keydown", handleKeyDown);
  document.addEventListener("keyup", handleKeyUp);
  window.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
      event.preventDefault();
    }
  });
  updateScoreDisplay();
  updatePlayerPosition();
}

function handleKeyDown(event) {
  if (!gameState.isRunning && !gameState.isGameOver) {
    gameState.isRunning = true;
    requestAnimationFrame(gameLoop);
  }

  if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
    keys.left = true;
  }

  if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
    keys.right = true;
  }

  if (event.code === "Space" || event.key === "ArrowUp") {
    jump();
  }
}

function handleKeyUp(event) {
  if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
    keys.left = false;
  }

  if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
    keys.right = false;
  }
}

function jump() {
  if (!playerState.isJumping && !gameState.isGameOver) {
    playerState.velocityY = playerState.jumpStrength;
    playerState.isJumping = true;
  }
}

function movePlayer() {
  const areaWidth = gameElements.area.clientWidth;
  const playerWidth = gameElements.player.offsetWidth;
  let positionX = gameElements.player.offsetLeft;

  if (keys.left) {
    positionX -= movement.speed;
  }

  if (keys.right) {
    positionX += movement.speed;
  }

  positionX = Math.max(0, Math.min(positionX, areaWidth - playerWidth));
  gameElements.player.style.left = `${positionX}px`;
}

function applyGravity() {
  playerState.velocityY -= playerState.gravity;
  playerState.positionY += playerState.velocityY;

  if (playerState.positionY <= 0) {
    playerState.positionY = 0;
    playerState.velocityY = 0;
    playerState.isJumping = false;
  }

  updatePlayerPosition();
}

function updatePlayerPosition() {
  gameElements.player.style.bottom = `${30 + playerState.positionY}px`;
}

function updateScoreDisplay() {
  gameElements.scoreDisplay.value = String(gameState.score).padStart(5, "0");
}

function getRandomHeight() {
  return Math.floor(Math.random() * (obstacleSettings.maxHeight - obstacleSettings.minHeight + 1)) + obstacleSettings.minHeight;
}

function createObstacle() {
  const obstacle = document.createElement("div");
  obstacle.classList.add("obstacle");
  
  const height = getRandomHeight();
  obstacle.style.height = `${height}px`;
  obstacle.style.right = "auto";
  obstacle.style.left = `${gameElements.area.clientWidth}px`;
  obstacle.style.bottom = "30px";

  gameElements.obstacles.appendChild(obstacle);
}

function generateObstacles(deltaTime) {
  obstacleSettings.elapsedTime += deltaTime;

  if (obstacleSettings.elapsedTime >= obstacleSettings.interval) {
    createObstacle();
    obstacleSettings.elapsedTime = 0;
  }
}

function moveObstacles(deltaTime) {
  const obstacles = gameElements.obstacles.children;
  const distance = obstacleSettings.speed * deltaTime / 1000;

  for (const obstacle of obstacles) {
    let positionX = parseFloat(obstacle.style.left);
    positionX -= distance;
    obstacle.style.left = `${positionX}px`;
  }
}

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

function checkCollisions() {
  const obstacles = gameElements.obstacles.children;

  for (const obstacle of obstacles) {
    if (isColliding(obstacle)) {
      endGame();
      return;
    }
  }
}

function endGame() {
  gameState.isRunning = false;
  gameState.isGameOver = true;
  keys.left = false;
  keys.right = false;

  gameElements.caption.textContent = `Game Over! Final Score: ${gameState.score}`;
  gameElements.caption.style.color = "#e27a60";
  gameElements.caption.style.fontWeight = "bold";
}

function resetGame() {
  gameState.isRunning = false;
  gameState.isGameOver = false;
  gameState.score = 0;
  playerState.positionY = 0;
  playerState.velocityY = 0;
  playerState.isJumping = false;
  obstacleSettings.elapsedTime = 0;
  obstacleSettings.lastFrameTime = null;
  keys.left = false;
  keys.right = false;

  gameElements.obstacles.innerHTML = "";
  updateScoreDisplay();
  updatePlayerPosition();
  gameElements.caption.textContent = "Get ready to run!";
  gameElements.caption.style.color = "";
  gameElements.caption.style.fontWeight = "";
}

document.addEventListener("keydown", (event) => {
  if (gameState.isGameOver && event.key === " ") {
    resetGame();
    event.preventDefault();
  }
});

function gameLoop(timestamp) {
  if (!gameState.isRunning || gameState.isGameOver) {
    return;
  }

  if (obstacleSettings.lastFrameTime === null) {
    obstacleSettings.lastFrameTime = timestamp;
  }

  const deltaTime = timestamp - obstacleSettings.lastFrameTime;
  obstacleSettings.lastFrameTime = timestamp;

  movePlayer();
  applyGravity();
  generateObstacles(deltaTime);
  moveObstacles(deltaTime);
  removeObstacles();
  checkCollisions();

  if (gameState.isRunning) {
    requestAnimationFrame(gameLoop);
  }
}
