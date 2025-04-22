/**
 * main.js
 * Main entry point for the chromatic sound sequences game
 * coordinates game flow,user interaction, and the integration of all components 
 */

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
      audioInitialized = true;
  
      // Test initial sound object
      new SoundObject(audioCtx, 0, 'square', 0.1);
    } catch (e) {
      console.error("AudioContext not supported:", e);
      // Simple fallback
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
        currentTime: 0,
        state: 'running'
      };
      audioInitialized = true;
    }
  }
  
  // Don't initialize immediately to avoid autoplay restrictions
  // We'll initialize on first user interaction instead
  
  const gameState = new GameState();

  // control the difficulty of the levels
  const difficultyManager = {
    baseSettings: {
      speed: {min: 0.5, max: 1.2},
      sequenceDelay: 1000,
      shapeDuration: 500
    },

    applyScaling(level, shapes = null) {
      // Calculate speed multiplier capped at 2x
      const speedMultiplier = Math.min(1 + (level - 1) * 0.1, 2.0);
      
      // Update shape speeds if provided
      if (shapes && Array.isArray(shapes)) {
        shapes.forEach(shape => {
          // Apply speed multiplier
          shape.speedX *= speedMultiplier;
          shape.speedY *= speedMultiplier;
          
          // Limit maximum speed
          const maxSpeed = 3;
          if (Math.abs(shape.speedX) > maxSpeed) {
            shape.speedX = (shape.speedX > 0) ? maxSpeed : -maxSpeed;
          }
          if (Math.abs(shape.speedY) > maxSpeed) {
            shape.speedY = (shape.speedY > 0) ? maxSpeed : -maxSpeed;
          }
        });
      }
      
      return {
        sequenceDelay: Math.max(this.baseSettings.sequenceDelay - ((level - 1) * 50), 400),
        shapeDuration: Math.max(this.baseSettings.shapeDuration - ((level - 1) * 25), 200)
      };
    },
    
    getBaseSpeed() {
      return this.baseSettings.speed;
    }
  };

  // Make sure the game timer is initialized
  const gameTimer = {
    element: document.querySelector('.timer-display'),
    interval: null,
    timeLeft: 0,

    start(duration, onComplete) {
      this.reset();
      this.timeLeft = Math.max(1, Math.floor(duration));
      this.update();
      this.show();

      this.interval = setInterval(() => {
        this.timeLeft--;
        this.update();
        
        if (this.timeLeft <= 0) {
          this.stop();
          if (onComplete) onComplete();
        }
      }, 1000);
    },

    update() {
      const timerValue = document.getElementById('timer-value');
      if (timerValue) {
        timerValue.textContent = this.timeLeft;
        
        // Add warning style when time is low
        if (this.timeLeft <= 3) {
          this.element.style.color = '#f44336';
          this.element.style.animation = 'pulse 0.5s infinite alternate';
        } else {
          this.element.style.color = '#fff';
          this.element.style.animation = 'pulse 1s infinite alternate';
        }
      }
      return this;
    },
    
    stop() {
      if (this.interval) {
        clearInterval(this.interval);
        this.interval = null;
      }
      return this;
    },
    
    reset() {
      this.stop();
      this.timeLeft = 0;
      this.hide();
      return this;
    },
    
    show() {
      if (this.element) this.element.style.opacity = '1';
      return this;
    },
    
    hide() {
      if (this.element) this.element.style.opacity = '0';
      return this;
    },
    
    calculateDuration(level) {
      return Math.max(10 - ((level - 1) * 0.5), 3);
    }
  };

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
  };

  // Define message elements
  const successMessage = displays.message;
  const errorMessage = displays.messageWrong;

  // Get the shapes container
  const shapesContainer = document.querySelector('.shapes-container');
  
  // Ensure SVG variables are defined before using them
  if (typeof raro === 'undefined' || typeof prisma === 'undefined' || 
      typeof estrella === 'undefined' || typeof circle === 'undefined') {
    console.error("SVG shapes are not defined. Check shapes.js inclusion.");
    return; // Exit initialization if shapes aren't available
  }
  
  const shapeSvgs = [raro, prisma, estrella, circle];
  
  // Initialize moving shapes with improved settings for better visibility
  const movingShapes = new MovingShapes(shapesContainer, shapeSvgs, {
    count: 1, 
    speed: difficultyManager.getBaseSpeed(), 
    size: { min: 50, max: 70 } 
  });
  
  //shape callbacks
  movingShapes.onShapeActivate = (data) => {
    // Initialize audio if needed
    if (!audioInitialized) initializeAudio();
    
    const soundInfo = gameState.soundMap[data.typeIndex];
    try {
      if (audioCtx.state === 'suspended') {
        audioCtx.resume().then(() => {
          new SoundObject(audioCtx, soundInfo.frequency, soundInfo.type, soundInfo.duration);
        });
      } else {
        new SoundObject(audioCtx, soundInfo.frequency, soundInfo.type, soundInfo.duration);
      }
    } catch (e) {
      console.error("Error playing sound:", e);
    }
  };
  
  movingShapes.onSequencePlay = (data) => {
    if (data.ready) {
      buttons.play.disabled = false;
      movingShapes.canPlayerInteract = true;

      // Start timer
      const timerDuration = gameTimer.calculateDuration(gameState.level);
      gameTimer.start(timerDuration, () => {
        movingShapes.onSequenceError({ error: "Time's up!" });
      });
    }
  };

  // the user completes the sequence
  movingShapes.onSequenceComplete = (data) => {
    if (data.success) {
      // Stop timer
      gameTimer.stop().hide();
    
      // Update score and level
      gameState.score += gameState.level * 10;
      updateDisplay(gameState.score, gameState.level);
      showMessage(successMessage);
      
      // Visual feedback
      AnimationEffects.flashBackground(document.body, 'rgba(0, 255, 0, 0.2)', 500);

      // Level up after delay
      setTimeout(() => {
        const newState = gameState.levelUp();
        updateDisplay(newState.score, newState.level);
         
        // Apply difficulty scaling
        const difficultySettings = difficultyManager.applyScaling(
          gameState.level, 
          movingShapes.shapes
        );
         
        // Reset game state for next level
        gameState.generateNextSequence();
        gameState.isPlaying = false;
        gameState.canPlayerInteract = false;
         
        // Reset state
        buttons.play.disabled = false;
        movingShapes.reset();
        movingShapes.isPlayingSequence = false;
        movingShapes.canPlayerInteract = false;
      }, 1500);
    }
  };

  // error of the user in the sequence 
  movingShapes.onSequenceError = (data) => {
    // Stop timer
    gameTimer.stop().hide();
    
    showMessage(errorMessage);
    
    // Visual feedback
    AnimationEffects.screenShake(screens.game, 10, 500);
    AnimationEffects.flashBackground(document.body, 'rgba(255, 0, 0, 0.2)', 500);
    
    setTimeout(endGame, 1000);
  };

  // Add button event listeners with initialization
  buttons.start.addEventListener('click', (e) => {
    initializeAudio(); // Ensure audio is initialized on first interaction
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

  //game state functions 
  function startGame() {
    screens.intro.classList.remove('active');
    screens.game.classList.add('active');
    
    const state = gameState.resetGame();
    updateDisplay(state.score, state.level);
    
    gameState.generateNextSequence();
    buttons.play.disabled = false;
    movingShapes.reset();
  }

  function restartGame() {
    screens.gameOver.classList.remove('active');
    screens.game.classList.add('active');
    
    const state = gameState.resetGame();
    updateDisplay(state.score, state.level);
    
    gameState.generateNextSequence();
    buttons.play.disabled = false;
    movingShapes.reset();
  }

  function updateDisplay(score, level) {
    displays.score.textContent = score;
    displays.level.textContent = level;
    displays.finalScore.textContent = score;
  }

  function playSequence() {
    // Prevent multiple plays
    if (gameState.isPlaying || movingShapes.isPlayingSequence) return;
    
    const sequence = gameState.startPlayingSequence();
    buttons.play.disabled = true;
    
    // Ensure valid sequence
    if (!sequence || sequence.length === 0) {
      gameState.generateNextSequence();
      const newSequence = gameState.startPlayingSequence();
      
      if (!newSequence || newSequence.length === 0) {
        buttons.play.disabled = false;
        return;
      }

      const settings = difficultyManager.applyScaling(gameState.level);
      movingShapes.playSequence(newSequence, settings);
    } else {
      const settings = difficultyManager.applyScaling(gameState.level);
      movingShapes.playSequence(sequence, settings);
    }
  }

  function showMessage(element) {
    element.classList.add('visible');
    setTimeout(() => element.classList.remove('visible'), 1000);
  }

  function endGame() {
    screens.game.classList.remove('active');
    screens.gameOver.classList.add('active');
    displays.finalScore.textContent = gameState.score;
  }

  // Initialize audio on any user interaction
  document.addEventListener('click', () => {
    initializeAudio();  
    if (audioCtx && audioCtx.state === 'suspended') {
      try {
        audioCtx.resume().catch(e => console.error("Error resuming AudioContext:", e));
      } catch (e) {
        console.error("Error resuming AudioContext:", e);
      }
    }
  }, {once: true});
});