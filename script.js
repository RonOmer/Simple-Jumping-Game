"use strict";

const gameElements = {
  area: document.querySelector("#game-area"),
  player: document.querySelector("#player"),
  obstacles: document.querySelector("#obstacles"),
  ground: document.querySelector("#ground"),
  scoreDisplay: document.querySelector("#score-display"),
};

const gameState = {
  isRunning: false,
  isGameOver: false,
  score: 0,
};