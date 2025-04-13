class SoundObject {
  constructor(audioCtx, frequency, type, duration) {
      try {
          // Create Oscillator node
          this.oscillator = audioCtx.createOscillator(); // input sound wave
          this.gainNode = audioCtx.createGain(); // volume module

          // Set frequency
          this.oscillator.frequency.value = frequency;

          // Connect nodes
          this.oscillator.connect(this.gainNode); // connect sound to volume controller
          this.gainNode.connect(audioCtx.destination); // connect volume module to output

          // Set oscillator type (sine, square, etc.)
          this.oscillator.type = type;
          
          // Start oscillator
          this.oscillator.start();
          
          // Set initial gain (volume) and fade out
          this.gainNode.gain.setValueAtTime(0.7, audioCtx.currentTime); // Lower initial volume to prevent clipping
          this.gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

          // Stop the oscillator after duration
          setTimeout(() => {
              try {
                  this.oscillator.stop();
              } catch (e) {
                  console.warn("Error stopping oscillator:", e);
              }
          }, duration * 1000);
          
          console.log(`Playing sound: freq=${frequency}, type=${type}, duration=${duration}`);
      } catch (e) {
          console.error("Error creating sound:", e);
      }
  }
}