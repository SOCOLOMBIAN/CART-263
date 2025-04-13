//management of the game 
class GameState {
  constructor() {
    this.gameSequence = [];
    this.playerSequence = [];
    this.score = 0;
    this.level = 1;
    this.isPlaying = false;
    this.canPlayerInteract = false;
    this.soundMap = this.generateRandomSoundMap();
    this.savedArtworks = []; // Keeping this for compatibility, but we won't use it
  }

  resetGame() {
    this.gameSequence = [];
    this.playerSequence = [];
    this.score = 0;
    this.level = 1;
    this.isPlaying = false;
    this.canPlayerInteract = false;
    this.soundMap = this.generateRandomSoundMap();

    return {
      score: this.score,
      level: this.level
    };
  }

  generateRandomSoundMap() {
    // Create more distinctive sounds for better game experience
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
    // For levels > 1, keep the existing sequence and add new elements
    if (this.level === 1) {
      // Reset sequence for level 1
      this.gameSequence = [];
    }
    
    // Add elements based on the current level
    // For level 1, add 2 elements
    // For higher levels, add 1 more element
    const elementsToAdd = (this.level === 1) ? 2 : 1;
    
    for (let i = 0; i < elementsToAdd; i++) {
      const nextShape = Math.floor(Math.random() * 4);
      this.gameSequence.push(nextShape);
    }
    
    return [...this.gameSequence];
  }

  // Playing the sequence 
  startPlayingSequence() {
    this.isPlaying = true;
    this.canPlayerInteract = false;
    this.playerSequence = [];
    return [...this.gameSequence];
  }

  // user finish to play the sequence 
  finishPlayingSequence() {
    this.isPlaying = false;
    this.canPlayerInteract = true;
  }

  addPlayerMove(shapeIndex) {
    if (!this.canPlayerInteract) return { correct: false };

    this.playerSequence.push(shapeIndex);
    const currentMove = this.playerSequence.length - 1;

    // Check if the move is correct
    if (this.playerSequence[currentMove] !== this.gameSequence[currentMove]) {
      return { correct: false }; // Return false if the move of the user is incorrect
    }

    // Check if the sequence is complete
    if (this.playerSequence.length === this.gameSequence.length) {
      this.score += this.level * 10;
      this.canPlayerInteract = false;
      return {
        correct: true,
        score: this.score,
        level: this.level,
        sequence: [...this.gameSequence]
      };
    }

    return { correct: true }; // Return true if move is correct but sequence not complete
  }

  levelUp() {
    this.level++;
    return { score: this.score, level: this.level };
  }
}