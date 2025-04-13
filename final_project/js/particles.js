class particleBackground {
    constructor(selector, options = {}) {
      // default options
      this.options = {
        particleCount: options.particleCount || 100,
        particleColor: options.particleColor || '#ffffff',
        starSize: options.starSize || 2,
        twinkle: options.twinkle !== undefined ? options.twinkle : true,
        speed: options.speed || 0.1,
        minOpacity: options.minOpacity || 0.2,
        maxOpacity: options.maxOpacity || 0.9
      };
      
      // Create canvas element
      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
      
      //  styles to make it a background
      this.canvas.style.position = 'fixed';
      this.canvas.style.top = '0';
      this.canvas.style.left = '0';
      this.canvas.style.width = '100%';
      this.canvas.style.height = '100%';
      this.canvas.style.zIndex = '-1';
      this.canvas.style.pointerEvents = 'none';
      
      // Append to specified element or to body
      const container = document.querySelector(selector) || document.body;
      container.appendChild(this.canvas);
      
      // Initialize particles
      this.particles = [];
      this.resizeCanvas();
      this.createParticles();
      
      // Start animation
      this.animate();
      
      //window resize
      window.addEventListener('resize', () => this.resizeCanvas());
    }
    
    resizeCanvas() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      
      // Recreate particles when canvas size changes
      if (this.particles.length > 0) {
        this.particles = [];
        this.createParticles();
      }
    }
    
    createParticles() {
      for (let i = 0; i < this.options.particleCount; i++) {
        this.particles.push({
          x: Math.random() * this.canvas.width,
          y: Math.random() * this.canvas.height,
          size: Math.random() * this.options.starSize + 0.5,
          opacity: Math.random() * (this.options.maxOpacity - this.options.minOpacity) + this.options.minOpacity,
          speed: Math.random() * this.options.speed + 0.05,
          increasing: Math.random() > 0.5
        });
      }
    }
    
    animate() {
      // Clear canvas
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
      // Update and draw particles
      for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i];
        
        // Draw particle
        this.ctx.beginPath();
        this.ctx.fillStyle = `rgba(255,255,255, ${p.opacity})`;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Move particle slowly upward
        p.y -= p.speed;
        
        // Reset position if out of bounds
        if (p.y < -10) {
          p.y = this.canvas.height + 10;
          p.x = Math.random() * this.canvas.width;
        }
        
        // Twinkle effect
        if (this.options.twinkle) {
          if (p.increasing) {
            p.opacity += 0.005;
            if (p.opacity >= this.options.maxOpacity) {
              p.increasing = false;
            }
          } else {
            p.opacity -= 0.005;
            if (p.opacity <= this.options.minOpacity) {
              p.increasing = true;
            }
          }
        }
      }
      
      requestAnimationFrame(() => this.animate());
    }
}