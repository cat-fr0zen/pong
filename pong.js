/* Jeu de Pong simple avec raquette contrôlée par flèches, boutons et tactile*/
const canvas = document.getElementById('écran_de_jeu');
const ctx = canvas.getContext('2d');
// Taille du canvas
canvas.width = 350;
canvas.height = 600;
// Variables de jeu
let score = 0;        
let startTime = 0; 
let gameRunning = false;
let gameOver = false;
const MIN_HORIZONTAL_RATIO = 0.15;// Pour éviter les angles trop plats
// Boutons
const startBtn = document.getElementById('start');
const resetBtn = document.getElementById('reset');
const leftBtn  = document.getElementById('leftBtn');
const rightBtn = document.getElementById('rightBtn');

// Raquette
let raquette = {
  w: 80,
  h: 15,
  x: canvas.width / 2 - 40,
  y: canvas.height - 30,
  speed: 7,
  dx: 0
};

// Balle
let balle = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  r: 10,
  speed: 1,
  dx: 0,
  dy: 0
};



//bouton Démarrer / Reset
startBtn.onclick = () => {
  if (!gameRunning) startGame();
};

resetBtn.onclick = () => {
  gameRunning = false;
  gameOver = false;
  score = 0;
  raquette.dx = 0;
  balle.dx = 0;
  balle.dy = 0;
  balle.speed = BASE_BALL_SPEED;
  placeballeaudessusraquette();
  draw();
};

// Clavier (uniquement pour les flèches gauche/droite)
let keyLeftDown = false;
let keyRightDown = false;


document.addEventListener('keydown', (e) => {
  if (e.key === "ArrowLeft") {
    keyLeftDown = true;
    raquette.dx = -raquette.speed;
  }
  if (e.key === "ArrowRight") {
    keyRightDown = true;
    raquette.dx = raquette.speed;
  }
});

document.addEventListener('keyup', (e) => {
  if (e.key === "ArrowLeft") keyLeftDown = false;
  if (e.key === "ArrowRight") keyRightDown = false;
  if (!keyLeftDown && !keyRightDown) raquette.dx = 0;
});

// Contrôles “appui continu” pour les flèches (souris + touch)
function startHold(side) {
  if (side === 'left') {
    raquette.dx = -raquette.speed;
    leftBtn.classList.add('hold-left');
  } else {
    raquette.dx = raquette.speed;
    rightBtn.classList.add('hold-right');
  }
}

// Arrêt appui continu
function stopHold() {
  if (!keyLeftDown && !keyRightDown) raquette.dx = 0;// Arrêt du déplacement si pas de touche clavier ou enfoncée
}

// Souris
leftBtn.addEventListener('mousedown', () => startHold('left'));
rightBtn.addEventListener('mousedown', () => startHold('right'));
window.addEventListener('mouseup', stopHold);
leftBtn.addEventListener('mouseleave', stopHold);
rightBtn.addEventListener('mouseleave', stopHold);

// Tactile
leftBtn.addEventListener('touchstart', (e) => { e.preventDefault(); startHold('left'); }, { passive: false });
rightBtn.addEventListener('touchstart', (e) => { e.preventDefault(); startHold('right'); }, { passive: false });
window.addEventListener('touchend', stopHold, { passive: true });
window.addEventListener('touchcancel', stopHold, { passive: true });

placeballeaudessusraquette();// Place la balle au-dessus de la raquette au départ

// Augmente la vitesse de la balle à chaque rebond sur la raquette

const BASE_BALL_SPEED = balle.speed;

function increaseBallSpeed() {
  const currentSpeed = Math.hypot(balle.dx, balle.dy) || BASE_BALL_SPEED;
  const nextSpeed = Math.min(currentSpeed + BASE_BALL_SPEED + 0.2, BASE_BALL_SPEED * 5);
  const scale = nextSpeed / currentSpeed;
  balle.dx *= scale;
  balle.dy *= scale;
}

function placeballeaudessusraquette() {
  balle.x = raquette.x + raquette.w / 2;
  balle.y = raquette.y - balle.r - 1;
}

