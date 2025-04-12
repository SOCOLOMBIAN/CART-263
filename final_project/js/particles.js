class particleBackground {
    constructor(containerId, options={}) {
        this.container= document.getElementById(containerId);
        this.canvas= document.createElement('canvas');
        this.ctx= this.canvas.getContext('2d');

        this.options = {
            particleCount: options.particleCount || 50,
            particleColor: options.particleColor || '#ffffff',
            startSize: options.startSize || 1.5,
            twinkle: options.twinkle !== undefined ? options.twinkle : true

        };

        this.stars= [];
        this.animationFrame= null;

        this.init();
    }

    // set up the particle canvas 
    init(){
        
        this.canvas.style.position 
    }









}