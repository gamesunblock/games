const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("startBtn");
const levelSpan = document.getElementById("level");
const highscoreSpan = document.getElementById("highscore");

canvas.width = 800;
canvas.height = 400;

// Stickman and game variables
let stickman = { x: 50, y: 350, width: 20, height: 50, vy: 0, jumping: false };
let obstacles = [];
let speed = 5;
let score = 0;
let level = 1;
let highscore = localStorage.getItem("highscore") || 0;

// Update UI
levelSpan.textContent = level;
highscoreSpan.textContent = highscore;

function drawStickman() {
    ctx.fillStyle = "black";
    ctx.fillRect(stickman.x, stickman.y, stickman.width, stickman.height);
}

function drawObstacles() {
    ctx.fillStyle = "red";
    obstacles.forEach(obstacle => {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
}

function spawnObstacle() {
    const size = Math.random() * 30 + 20;
    obstacles.push({ x: canvas.width, y: 350, width: size, height: size });
}

function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Stickman physics
    stickman.y += stickman.vy;
    if (stickman.jumping) stickman.vy += 1;
    if (stickman.y >= 350) {
        stickman.y = 350;
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

    // Increase score
    score += 1;
    if (score % 500 === 0) {
        level++;
        levelSpan.textContent = level;
        speed++;
        spawnObstacle();
    }

    if (score > highscore) {
        highscore = score;
        localStorage.setItem("highscore", highscore);
        highscoreSpan.textContent = highscore;
    }

    requestAnimationFrame(updateGame);
}

function startGame() {
    stickman.y = 350;
    stickman.vy = 0;
    stickman.jumping = false;
    obstacles = [];
    speed = 5;
    score = 0;
    level = 1;
    levelSpan.textContent = level;
    spawnObstacle();
    updateGame();
}

function endGame() {
    alert("Game Over! Your score: " + score);
    startGame();
}

startBtn.addEventListener("click", startGame);
document.addEventListener("keydown", e => {
    if (e.code === "Space" && !stickman.jumping) {
        stickman.jumping = true;
        stickman.vy = -15;
    }
});
