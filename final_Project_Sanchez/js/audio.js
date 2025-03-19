// Audio Context for sound generation
let audioContext;

// Initialize audio context
function initAudio() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
}

// Play a tone with color relationship
function playTone(frequency, duration, color) {
    if (!audioContext) initAudio();
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + duration);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
    
    // Visual feedback on canvas
    drawVisualEffect(color);
}
