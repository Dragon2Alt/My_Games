const gameBoard = document.querySelector("#gameBoard");
const ctx = gameBoard.getContext("2d");
const scoreText = document.querySelector("#scoreText");
const resetBtn = document.querySelector("#resetBtn");
const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
const boardBackground = "#FFFFFF"; // Changed to hex code for white
const snakeColor = "#00FF00"; // Changed to hex code for green
const snakeBorder = "#000000"; // Changed to hex code for black
const foodColor = "#FF0000"; // Changed to hex code for red
const unitSize = 25;
let running = false;
let xVelocity = unitSize;
let yVelocity = 0;
let foodX;
let foodY;
let score = 0;
let snake = [
    { x: unitSize * 4, y: 0 },
    { x: unitSize * 3, y: 0 },
    { x: unitSize * 2, y: 0 },
    { x: unitSize, y: 0 },
    { x: 0, y: 0 }
];

window.addEventListener("keydown", changeDirection);
resetBtn.addEventListener("click", resetGame);

gameStart();

function gameStart() {
    running = true;
    scoreText.textContent = score;
    createFood();
    drawFood();
    nextTick();
}

function nextTick() {
    if (running) {
        setTimeout(() => {
            clearBoard();
            drawFood();
            moveSnake();
            drawSnake();
            checkGameOver();
            nextTick();
        }, 150);
    } else {
        displayGameOver();
    }
}

function clearBoard() {
    ctx.fillStyle = boardBackground; // Fixed typo
    ctx.fillRect(0, 0, gameWidth, gameHeight); // Fixed typo
}

function createFood() {
    function randomFood(min, max) {
        const randNum = Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize;
        return randNum;
    }
    
    foodX = randomFood(0, gameWidth - unitSize);
    foodY = randomFood(0, gameHeight - unitSize);

    // Ensure food does not spawn on the snake
    snake.forEach(part => {
        if (part.x === foodX && part.y === foodY) createFood(); // Regenerate if on snake
    });
}

function drawFood() {
    ctx.fillStyle = foodColor; // Fixed typo
    ctx.fillRect(foodX, foodY, unitSize, unitSize);
}

function moveSnake() {
    const head = { x: snake[0].x + xVelocity, y: snake[0].y + yVelocity };
    
    // Check for food collision
    if (head.x === foodX && head.y === foodY) {
        score += 10; // Increase score
        scoreText.textContent = score; // Update score display
        createFood(); // Create new food
    } else {
        snake.pop(); // Remove last segment if not eating
    }
    
    snake.unshift(head); // Add new head to the snake
}

function drawSnake() {
    ctx.fillStyle = snakeColor; // Fixed typo
    ctx.strokeStyle = snakeBorder; // Fixed typo
    
    snake.forEach(part => {
        ctx.fillRect(part.x, part.y, unitSize, unitSize);
        ctx.strokeRect(part.x, part.y, unitSize, unitSize); // Fixed typo
    });
}
// Existing code...

// Add event listeners for direction buttons
document.getElementById("upBtn").addEventListener("click", () => changeDirection({ keyCode: 38 }));
document.getElementById("downBtn").addEventListener("click", () => changeDirection({ keyCode: 40 }));
document.getElementById("leftBtn").addEventListener("click", () => changeDirection({ keyCode: 37 }));
document.getElementById("rightBtn").addEventListener("click", () => changeDirection({ keyCode: 39 }));

// Existing code...


function changeDirection(event) {
    const keyPressed = event.keyCode;

    switch (keyPressed) {
        case 37: // left arrow key
            if (xVelocity === 0) {
                xVelocity = -unitSize;
                yVelocity = 0;
            }
            break;
        case 38: // up arrow key
            if (yVelocity === 0) {
                xVelocity = 0;
                yVelocity = -unitSize;
            }
            break;
        case 39: // right arrow key
            if (xVelocity === 0) {
                xVelocity = unitSize;
                yVelocity = 0;
            }
            break;
        case 40: // down arrow key
            if (yVelocity === 0) {
                xVelocity = 0;
                yVelocity = unitSize;
            }
            break;
    }
}

function checkGameOver() {
    // Check wall collisions
    if (
        snake[0].x < 0 || 
        snake[0].x >= gameWidth || 
        snake[0].y < 0 || 
        snake[0].y >= gameHeight ||
        snake.slice(1).some(part => part.x === snake[0].x && part.y === snake[0].y)
    ) {
        running = false; 
    }
}

function displayGameOver() {
    ctx.fillStyle = "green";
    ctx.font = "50px cursive";
    ctx.fillText("Game Over", gameWidth / 3.5, gameHeight / 2);
}

function resetGame() {
    running = false; 
    score = 0; 
    xVelocity = unitSize; 
    yVelocity = 0; 
    snake = [
        { x: unitSize * 4, y: 0 },
        { x: unitSize * 3, y: 0 },
        { x: unitSize * 2, y: 0 },
        { x: unitSize, y: 0 },
        { x: 0, y: 0 }
    ];
    
    gameStart(); 
}
