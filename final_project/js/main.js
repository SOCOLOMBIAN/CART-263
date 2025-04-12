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

  // Shapes array
  const shapes = Array.from({length: 4}, (_, i) => {
    const element = document.getElementById(`shape-${i}`);
    element.innerHTML = [raro, prisma, estrella, circle][i];
    return element;
  });

  // Initialize generative art canvas
  const artDisplay = displays.art;
  artDisplay.innerHTML = '<canvas width="300" height="300"></canvas>';
  const artCanvas = artDisplay.querySelector('canvas');
  const generativeArt = new GenerativeArt(artCanvas);

  // Event listeners
  buttons.start.addEventListener('click', startGame);
  buttons.restart.addEventListener('click', restartGame);
  buttons.play.addEventListener('click', playSequence);
  buttons.save.addEventListener('click', saveArtwork);

  shapes.forEach((shape, index) => {
    shape.addEventListener('click', (event) => {
      if (gameState.canPlayerInteract) {
        playShape(index);
        const result = gameState.addPlayerMove(index);
        
        // Wrong sequence
        if (!result.correct) {
          showMessage(errorMessage);
          // Shake the screen and flash red
          AnimationEffects.screenShake(screens.game, 10, 500);
          AnimationEffects.flashBackground(document.body, 'rgba(255, 0, 0, 0.3)', 500);
          setTimeout(endGame, 1000);
          return;
        }
        
        // If the player completed the sequence
        if (result.score !== undefined) {
          // Update displays
          updateDisplay(result.score, result.level);
          showMessage(successMessage);
          
          // Flash green for success
          AnimationEffects.flashBackground(document.body, 'rgba(0, 255, 0, 0.3)', 500);
          
          // Generate art based on sequence
          generateArt(result.sequence, result.level);
          displays.art.style.display = 'block';
          buttons.save.disabled = false;

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

    // Play the sequence
    let i = 0;
    const interval = setInterval(() => {
      playShape(sequence[i]);
      i++;
      if (i >= sequence.length) {
        clearInterval(interval);
        setTimeout(() => {
          gameState.finishPlayingSequence();
        }, 500);
      }
    }, 1000);
  }

  function playShape(index) {
    // Highlight the shape with animation
    AnimationEffects.highlightShape(shapes[index]);

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
    // Use the enhanced generative art system
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
  }
  
  function addToGallery(artData) {
    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery-item';
    
    const img = document.createElement('img');
    img.src = artData;
    img.alt = 'Generated Artwork';
    img.style.width = '100%';
    img.style.height = '100%';
    
    galleryItem.appendChild(img);
    displays.gallery.appendChild(galleryItem);
  }

  function endGame() {
    screens.game.classList.remove('active');
    screens.gameOver.classList.add('active');
    
    // Clear old gallery items
    displays.gallery.innerHTML = '';
    
    // Display saved artworks in gallery
    gameState.savedArtworks.forEach(artwork => {
      addToGallery(artwork.art);
    });
  }

  // Resume audio context on user interaction
  window.addEventListener('click', () => {
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }, {once: true});
});