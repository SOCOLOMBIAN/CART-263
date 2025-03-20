// Game configuration
const config = {
    sequenceInterval: 1000,// Time between sequence elements (ms)
    highlightDuration: 500,// How long each button stays highlighted (ms)
    nextRoundDelay: 1500, // Delay before starting next round (ms)
    baseScore: 10, // Base score per correct sequence
    maxLevel: 8, // Maximum game level
};

// Game controller
class GameController {
    constructor(audioController, uiController) {
        this.audio = audioController;
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
        this.ui.setStatusText('');
        this.ui.hideGameOver();
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
        this.ui.toggleButtons(false);
        this.ui.setStatusText('Watch the sequence...');
        
        let i = 0;
        const playNext = () => {
            if (i >= this.gameSequence.length) {
                this.playingSequence = false;
                this.ui.toggleButtons(true);
                this.ui.setStatusText('Your turn!');
                return;
            }
            
            const index = this.gameSequence[i];
            this.highlightButton(index);
            
            i++;
            setTimeout(playNext, config.sequenceInterval);
        };
        
        // Start the sequence after a short delay
        setTimeout(playNext, 500);
    }

    // Highlight a button 
    highlightButton(index) {
        const color = colors[index];
        
        // Make background flash with the button color
        this.ui.setBackgroundColor(color.code + '30'); // visible background 
        this.ui.highlightButton(index); // Add active class for visual effect
        this.audio.playTone(color.frequency);// Play the sound
        
        // Reset background after highlight duration
        setTimeout(() => {
            this.ui.resetBackgroundColor();
        }, config.highlightDuration);
    }

    // player button click
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
            
            // Check if level up
            if (this.gameSequence.length % 3 === 0) {
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
        this.ui.setStatusText('Game Over!');
        this.ui.showGameOver(this.score);
        this.ui.enableGameControls();
    }
}