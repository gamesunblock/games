const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("startBtn");
const highscoreDisplay = document.getElementById("highscore");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Stickman and game variables
let stickman = { x: 50, y: canvas.height - 100, width: 20, height: 50, vy: 0, jumping: false };
let obstacles = [];
let speed = 2;
let score = 0;
let highscore = localStorage.getItem("highscore") || 0;
let gameRunning = false;

highscoreDisplay.textContent = highscore;

function drawStickman() {
    ctx.fillStyle = "black";
    ctx.fillRect(stickman.x, stickman.y, stickman.width, stickman.height);
}

function drawObstacles() {
    ctx.fillStyle = "darkred";
    obstacles.forEach(obstacle => {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
}

function spawnObstacle() {
    const size = Math.random() * 40 + 20;
    obstacles.push({ x: canvas.width, y: canvas.height - size - 50, width: size, height: size });
}

function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, canvas.height - 100, canvas.width, 100);

    // Stickman physics
    stickman.y += stickman.vy;
    if (stickman.jumping) stickman.vy += 1;
    if (stickman.y >= canvas.height - 100 - stickman.height) {
        stickman.y = canvas.height - 100 - stickman.height;
        stickman.jumping = false;
    }

    drawStickman();

    // Obstacles movement
    obstacles.forEach(obstacle => obstacle.x -= speed);
    obstacles = obstacles.filter(obstacle => obstacle.x + obstacle.width > 0);
    drawObstacles();

    // Collision detection
    obstacles.forEach(obstacle => {
        if (
            stickman.x < obstacle.x + obstacle.width &&
            stickman.x + stickman.width > obstacle.x &&
            stickman.y < obstacle.y + obstacle.height &&
            stickman.y + stickman.height > obstacle.y
        ) {
            endGame();
        }
    });

    // Increase score and speed
    score += 1;
    if (score % 1000 === 0) {
        speed += 0.5;
        spawnObstacle();
    }

    if (score > highscore) {
        highscore = score;
        localStorage.setItem("highscore", highscore);
        highscoreDisplay.textContent = highscore;
    }

    if (gameRunning) requestAnimationFrame(updateGame);
}

function startGame() {
    stickman.y = canvas.height - 100 - stickman.height;
    stickman.vy = 0;
    stickman.jumping = false;
    obstacles = [];
    speed = 2;
    score = 0;
    gameRunning = true;
    spawnObstacle();
    startBtn.style.display = "none";
    updateGame();
}

function endGame() {
    gameRunning = false;
    alert("Game Over! Your score: " + score);
    startBtn.style.display = "block";
}

startBtn.addEventListener("click", startGame);

document.addEventListener("keydown", e => {
    if (e.key === "w" && !stickman.jumping) {
        stickman.jumping = true;
        stickman.vy = -15;
    }
});
