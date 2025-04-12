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
        
        this.canvas.style.position= 'absolute';
        this.canvas.style.top= '0';
        this.canvas.style.left= '0';
        this.canvas.style.zIndex= '-1';
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        this.container.style.position= 'relative';
        this.container.appendChild(this.canvas);

    // creation of the starts based on the screen size
    this.createStars();
    window.addEventListener('resize', () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      this.createStars();
    });
     
    this.animate();
}

// cretaions of the starts
createStarts() {
    this.starts= [];

    for (let i=0; i< this.options.startCount; i++) {
        this.starts.push( {
    x: Math.random() * this.canvas.width,
    y:  Math.random() * this.canvas.height,
    size:  Math.random() * this.options.starSize + 0.5,
    alpha:  Math.random(),
    //delta:  Math.random() * 0.02) -0.01

    });
  }
 }

animate() {
    this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);


    for (const star of this.stars) {
        if (this.options.twinkle) {
          star.alpha += star.delta;
          if (star.alpha <= 0 || star.alpha >= 1) {
            star.delta *= -1;
          }
        }
  
        this.ctx.beginPath();
        this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
        this.ctx.fill();
      }
      
      this.animationFrame= requestAnimationFrame(() => this.animate ());
    }









}
