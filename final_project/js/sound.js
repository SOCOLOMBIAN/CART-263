class SoundObject{

    constructor(audioCtx ,frequency,type,duration){
         // create Oscillator node
    this.oscillator = audioCtx.createOscillator(); // input sound wave
    this.gainNode = audioCtx.createGain(); // volume module

    this.oscillator.frequency.value = frequency;

    this.oscillator.connect(this.gainNode); // connect sound to volume controller
    this.gainNode.connect(audioCtx.destination); // connect voume module to output

    //console.log(audioCtx.currentTime);

    this.oscillator.type = type;
    this.oscillator.start();
    this.gainNode.gain.setValueAtTime(1, audioCtx.currentTime);
    this.gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    }

}