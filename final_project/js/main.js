document.addEventListener('DOMContentLoaded', () => { 
  // Wait to make sure all scripts are fully loaded
  setTimeout(initGame, 300);
  
  function initGame() {
    // Initialize the particle background
    const starBackground = new particleBackground('body', {
        particleCount: 100,
        particleColor: 'rgba(255, 255, 255, 0.8)',
        starSize: 2,
        twinkle: true
    });

    // Force SVG vars to be loaded from global scope
    window.shapeSvgs = [raro, prisma, estrella, circle];
    console.log("SVG availability check:", 
      typeof raro !== 'undefined', 
      typeof prisma !== 'undefined',
      typeof estrella !== 'undefined',
      typeof circle !== 'undefined');

    const audioCtx = new AudioContext();
    const gameState = new GameState();
    let autoPlayTimer = null;

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
      gallery: document.getElementById('gallery'),
      timer: document.createElement('div')
    };

    // Setup timer display
    displays.timer.id = 'timer-display';
    displays.timer.className = 'timer-display';
    displays.timer.innerHTML = '<span id="timer-value">10</span>';
    const controlsDiv = document.querySelector('.controls');
    controlsDiv.parentNode.insertBefore(displays.timer, controlsDiv);
    hideTimerDisplay();

    // Define message elements for easy reference
    const successMessage = displays.message;
    const errorMessage = displays.messageWrong;

    // Get the shapes container
    const shapesContainer = document.querySelector('.shapes-container');
    
    // Remove static shapes
    shapesContainer.innerHTML = '';
    
    // Set up container for moving shapes
    shapesContainer.style.position = 'relative';
    shapesContainer.style.height = '400px';
    
    // Initialize moving shapes with improved settings for better movement
    const movingShapes = new MovingShapes(shapesContainer, window.shapeSvgs, {
      count: 2, // 2 of each shape type (8 total shapes moving around)
      speed: { min: 1.0, max: 2.0 }, // Increased speed for better visibility
      size: { min: 60, max: 80 } // Increased size for better visibility
    });
    
    // Set up callbacks for the moving shapes
    movingShapes.onShapeActivate = (data) => {
      // Play sound for the activated shape
      const soundInfo = gameState.soundMap[data.typeIndex];
      const sound = new SoundObject(
        audioCtx,
        soundInfo.frequency,
        soundInfo.type,
        soundInfo.duration
      );
    };
    
    movingShapes.onSequencePlay = (data) => {
      if (data.ready) {
        // Sequence finished playing, player can interact
        buttons.play.disabled = false;
        console.log("Sequence ready for player interaction");
        startAutoplayTimer(10);
      }
    };
    
    movingShapes.onSequenceComplete = (data) => {
      if (data.success) {
        console.log("Sequence complete success!");
        // Clear any autoplay timer
        clearAutoplayTimer();
        
        // Update score and level
        gameState.score += gameState.level * 10;
        updateDisplay(gameState.score, gameState.level);
        showMessage(successMessage);
        
        // Flash green for success
        AnimationEffects.flashBackground(document.body, 'rgba(0, 255, 0, 0.2)', 500);
        
        // Add level-up animation
        showLevelUpEffect();

        // Level up after a delay
        setTimeout(() => {
          const newState = gameState.levelUp();
          updateDisplay(newState.score, newState.level);
          
          // Generate the next sequence for the new level
          const newSequence = gameState.generateNextSequence();
          console.log("New level sequence generated:", newSequence);
          
          // Reset buttons and prepare for next round
          buttons.play.disabled = false;
          movingShapes.reset();
          
          // Automatically start next sequence after a delay
          setTimeout(() => {
            playSequence();
          }, 2000);
        }, 1500);
      }
    };
    
    movingShapes.onSequenceError = (data) => {
      console.log("Sequence error:", data);
      // Clear any autoplay timer
      clearAutoplayTimer();
      
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
      screens.intro.classList.remove('active');
      screens.game.classList.add('active');
      const state = gameState.resetGame();
      updateDisplay(state.score, state.level);
      const sequence = gameState.generateNextSequence();
      console.log("Initial game sequence:", sequence);
      buttons.play.disabled = false;
      movingShapes.reset();
      
      // Automatically start first sequence after a short delay
      setTimeout(() => {
        playSequence();
      }, 1000);
    }

    function restartGame() {
      screens.gameOver.classList.remove('active');
      screens.game.classList.add('active');
      const state = gameState.resetGame();
      updateDisplay(state.score, state.level);
      const sequence = gameState.generateNextSequence();
      console.log("Restart game sequence:", sequence);
      buttons.play.disabled = false;
      movingShapes.reset();
      
      // Automatically start first sequence after a short delay
      setTimeout(() => {
        playSequence();
      }, 1000);
    }

    // Update the screen
    function updateDisplay(score, level) {
      displays.score.textContent = score;
      displays.level.textContent = level;
      displays.finalScore.textContent = score;
    }

    function playSequence() {
      if (gameState.isPlaying) return;
      
      // Clear any existing autoplay timer
      clearAutoplayTimer();
      
      const sequence = gameState.startPlayingSequence();
      console.log("Playing sequence:", sequence);
      buttons.play.disabled = true;
      
      // Use the moving shapes to play the sequence
      movingShapes.playSequence(sequence);
    }

    function showMessage(element) {
      element.classList.add('visible');
      setTimeout(() => {
        element.classList.remove('visible');
      }, 1000);
    }

    function endGame() {
      clearAutoplayTimer();
      hideTimerDisplay();
      
      screens.game.classList.remove('active');
      screens.gameOver.classList.add('active');
      
      // Clear old gallery items
      displays.gallery.innerHTML = '';
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
    
    // Autoplay timer functions
    function startAutoplayTimer(seconds) {
      clearAutoplayTimer();
      
      const timerValue = document.getElementById('timer-value');
      let timeLeft = seconds;
      
      // Show the timer
      showTimerDisplay();
      timerValue.textContent = timeLeft;
      
      // Start the countdown
      autoPlayTimer = setInterval(() => {
        timeLeft--;
        timerValue.textContent = timeLeft;
        
        if (timeLeft <= 0) {
          clearInterval(autoPlayTimer);
          // Auto-play the sequence again
          if (gameState.isPlaying) {
            // Game is already playing, don't do anything
            hideTimerDisplay();
          } else {
            // Auto-play the sequence again
            playSequence();
          }
        }
      }, 1000);
    }
    
    function clearAutoplayTimer() {
      if (autoPlayTimer) {
        clearInterval(autoPlayTimer);
        autoPlayTimer = null;
        hideTimerDisplay();
      }
    }
    
    function showTimerDisplay() {
      displays.timer.style.display = 'block';
      displays.timer.style.opacity = '1';
    }
    
    function hideTimerDisplay() {
      displays.timer.style.display = 'none';
      displays.timer.style.opacity = '0';
    }

    // Resume audio context on user interaction
    window.addEventListener('click', () => {
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
    }, {once: true});
  }
});