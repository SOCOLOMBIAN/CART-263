document.addEventListener('DOMContentLoaded', () => { 
  // Initialize the particle background
  const starBackground = new particleBackground('body', {
      particleCount: 100,
      particleColor: '#ffffff',
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

  // get the container of the shapes 
  const shapesContainer= document.querySelectorAll('.shapes-container');
  shapesContainer.innerHTML= '';

  //moving shapes container
  shapesContainer.style.position='relative';
  shapesContainer.style.height='300px';

  const shapeSvgs= [raro,prisma,estrella,circle];

  // initialize the moving shapes 
  const movingShapes= new MovingShapes(shapesContainer, shapeSvgs, {
  count: 2,
  speed:{min: 0.5, max:1.2},
  size: {min: 50, max: 70},
  });

  //callback for the moving shapes
  movingShapes.onShapeActivate= (data) => {

    const soundInfo= gameState.soundMap[data.typeIndex];
    const sound= new SoundObject(
      audioCtx,
      soundInfo.frequency,
      soundInfo.type,
      soundInfo.duration
    );
  };

  movingShapes.onSequencePlay= (data) => {
    if (data.ready) {
      buttons.play.disable=false;
    }
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

  shapes.forEach((shape, index) => {
    shape.addEventListener('click', (event) => {
      AnimationEffects.createRipple(event, `rgba(${index * 60 + 100}, ${255 - index * 40}, ${index * 50 + 100}, 0.5)`);
      
      if (gameState.canPlayerInteract) {
        playShape(index);
        const result = gameState.addPlayerMove(index);
        
        // Wrong sequence
        if (!result.correct) {
          showMessage(errorMessage);
          
          // Shake the screen and flash red
          AnimationEffects.screenShake(screens.game, 10, 500);
          AnimationEffects.flashBackground(document.body, 'rgba(255, 0, 0, 0.2)', 500);
          
          setTimeout(endGame, 1000);
          return;
        }
        
        // If the player completed the sequence
        if (result.score !== undefined) {
          // Update displays
          updateDisplay(result.score, result.level);
          showMessage(successMessage);
          
          // Flash green for success
          AnimationEffects.flashBackground(document.body, 'rgba(0, 255, 0, 0.2)', 500);
          
          // Generate art based on sequence
          generateArt(result.sequence, result.level);
          displays.art.style.display = 'block';
          buttons.save.disabled = false;

          // Add level-up animation
          showLevelUpEffect();

          setTimeout(() => {
            const newState = gameState.levelUp();
            updateDisplay(newState.score, newState.level);
            gameState.generateNextSequence();
            buttons.play.disabled = false;
          }, 1500);
        }
      }
    });
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
    
    // Show welcome animation
    showWelcomeAnimation();
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
    
    // Show welcome animation
    showWelcomeAnimation();
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

    // Clear the canvas for new sequence
    const ctx = gameCanvas.getContext('2d');
    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

    // Play the sequence with animations on canvas
    let i = 0;
    const playNextShape = () => {
      if (i < sequence.length) {
        const shapeIndex = sequence[i];
        playShape(shapeIndex);
        
        // Animate the shape on canvas
        AnimationEffects.animateShapeOnCanvas(gameCanvas, shapeIndex, 800);
        
        i++;
        setTimeout(playNextShape, 1000);
      } else {
        setTimeout(() => {
          gameState.finishPlayingSequence();
        }, 500);
      }
    };
    
    // Start playing the sequence after a short delay
    setTimeout(playNextShape, 500);
  }

  function playShape(index) {
    // Highlight the shape with animation
    shapes[index].classList.add('active-shape');
    setTimeout(() => {
      shapes[index].classList.remove('active-shape');
    }, 500);

    // Play the sound
    const soundInfo = gameState.soundMap[index];
    const sound = new SoundObject(
      audioCtx,
      soundInfo.frequency,
      soundInfo.type,
      soundInfo.duration
    );
  }

  function showMessage(element) {
    element.classList.add('visible');
    setTimeout(() => {
      element.classList.remove('visible');
    }, 1000);
  }

  function generateArt(sequence, level) {
    // Use the generative art system
    generativeArt.generateArt(sequence, level);
    displays.art.style.display = 'block';
  }

  function saveArtwork() {
    // Save the artwork to local storage
    const artData = generativeArt.exportArt();
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

  // Show welcome animation with moving shapes
  function showWelcomeAnimation() {
    const ctx = gameCanvas.getContext('2d');
    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    
    // Show all shapes moving to introduce them
    for (let i = 0; i < 4; i++) {
      setTimeout(() => {
        AnimationEffects.animateShapeOnCanvas(gameCanvas, i, 1000);
      }, i * 300);
    }
  }

  // Show level up effect
  function showLevelUpEffect() {
    // Create a level up text effect on canvas
    const ctx = gameCanvas.getContext('2d');
    const width = gameCanvas.width;
    const height = gameCanvas.height;
    
    let opacity = 1;
    let scale = 0.5;
    
    function animateLevelUp() {
      ctx.clearRect(0, 0, width, height);
      
      // Draw level up text
      ctx.save();
      ctx.translate(width/2, height/2);
      ctx.scale(scale, scale);
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
      ctx.font = '36px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('LEVEL UP!', 0, 0);
      ctx.restore();
      
      // Update animation parameters
      opacity -= 0.02;
      scale += 0.03;
      
      if (opacity > 0) {
        requestAnimationFrame(animateLevelUp);
      }
    }
    
    animateLevelUp();
  }

  // Resume audio context on user interaction
  window.addEventListener('click', () => {
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }, {once: true});
});


  // // Initialize generative art canvas
  // displays.art.innerHTML = '<canvas width="300" height="300"></canvas>';
  // const artCanvas = displays.art.querySelector('canvas');
  // const generativeArt = new GenerativeArt(artCanvas);
