class MovingShapes {
  constructor(container, shapesData, options = {}) {
    this.container = typeof container === 'string' ? document.querySelector(container) : container;
    this.shapesData = shapesData; // Array of SVG strings
    this.options = {
      count: options.count || 3, // Number of each shape type
      speed: options.speed || { min: 0.5, max: 1.5 },
      size: options.size || { min: 40, max: 70 },
      activeColor: options.activeColor || '#4CAF50', // Green highlight when active
      inactiveColor: options.inactiveColor || '#ffffff', // Normal color
      clickableRadius: options.clickableRadius || 50,
      ...options
    };
    
    // Create canvas
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.container.appendChild(this.canvas);
    this.resizeCanvas();
    
    // Moving shapes collection
    this.shapes = [];
    
    // Sequence and player interaction
    this.activeSequence = [];
    this.playerSequence = [];
    this.isPlayingSequence = false;
    this.canPlayerInteract = false;
    this.currentPlayIndex = 0;
    
    // Initialize shapes
    this.initShapes();
    
    // Event listeners
    window.addEventListener('resize', () => this.resizeCanvas());
    this.canvas.addEventListener('click', (e) => this.handleClick(e));
    
    // Start animation
    this.animate();
  }
  
  resizeCanvas() {
    // Get container dimensions and make canvas full size
    const rect = this.container.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
    
    // Adjust canvas styling
    this.canvas.style.position = 'absolute';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
  }
  
  initShapes() {
    this.shapes = [];
    
    // Create multiple instances of each shape type
    for (let typeIndex = 0; typeIndex < this.shapesData.length; typeIndex++) {
      for (let i = 0; i < this.options.count; i++) {
        // Random position, size, and speed
        const size = this.randomRange(this.options.size.min, this.options.size.max);
        const shape = {
          id: `shape-${typeIndex}-${i}`,
          typeIndex: typeIndex, // Type of shape (0, 1, 2, 3)
          x: Math.random() * (this.canvas.width - size),
          y: Math.random() * (this.canvas.height - size),
          size: size,
          speedX: (Math.random() - 0.5) * this.randomRange(this.options.speed.min, this.options.speed.max) * 2,
          speedY: (Math.random() - 0.5) * this.randomRange(this.options.speed.min, this.options.speed.max) * 2,
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 2,
          svg: this.shapesData[typeIndex],
          active: false,
          opacity: 0.7 + Math.random() * 0.3
        };
        
        this.shapes.push(shape);
      }
    }
  }
  
  randomRange(min, max) {
    return min + Math.random() * (max - min);
  }
  
  animate() {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Update and draw shapes
    for (const shape of this.shapes) {
      // Update position
      shape.x += shape.speedX;
      shape.y += shape.speedY;
      shape.rotation += shape.rotationSpeed;
      
      // Bounce off edges - with slight offset to avoid getting stuck
      if (shape.x < -shape.size/2) {
        shape.speedX = Math.abs(shape.speedX);
        shape.x = -shape.size/2 + 1;
      } else if (shape.x > this.canvas.width - shape.size/2) {
        shape.speedX = -Math.abs(shape.speedX);
        shape.x = this.canvas.width - shape.size/2 - 1;
      }
      
      if (shape.y < -shape.size/2) {
        shape.speedY = Math.abs(shape.speedY);
        shape.y = -shape.size/2 + 1;
      } else if (shape.y > this.canvas.height - shape.size/2) {
        shape.speedY = -Math.abs(shape.speedY);
        shape.y = this.canvas.height - shape.size/2 - 1;
      }
      
      // Draw shape
      this.drawShape(shape);
    }
    
    // Continue animation
    requestAnimationFrame(() => this.animate());
  }
  
