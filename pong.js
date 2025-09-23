const canvas = document.getElementById('écran_de_jeu');
const ctx = canvas.getContext('2d');
canvas.width = 350;
canvas.height = 600;
let score = 0;// le score du joueur
let startTime = 0;// le temps de début du jeu
let gameRunning = false;// état du jeu (en cours ou non)
let gameOver = false;// état du jeu

// la raquette du joueur(objet)
let raquette = {
    w: 80,
    h: 15,
    x: canvas.width / 2 - 40,
    y: canvas.height - 30,
    speed: 7,
    dx: 0
};

// la balle (objet)
let balle = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    r: 10,
    speed: 4,
    dx: 0,
    dy: 0
};

document.getElementById('start').onclick = () => {
    if (!gameRunning) startGame();
};

//** document.getElementById('start') fait référence au bouton de démarrage */

document.getElementById('reset').onclick = () => {
    gameRunning = false;
    gameOver = false;
    score = 0;
    draw();
};

//** document.getElementById('reset') fait référence au bouton de réinitialisation */

// Contrôles clavier
document.addEventListener('keydown', (e) => {
    if (e.key === "ArrowLeft") raquette.dx = -raquette.speed;
    if (e.key === "ArrowRight") raquette.dx = raquette.speed;
});

//** document.addEventListener('keydown') fait référence aux touches enfoncées */

document.addEventListener('keyup', (e) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") raquette.dx = 0;
});

//** document.addEventListener('keyup') fait référence aux touches relâchées */


/**
 * Démarre une nouvelle partie
 * Initialise les variables et positionne la balle et la raquette
 * Lance la boucle de mise à jour du jeu  */
 
function startGame() {// Démarre une nouvelle partie
    if (gameRunning) return; // Empêche de démarrer une nouvelle partie si le jeu est déjà en cours
    gameRunning = true; // Met l'état du jeu à "en cours"
    gameOver = false;// Réinitialise l'état de fin de jeu
    score = 0; // Réinitialise le score
    startTime = Date.now();// Enregistre le temps de début du jeu

    // Position initiale de la balle
    balle.x = canvas.width / 2;// Position horizontale au centre du canvas
    balle.y = canvas.height / 2;// Position verticale au centre du canvas

    // Angle aléatoire entre 30° et 150°
    let angle = (Math.random() * 120 + 30) * Math.PI / 180;// Convertit l'angle en radians
    balle.dx = balle.speed * Math.cos(angle);// Vitesse horizontale basée sur l'angle
    balle.dy = -balle.speed * Math.sin(angle);// Vitesse verticale basée sur l'angle (négative pour aller vers le haut)

    // Position initiale de la raquette
    raquette.x = canvas.width / 2 - raquette.w / 2;// Centre la raquette horizontalement

    draw();// Dessine l'état initial du jeu
    requestAnimationFrame(update);// Lance la boucle de mise à jour du jeu
}

/** fonction startGame() : Démarre une nouvelle partie */

function draw() {// Dessine tous les éléments du jeu
    ctx.clearRect(0, 0, canvas.width, canvas.height);// Efface le canvas

    // Balle
    ctx.beginPath();
    ctx.arc(balle.x, balle.y, balle.r, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.closePath();

    // Raquette
    ctx.fillStyle = "#4af";
    ctx.fillRect(raquette.x, raquette.y, raquette.w, raquette.h);

    // Score
    ctx.font = "20px Arial";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.fillText(`Score : ${score}s`, canvas.width / 2, canvas.height - 10);

    // Message de fin
    if (gameOver) {
        ctx.font = "32px Arial";
        ctx.fillStyle = "#f44";
        ctx.fillText("Perdu !", canvas.width / 2, canvas.height / 2);
        ctx.font = "18px Arial";
        ctx.fillStyle = "#fff";
        ctx.fillText("Appuie sur Start pour rejouer", canvas.width / 2, canvas.height / 2 + 40);
    }
}

/**
* fonction draw() : Dessine tous les éléments du jeu (balle, raquette, score, message de fin)
 */

function update() {
    if (!gameRunning) return;

    // Déplacement de la balle
    balle.x += balle.dx;
    balle.y += balle.dy;

    // Collisions avec les murs
    if (balle.x - balle.r < 0) {
        balle.x = balle.r;
        balle.dx *= -1;
    }
    if (balle.x + balle.r > canvas.width) {
        balle.x = canvas.width - balle.r;
        balle.dx *= -1;
    }
    if (balle.y - balle.r < 0) {
        balle.y = balle.r;
        balle.dy *= -1;
    }

    // Collision avec la raquette
    if (
        balle.y + balle.r >= raquette.y &&
        balle.x > raquette.x &&
        balle.x < raquette.x + raquette.w &&
        balle.dy > 0
    ) {
        balle.y = raquette.y - balle.r;
        balle.dy *= -1;
    }

    // Si la balle est ratée
    if (balle.y - balle.r > canvas.height) {
        gameRunning = false;
        gameOver = true;
        draw();
        return;
    }

    // Déplacement de la raquette
    raquette.x += raquette.dx;
    if (raquette.x < 0) raquette.x = 0;
    if (raquette.x + raquette.w > canvas.width) raquette.x = canvas.width - raquette.w;

    // Score
    score = Math.floor((Date.now() - startTime) / 1000);

    draw();
    requestAnimationFrame(update);
}

/**
* fonction update() : Met à jour l'état du jeu (position de la balle, collisions, score)
 */
draw(); // Dessine l'état initial
update(); // Lance la boucle de mise à jour du jeu








