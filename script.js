
"use strict";

const gameElements = {
  area: document.querySelector("#game-area"),
  player: document.querySelector("#player"),
  obstacles: document.querySelector("#obstacles"),
  scoreDisplay: document.querySelector("#score-display"),
  caption: document.querySelector(".game-caption"),
  clouds: document.querySelector("#clouds"),
};

const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function playSound(freq1, freq2, duration, gain1 = 0.3) {
  const now = audioContext.currentTime;
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();

  osc.connect(gain);
  gain.connect(audioContext.destination);

  osc.frequency.setValueAtTime(freq1, now);
  osc.frequency.exponentialRampToValueAtTime(freq2, now + duration);
  gain.gain.setValueAtTime(gain1, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

  osc.start(now);
  osc.stop(now + duration);
}

const gameState = {
  isRunning: false,
  isGameOver: false,
  score: 0,
};

const playerState = {
  positionY: 0,
  velocityY: 0,
  isJumping: false,
  direction: 1,
  lastDirection: 1,
  isMoving: false,
  spriteFrame: 0,
  animationTime: 0,
};

const keys = { left: false, right: false };

const CONFIG = {
  jump: 12,
  gravity: 0.6,
  moveSpeed: 5,
  spriteWidth: 24,
  spriteHeight: 42,
  obstacleSpeed: 220,
  obstacleInterval: 1600,
  minObstacleHeight: 20,
  maxObstacleHeight: 40,
  animationSpeed: 200,
};

const gameData = {
  elapsedTime: 0,
  lastFrameTime: null,
  currentInterval: CONFIG.obstacleInterval,
  initialPlayerX: 0,
};

if (
  gameElements.area &&
  gameElements.player &&
  gameElements.obstacles &&
  gameElements.scoreDisplay &&
  gameElements.caption &&
  gameElements.clouds
) {
  init();
}

function init() {
  gameData.initialPlayerX = gameElements.player.offsetLeft;

  document.addEventListener("keydown", handleKeyDown);
  document.addEventListener("keyup", handleKeyUp);
  window.addEventListener("keydown", (e) => e.code === "Space" && e.preventDefault());

  generateClouds();
  updateScore();
  updatePlayer();
}

function handleKeyDown(e) {
  if (!gameState.isRunning && !gameState.isGameOver) {
    gameState.isRunning = true;
    requestAnimationFrame(gameLoop);
  }

  if (e.key === "ArrowLeft") keys.left = true;
  if (e.key === "ArrowRight") keys.right = true;
  if (e.code === "Space" || e.key === "ArrowUp") jump();
}

function handleKeyUp(e) {
  if (e.key === "ArrowLeft") keys.left = false;
  if (e.key === "ArrowRight") keys.right = false;
}

function jump() {
  if (!playerState.isJumping && !gameState.isGameOver) {
    playerState.velocityY = CONFIG.jump;
    playerState.isJumping = true;
    playSound(400, 800, 0.1, 0.3);
  }
}

function movePlayer() {
  const areaWidth = gameElements.area.clientWidth;
  const playerWidth = gameElements.player.offsetWidth;
  let positionX = gameElements.player.offsetLeft;
  let moved = false;

  if (keys.left) {
    positionX -= CONFIG.moveSpeed;
    playerState.direction = -1;
    playerState.isMoving = true;
    moved = true;
  }

  if (keys.right) {
    positionX += CONFIG.moveSpeed;
    playerState.direction = 1;
    playerState.isMoving = true;
    moved = true;
  }

  if (!moved) playerState.isMoving = false;

  positionX = Math.max(0, Math.min(positionX, areaWidth - playerWidth));
  gameElements.player.style.left = `${positionX}px`;
}

function applyGravity() {
  playerState.velocityY -= CONFIG.gravity;
  playerState.positionY += playerState.velocityY;

  if (playerState.positionY <= 0) {
    playerState.positionY = 0;
    playerState.velocityY = 0;
    playerState.isJumping = false;
  }

  updatePlayer();
}

function updatePlayer() {
  gameElements.player.style.bottom = `${30 + playerState.positionY}px`;
  updateSprite();
}

function updateSprite(deltaTime = 0) {
  if (playerState.isMoving) {
    playerState.lastDirection = playerState.direction;
    playerState.animationTime += deltaTime;

    if (playerState.animationTime >= CONFIG.animationSpeed) {
      playerState.spriteFrame = playerState.spriteFrame === 0 ? 2 : 0;
      playerState.animationTime = 0;
    }
  } else {
    playerState.spriteFrame = 1;
    playerState.animationTime = 0;
  }

  if (playerState.isJumping) playerState.spriteFrame = 0;

  const offsetX = playerState.spriteFrame * CONFIG.spriteWidth;
  gameElements.player.style.backgroundPosition = `-${offsetX}px 0px`;

  const isFlipped = playerState.direction === -1 ||
    (!playerState.isMoving && playerState.lastDirection === -1);

  gameElements.player.style.transform = isFlipped ? "scaleX(-1)" : "scaleX(1)";
}

function updateScore() {
  gameElements.scoreDisplay.value = String(gameState.score).padStart(5, "0");
}

function getRandomHeight() {
  return Math.floor(
    Math.random() * (CONFIG.maxObstacleHeight - CONFIG.minObstacleHeight + 1)
  ) + CONFIG.minObstacleHeight;
}

function getRandomColor() {
  const colors = [
    { body: "#ff4757", border: "#ff1744", glow: "rgba(255, 71, 87, 0.5)" },
    { body: "#ffb347", border: "#ff9500", glow: "rgba(255, 179, 71, 0.5)" },
    { body: "#a29bfe", border: "#6c5ce7", glow: "rgba(162, 155, 254, 0.5)" },
    { body: "#74b9ff", border: "#0984e3", glow: "rgba(116, 185, 255, 0.5)" },
    { body: "#55efc4", border: "#00b894", glow: "rgba(85, 239, 196, 0.5)" },
    { body: "#fd79a8", border: "#e84393", glow: "rgba(253, 121, 168, 0.5)" },
  ];

  return colors[Math.floor(Math.random() * colors.length)];
}

function getRandomSpacing() {
  return Math.random() * 800 + 800;
}

function generateClouds() {
  const cloudCount = 3;
  const areaHeight = gameElements.area.clientHeight;

  for (let i = 0; i < cloudCount; i++) {
    const cloud = document.createElement("div");
    cloud.classList.add("cloud");

    const width = Math.random() * 60 + 40;
    const height = Math.random() * 20 + 15;
    const top = Math.random() * (areaHeight * 0.5 - 50);
    const duration = Math.random() * 10 + 15;

    cloud.style.width = `${width}px`;
    cloud.style.height = `${height}px`;
    cloud.style.top = `${top}px`;
    cloud.style.left = `-${width}px`;
    cloud.style.animation = `cloudDrift ${duration}s linear infinite`;

    gameElements.clouds.appendChild(cloud);
  }
}

function createObstacle() {
  const obstacle = document.createElement("div");
  obstacle.classList.add("obstacle");

  const height = getRandomHeight();
  const color = getRandomColor();

  obstacle.style.height = `${height}px`;
  obstacle.style.left = `${gameElements.area.clientWidth}px`;
  obstacle.style.bottom = "30px";
  obstacle.style.setProperty("--color-body", color.body);
  obstacle.style.setProperty("--color-border", color.border);
  obstacle.style.setProperty("--color-glow", color.glow);

  gameElements.obstacles.appendChild(obstacle);
}

function generateObstacles(deltaTime) {
  gameData.elapsedTime += deltaTime;

  if (gameData.elapsedTime >= gameData.currentInterval) {
    createObstacle();
    gameData.elapsedTime = 0;
    gameData.currentInterval = getRandomSpacing();
  }
}

function moveObstacles(deltaTime) {
  const currentSpeed = CONFIG.obstacleSpeed + (gameState.score * 5);
  const distance = currentSpeed * deltaTime / 1000;

  for (const obstacle of gameElements.obstacles.children) {
    let positionX = parseFloat(obstacle.style.left);
    obstacle.style.left = `${positionX - distance}px`;
  }
}

function removeObstacles() {
  for (const obstacle of Array.from(gameElements.obstacles.children)) {
    if (obstacle.offsetLeft + obstacle.offsetWidth < 0) {
      obstacle.remove();
      gameState.score++;
      updateScore();
    }
  }
}

function checkCollisions() {
  const playerRect = gameElements.player.getBoundingClientRect();

  for (const obstacle of gameElements.obstacles.children) {
    const obstacleRect = obstacle.getBoundingClientRect();

    if (
      playerRect.left < obstacleRect.right &&
      playerRect.right > obstacleRect.left &&
      playerRect.top < obstacleRect.bottom &&
      playerRect.bottom > obstacleRect.top
    ) {
      playSound(200, 50, 0.15, 0.4);
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

  gameElements.caption.innerHTML = `
    <strong>Game Over!</strong> Final Score: <strong>${gameState.score}</strong>.<br />
    Press Space to play again!
  `;

  gameElements.caption.style.color = "#e27a60";
}

function resetGame() {
  gameState.isRunning = false;
  gameState.isGameOver = false;
  gameState.score = 0;

  playerState.positionY = 0;
  playerState.velocityY = 0;
  playerState.isJumping = false;
  playerState.direction = 1;
  playerState.lastDirection = 1;
  playerState.isMoving = false;
  playerState.spriteFrame = 0;
  playerState.animationTime = 0;

  gameElements.player.style.left = `${gameData.initialPlayerX}px`;

  gameData.elapsedTime = 0;
  gameData.lastFrameTime = null;
  gameData.currentInterval = CONFIG.obstacleInterval;

  keys.left = false;
  keys.right = false;

  gameElements.obstacles.innerHTML = "";

  updateScore();
  updatePlayer();

  gameElements.caption.textContent = "Get ready to run!";
  gameElements.caption.style.color = "";
  gameElements.caption.style.fontWeight = "";
}

document.addEventListener("keydown", (e) => {
  if (gameState.isGameOver && e.code === "Space") {
    resetGame();
    e.preventDefault();
  }
});

function gameLoop(timestamp) {
  if (!gameState.isRunning || gameState.isGameOver) return;

  if (gameData.lastFrameTime === null) {
    gameData.lastFrameTime = timestamp;
  }

  const deltaTime = timestamp - gameData.lastFrameTime;
  gameData.lastFrameTime = timestamp;

  movePlayer();
  applyGravity();
  updateSprite(deltaTime);
  generateObstacles(deltaTime);
  moveObstacles(deltaTime);
  removeObstacles();
  checkCollisions();

  if (gameState.isRunning) {
    requestAnimationFrame(gameLoop);
  }
}
