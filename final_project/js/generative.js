class GenerativeArt {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = this.canvas.getContext('2d');
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.particles = [];
    this.animation = null;
  }

  // Generate art based on the sequence and level
  generateArt(sequence, level) {
    // Clear previous art
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.particles = [];
    
    // Cancel any ongoing animation
    if (this.animation) {
      cancelAnimationFrame(this.animation);
    }
    
    // Create background
    this.createBackground(level);
    
    // Create particles based on sequence
    this.createParticles(sequence, level);
    
    // Start animation
    this.animate();
  }

  // Create a gradient background
  createBackground(level) {
    const gradient = this.ctx.createLinearGradient(0, 0, this.width, this.height);
    const hue1 = (level * 30) % 360;
    const hue2 = (hue1 + 180) % 360;
    
    gradient.addColorStop(0, `hsla(${hue1}, 70%, 20%, 0.8)`);
    gradient.addColorStop(1, `hsla(${hue2}, 70%, 20%, 0.8)`);
    
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  // Create particles based on sequence
  createParticles(sequence, level) {
    const count = sequence.length * 5;
    
    for (let i = 0; i < count; i++) {
      const index = i % sequence.length;
      const value = sequence[index];
      
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: 5 + value * 3,
        color: `hsl(${value * 90}, 80%, 50%)`,
        speedX: (Math.random() - 0.5) * 2,
        speedY: (Math.random() - 0.5) * 2,
        type: value % 4 // 0, 1, 2, or 3 for different shapes
      });
    }
  }

  // Animate the particles
  animate() {
    // Apply a semi-transparent layer to create trails
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    this.ctx.fillRect(0, 0, this.width, this.height);
    
    // Draw each particle
    for (const particle of this.particles) {
      // Move particle
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      
      // Bounce off edges
      if (particle.x < 0 || particle.x > this.width) {
        particle.speedX *= -1;
      }
      if (particle.y < 0 || particle.y > this.height) {
        particle.speedY *= -1;
      }
      
      // Draw particle
      this.ctx.fillStyle = particle.color;
      this.ctx.strokeStyle = '#ffffff';
      this.ctx.lineWidth = 1;
      
      switch (particle.type) {
        case 0: // Circle
          this.ctx.beginPath();
          this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          this.ctx.fill();
          this.ctx.stroke();
          break;
          
        case 1: // Square
          this.ctx.fillRect(
            particle.x - particle.size / 2,
            particle.y - particle.size / 2,
            particle.size,
            particle.size
          );
          this.ctx.strokeRect(
            particle.x - particle.size / 2,
            particle.y - particle.size / 2,
            particle.size,
            particle.size
          );
          break;
          
        case 2: // Triangle
          this.ctx.beginPath();
          this.ctx.moveTo(particle.x, particle.y - particle.size / 2);
          this.ctx.lineTo(particle.x + particle.size / 2, particle.y + particle.size / 2);
          this.ctx.lineTo(particle.x - particle.size / 2, particle.y + particle.size / 2);
          this.ctx.closePath();
          this.ctx.fill();
          this.ctx.stroke();
          break;
          
        case 3: // Diamond
          this.ctx.beginPath();
          this.ctx.moveTo(particle.x, particle.y - particle.size / 2);
          this.ctx.lineTo(particle.x + particle.size / 2, particle.y);
          this.ctx.lineTo(particle.x, particle.y + particle.size / 2);
          this.ctx.lineTo(particle.x - particle.size / 2, particle.y);
          this.ctx.closePath();
          this.ctx.fill();
          this.ctx.stroke();
          break;
      }
    }
    
    // Continue animation
    this.animation = requestAnimationFrame(() => this.animate());
  }

  // Export the art as data URL
  exportArt() {
    return this.canvas.toDataURL('image/png');
  }
}