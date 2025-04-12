document.addEventListener('DOMContentLoaded', () => { 
    const audioCtx = new AudioContext();
    const gameState = new GameState();
  
    // get the DOM elements 
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
  
    // Event listeners
    buttons.start.addEventListener('click', startGame);
    buttons.restart.addEventListener('click', restartGame);
    buttons.play.addEventListener('click', playSequence);
    buttons.save.addEventListener('click', saveArtwork);
  
    shapes.forEach((shape, index) => {
      shape.addEventListener('click', () => {
        if (gameState.canPlayerInteract) {
          playShape(index);
          const result = gameState.addPlayerMove(index);
          
          // wrong sequence
          if (!result.correct) {
            showMessage(errorMessage);
            setTimeout(endGame, 1000);
            return;
          }
          
          // If the player completed the sequence
          if (result.score !== undefined) {
            // Update displays
            updateDisplay(result.score, result.level);
            showMessage(successMessage);
            
            // Generate art based on sequence - implement a simple function for this
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
  
      // play the sequence
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
      // Highlight the shape
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
      // Simple implementation - you can expand this
      const artDisplay = displays.art;
      artDisplay.innerHTML = '';
      
      // Create a basic SVG based on the sequence
      const svgNS = "http://www.w3.org/2000/svg";
      const svg = document.createElementNS(svgNS, "svg");
      svg.setAttribute("width", "100%");
      svg.setAttribute("height", "100%");
      svg.setAttribute("viewBox", "0 0 300 300");
      
      // For each element in the sequence, add a shape
      sequence.forEach((shapeIdx, i) => {
        const x = 50 + (i % 3) * 100;
        const y = 50 + Math.floor(i / 3) * 100;
        
        const circle = document.createElementNS(svgNS, "circle");
        circle.setAttribute("cx", x);
        circle.setAttribute("cy", y);
        circle.setAttribute("r", 20 + (shapeIdx * 5));
        circle.setAttribute("fill", `hsl(${shapeIdx * 90}, 80%, 50%)`);
        circle.setAttribute("stroke", "white");
        circle.setAttribute("stroke-width", "2");
        
        svg.appendChild(circle);
      });
      
      artDisplay.appendChild(svg);
    }
  
    function saveArtwork() {
      // Implement if needed - could save to localStorage
      buttons.save.disabled = true;
      showMessage(successMessage);
    }
  
    function endGame() {
      screens.game.classList.remove('active');
      screens.gameOver.classList.add('active');
      
      // Could implement a displayGallery function here if needed
    }
  
    // Resume audio context on user interaction
    window.addEventListener('click', () => {
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
    }, {once: true});
  });






