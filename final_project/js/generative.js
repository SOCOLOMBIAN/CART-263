// Generative art 

class GenerativeArt {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');
    this.width = canvasElement.width;
    this.height = canvasElement.height;
    this.particles = [];
    this.animations = [];
    this.isAnimating = false;
  }

  // Reset the canvas for a new artwork
  reset() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.particles = [];
    this.animations = [];
    this.isAnimating = false;
  }

  // Generate art based on the game sequence and level
  generateArt(sequence, level) {
    this.reset();
    
    // Create background gradient based on level
    this.createBackground(level);
    
    // Generate particles based on sequence
    this.generateParticles(sequence, level);
    
    // Start animation
    this.startAnimation();
    
    return this.canvas;
  }

  // Create a gradient background based on level
  createBackground(level) {
    const gradient = this.ctx.createLinearGradient(0, 0, this.width, this.height);
    
    // Create different color schemes based on level
    const hue1 = (level * 30) % 360;
    const hue2 = (hue1 + 180) % 360;
    
    gradient.addColorStop(0, `hsla(${hue1}, 70%, 20%, 0.8)`);
    gradient.addColorStop(1, `hsla(${hue2}, 70%, 20%, 0.8)`);
    
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  // Generate particles based on the sequence
  generateParticles(sequence, level) {
    const particleCount = Math.min(sequence.length * 5, 100);
    
    for (let i = 0; i < particleCount; i++) {
      // Use sequence values to determine particle properties
      const sequenceIdx = i % sequence.length;
      const shapeValue = sequence[sequenceIdx];
      
      // Create particle with properties based on the sequence value
      const particle = {
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: 5 + (shapeValue * 3) + (Math.random() * 10),
        hue: (shapeValue * 90) % 360,
        saturation: 70 + Math.random() * 30,
        lightness: 40 + Math.random() * 30,
        speedX: (Math.random() - 0.5) * 2,
        speedY: (Math.random() - 0.5) * 2,
        shape: shapeValue, // 0-3 representing the shape type
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.05,
        opacity: 0.7 + Math.random() * 0.3,
        pulse: 0,
        pulseSpeed: 0.02 + Math.random() * 0.04
      };
      
      this.particles.push(particle);
    }
    
    // Create connections between particles based on level
    if (level > 1) {
      this.createConnections();
    }
  }

  // Create connections between particles for higher levels
  createConnections() {
    const connectionCount = Math.floor(this.particles.length / 2);
    
    for (let i = 0; i < connectionCount; i++) {
      const startIdx = Math.floor(Math.random() * this.particles.length);
      let endIdx;
      
      do {
        endIdx = Math.floor(Math.random() * this.particles.length);
      } while (startIdx === endIdx);
      
      // Create connection animation
      const connection = {
        startIdx: startIdx,
        endIdx: endIdx,
        progress: 0,
        speed: 0.005 + Math.random() * 0.01,
        thickness: 1 + Math.random() * 2,
        opacity: 0.5 + Math.random() * 0.5,
        complete: false
      };
      
      this.animations.push(connection);
    }
  }

  // Draw a particle with the appropriate shape
  drawParticle(particle) {
    const { x, y, size, hue, saturation, lightness, rotation, shape, opacity } = particle;
    
    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.rotate(rotation);
    this.ctx.fillStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${opacity})`;
    this.ctx.strokeStyle = `hsla(${hue}, ${saturation}%, ${lightness + 10}%, ${opacity})`;
    this.ctx.lineWidth = 1;
    
    switch (shape % 4) {
      case 0: // Circle (for the circle shape)
        this.ctx.beginPath();
        this.ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();
        break;
        
      case 1: // Square/Rectangle (for the prisma shape)
        this.ctx.fillRect(-size / 2, -size / 2, size, size);
        this.ctx.strokeRect(-size / 2, -size / 2, size, size);
        break;
        
      case 2: // Star (for the estrella shape)
        this.drawStar(0, 0, 5, size / 2, size / 4);
        break;
        
      case 3: // Custom shape (for the raro shape)
        this.drawCustomShape(0, 0, size / 2);
        break;
    }
    
    this.ctx.restore();
  }

  // Draw a star shape
  drawStar(cx, cy, spikes, outerRadius, innerRadius) {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;
    
    this.ctx.beginPath();
    this.ctx.moveTo(cx, cy - outerRadius);
    
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      this.ctx.lineTo(x, y);
      rot += step;
      
      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      this.ctx.lineTo(x, y);
      rot += step;
    }
    
    this.ctx.lineTo(cx, cy - outerRadius);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();
  }

  // Draw a custom organic shape (for the raro shape)
  drawCustomShape(x, y, radius) {
    this.ctx.beginPath();
    
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const r = radius * (0.6 + Math.sin(i * 3) * 0.4);
      const pointX = x + Math.cos(angle) * r;
      const pointY = y + Math.sin(angle) * r;
      
      if (i === 0) {
        this.ctx.moveTo(pointX, pointY);
      } else {
        this.ctx.lineTo(pointX, pointY);
      }
    }
    
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();
  }

  // Draw connection between particles
  drawConnection(connection) {
    const { startIdx, endIdx, progress, thickness, opacity } = connection;
    const start = this.particles[startIdx];
    const end = this.particles[endIdx];
    
    // Interpolate position based on progress
    const x = start.x + (end.x - start.x) * progress;
    const y = start.y + (end.y - start.y) * progress;
    
    // Draw line from start to current position
    this.ctx.beginPath();
    this.ctx.moveTo(start.x, start.y);
    this.ctx.lineTo(x, y);
    this.ctx.strokeStyle = `hsla(${(start.hue + end.hue) / 2}, 70%, 50%, ${opacity})`;
    this.ctx.lineWidth = thickness;
    this.ctx.stroke();
  }

  // Animate the generative art
  animate() {
    if (!this.isAnimating) return;
    
    // Clear canvas with slight opacity to create trails
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    this.ctx.fillRect(0, 0, this.width, this.height);
    
    // Update and draw particles
    for (const particle of this.particles) {
      // Update position
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      
      // Bounce off edges
      if (particle.x < 0 || particle.x > this.width) particle.speedX *= -1;
      if (particle.y < 0 || particle.y > this.height) particle.speedY *= -1;
      
      // Update rotation
      particle.rotation += particle.rotationSpeed;
      
      // Update pulse effect
      particle.pulse += particle.pulseSpeed;
      particle.opacity = 0.7 + Math.sin(particle.pulse) * 0.3;
      
      // Draw the particle
      this.drawParticle(particle);
    }
    
    // Update and draw animations
    for (const connection of this.animations) {
      if (!connection.complete) {
        connection.progress += connection.speed;
        
        if (connection.progress >= 1) {
          connection.complete = true;
        }
        
        this.drawConnection(connection);
      }
    }
    
    // Continue animation
    requestAnimationFrame(() => this.animate());
  }

  // Start the animation
  startAnimation() {
    this.isAnimating = true;
    this.animate();
  }

  // Stop the animation
  stopAnimation() {
    this.isAnimating = false;
  }

  // Export the current artwork as a data URL
  exportArt() {
    return this.canvas.toDataURL('image/png');
  }
}