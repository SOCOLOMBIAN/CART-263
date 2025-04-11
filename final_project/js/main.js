
import GameState from 'js/state.js';
let audioCtx;
document.addEventListener('DOMContentLoaded', () => { 
    audioCtx= new AudioContext();

//svg elements 
// document.getElementById('shape-0').innerHTML=raro;
// document.getElementById('shape-1').innerHTML=prisma;
// document.getElementById('shape-2').innerHTML=estrella;
// document.getElementById('shape-3').innerHTML=circle;

const gameState = new GameState();

// get the DOM elements 
const introScreen = document.getElementById('intro-screen');
const gameScreen = document.getElementById('game-screen');
const startBtn = document.getElementById('start-btn');

//Event listeners
startBtn.addEventListener('click',startGame);
restartBtn.addEventListener('click',restartGame);
playBtn.addEventListener('click', playSequence);

    shapes.forEach((shape, index) => {
         shape.addEventListener('click', () => {
            if (gameState.canPlayerInteract){
            playShape(index);
            const result= gameState.addPlayerMove(index);

            if (!result.correct) {
                showMessage(errorMessage);
                setTimeout(endGame,1000);
                return;
            }
               //correct sequence
            updateDisplay(result.score, result.level);
            showMessage(successMessage);
            
            // Generate art based on sequence
           //generateArt(result.sequence, result.level, artDisplay);
          //saveBtn.disabled = false;

           setTimeout(() => {
            const newState= gameState.levelUp();
            updateDisplay(newState.score, newState.level);
            gameState.generateNextSequence();
            playBtn.disabled=false;
           }, 1500);
        }
   });
});

function startGame(){
    introScreen.classList.remove('active');
    gameScreen.classList.add('active')
    const state= gameState.resetGame();
    updateDisplay(state.score,state.level);
    gameState.generateNextSequence();
    playBtn.disabled=false;
    //artDisplay.style.display='none';
    //saveBtn.disabled =true;
}

function restartGame() {
    gameOverScreen.classList.remove('active');
    gameScreen.classList.add('active');
    const state= gameState.resetGame();
    updateDisplay(state.score,state.level);
    gameState.generateNextSequence();
    playBtn.disabled=false;
    //artDisplay.style.display='none';
    //saveBtn.disable=true;

}

function updateDisplay(score,level) {
    scoreDisplay.textContent= score;
    levelDisplay.textContent= level;
    finalScoreDisplay.textContent= score;
}

function playSequence(){
  if (gameState.isPlaying) return;

  const sequence= gameState.startPlayingSequence();
  playBtn.disabled= true;
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
}

function showMessage(element){
}

function endGame(){
    gameScreen.classList.remove('active');
    gameOverScreen.classList.add('active');

     // Display saved artworks in the gallery
     //displayGallery(gallery, gameState.savedArtworks);
}

window.addEventListener('click',() => {
    if (audioCtx.state=== 'suspended') {
        audioCtx.resume();
     }
  }, {once: true});
});










