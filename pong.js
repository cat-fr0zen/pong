const canvas = document.getElementById("écran_de_jeu");
const ctx = canvas.getContext("2d");

// Dimensions du canvas
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

// Raquettes
const paddleWidth = 10;
const paddleHeight = 80;
const playerPaddle = { x: 10, y: canvasHeight / 2 - paddleHeight / 2, speed: 5 };
const botPaddle = { x: canvasWidth - 20, y: canvasHeight / 2 - paddleHeight / 2, speed: 3 };

// Balle
const ball = {
  x: canvasWidth / 2,
  y: canvasHeight / 2,
  radius: 8,
  speedX: 4,
  speedY: 4,
};

// Dessiner les raquettes
function drawPaddle(paddle) {
  ctx.fillStyle = "white";
  ctx.fillRect(paddle.x, paddle.y, paddleWidth, paddleHeight);
}

// Dessiner la balle
function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.closePath();
}

// Déplacer la balle
function moveBall() {
  ball.x += ball.speedX;
  ball.y += ball.speedY;

  // Collision avec le haut et le bas
  if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvasHeight) {
    ball.speedY *= -1;
  }

  // Collision avec les raquettes
  if (
    ball.x - ball.radius < playerPaddle.x + paddleWidth &&
    ball.y > playerPaddle.y &&
    ball.y < playerPaddle.y + paddleHeight
  ) {
    ball.speedX *= -1;
  }

  if (
    ball.x + ball.radius > botPaddle.x &&
    ball.y > botPaddle.y &&
    ball.y < botPaddle.y + paddleHeight
  ) {
    ball.speedX *= -1;
  }

  // Réinitialiser la balle si elle sort des limites
  if (ball.x < 0 || ball.x > canvasWidth) {
    ball.x = canvasWidth / 2;
    ball.y = canvasHeight / 2;
    ball.speedX *= -1;
  }
}

// Déplacer la raquette du joueur
function movePlayerPaddle(direction) {
  if (direction === "up" && playerPaddle.y > 0) {
    playerPaddle.y -= playerPaddle.speed;
  } else if (direction === "down" && playerPaddle.y < canvasHeight - paddleHeight) {
    playerPaddle.y += playerPaddle.speed;
  }
}

// Déplacer la raquette du bot
function moveBotPaddle() {
  if (ball.y < botPaddle.y + paddleHeight / 2) {
    botPaddle.y -= botPaddle.speed;
  } else if (ball.y > botPaddle.y + paddleHeight / 2) {
    botPaddle.y += botPaddle.speed;
  }
}

// Dessiner le jeu
function draw() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight); // Effacer le canvas
  drawPaddle(playerPaddle);
  drawPaddle(botPaddle);
  drawBall();
}

// Mettre à jour le jeu
function update() {
  moveBall();
  moveBotPaddle();
  draw();
}

// Gérer les entrées clavier
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") {
    movePlayerPaddle("up");
  } else if (e.key === "ArrowDown") {
    movePlayerPaddle("down");
  }
});

// Boucle de jeu
setInterval(update, 1000 / 60); // 60 FPS