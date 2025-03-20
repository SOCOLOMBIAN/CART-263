// UI controller
class UiController {
    constructor() {
        this.startScreen = document.getElementById('start-screen');
        this.gameContainer = document.getElementById('game-container');
        this.gameBoard = document.getElementById('gameBoard');
        this.goButton = document.getElementById('go-btn');
        this.resetButton = document.getElementById('reset-btn');
        this.statusText = document.getElementById('statusText');
        this.scoreText = document.getElementById('scoreText');
        this.levelText = document.getElementById('levelText');
        this.levelComplete = document.getElementById('level-complete');
        this.gameOver = document.getElementById('game-over');
        this.finalScore = document.getElementById('final-score');
        this.startButton = document.getElementById('start-btn');
        this.continueButton = document.getElementById('continue-btn');
        this.playAgainButton = document.getElementById('play-again-btn');
        
        this.buttonElements = [];
    }

    // Initialize the UI with improved button creation
    init() {
        // Clear existing buttons
        this.gameBoard.innerHTML = '';
        this.buttonElements = [];
        
        // Create color buttons with better styling
        for (let i = 0; i < colors.length; i++) {
            const button = document.createElement('button');
            button.className = 'color-button';
            button.style.backgroundColor = colors[i].code;
            
        //     // Add a label for debugging (can be removed later)
            const label = document.createElement('span');
            label.style.position = 'absolute';
            label.style.top = '50%';
            label.style.left = '50%';
            label.style.transform = 'translate(-50%, -50%)';
            label.style.color = getContrastColor(colors[i].code);
            label.style.fontSize = '12px';
            label.style.fontWeight = 'bold';
            label.textContent = i + 1;
            
            button.appendChild(label);
            button.dataset.index = i;
            this.gameBoard.appendChild(button);
            this.buttonElements.push(button);
        }
        console.log("Created buttons:", this.buttonElements.length);
      }
    
    // Highlight a button by index with visual feedback
    highlightButton(index) {
        if (index < 0 || index >= this.buttonElements.length) {
            console.error("Invalid button index:", index);
            return;
        }
        console.log("Highlighting button:", index);
        const button = this.buttonElements[index];
        
        // Add a flash effect
        button.style.boxShadow = "0 0 30px white";
        button.style.transform = "scale(1.1)";
        button.classList.add('active');
        
        // Reset after highlight duration
        setTimeout(() => {
            button.style.boxShadow = "";
            button.style.transform = "";
            button.classList.remove('active');
        }, 500);
    }

    // // Set the background color
    setBackgroundColor(color) {
        document.body.style.backgroundColor = color;
    }

    // Reset the background color
    resetBackgroundColor() {
        document.body.style.backgroundColor = 'black';
    
    }
    // Show the game screen, hide start screen
    showGame() {
        this.startScreen.style.display = 'none';
        this.gameContainer.style.display = 'flex';
    }

    // Show level complete screen
    showLevelComplete() {
        this.levelComplete.classList.add('active');
    }

    // Hide level complete screen
    hideLevelComplete() {
        this.levelComplete.classList.remove('active');
    }

    // Show game over screen
    showGameOver(score) {
        this.finalScore.textContent = `Your score: ${score}`;
        this.gameOver.classList.add('active');
    }

    // Hide game over screen
    hideGameOver() {
        this.gameOver.classList.remove('active');
    }

    // Update the score display
    updateScore(score) {
        this.scoreText.textContent = `Score: ${score}`;
    }

    // Update the level display
    updateLevel(level) {
        this.levelText.textContent = `Level: ${level}`;
    }

    // Set the status text
    setStatusText(text) {
        this.statusText.textContent = text;
    }

    // Enable or disable all game buttons
    toggleButtons(enabled) {
        this.buttonElements.forEach(button => {
            button.disabled = !enabled;
            button.style.cursor = enabled ? 'pointer' : 'not-allowed';
            button.style.opacity = enabled ? '1' : '0.7';
        });
    }

    // Disable game controls
    disableGameControls() {
        this.goButton.disabled = true;
        this.resetButton.disabled = false;
    }

    // Enable game controls
    enableGameControls() {
        this.goButton.disabled = false;
        this.resetButton.disabled = false;
    }

    // Add event listeners for buttons
    addButtonListener(buttonIndex, callback) {
        this.buttonElements[buttonIndex].addEventListener('click', () => callback(buttonIndex));
    }

    // Add event listener for start button
    addStartButtonListener(callback) {
        this.startButton.addEventListener('click', callback);
    }

    // Add event listener for go button
    addGoButtonListener(callback) {
        this.goButton.addEventListener('click', callback);
    }

    // Add event listener for reset button
    addResetButtonListener(callback) {
        this.resetButton.addEventListener('click', callback);
    }

    // Add event listener for continue button
    addContinueButtonListener(callback) {
        this.continueButton.addEventListener('click', callback);
    }

    // Add event listener for play again button
    addPlayAgainButtonListener(callback) {
        this.playAgainButton.addEventListener('click', callback);
    }
}

// Helper function to determine contrasting text color
function getContrastColor(hexColor) {
    // Convert hex to RGB
    let r, g, b;
    if (hexColor.startsWith('#')) {
        hexColor = hexColor.substring(1);
    }
    
    // color names
    const colorMap = {
        'red': '#FF0000',
        'green': '#00FF00',
        'blue': '#0000FF',
        'yellow': '#FFFF00'
    };
    
    if (colorMap[hexColor]) {
        hexColor = colorMap[hexColor].substring(1);
    }
    
    // Parse RGB
    if (hexColor.length === 3) {
        r = parseInt(hexColor.charAt(0) + hexColor.charAt(0), 16);
        g = parseInt(hexColor.charAt(1) + hexColor.charAt(1), 16);
        b = parseInt(hexColor.charAt(2) + hexColor.charAt(2), 16);
    } else {
        r = parseInt(hexColor.substring(0, 2), 16);
        g = parseInt(hexColor.substring(2, 4), 16);
        b = parseInt(hexColor.substring(4, 6), 16);
    }
    
    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Return white for dark colors, black for light colors
    return luminance > 0.5 ? 'black' : 'white';
}

