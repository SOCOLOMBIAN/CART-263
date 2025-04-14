class GameTimer {
    constructor() {
        this.element = null,
        this.interval= null,
        this.timeLeft= 0,
        this.callBack=null;
    }

    initialize(container) {
        this.element = document.querySelector(".time-display");

        if (!this.element) {
            console.error( 'timer not working');
            return;
        }
      }

    start(duration,onComplete) {
        this.callBack= onComplete;

        //inital time
        this.timeLeft= Math.max(1, Math.floor(duration));
        this.update();
        this.show();

        this.interval= setInterval(() => {
            this.timeLeft--;
            this.update();

            if (this.timeLeft <=0) {
                this.stop();

                if (this.callBack && typeof this.callBack === 'function') {

                }
            }
        }, 1000);

        return this;
    }
    
    //get the timer 
    update() {
        const timerValue= document.getElementById('timer-value');
        if (timerValue) {
            timerValue.textContent= this.timeLeft;

            if (this.timeLeft <= 3) {
              this.element.classList.add ('warning');
            } else{
              this.element.classList.remove('warning');
                 
             }
            }
            return this;
        }
       
        // reset the timer 
        reset() {
            this.stop();
            this.timeLeft=0;
            this.hide();

            return this;
        }
        
        show() {
            if (this.element){
                this.element.computedStyleMap.opacity= '1';
            }
            return this;
        }

        hide(){
            if (this.element){
                this.element.style.opacity= '0';
            }
            return this;
        }
        
        static calculateDuration(level){
            return Math.max(10-((level -1)*0.5), 3);
        }
    }

    // create the global instance 
window.gameTimer= new GameTimer();