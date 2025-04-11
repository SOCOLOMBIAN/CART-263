window.onload = go;

let audioCtx;
let shapes= [];
let sequenceManager;

function go() {
     audioCtx= new AudioContext();
     initializeShapes();

sequenceManager= new sequenceManager(audioCtx,shapes);

 // event listeners
document.getElementById('playSequenceBtn').addEventListener('click',() => {
    playerSequence = [];

    disableGameButtons();

// audio working 
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

//play sequence and enable buttons
    sequenceManager.playSequence(() => {
        enableGameButtons();
    });
});

   document.getElementById('generateSequenceBtn').addEventListener('click', () => {
    // Reset player sequence
    playerSequence = [];

    sequenceManager.generateSequence();

   document.getElementById('soundInfo').innerHTML=
   "New sequence generated!"

  });
}

// track player sequence 
let playerSequence= [];

****function initializeShapes() {

    //shapes with SVGS

    svgData.forEach((data, index) => {
        const shape= new Shape(
            audioCtx,
            200 + (index * 100), //different base for each shape
            [ 'sine', 'sine', 'triangle'] [index % 3],
            0.8, // duration
            data.svg,
            data.background,
            index
        );

        shape.setClickCallback((shapeIndex) => {

        if ( !sequenceManager.isPlaying) {
            playerSequence.push(shapeIndex);

            document.getElementById('soundInfo').innerHTML=
            `You clicked shape ${shapeIndex + 1}. Sequence so far: ${playerSequence.length} / ${sequenceManager.sequence.length}`;

        // check the player completition
        if (playerSequence.length === sequenceManager.sequence.length){
           checkPlayerSequence();

        }
      }
    });
    shapes.push(shape);
  });
}


// reset the player sequence 
function resetPlayerSequence(){
playerSequence= [];

}
// disable buttons
function disableGameButtons(){
document.getElementById('playSequenceBtn').disabled = true;
document.getElementById('generateSequenceBtn').disabled = true;
}

//enable buttons
function enableGameButtons(){
document.getElementById('playSequenceBtn').disabled = false;
document.getElementById('generateSequenceBtn').disabled = false;
}

 //check if the player matches the sequence 
 function checkPlayerSequence() {
    const sequenceCorrect= sequenceManager.checkSequence(playerSequence);

    if (sequenceCorrect){
        document.getElementById('soundInfo').innerHTML =
        "Correct!";
    } else{
        document.getElementById('soundInfo').innerHTML=
        "incorrect!";
    
    resetPlayerSequence ();
    disableGameButtons();

    setTimeout(() => {
        enableGameButtons();
    }, 1500);
 }
}









