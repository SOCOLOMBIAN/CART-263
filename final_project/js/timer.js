/**
 * timer.js
 * Provides countdown timer functionality for the game.
 * Manages visual display and callback execution when time runs out.
 */

class GameTimer {
    constructor() {
      this.element = null;
      this.interval = null;
      this.timeLeft = 0;
      this.callback = null;
    }

   /**
    *Find and store the timer element in the DOM
     */
    create() {
      this.element = document.querySelector('.timer-display');
      if (!this.element) {
        console.error('Timer element not found');
      }
    }
  
   /**
     * countdown timer 
     */
    start(duration, onComplete) {
      this.reset();
      this.callback = onComplete;
      this.timeLeft = Math.max(1, Math.floor(duration));
      this.update();
      this.show();
  
      this.interval = setInterval(() => {
        this.timeLeft--;
        this.update();
        
        if (this.timeLeft <= 0) {
          this.stop();
          if (this.callback && typeof this.callback === 'function') {
            this.callback();
          }
        }
      }, 1000);
  
      return this;
    }
    
     /**
     * update timer display
     */
    update() {
      const timerValue = document.getElementById('timer-value');
      if (timerValue) {
        timerValue.textContent = this.timeLeft;
        
        // Add warning style when time is low
        if (this.timeLeft <= 3) {
          this.element.style.color = '#f44336';
          this.element.style.animation = 'pulse 0.5s infinite alternate';
        } else {
          this.element.style.color = '#fff';
          this.element.style.animation = 'pulse 1s infinite alternate';
        }
      }
      return this;
    }
    
     /**
     * stop,rest,show and hide the timer
     */
    stop() {
      if (this.interval) {
        clearInterval(this.interval);
        this.interval = null;
      }
      return this;
    }
    
    reset() {
      this.stop();
      this.timeLeft = 0;
      this.hide();
      return this;
    }
    
    show() {
      if (this.element) this.element.style.opacity = '1';
      return this;
    }
    
    hide() {
      if (this.element) this.element.style.opacity = '0';
      return this;
    }
    
    static calculateDuration(level) {
      return Math.max(10 - ((level - 1) * 0.5), 3);
    }
  }
    // create the global instance 
window.gameTimer= new GameTimer();