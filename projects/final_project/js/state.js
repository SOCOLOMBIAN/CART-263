/**
 * state.js
 * Manages the game state, including score, level, sequences and sound mapping.
 * Handles game progression logic and sequence validation.
 */

class GameState {
  constructor() {
    this.gameSequence = [];
    this.playerSequence = [];
    this.score = 0;
    this.level = 1;

    // game state
    this.isPlaying = false;
    this.canPlayerInteract = false;

    // audio configuration
    this.soundMap = this.generateRandomSoundMap();
  }
  
  /**
 *reset game to inital state
 */
  resetGame() {
    this.gameSequence = [];
    this.playerSequence = [];
    this.score = 0;
    this.level = 1;
    this.isPlaying = false;
    this.canPlayerInteract = false;
    this.soundMap = this.generateRandomSoundMap(); // Refresh sounds for new game

    console.log("Game state reset");
    return {
      score: this.score,
      level: this.level
    };
  }

/**
 array of sounds 
 */
  generateRandomSoundMap() {
    return [
      {
        frequency: 261.63, 
        type: 'sine',
        duration: 0.4
      },
      {
        frequency: 329.63, 
        type: 'triangle',
        duration: 0.4
      },
      {
        frequency: 392.00, 
        type: 'square',
        duration: 0.4
      },
      {
        frequency: 523.25,
        type: 'sawtooth',
        duration: 0.4
      }
    ];
  }

/**
 generate the next sequence base on the current level 
 */
  generateNextSequence() {
    if (this.level === 1) {
      // Reset sequence for level 1
      this.gameSequence = [];
    }
    
    // Add elements based on the current level
    const elementsToAdd = (this.level === 1) ? 2 : 1;
    
    for (let i = 0; i < elementsToAdd; i++) {
      // Generate random shape index (0-3)
      const nextShape = Math.floor(Math.random() * 4);
      this.gameSequence.push(nextShape);
    }
    
    console.log(`Generated sequence for level ${this.level}:`, this.gameSequence);
    return [...this.gameSequence];
  }

 /**
 start playing the sequence
 */
  startPlayingSequence() {
    this.isPlaying = true;
    this.canPlayerInteract = false;
    this.playerSequence = [];
    console.log("Starting to play sequence:", this.gameSequence);
    return [...this.gameSequence];
  }

 /**
 User finished playing the sequence 
 */
  finishPlayingSequence() {
    this.isPlaying = false;
    this.canPlayerInteract = true;
    console.log("Finished playing sequence, ready for player input");
  }

/**
 index of what the user clicked and move is correct
 */
  addPlayerMove(shapeIndex) {
    if (!this.canPlayerInteract) return { correct: false };

    this.playerSequence.push(shapeIndex);
    const currentMove = this.playerSequence.length - 1;
    
    console.log(`Player move: ${shapeIndex}, expected: ${this.gameSequence[currentMove]}`);

    // Check if the move is correct, if not wrong message
    if (this.playerSequence[currentMove] !== this.gameSequence[currentMove]) {
      console.log("Incorrect move!");
      return { correct: false }; // Return false if the move is incorrect
    }

    // Check if the sequence is complete
    if (this.playerSequence.length === this.gameSequence.length) {
      // Calculate score based on level (higher levels = more points)
      this.score += this.level * 3; // score corresponding to a good answer
      this.canPlayerInteract = false;
      console.log("Sequence complete! Score:", this.score);
      return {
        correct: true,
        score: this.score,
        level: this.level,
        sequence: [...this.gameSequence]
      };
    }

    return { correct: true }; // Move is correct but sequence not complete
  }
  
  // increment the level when the user succes
  levelUp() {
    this.level++;
    console.log("Level up! New level:", this.level);
    return { score: this.score, level: this.level };
  }
}