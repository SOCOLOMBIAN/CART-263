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

}