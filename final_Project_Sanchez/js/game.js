// Game variables
let sequence = [];
let playerSequence = [];
let level = 1;
let score = 0;
let isPlaying = false;
let canPlayerInput = false;
let shapes = [];

// Initialize game when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Setup event listeners
    document.getElementById('start-btn').addEventListener('click', startGame);
    document.getElementById('Go-btn').addEventListener('click', startSequence);
    document.getElementById('reset-btn').addEventListener('click', resetGame);
    document.getElementById('continue-btn').addEventListener('click', nextLevel);
    
    // Initialize canvas
    initCanvas();
});

// Start the game
function startGame() {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('game-container').style.display = 'flex';
    initializeGame();
    initAudio();
}

// Initialize game board
function initializeGame() {
    const gameBoard = document.getElementById('gameBoard');
    gameBoard.innerHTML = '';
    shapes = [];
    
    colors.forEach((color, index) => {
        const shape = document.createElement('div');
        shape.className = 'shape';
        shape.dataset.color = color;
        shape.style.backgroundColor = color;
        
        shape.addEventListener('click', () => {
            if (!canPlayerInput) return;
            
            const frequency = colorToFrequency[color];
            playTone(frequency, 0.3, color);
            flashShape(shape);
            
            checkPlayerInput(index);
        });
        
        gameBoard.appendChild(shape);
        shapes.push(shape);
    });
    
    updateStatus('Press Go to start!');
}

// Start the sequence demonstration
function startSequence() {
    if (!isPlaying) {
        startLevel();
    }
}

// Generate and show the sequence
function startLevel() {
    playerSequence = [];
    generateSequence();
    showSequence();
    isPlaying = true;
}

// Generate a random sequence based on current level
function generateSequence() {
    sequence = [];
    for (let i = 0; i < level; i++) {
        sequence.push(Math.floor(Math.random() * 4));
    }
}

// Show the sequence to the player
async function showSequence() {
    canPlayerInput = false;
    updateStatus('Watch the sequence...');
    
    for (let i = 0; i < sequence.length; i++) {
        await new Promise(resolve => {
            setTimeout(() => {
                const index = sequence[i];
                const shape = shapes[index];
                const color = shape.dataset.color;
                flashShape(shape);
                playTone(colorToFrequency[color], 0.3, color);
                resolve();
            }, 600);
        });
    }
    
    canPlayerInput = true;
    updateStatus('Your turn! Repeat the sequence.');
}

// Check player's input against the sequence
function checkPlayerInput(colorIndex) {
    playerSequence.push(colorIndex);
    
    const currentIndex = playerSequence.length - 1;
    
    if (playerSequence[currentIndex] !== sequence[currentIndex]) {
        // Wrong input
        updateStatus('Wrong sequence! Try again.');
        playTone(100, 0.5, 'rgba(255, 0, 0, 0.5)');
        resetGame();
        return;
    }
    
    if (playerSequence.length === sequence.length) {
        // Completed the sequence
        score += level * 10;
        updateScore();
        
        setTimeout(() => {
            document.getElementById('level-complete').classList.remove('hidden-screen');
        }, 500);
    }
}

// Move to the next level
function nextLevel() {
    document.getElementById('level-complete').classList.add('hidden-screen');
    level++;
    updateScore();
    startLevel();
}

// Update status text
function updateStatus(text) {
    document.getElementById('statusText').textContent = text;
}

// Update score display
function updateScore() {
    document.getElementById('scoreText').textContent = `Score: ${score}`;
    document.getElementById('levelText').textContent = `Level: ${level}`;
}

// Reset the game
function resetGame() {
    sequence = [];
    playerSequence = [];
    level = 1;
    score = 0;
    isPlaying = false;
    canPlayerInput = false;
    
    updateScore();
    updateStatus('Press Go to start!');
}