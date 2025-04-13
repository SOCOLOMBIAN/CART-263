// GameState class - manages the game state
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

  generateRandomSoundMap() {
    // Create distinctive sounds for each shape type
    return [
      {
        frequency: 261.63, // C4
        type: 'sine',
        duration: 0.4
      },
      {
        frequency: 329.63, // E4
        type: 'triangle',
        duration: 0.4
      },
      {
        frequency: 392.00, // G4
        type: 'square',
        duration: 0.4
      },
      {
        frequency: 523.25, // C5
        type: 'sawtooth',
        duration: 0.4
      }
    ];
  }

  // Generate next sequence based on level
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

  // Start playing the sequence 
  startPlayingSequence() {
    this.isPlaying = true;
    this.canPlayerInteract = false;
    this.playerSequence = [];
    console.log("Starting to play sequence:", this.gameSequence);
    return [...this.gameSequence];
  }

  // User finished playing the sequence 
  finishPlayingSequence() {
    this.isPlaying = false;
    this.canPlayerInteract = true;
    console.log("Finished playing sequence, ready for player input");
  }

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
      this.score += this.level * 10;
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