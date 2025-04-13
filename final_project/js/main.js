document.addEventListener('DOMContentLoaded', () => { 
  // Initialize the particle background
  const starBackground = new particleBackground('body', {
      particleCount: 100,
      particleColor: 'rgba(255, 255, 255, 0.8)',
      starSize: 2,
      twinkle: true
  });

  // Initialize audio context with better error handling
  let audioCtx;
  let audioInitialized = false;
  
  // Function to initialize audio properly - can be called on user interaction
  function initializeAudio() {
    if (audioInitialized) return;
    
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      console.log("Audio context created successfully");
      audioInitialized = true;
      
      // Create a silent sound to "warm up" the audio context
      const silent = new SoundObject(audioCtx, 0, 'sine', 0.1);
    } catch (e) {
      console.error("AudioContext not supported or blocked:", e);
      // Fallback for browsers that don't support AudioContext
      audioCtx = {
        createOscillator: () => ({ 
          frequency: { value: 0 },
          connect: () => {},
          start: () => {},
          stop: () => {}
        }),
        createGain: () => ({
          gain: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} },
          connect: () => {}
        }),
        destination: {},
        currentTime: 0
      };
      audioInitialized = true;
    }
  }
  
  // Try to initialize immediately - will likely be suspended in many browsers
  initializeAudio();

  const gameState = new GameState();

  // Get the DOM elements 
  const screens = {
    intro: document.getElementById('screen'),
    game: document.getElementById('game-screen'),
    gameOver: document.getElementById('game-over')
  };

  const buttons = {
    start: document.getElementById('start-btn'),
    restart: document.getElementById('restart-btn'),
    play: document.getElementById('play-btn')
  };

  const displays = {
    score: document.getElementById('score'),
    level: document.getElementById('level'),
    finalScore: document.getElementById('final-score'),
    message: document.getElementById('message'),
    messageWrong: document.getElementById('messageWrong'),
    gallery: document.getElementById('gallery')
  };

  // Define message elements for easy reference
  const successMessage = displays.message;
  const errorMessage = displays.messageWrong;

  // Get the shapes container
  const shapesContainer = document.querySelector('.shapes-container');
  
  // Clear the container before adding our elements
  shapesContainer.innerHTML = '';
  
  // Set up container for moving shapes
  shapesContainer.style.position = 'relative';
  shapesContainer.style.height = '400px';
  
  // Make sure shapes are defined - these are the SVG shapes from shapes.js
  console.log("Shape SVGs loaded:", { raro, prisma, estrella, circle });
  
  // Shape SVGs
  const shapeSvgs = [raro, prisma, estrella, circle];
  
  // Initialize moving shapes with improved settings for better visibility
  const movingShapes = new MovingShapes(shapesContainer, shapeSvgs, {
    count: 1, // Reduced to 1 of each shape type (4 total) for simplicity
    speed: { min: 0.5, max: 1.2 }, // Slowed down for better visibility
    size: { min: 70, max: 90 } // Increased size for better visibility and interaction
  });
  
  // Set up callbacks for the moving shapes
  movingShapes.onShapeActivate = (data) => {
    // Make sure audio is initialized
    if (!audioInitialized) {
      initializeAudio();
    }
    
    // Play sound for the activated shape
    const soundInfo = gameState.soundMap[data.typeIndex];
    try {
      // Make sure audio context is running
      if (audioCtx.state === 'suspended') {
        audioCtx.resume().then(() => {
          const sound = new SoundObject(
            audioCtx,
            soundInfo.frequency,
            soundInfo.type,
            soundInfo.duration
          );
        });
      } else {
        const sound = new SoundObject(
          audioCtx,
          soundInfo.frequency,
          soundInfo.type,
          soundInfo.duration
        );
      }
    } catch (e) {
      console.error("Error playing sound:", e);
    }
  };
  
  movingShapes.onSequencePlay = (data) => {
    if (data.ready) {
      // Sequence finished playing, player can interact
      buttons.play.disabled = false;
      
      // FIXED: Now explicitly enables player interaction
      movingShapes.canPlayerInteract = true;
      console.log("Sequence finished playing, player can now interact");
    }
  };
  
  movingShapes.onSequenceComplete = (data) => {
    if (data.success) {
      // Update score and level
      gameState.score += gameState.level * 10;
      updateDisplay(gameState.score, gameState.level);
      showMessage(successMessage);
      
      // Flash green for success
      AnimationEffects.flashBackground(document.body, 'rgba(0, 255, 0, 0.2)', 500);
      
      // Add level-up animation
      showLevelUpEffect();

      // Level up after a delay - FIXED: Added proper sequence reset
      setTimeout(() => {
        const newState = gameState.levelUp();
        updateDisplay(newState.score, newState.level);
        
        // Generate next sequence and ensure game state is reset properly
        gameState.generateNextSequence();
        gameState.isPlaying = false;  // Ensure isPlaying is reset
        gameState.canPlayerInteract = false;  // Ensure player interaction state is correct
        
        // Ensure button is enabled
        buttons.play.disabled = false;
        
        // Reset moving shapes and ensure they're in the right state
        movingShapes.reset();
        movingShapes.isPlayingSequence = false;
        movingShapes.canPlayerInteract = false;
        
        console.log("Ready for next level sequence:", gameState.gameSequence);
      }, 1500);
    }
  };
  
  movingShapes.onSequenceError = (data) => {
    showMessage(errorMessage);
    
    // Shake the screen and flash red
    AnimationEffects.screenShake(screens.game, 10, 500);
    AnimationEffects.flashBackground(document.body, 'rgba(255, 0, 0, 0.2)', 500);
    
    setTimeout(endGame, 1000);
  };

  // Add visual effects to buttons
  buttons.start.addEventListener('click', (e) => {
    AnimationEffects.createRipple(e, 'rgba(76, 175, 80, 0.5)');
    startGame();
  });
  
  buttons.restart.addEventListener('click', (e) => {
    AnimationEffects.createRipple(e, 'rgba(76, 175, 80, 0.5)');
    restartGame();
  });
  
  buttons.play.addEventListener('click', (e) => {
    AnimationEffects.createRipple(e, 'rgba(33, 150, 243, 0.5)');
    playSequence();
  });

  function startGame() {
    // Hide intro, show game
    screens.intro.classList.remove('active');
    screens.game.classList.add('active');
    
    // Reset game state
    const state = gameState.resetGame();
    updateDisplay(state.score, state.level);
    
    // Generate initial sequence
    gameState.generateNextSequence();
    
    // Enable play button
    buttons.play.disabled = false;
    
    // Reset moving shapes
    movingShapes.reset();
    
    console.log("Game started!");
  }

  function restartGame() {
    // Hide game over, show game
    screens.gameOver.classList.remove('active');
    screens.game.classList.add('active');
    
    // Reset game state
    const state = gameState.resetGame();
    updateDisplay(state.score, state.level);
    
    // Generate initial sequence
    gameState.generateNextSequence();
    
    // Enable play button
    buttons.play.disabled = false;
    
    // Reset moving shapes
    movingShapes.reset();
    
    console.log("Game restarted!");
  }

  // Update the screen displays
  function updateDisplay(score, level) {
    displays.score.textContent = score;
    displays.level.textContent = level;
    displays.finalScore.textContent = score;
  }

  function playSequence() {
    console.log("Play button clicked");
    console.log("Current game state:", { 
      isPlaying: gameState.isPlaying, 
      sequence: gameState.gameSequence,
      movingShapesPlaying: movingShapes.isPlayingSequence
    });
    
    // Prevent multiple plays
    if (gameState.isPlaying || movingShapes.isPlayingSequence) {
      console.log("Already playing sequence - ignoring click");
      return;
    }
    
    console.log("Playing sequence");
    
    const sequence = gameState.startPlayingSequence();
    buttons.play.disabled = true;
    
    // Check if sequence exists and has length
    if (!sequence || sequence.length === 0) {
      console.error("Sequence is empty or undefined!");
      // Regenerate sequence if empty
      gameState.generateNextSequence();
      const newSequence = gameState.startPlayingSequence();
      
      if (!newSequence || newSequence.length === 0) {
        console.error("Failed to generate new sequence");
        buttons.play.disabled = false;
        return;
      } else {
        console.log("Generated new sequence:", newSequence);
        // Use the moving shapes to play the sequence
        movingShapes.playSequence(newSequence);
      }
    } else {
      console.log("Using existing sequence:", sequence);
      // Use the moving shapes to play the sequence
      movingShapes.playSequence(sequence);
    }
  }

  function showMessage(element) {
    element.classList.add('visible');
    setTimeout(() => {
      element.classList.remove('visible');
    }, 1000);
  }

  function endGame() {
    console.log("Game over!");
    
    screens.game.classList.remove('active');
    screens.gameOver.classList.add('active');
    
    // Clear old gallery items
    displays.gallery.innerHTML = '';
    
    // Add a simple game over message
    const gameOverMsg = document.createElement('div');
    gameOverMsg.innerHTML = `<p>Thanks for playing! You reached level ${gameState.level}!</p>
                           <p>Your final score: ${gameState.score}</p>`;
    displays.gallery.appendChild(gameOverMsg);
  }

  // Show level up effect
  function showLevelUpEffect() {
    // Create a level up text effect
    const levelUpText = document.createElement('div');
    levelUpText.textContent = 'LEVEL UP!';
    levelUpText.style.position = 'absolute';
    levelUpText.style.top = '50%';
    levelUpText.style.left = '50%';
    levelUpText.style.transform = 'translate(-50%, -50%)';
    levelUpText.style.fontSize = '48px'; // Increased size
    levelUpText.style.color = '#4CAF50';
    levelUpText.style.fontWeight = 'bold';
    levelUpText.style.textShadow = '0 0 15px rgba(76, 175, 80, 0.8)';
    levelUpText.style.opacity = '0';
    levelUpText.style.transition = 'opacity 0.5s, transform 1s';
    levelUpText.style.zIndex = '100'; // Make sure it appears on top
    
    screens.game.appendChild(levelUpText);
    
    // Show animation
    setTimeout(() => {
      levelUpText.style.opacity = '1';
      levelUpText.style.transform = 'translate(-50%, -70%) scale(1.5)';
    }, 100);
    
    // Remove after animation
    setTimeout(() => {
      levelUpText.style.opacity = '0';
      setTimeout(() => levelUpText.remove(), 500);
    }, 1500);
  }

  // Initialize audio on first click anywhere in the document
  document.addEventListener('click', () => {
    initializeAudio();
    
    // Try to resume audio context if it's suspended
    if (audioCtx.state === 'suspended') {
      try {
        audioCtx.resume().then(() => {
          console.log("AudioContext resumed successfully");
        });
      } catch (e) {
        console.error("Error resuming AudioContext:", e);
      }
    }
  }, {once: true});
  
  console.log("Game initialized and ready!");
});