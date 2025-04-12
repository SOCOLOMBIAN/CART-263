
class GameState {
constructor(){

this.gameSequence= [];
this.playerSequence=[];
this.score= 0;
this.level= 1;
this.isPlaying= false;
this.canPlayerInteract=false;
this.soundMap= this.generateRandomSoundMap();
//this.savedArtworks=[];
}

resetGame(){
this.gameSequence= [];
this.playerSequence=[];
this.score= 0;
this.level= 1;
this.isPlaying= false;
this.canPlayerInteract=false;
this.soundMap= this.generateRandomSoundMap();

return{
    score:this.score,
    level:this.level };
}

generateRandomSoundMap() {
    this.soundMap= Array.from({ length: 4}, () => ({
        frequency: 200 + Math.random()* 800,
        type:['sine','square','triangle','sawtooth'][Math.floor(Math.random()*4)],
        duration: 0.3 + Math.random() *0.4 
    }));
}

// players get the answer, it generates next sequence
generateNextSequence(){
  const nextShape= Math.floor(Math.random()*4);
  this.gameSequence.push(nextShape);
  return this.gameSequence
}

// playing the sequence 
startPlayingSequence(){
    this.isPlaying=true;
    this.canPlayerInteract=false;
    this.playerSequence=[];
    return[...this.gameSequence];
}

finishPlayingSequence() {
    this.isPlaying = false;
    this.canPlayerInteract = true;
}

addPlayerMove(shapeIndex) {
    if (!this.canPlayerInteract) return { correct: false };
  
    this.playerSequence.push(shapeIndex);
    const currentMove = this.playerSequence.length - 1;
  
    // Check if the move is correct
    if (this.playerSequence[currentMove] !== this.gameSequence[currentMove]) {
      return { correct: false }; //  return false if the move is incorrect
    }
  
    // Check if the sequence is complete
    if (this.playerSequence.length === this.gameSequence.length) {
      this.score += this.level * 10;
      this.canPlayerInteract = false;
      return {
        correct: true,
        score: this.score,
        level: this.level,
        sequence: [...this.gameSequence]
      };
    }
  
    return { correct: true }; // Return true only if the move is correct and the sequence is not complete
  }
  
  levelUp(){
    this.level++;
    this.soundMap = this.generateRandomSoundMap();
    return { score: this.score, level: this.level};
  }
}  
// saveArtwork(artData) {
//     this.savedArtworks.push({
//         sequence: [...this.sequence],
//         level: this.level,
//         score: this.score,
//         art: artData
//     });
//     return this.savedArtworks;
  