  drawShape(shape) {
    this.ctx.save();
    
    // Set position and rotation
    this.ctx.translate(shape.x + shape.size/2, shape.y + shape.size/2);
    this.ctx.rotate(shape.rotation * Math.PI / 180);
    
    // Draw color highlight if active
    if (shape.active) {
      this.ctx.shadowColor = this.options.activeColor;
      this.ctx.shadowBlur = 15;
      
      // Draw glow effect
      this.ctx.beginPath();
      this.ctx.arc(0, 0, shape.size/1.5, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(76, 175, 80, 0.3)`;
      this.ctx.fill();
    }
    
    // Create an SVG image for drawing
    if (!shape.svgImage) {
      const svgBlob = new Blob([shape.svg], {type: 'image/svg+xml'});
      const url = URL.createObjectURL(svgBlob);
      shape.svgImage = new Image();
      shape.svgImage.src = url;
      shape.svgUrl = url;
    }
    
    // Draw the SVG if it's loaded
    if (shape.svgImage.complete) {
      const color = shape.active ? this.options.activeColor : this.options.inactiveColor;
      
      // Apply color filter
      this.ctx.filter = shape.active ? 'brightness(1.5) saturate(1.5)' : `opacity(${shape.opacity})`;
      
      // Draw the image
      this.ctx.drawImage(
        shape.svgImage,
        -shape.size/2, -shape.size/2,
        shape.size, shape.size
      );
      
      this.ctx.filter = 'none';
    }
    
    this.ctx.restore();
  }
  
  handleClick(event) {
    if (!this.canPlayerInteract) return;
    
    // Get click position relative to canvas
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Check if a shape was clicked
    for (const shape of this.shapes) {
      const centerX = shape.x + shape.size/2;
      const centerY = shape.y + shape.size/2;
      const distance = Math.sqrt((x - centerX)**2 + (y - centerY)**2);
      
      if (distance <= this.options.clickableRadius) {
        this.handleShapeClick(shape);
        break;
      }
    }
  }
  
  handleShapeClick(shape) {
    // Compare with expected shape in sequence
    const expectedTypeIndex = this.activeSequence[this.playerSequence.length];
    
    // Add to player sequence
    this.playerSequence.push(shape.typeIndex);
    
    // Activate the shape (visual and audio feedback)
    this.activateShape(shape);
    
    // Check if correct
    const isCorrect = shape.typeIndex === expectedTypeIndex;
    
    // Check if sequence is complete
    if (isCorrect && this.playerSequence.length === this.activeSequence.length) {
      // Complete sequence callback
      setTimeout(() => {
        if (this.onSequenceComplete) {
          this.onSequenceComplete({
            sequence: [...this.activeSequence],
            success: true
          });
        }
      }, 500);
      
      this.canPlayerInteract = false;
    } 
    // Check if incorrect
    else if (!isCorrect) {
      // Error callback
      setTimeout(() => {
        if (this.onSequenceError) {
          this.onSequenceError({
            expected: expectedTypeIndex,
            received: shape.typeIndex,
            position: this.playerSequence.length - 1
          });
        }
      }, 300);
      
      this.canPlayerInteract = false;
    }
  }
  
  playSequence(sequence) {
    if (this.isPlayingSequence) return;
    
    this.activeSequence = [...sequence];
    this.playerSequence = [];
    this.isPlayingSequence = true;
    this.canPlayerInteract = false;
    this.currentPlayIndex = 0;
    
    // Play sequence with delay between each shape
    const playNextInSequence = () => {
      if (this.currentPlayIndex < this.activeSequence.length) {
        const typeIndex = this.activeSequence[this.currentPlayIndex];
        
        // Find a shape of this type
        const shapesOfType = this.shapes.filter(s => s.typeIndex === typeIndex);
        
        if (shapesOfType.length > 0) {
          const randomShape = shapesOfType[Math.floor(Math.random() * shapesOfType.length)];
          
          // Activate the shape
          this.activateShape(randomShape);
          
          // Move to next in sequence
          this.currentPlayIndex++;
          setTimeout(playNextInSequence, 1000);
        } else {
          console.error("No shapes of type", typeIndex, "found");
          // Continue anyway
          this.currentPlayIndex++;
          setTimeout(playNextInSequence, 500);
        }
      } else {
        // Sequence finished playing
        this.isPlayingSequence = false;
        this.canPlayerInteract = true;
        
        if (this.onSequencePlay) {
          this.onSequencePlay({
            sequence: [...this.activeSequence],
            ready: true
          });
        }
      }
    };
    
    // Start playing sequence after a short delay
    setTimeout(playNextInSequence, 500);
  }
  
  activateShape(shape) {
    // Visual feedback
    shape.active = true;
    
    // Sound callback
    if (this.onShapeActivate) {
      this.onShapeActivate({
        typeIndex: shape.typeIndex
      });
    }
    
    // Deactivate after a short time
    setTimeout(() => {
      shape.active = false;
    }, 500);
  }
  
  // Reset for a new game
  reset() {
    this.activeSequence = [];
    this.playerSequence = [];
    this.isPlayingSequence = false;
    this.canPlayerInteract = false;
    
    // Add some movement variation to shapes
    for (const shape of this.shapes) {
      shape.speedX = (Math.random() - 0.5) * this.randomRange(this.options.speed.min, this.options.speed.max) * 2;
      shape.speedY = (Math.random() - 0.5) * this.randomRange(this.options.speed.min, this.options.speed.max) * 2;
      shape.rotationSpeed = (Math.random() - 0.5) * 2;
    }
  }
}