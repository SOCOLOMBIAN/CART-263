class GameParticles {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.fireworks = [];
    
    this.animate();
  }
  
  animate() {
    // Clear canvas with transparency
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Update and draw particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      
      // Update position
      p.x += p.vx;
      p.y += p.vy;
      
      // Apply gravity
      p.vy += p.gravity;
      
      // Update life
      p.life -= p.decay;
      
      // Remove dead particles
      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }
      
      // Draw particle
      this.ctx.globalAlpha = p.life;
      this.ctx.fillStyle = p.color;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
    }
    
    // Update and draw fireworks
    for (let i = this.fireworks.length - 1; i >= 0; i--) {
      const fw = this.fireworks[i];
      
      // Update position
      fw.x += fw.vx;
      fw.y += fw.vy;
      
      // Apply gravity
      fw.vy += fw.gravity;
      
      // Check if it's time to explode
      if (fw.vy >= 0 || fw.y <= fw.targetY) {
        // Create explosion
        this.createExplosion(fw.x, fw.y, fw.color);
        
        // Remove firework
        this.fireworks.splice(i, 1);
        continue;
      }
      
      // Draw firework
      this.ctx.fillStyle = fw.color;
      this.ctx.beginPath();
      this.ctx.arc(fw.x, fw.y, fw.size, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Draw trail
      this.ctx.strokeStyle = fw.color;
      this.ctx.lineWidth = 1;
      this.ctx.beginPath();
      this.ctx.moveTo(fw.x, fw.y);
      this.ctx.lineTo(fw.x - fw.vx * 4, fw.y - fw.vy * 4);
      this.ctx.stroke();
    }
    
    requestAnimationFrame(() => this.animate());
  }
  
  createExplosion(x, y, color, particleCount = 50) {
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 5;
      
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 1 + Math.random() * 3,
        color,
        gravity: 0.05,
        life: 0.7 + Math.random() * 0.3,
        decay: 0.01 + Math.random() * 0.01
      });
    }
  }
  
  createFireworks(count = 5) {
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const x = Math.random() * this.canvas.width;
        const targetY = Math.random() * this.canvas.height * 0.5;
        
        this.fireworks.push({
          x,
          y: this.canvas.height,
          targetY,
          vx: (Math.random() - 0.5) * 2,
          vy: -10 - Math.random() * 5,
          size: 2 + Math.random() * 2,
          color: `hsl(${Math.random() * 360}, 70%, 60%)`,
          gravity: 0.2
        });
      }, i * 300);
    }
  }
}

