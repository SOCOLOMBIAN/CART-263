class MovingShapes {
  constructor(container, shapesData, options = {}) {
    this.container = typeof container === 'string' ? document.querySelector(container) : container;
    
    // Validate shapes data
    if (!Array.isArray(shapesData) || shapesData.length === 0) {
      console.error("Invalid shapesData provided:", shapesData);
      // Provide default shapes if none provided
      this.shapesData = [
        '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" stroke="white" fill="none" stroke-width="3"/></svg>',
        '<svg viewBox="0 0 100 100"><rect x="20" y="20" width="60" height="60" stroke="white" fill="none" stroke-width="3"/></svg>',
        '<svg viewBox="0 0 100 100"><polygon points="50,10 90,90 10,90" stroke="white" fill="none" stroke-width="3"/></svg>',
        '<svg viewBox="0 0 100 100"><polygon points="10,10 90,10 90,90 10,90" stroke="white" fill="none" stroke-width="3"/></svg>'
      ];
    } else {
      this.shapesData = shapesData;
    }
    
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
    
    // Flag to track SVG image loading
    this.imagesLoaded = 0;
    this.totalImages = this.shapesData.length;
    this.loadingAttempts = 0;
    this.maxLoadingAttempts = 3;
    
    // Initialize shapes
    this.initShapes();
    
    // Start loading process
    this.startLoading();
    
    // Event listeners
    window.addEventListener('resize', () => this.resizeCanvas());
    this.canvas.addEventListener('click', (e) => this.handleClick(e));
  }
  
  startLoading() {
    console.log("Starting SVG loading attempt", this.loadingAttempts + 1);
    
    // Reset loading counters
    this.imagesLoaded = 0;
    this.svgImages = [];
    
    // Preload SVG images with callback to ensure they're loaded
    this.preloadSVGImages((success) => {
      if (success) {
        console.log("All SVG images loaded successfully");
        // Start animation once SVGs are loaded
        this.animate();
      } else {
        this.loadingAttempts++;
        if (this.loadingAttempts < this.maxLoadingAttempts) {
          console.log(`Retrying SVG loading (attempt ${this.loadingAttempts + 1} of ${this.maxLoadingAttempts})`);
          setTimeout(() => this.startLoading(), 500);
        } else {
          console.error("Failed to load SVGs after multiple attempts, using fallback shapes");
          // Use fallback rendering without SVGs
          this.animate();
        }
      }
    });
  }
  
  preloadSVGImages(callback) {
    // Create SVG images for each shape type
    this.svgImages = [];
    
    // Check if we have any shapes to load
    if (this.shapesData.length === 0) {
      console.error("No shape data available");
      if (callback) callback(false);
      return;
    }
    
    for (let i = 0; i < this.shapesData.length; i++) {
      // Check if we have valid SVG data
      if (!this.shapesData[i] || typeof this.shapesData[i] !== 'string') {
        console.error(`Invalid SVG data for shape ${i}`);
        this.svgImages[i] = null;
        this.imagesLoaded++;
        continue;
      }

      try {
        // Create SVG blob and convert to image
        const svgBlob = new Blob([this.shapesData[i]], {type: 'image/svg+xml'});
        const url = URL.createObjectURL(svgBlob);
        const img = new Image();
        
        img.onload = () => {
          this.imagesLoaded++;
          console.log(`Loaded SVG image ${i}: ${this.imagesLoaded}/${this.totalImages}`);
          if (this.imagesLoaded === this.totalImages && callback) {
            callback(true);
          }
        };
        
        img.onerror = (error) => {
          console.error(`Error loading SVG image ${i}:`, error);
          this.imagesLoaded++;
          if (this.imagesLoaded === this.totalImages && callback) {
            callback(false);
          }
        };
        
        img.src = url;
        
        this.svgImages[i] = {
          image: img,
          url: url
        };
      } catch (error) {
        console.error(`Error creating SVG image ${i}:`, error);
        this.svgImages[i] = null;
        this.imagesLoaded++;
      }
    }
    
    // If no images to load, call callback immediately
    if (this.totalImages === 0 && callback) {
      callback(false);
    }
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
    
    // Make sure there's no overflow hidden constraint
    this.container.style.overflow = 'visible';
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
          active: false,
          opacity: 0.7 + Math.random() * 0.3,
          pulseValue: 0,
          pulseDirection: 1
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
    
    // Draw loading screen if SVGs are not loaded yet
    if (this.imagesLoaded < this.totalImages && this.loadingAttempts < this.maxLoadingAttempts) {
      this.drawLoadingScreen();
      requestAnimationFrame(() => this.animate());
      return;
    }
    
    // Update and draw shapes
    for (const shape of this.shapes) {
      // Update position
      shape.x += shape.speedX;
      shape.y += shape.speedY;
      shape.rotation += shape.rotationSpeed;
      
      // Update pulsating animation for active shapes
      if (shape.active) {
        shape.pulseValue += 0.1 * shape.pulseDirection;
        if (shape.pulseValue > 1) {
          shape.pulseDirection = -1;
        } else if (shape.pulseValue < 0) {
          shape.pulseDirection = 1;
        }
      } else {
        shape.pulseValue = 0;
        shape.pulseDirection = 1;
      }
      
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
  
  drawLoadingScreen() {
    const ctx = this.ctx;
    const width = this.canvas.width;
    const height = this.canvas.height;
    
    // Draw loading text
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Loading shapes... (${this.imagesLoaded}/${this.totalImages})`, 
                width/2, height/2 - 30);
    
    // Draw loading bar
    const barWidth = 200;
    const barHeight = 10;
    const barX = width/2 - barWidth/2;
    const barY = height/2;
    
    // Background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.fillRect(barX, barY, barWidth, barHeight);
    
    // Progress
    const progress = this.totalImages > 0 ? this.imagesLoaded / this.totalImages : 0;
    ctx.fillStyle = '#4CAF50';
    ctx.fillRect(barX, barY, barWidth * progress, barHeight);
    
    // Border
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.strokeRect(barX, barY, barWidth, barHeight);
    
    // Loading dots animation
    const dots = '.'.repeat((Math.floor(Date.now() / 500) % 4));
    ctx.fillStyle = 'white';
    ctx.fillText(`Please wait${dots}`, width/2, height/2 + 30);
  }
  
  drawShape(shape) {
    this.ctx.save();
    
    // Set position and rotation
    this.ctx.translate(shape.x + shape.size/2, shape.y + shape.size/2);
    this.ctx.rotate(shape.rotation * Math.PI / 180);
    
    // Draw color highlight if active
    if (shape.active) {
      this.ctx.shadowColor = this.options.activeColor;
      this.ctx.shadowBlur = 15 + 5 * Math.sin(shape.pulseValue * Math.PI);
      
      // Draw glow effect
      this.ctx.beginPath();
      this.ctx.arc(0, 0, shape.size/1.5, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(76, 175, 80, ${0.3 + 0.2 * Math.sin(shape.pulseValue * Math.PI)})`;
      this.ctx.fill();
      
      // Make active shapes slightly larger
      const scale = 1.2 + 0.1 * Math.sin(shape.pulseValue * Math.PI * 2);
      this.ctx.scale(scale, scale);
    }
    
    // Use preloaded SVG image if available
    const svgImg = this.svgImages && this.svgImages[shape.typeIndex];
    
    if (svgImg && svgImg.image && svgImg.image.complete) {
      // Apply opacity
      this.ctx.globalAlpha = shape.active ? 1.0 : shape.opacity;
      
      // Draw the image
      this.ctx.drawImage(
        svgImg.image,
        -shape.size/2, -shape.size/2,
        shape.size, shape.size
      );
    } else {
      // Fallback shapes if image isn't loaded
      this.drawFallbackShape(shape);
    }
    
    this.ctx.restore();
  }
  
  drawFallbackShape(shape) {
    const ctx = this.ctx;
    const size = shape.size * 0.8; // Slightly smaller for better visibility
    
    // Set styles
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 3;
    ctx.fillStyle = shape.active ? 'rgba(76, 175, 80, 0.3)' : 'rgba(255, 255, 255, 0.1)';
    
    // Draw different fallback shapes based on type
    switch(shape.typeIndex % 4) {
      case 0: // Circle
        ctx.beginPath();
        ctx.arc(0, 0, size/2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        break;
        
      case 1: // Square
        ctx.beginPath();
        ctx.rect(-size/2, -size/2, size, size);
        ctx.fill();
        ctx.stroke();
        break;
        
      case 2: // Triangle
        ctx.beginPath();
        ctx.moveTo(0, -size/2);
        ctx.lineTo(size/2, size/2);
        ctx.lineTo(-size/2, size/2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        break;
        
      case 3: // Diamond
        ctx.beginPath();
        ctx.moveTo(0, -size/2);
        ctx.lineTo(size/2, 0);
        ctx.lineTo(0, size/2);
        ctx.lineTo(-size/2, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        break;
    }
  }
  
  handleClick(event) {
    if (!this.canPlayerInteract) {
      console.log("Player interaction is disabled");
      return;
    }
    
    // Get click position relative to canvas
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Check if a shape was clicked
    let clickedShape = null;
    for (const shape of this.shapes) {
      const centerX = shape.x + shape.size/2;
      const centerY = shape.y + shape.size/2;
      const distance = Math.sqrt((x - centerX)**2 + (y - centerY)**2);
      
      // Use a larger click radius for better usability
      if (distance <= shape.size/2 + this.options.clickableRadius/2) {
        clickedShape = shape;
        break;
      }
    }
    
    if (clickedShape) {
      console.log("Shape clicked:", clickedShape.typeIndex);
      this.handleShapeClick(clickedShape);
    } else {
      console.log("No shape clicked at", x, y);
    }
  }
  
  handleShapeClick(shape) {
    // Compare with expected shape in sequence
    const expectedTypeIndex = this.activeSequence[this.playerSequence.length];
    
    // Add to player sequence
    this.playerSequence.push(shape.typeIndex);
    console.log("Player sequence:", this.playerSequence, "Expected:", expectedTypeIndex);
    
    // Activate the shape (visual and audio feedback)
    this.activateShape(shape);
    
    // Check if correct
    const isCorrect = shape.typeIndex === expectedTypeIndex;
    
    // Check if sequence is complete
    if (isCorrect && this.playerSequence.length === this.activeSequence.length) {
      console.log("Player completed sequence correctly!");
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
      console.log("Player made an error in sequence");
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
    if (this.isPlayingSequence) {
      console.log("Already playing sequence");
      return;
    }
    
    console.log("Starting to play sequence:", sequence);
    this.activeSequence = [...sequence];
    this.playerSequence = [];
    this.isPlayingSequence = true;
    this.canPlayerInteract = false;
    this.currentPlayIndex = 0;
    
    // Play sequence with delay between each shape
    const playNextInSequence = () => {
      if (this.currentPlayIndex < this.activeSequence.length) {
        const typeIndex = this.activeSequence[this.currentPlayIndex];
        console.log("Playing shape:", typeIndex, "at index:", this.currentPlayIndex);
        
        // Find shapes of this type
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
        console.log("Sequence finished playing - player can now interact");
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