// Lancement du Jeu 
function startGame() {
  if (gameRunning) return;
  gameRunning = true;
  gameOver = false;
  score = 0;
  startTime = Date.now();

  // Raquette centrée
  raquette.x = canvas.width / 2 - raquette.w / 2;

  // Balle placée juste au-dessus de la raquette
  placeballeaudessusraquette();
  balle.speed = BASE_BALL_SPEED;

  // Balle placée juste au-dessus de la raquette
  balle.x = raquette.x + raquette.w / 2;
  balle.y = raquette.y - balle.r - 1;

  // Angle aléatoire entre 30° et 150°
  let angle = (Math.random() * 120 + 30) * Math.PI / 180;
  balle.dx = balle.speed * Math.cos(angle);
  balle.dy = -balle.speed * Math.sin(angle);
  antiangle90(-1);

  // Raquette centrée
  raquette.x = canvas.width / 2 - raquette.w / 2;

  draw();// Premier dessin
  requestAnimationFrame(update);// Lancement de la boucle de jeu
}

//  Dessiner le jeu
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Balle
  ctx.beginPath();
  ctx.arc(balle.x, balle.y, balle.r, 0, Math.PI * 2);
  ctx.fillStyle = "#fff";
  ctx.fill();
  ctx.closePath();

  // Raquette
  ctx.fillStyle = "#4af";
  ctx.fillRect(raquette.x, raquette.y, raquette.w, raquette.h);

  // affichage du Score
  ctx.font = "20px Arial";
  ctx.fillStyle = "hsla(204, 19%, 89%, 1.00)";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText(`Score : ${score}s`, 10, 10);

  // Annonce le message de fin de partie
  if (gameOver) {
    ctx.font = "32px Arial";
    ctx.fillStyle = "#f44";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Perdu !", canvas.width / 2, canvas.height / 2);
    ctx.font = "18px Arial";
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)"; 
    ctx.fillText("Appuie sur Start pour rejouer", canvas.width / 2, canvas.height / 2 + 40);
  }
}



function update() {
  if (!gameRunning) return;

  // Déplacement de la balle
  balle.x += balle.dx;
  balle.y += balle.dy;

  // Collisions murs
  if (balle.x - balle.r < 0){
    balle.x = balle.r;
    balle.dx *= -1;
    increaseBallSpeed();
  }
  if (balle.x + balle.r > canvas.width){
    balle.x = canvas.width - balle.r;
    balle.dx *= -1;
    increaseBallSpeed();
  }
  if (balle.y - balle.r < 0){
    balle.y = balle.r;
    balle.dy *= -1;
    increaseBallSpeed();
  }

  // Collision raquette (rebond vertical simple)
  if (
    balle.y + balle.r >= raquette.y &&
    balle.x > raquette.x &&
    balle.x < raquette.x + raquette.w &&
    balle.dy > 0
  )
  {
    balle.y = raquette.y - balle.r;// Évite que la balle "s'incruste" dans la raquette
    balle.dy *= -1;
    increaseBallSpeed();
    antiangle90(-1);
  }

  // Perdu si la balle touche le bas
  if (balle.y - balle.r > canvas.height) {
    gameRunning = false;
    gameOver = true;
    draw();
    return;
  }

  // Déplacement raquette
  raquette.x += raquette.dx;
  if (raquette.x < 0) raquette.x = 0;
  if (raquette.x + raquette.w > canvas.width) raquette.x = canvas.width - raquette.w;

  // Score
  score = Math.floor((Date.now() - startTime) / 1000);

  // Prochain frame
  draw();
  requestAnimationFrame(update);
}

function antiangle90(defaultYDirection) {
  const speed = Math.hypot(balle.dx, balle.dy) || BASE_BALL_SPEED;
  let nx = balle.dx / speed;
  let ny = balle.dy / speed || defaultYDirection;
  if (Math.abs(nx) < MIN_HORIZONTAL_RATIO) {
    const signX = nx === 0 ? (Math.random() < 0.5 ? -1 : 1) : Math.sign(nx);
    nx = signX * MIN_HORIZONTAL_RATIO;
    ny = Math.sign(ny || defaultYDirection) * Math.sqrt(Math.max(0, 1 - nx * nx));
  }
  balle.dx = nx * speed;
  balle.dy = ny * speed;
}


/*création du jeu en le dessinant et le mettant à jour*/

draw();
update();