

document.addEventListener('DOMContentLoaded', () => { 
 const audioCtx= new AudioContext();

 const gameState = new GameState();


// get the DOM elements 
const screens={
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

// efficent code for the svg?
  const shapes = Array.from({length: 4}, (_, i) => {
    const element = document.getElementById(`shape-${i}`);
    element.innerHTML = [raro, prisma, estrella, circle][i];
    return element;
});

//Event listeners
buttons.start.addEventListener('click',startGame);
buttons.restart.addEventListener('click',restartGame);
buttons.play.addEventListener('click', playSequence);



    shapes.forEach((shape, index) => {
         shape.addEventListener('click', () => {
            if (gameState.canPlayerInteract){
            playShape(index);
            const result= gameState.addPlayerMove(index);
            
            // wrong sequence
            if (!result.correct) {
                showMessage(errorMessage);
                setTimeout(endGame,1000);
                return;
            }
             //correct sequence
            displays.messageWrong(result.score, result.level);
            displays.message(successMessage);
            
            // Generate art based on sequence
           //generateArt(result.sequence, result.level, artDisplay);
          //saveBtn.disabled = false;

           setTimeout(() => {
            const newState= gameState.levelUp();
            updateDisplay(newState.score, newState.level);
            gameState.generateNextSequence();
            buttons.play.disabled=false;
           }, 1500);
        }
   });
});

function startGame(){
    screens.intro.classList.remove('active');
    screens.game.classList.add('active')
    const state= gameState.resetGame();
    updateDisplay(state.score,state.level);
    gameState.generateNextSequence();
    buttons.play.disabled=false;
    //artDisplay.style.display='none';
    //saveBtn.disabled =true;
}

function restartGame() {
    screens.gameOver.classList.remove('active');
    screens.game.classList.add('active');
    const state= gameState.resetGame();
    updateDisplay(state.score,state.level);
    gameState.generateNextSequence();
    buttons.play.disabled=false;
    //artDisplay.style.display='none';
    //saveBtn.disable=true;

}

//update the screen
function updateDisplay(score,level) {
    displays.score.textContent= score;
    displays.level.textContent= level;
    displays.finalScore.textContent= score;
}

function playSequence(){
  if (gameState.isPlaying) return;

  const sequence= gameState.startPlayingSequence();
  buttons.play.disabled= true;
  //savebtn.disabled=true;

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

function endGame(){
    screens.game.classList.remove('active');
    screens.gameOver.classList.add('active');

     // Display saved artworks in the gallery
     //displayGallery(gallery, gameState.savedArtworks);
}

window.addEventListener('click',() => {
    if (audioCtx.state=== 'suspended') {
        audioCtx.resume();
     }
  }, {once: true});
});










