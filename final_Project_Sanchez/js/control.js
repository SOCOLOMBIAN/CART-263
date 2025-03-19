// UI controller
class UIController {
    constructor() {
        this.startScreen = document.getElementById('start-screen');
        this.gameContainer = document.getElementById('game-container');
        this.gameBoard = document.getElementById('gameBoard');
        this.goButton = document.getElementById('Go-btn');
        this.resetButton = document.getElementById('reset-btn');
        this.statusText = document.getElementById('statusText');
        this.scoreText = document.getElementById('scoreText');
        this.levelText = document.getElementById('levelText');
        this.levelComplete = document.getElementById('level-complete');
        this.startButton = document.getElementById('start-btn');
        this.continueButton = document.getElementById('continue-btn');
        
        this.buttonElements = [];
    }

    // Initialize the UI
    init() {
        // Create color buttons
        this.gameBoard.innerHTML = '';
        
        for (let i = 0; i < colors.length; i++) {
            const button = document.createElement('button');
            button.className = 'color-button';
            button.style.backgroundColor = colors[i].code;
            button.dataset.index = i;
            this.gameBoard.appendChild(button);
            this.buttonElements.push(button);
        }
    }

    // Highlight a button by index
    highlightButtonByIndex(index) {
        this.buttonElements[index].classList.add('active');
    }

    // Unhighlight a button by index
    unhighlightButtonByIndex(index) {
        this.buttonElements[index].classList.remove('active');
    }

    // Set the background color
    setBackgroundColor(color) {
        document.body.style.backgroundColor = color;
    }

    // Reset the background color
    resetBackgroundColor() {
        document.body.style.backgroundColor = '#f0f0f0';
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
    disableButtons(disabled) {
        this.buttonElements.forEach(button => {
            button.disabled = disabled;
            button.style.cursor = disabled ? 'not-allowed' : 'pointer';
            button.style.opacity = disabled ? '0.7' : '1';
        });
    }

    // Disable game controls at start
    disableGameControls() {
        this.goButton.disabled = true;
        this.resetButton.disabled = false;
    }

    // Enable game controls
    enableGameControls() {
        this.goButton.disabled = false;
        this.resetButton.disabled = false;
    }

    // Add event listeners for a button
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
}