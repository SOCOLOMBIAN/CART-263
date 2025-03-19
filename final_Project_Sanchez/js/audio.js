// Audio controller
class AudioController {
    constructor() {
        this.audioContext = null;
        this.initAudioContext();
    }

    // Initialize audio context
    initAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.error('Web Audio API is not supported in this browser');
        }
    }

    // Play a tone with the given frequency
    playTone(frequency) {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.value = frequency;
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.5, this.audioContext.currentTime + 0.05);
        gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.5);
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.5);
    }
}