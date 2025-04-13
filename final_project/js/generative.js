class GenerativeArt {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = canvas.width;
    this.height = canvas.height;
    this.shapes = [];
    this.colors = [];
  }

  generateArt(sequence, level) {
    // Clear previous art
    this.ctx.clearRect(0, 0, this.width, this.height);
    
    // Create a background
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    this.ctx.fillRect(0, 0, this.width, this.height);
    
    // Generate colors based on sequence
    this.colors = this.generateColorPalette(sequence);
    
    // Generate shapes based on sequence and level
    this.shapes = [];
    const shapeCount = 10 + level * 5; // More shapes for higher levels
    
    for (let i = 0; i < shapeCount; i++) {
      const sequenceIndex = i % sequence.length;
      const shapeType = sequence[sequenceIndex];
      
      this.shapes.push({
        type: shapeType,
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: 10 + Math.random() * (20 + level * 2),
        rotation: Math.random() * 360,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        opacity: 0.5 + Math.random() * 0.5
      });
    }
    
    // Draw the art
    this.drawArt();
  }
  
  drawArt() {
    // Draw each shape
    for (const shape of this.shapes) {
      this.ctx.save();
      this.ctx.translate(shape.x, shape.y);
      this.ctx.rotate(shape.rotation * Math.PI / 180);
      this.ctx.globalAlpha = shape.opacity;
      
      // Draw based on shape type
      this.ctx.fillStyle = shape.color;
      this.ctx.strokeStyle = shape.color;
      this.ctx.lineWidth = 2;
      
      switch (shape.type) {
        case 0: // Circle (for the "circle" shape)
          this.ctx.beginPath();
          this.ctx.arc(0, 0, shape.size / 2, 0, Math.PI * 2);
          if (Math.random() > 0.5) {
            this.ctx.fill();
          } else {
            this.ctx.stroke();
          }
          break;
          
        case 1: // Triangle (for the "prisma" shape)
          this.ctx.beginPath();
          this.ctx.moveTo(0, -shape.size / 2);
          this.ctx.lineTo(shape.size / 2, shape.size / 2);
          this.ctx.lineTo(-shape.size / 2, shape.size / 2);
          this.ctx.closePath();
          if (Math.random() > 0.5) {
            this.ctx.fill();
          } else {
            this.ctx.stroke();
          }
          break;
          
        case 2: // Star (for the "estrella" shape)
          this.drawStar(0, 0, 5, shape.size / 2, shape.size / 4);
          if (Math.random() > 0.5) {
            this.ctx.fill();
          } else {
            this.ctx.stroke();
          }
          break;
          
        case 3: // Organic shape (for the "raro" shape)
          this.drawOrganic(0, 0, shape.size / 2);
          if (Math.random() > 0.5) {
            this.ctx.fill();
          } else {
            this.ctx.stroke();
          }
          break;
      }
      
      this.ctx.restore();
    }
    
    // Add some connecting lines for complexity
    this.ctx.globalAlpha = 0.2;
    this.ctx.lineWidth = 1;
    
    for (let i = 0; i < this.shapes.length - 1; i++) {
      if (Math.random() > 0.7) {
        const shape1 = this.shapes[i];
        const shape2 = this.shapes[i + 1];
        
        this.ctx.beginPath();
        this.ctx.moveTo(shape1.x, shape1.y);
        this.ctx.lineTo(shape2.x, shape2.y);
        this.ctx.strokeStyle = this.colors[i % this.colors.length];
        this.ctx.stroke();
      }
    }
  }
  
  drawStar(cx, cy, spikes, outerRadius, innerRadius) {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    let step = Math.PI / spikes;
    
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
  }
  
  drawOrganic(x, y, radius) {
    const points = 8;
    const variation = radius * 0.4;
    
    this.ctx.beginPath();
    
    for (let i = 0; i <= points; i++) {
      const angle = (i / points) * Math.PI * 2;
      const r = radius + (Math.random() - 0.5) * variation;
      const px = x + Math.cos(angle) * r;
      const py = y + Math.sin(angle) * r;
      
      if (i === 0) {
        this.ctx.moveTo(px, py);
      } else {
        this.ctx.lineTo(px, py);
      }
    }
    
    this.ctx.closePath();
  }
  
  generateColorPalette(sequence) {
    // Generate a color palette based on the sequence
    const baseHues = [
      30,  // Orange (for shape 0)
      120, // Green (for shape 1)
      240, // Blue (for shape 2)
      280  // Purple (for shape 3)
    ];
    
    const colors = [];
    
    for (const shapeIndex of sequence) {
      const hue = baseHues[shapeIndex];
      const saturation = 70 + Math.random() * 30;
      const lightness = 50 + Math.random() * 20;
      
      colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
    }
    
    return colors;
  }
  
  exportArt() {
    return this.canvas.toDataURL('image/png');
  }
}