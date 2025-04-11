
export default class GameState {
constructor(){

this.gameSequence= [];
this.playerSequence=[];
this.score= 0;
this.level= 1;
this.isPlaying= false;
this.canPlayerInteract=false;
this.soundMap= this.generateSoundMap();
//this.savedArtworks=[];
}

resetGame(){
this.gameSequence= [];
this.playerSequence=[];
this.score= 0;
this.level= 1;
this.isPlaying= false;
this.canPlayerInteract=false;

return{
    score:this.score,
    level:this.level };
}


generateNextSequence(){
    const nextShape= Math.floor(Math.random()*4);
    this.sequence.push(nextShape);
    return this.sequence
}
startPlayingSequence(){
    this.isPlaying=true;
    this.canPlayerInteract=false;
    this.playerSequence=[];
    return[...this.sequence];
}

finishPlayingSequence() {
    this.isPlaying = false;
    this.canPlayerInteract = true;
}













}



