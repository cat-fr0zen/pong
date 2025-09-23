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



