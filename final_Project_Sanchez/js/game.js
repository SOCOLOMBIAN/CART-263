// Game controller
class GameController {
    constructor(audioController, canvasController, uiController) {
        this.audio = audioController;
        this.canvas = canvasController;
        this.ui = uiController;
        
        this.gameSequence = [];
        this.playerSequence = [];
        this.level = 1;
        this.score = 0;
        this.gameActive = false;
        this.playingSequence = false;
    }

    // Start a new game
    startGame() {
        this.gameActive = true;
        this.gameSequence = [];
        this.playerSequence = [];
        this.level = 1;
        this.score = 0;
        
        this.ui.updateScore(this.score);
        this.ui.updateLevel(this.level);
        this.ui.setStatusText('Watch the sequence...');
    
        
        setTimeout(() => this.nextRound(), config.nextRoundDelay);
    }

    // Reset the game
    resetGame() {
        this.gameActive = false;
        this.gameSequence = [];
        this.playerSequence = [];
        this.level = 1;
        this.score = 0;
        
        this.ui.updateScore(this.score);
        this.ui.updateLevel(this.level);
      
    }

    // Start the next round
    nextRound() {
        if (!this.gameActive) return;
        
        this.playerSequence = [];
        this.addToSequence();
        this.playSequence();
    }

    // Add a new random color to the sequence
    addToSequence() {
        const randomIndex = Math.floor(Math.random() * colors.length);
        this.gameSequence.push(randomIndex);
    }

    // Play the current sequence
    playSequence() {
        this.playingSequence = true;
        this.ui.disableButtons(true);
        this.ui.setStatusText('Watch the sequence...');
        
        let i = 0;
        const interval = setInterval(() => {
            if (i >= this.gameSequence.length) {
                clearInterval(interval);
                this.playingSequence = false;
                this.ui.disableButtons(false);
                this.ui.setStatusText('Your turn!');
                return;
            }
            
            const index = this.gameSequence[i];
            this.highlightButton(index);
            i++;
        }, config.sequenceInterval);
    }

    // Highlight a button and play its sound
    highlightButton(index) {
        const color = colors[index];
        
        this.ui.highlightButtonByIndex(index);
        this.audio.playTone(color.frequency);
        this.ui.setBackgroundColor(color.code + '20'); // Light version of the color
        
        setTimeout(() => {
            this.ui.unhighlightButtonByIndex(index);
            this.ui.resetBackgroundColor();
        }, config.highlightDuration);
    }

    // Handle player button click
    handleButtonClick(index) {
        if (!this.gameActive || this.playingSequence) return;
        
        this.playerSequence.push(index);
        this.highlightButton(index);
        this.checkSequence();
    }

    // Check if player's sequence matches the game sequence
    checkSequence() {
        const currentIndex = this.playerSequence.length - 1;
        
        if (this.playerSequence[currentIndex] !== this.gameSequence[currentIndex]) {
            // Wrong sequence
            this.gameOver();
            return;
        }
        
        if (this.playerSequence.length === this.gameSequence.length) {
            // Correct sequence
            this.score += this.level * config.baseScore;
            this.ui.updateScore(this.score);
            
            // Add art element using the last color in the sequence
            const lastColorIndex = this.gameSequence[this.gameSequence.length - 1];
            this.canvas.addElement(colors[lastColorIndex].code, this.level);
            
            // Check if level up
            if (this.gameSequence.length % 3 === 0 && this.level < config.maxLevel) {
                this.levelUp();
            } else {
                setTimeout(() => {
                    this.ui.setStatusText('Correct! Next round...');
                    setTimeout(() => this.nextRound(), config.nextRoundDelay);
                }, 500);
            }
        }
    }

    // Level up
    levelUp() {
        this.level++;
        this.ui.updateLevel(this.level);
        this.ui.showLevelComplete();
    }

    // Continue after level completion
    continueGame() {
        this.ui.hideLevelComplete();
        this.ui.setStatusText('Next level starting...');
        setTimeout(() => this.nextRound(), config.nextRoundDelay);
    }

    // Game over
    gameOver() {
        this.gameActive = false;
        this.ui.setStatusText('Game Over! Your artwork is complete.');
        this.canvas.finalizeArtwork(this.score);
        this.ui.enableGameControls();
    }
}