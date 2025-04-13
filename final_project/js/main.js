document.addEventListener('DOMContentLoaded', () => { 
  // Initialize the particle background
  const starBackground = new particleBackground('body', {
      particleCount: 100,
      particleColor: 'rgba(255, 255, 255, 0.8)',
      starSize: 2,
      twinkle: true
  });

  const audioCtx = new AudioContext();
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
    play: document.getElementById('play-btn'),
    save: document.getElementById('save-btn')
  };

  const displays = {
    score: document.getElementById('score'),
    level: document.getElementById('level'),
    finalScore: document.getElementById('final-score'),
    message: document.getElementById('message'),
    messageWrong: document.getElementById('messageWrong'),
    art: document.getElementById('art-display'),
    gallery: document.getElementById('gallery')
  };

  // Define message elements for easy reference
  const successMessage = displays.message;
  const errorMessage = displays.messageWrong;

  // Get the shapes container
  const shapesContainer = document.querySelector('.shapes-container');
  
  // Remove static shapes
  shapesContainer.innerHTML = '';
  
  // Set up container for moving shapes
  shapesContainer.style.position = 'relative';
  shapesContainer.style.height = '300px';
  
  // Shape SVGs
  const shapeSvgs = [raro, prisma, estrella, circle];
  
  // Initialize moving shapes
  const movingShapes = new MovingShapes(shapesContainer, shapeSvgs, {
    count: 2, // 2 of each shape type (8 total shapes moving around)
    speed: { min: 0.5, max: 1.2 },
    size: { min: 50, max: 70 }
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
      
      // Generate art based on sequence
      generateArt(data.sequence, gameState.level);
      displays.art.style.display = 'block';
      buttons.save.disabled = false;

      // Add level-up animation
      showLevelUpEffect();

      setTimeout(() => {
        const newState = gameState.levelUp();
        updateDisplay(newState.score, newState.level);
        gameState.generateNextSequence();
        buttons.play.disabled = false;
        movingShapes.reset();
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
  
  buttons.save.addEventListener('click', (e) => {
    AnimationEffects.createRipple(e, 'rgba(255, 193, 7, 0.5)');
    saveArtwork();
  });

  function startGame() {
    screens.intro.classList.remove('active');
    screens.game.classList.add('active');
    const state = gameState.resetGame();
    updateDisplay(state.score, state.level);
    gameState.generateNextSequence();
    buttons.play.disabled = false;
    displays.art.style.display = 'none';
    buttons.save.disabled = true;
    movingShapes.reset();
  }

  function restartGame() {
    screens.gameOver.classList.remove('active');
    screens.game.classList.add('active');
    const state = gameState.resetGame();
    updateDisplay(state.score, state.level);
    gameState.generateNextSequence();
    buttons.play.disabled = false;
    displays.art.style.display = 'none';
    buttons.save.disabled = true;
    movingShapes.reset();
  }

  // Update the screen
  function updateDisplay(score, level) {
    displays.score.textContent = score;
    displays.level.textContent = level;
    displays.finalScore.textContent = score;
  }

  function playSequence() {
    if (gameState.isPlaying) return;
    
    const sequence = gameState.startPlayingSequence();
    buttons.play.disabled = true;
    buttons.save.disabled = true;
    
    // Use the moving shapes to play the sequence
    movingShapes.playSequence(sequence);
  }

  function showMessage(element) {
    element.classList.add('visible');
    setTimeout(() => {
      element.classList.remove('visible');
    }, 1000);
  }

  function generateArt(sequence, level) {
    // Get the generative art canvas
    if (!displays.art.querySelector('canvas')) {
      displays.art.innerHTML = '<canvas width="300" height="300"></canvas>';
    }
    const artCanvas = displays.art.querySelector('canvas');
    const generativeArt = new GenerativeArt(artCanvas);
    
    // Use the generative art system
    generativeArt.generateArt(sequence, level);
    displays.art.style.display = 'block';
    
    // Store reference to generated art
    gameState.currentArt = generativeArt;
  }

  function saveArtwork() {
    // Save the artwork to local storage
    const artData = gameState.currentArt.exportArt();
    gameState.saveArtwork(artData);
    
    // Add to gallery
    addToGallery(artData);
    
    buttons.save.disabled = true;
    showMessage(successMessage);
    
    // Animation effect for saving
    AnimationEffects.flashBackground(displays.art, 'rgba(255, 255, 255, 0.3)', 500);
  }
  
  function addToGallery(artData) {
    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery-item';
    
    const img = document.createElement('img');
    img.src = artData;
    img.alt = 'Generated Artwork';
    img.style.width = '100%';
    img.style.height = '100%';
    
    // Add animation to gallery items
    galleryItem.style.opacity = '0';
    galleryItem.style.transform = 'scale(0.8)';
    galleryItem.style.transition = 'all 0.5s ease';
    
    galleryItem.appendChild(img);
    displays.gallery.appendChild(galleryItem);
    
    // Trigger animation
    setTimeout(() => {
      galleryItem.style.opacity = '1';
      galleryItem.style.transform = 'scale(1)';
    }, 50);
  }

  function endGame() {
    screens.game.classList.remove('active');
    screens.gameOver.classList.add('active');
    
    // Clear old gallery items
    displays.gallery.innerHTML = '';
    
    // Display saved artworks in gallery with a staggered animation
    gameState.savedArtworks.forEach((artwork, index) => {
      setTimeout(() => {
        addToGallery(artwork.art);
      }, index * 200);
    });
  }

  // // Show level up effect
  // function showLevelUpEffect() {
  //   // Create a level up text effect
  //   const levelUpText = document.createElement('div');
  //   levelUpText.textContent = 'LEVEL UP!';
  //   levelUpText.style.position = 'absolute';
  //   levelUpText.style.top = '50%';
  //   levelUpText.style.left = '50%';
  //   levelUpText.style.transform = 'translate(-50%, -50%)';
  //   levelUpText.style.fontSize = '36px';
  //   levelUpText.style.color = '#4CAF50';
  //   levelUpText.style.fontWeight = 'bold';
  //   levelUpText.style.textShadow = '0 0 10px rgba(76, 175, 80, 0.8)';
  //   levelUpText.style.opacity = '0';
  //   levelUpText.style.transition = 'opacity 0.5s, transform 1s';
    
  //   screens.game.appendChild(levelUpText);
    
  //   // Show animation
  //   setTimeout(() => {
  //     levelUpText.style.opacity = '1';
  //     levelUpText.style.transform = 'translate(-50%, -70%) scale(1.5)';
  //   }, 100);
    
  //   // Remove after animation
  //   setTimeout(() => {
  //     levelUpText.style.opacity = '0';
  //     setTimeout(() => levelUpText.remove(), 500);
  //   }, 1500);
  // }

  // Resume audio context on user interaction
  window.addEventListener('click', () => {
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }, {once: true});
});