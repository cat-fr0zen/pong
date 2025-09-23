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

