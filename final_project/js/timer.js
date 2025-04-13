// Timer class to handle all time-related functionality
class GameTimer {
    constructor() {
      this.timers = {};
      this.animationFrames = {};
    }
  
    // Set a timeout and store its ID
    setTimeout(callback, delay, id) {
      this.clearTimeout(id); // Clear existing timeout with same ID if exists
      this.timers[id] = setTimeout(callback, delay);
      return this.timers[id];
    }
  
    // Clear a specific timeout
    clearTimeout(id) {
      if (this.timers[id]) {
        clearTimeout(this.timers[id]);
        delete this.timers[id];
      }
    }
  
    // Set an animation frame and store its ID
    requestAnimationFrame(callback, id) {
      this.cancelAnimationFrame(id); // Cancel existing frame with same ID if exists
      this.animationFrames[id] = requestAnimationFrame(callback);
      return this.animationFrames[id];
    }
  
    // Cancel a specific animation frame
    cancelAnimationFrame(id) {
      if (this.animationFrames[id]) {
        cancelAnimationFrame(this.animationFrames[id]);
        delete this.animationFrames[id];
      }
    }
  
    // Clear all timers and animation frames
    clearAll() {
      // Clear all timeouts
      for (const id in this.timers) {
        clearTimeout(this.timers[id]);
        delete this.timers[id];
      }
      
      // Cancel all animation frames
      for (const id in this.animationFrames) {
        cancelAnimationFrame(this.animationFrames[id]);
        delete this.animationFrames[id];
      }
    }
  }
  
  // Export the timer instance
  const gameTimer = new GameTimer();