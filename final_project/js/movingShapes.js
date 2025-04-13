class MovingShapes {
  constructor(container, shapesData, options = {}) {
    this.container = typeof container === 'string' ? document.querySelector(container) : container;
    this.shapesData = shapesData; // Array of SVG strings
    this.options = {
      count: options.count || 1, // Number of each shape type (simplified)
      speed: options.speed || { min: 0.5, max: 1.2 },
      size: options.size || { min: 70, max: 90 }, // Larger shapes for better interaction
      activeColor: options.activeColor || '#4CAF50', // Green highlight when active
      inactiveColor: options.inactiveColor || '#ffffff', // Normal color
      clickableRadius: options.clickableRadius || 50, // Increased for easier clicking
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
    
    // Preload SVG images
    this.preloadSVGImages();
    
    // Event listeners
    window.addEventListener('resize', () => this.resizeCanvas());
    this.canvas.addEventListener('click', (e) => this.handleClick(e));
    
    // Start animation
    this.animate();
  }
  
  preloadSVGImages() {
    // Create SVG images for each shape type
    this.svgImages = [];
    
    const loadPromises = [];
    
    for (let i = 0; i < this.shapesData.length; i++) {
      const svgString = this.shapesData[i];
      // Convert SVG string to data URL
      const svgBlob = new Blob([svgString], {type: 'image/svg+xml'});
      const url = URL.createObjectURL(svgBlob);
      const img = new Image();
      
      // Create a promise for each image load
      const loadPromise = new Promise((resolve, reject) => {
        img.onload = () => {
          console.log(`SVG image ${i} loaded successfully`);
          resolve();
        };
        
        img.onerror = (e) => {
          console.error(`Error loading SVG image ${i}:`, e);
          reject(e);
        };
      });
      
      loadPromises.push(loadPromise);
      img.src = url;
      
      this.svgImages.push({
        image: img,
        url: url
      });
    }
    
    // Wait for all images to load
    Promise.all(loadPromises)
      .then(() => {
        console.log(`All ${this.svgImages.length} SVG images loaded successfully`);
        // Redraw to ensure shapes are visible
        this.redrawShapes();
      })
      .catch(error => {
        console.error("Error loading SVG images:", error);
      });
  }
  
  // Add a new method to force redraw of all shapes
  redrawShapes() {
    if (!this.ctx) return;
    
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw all shapes
    for (const shape of this.shapes) {
      this.drawShape(shape);
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
        
        // Set initial positions to be well-spaced
        // Calculate position based on the number of the shape type
        // This ensures all shapes are visible and not on top of each other
        const section = this.canvas.width / this.shapesData.length;
        const x = (section * typeIndex) + (section - size) * Math.random() * 0.7;
        const y = Math.random() * (this.canvas.height - size);
        
        const shape = {
          id: `shape-${typeIndex}-${i}`,
          typeIndex: typeIndex, // Type of shape (0, 1, 2, 3)
          x: x,
          y: y,
          size: size,
          speedX: (Math.random() - 0.5) * this.randomRange(this.options.speed.min, this.options.speed.max) * 2,
          speedY: (Math.random() - 0.5) * this.randomRange(this.options.speed.min, this.options.speed.max) * 2,
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 2,
          active: false,
          opacity: 0.8 + Math.random() * 0.2 // Increased base opacity for better visibility
        };
        
        this.shapes.push(shape);
      }
    }
    
    console.log(`Created ${this.shapes.length} shapes`);
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
      if (shape.x < 0) {
        shape.speedX = Math.abs(shape.speedX);
        shape.x = 1;
      } else if (shape.x > this.canvas.width - shape.size) {
        shape.speedX = -Math.abs(shape.speedX);
        shape.x = this.canvas.width - shape.size - 1;
      }
      
      if (shape.y < 0) {
        shape.speedY = Math.abs(shape.speedY);
        shape.y = 1;
      } else if (shape.y > this.canvas.height - shape.size) {
        shape.speedY = -Math.abs(shape.speedY);
        shape.y = this.canvas.height - shape.size - 1;
      }
      
      // Draw shape
      this.drawShape(shape);
    }
    
    // Add visual cue when player can interact
    if (this.canPlayerInteract) {
      this.ctx.save();
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      this.ctx.font = '16px Arial';
      this.ctx.fillText('Your Turn! Click on the shapes in sequence', 20, 30);
      this.ctx.restore();
    }
    
    // Continue animation
    requestAnimationFrame(() => this.animate());
  }
  
  drawShape(shape) {
    if (!this.ctx) return;
    
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
    
    // Use preloaded SVG image
    if (this.svgImages && this.svgImages[shape.typeIndex]) {
      const svgImg = this.svgImages[shape.typeIndex];
      
      if (svgImg && svgImg.image && svgImg.image.complete) {
        // Apply opacity
        this.ctx.globalAlpha = shape.active ? 1.0 : shape.opacity;
        
        // Draw the image
        this.ctx.drawImage(
          svgImg.image,
          -shape.size/2, -shape.size/2,
          shape.size, shape.size
        );
      }
    }
    
    // Draw a subtle border around the shapes to make them more visible
    if (!shape.active) {
      this.ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, shape.size/2 - 2, 0, Math.PI * 2);
      this.ctx.stroke();
    }
    
    this.ctx.restore();
  }
  
  handleClick(event) {
    // FIXED: Add debugging to check player interaction state
    console.log("Shape clicked, canPlayerInteract:", this.canPlayerInteract);
    
    if (!this.canPlayerInteract) {
      // FIXED: Add visual feedback when player clicks but interaction is disabled
      const rect = this.canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      // Show a small visual feedback that clicking is not allowed yet
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.arc(x, y, 20, 0, Math.PI * 2);
      this.ctx.fillStyle = "rgba(255, 0, 0, 0.2)";
      this.ctx.fill();
      this.ctx.restore();
      
      // Make the feedback disappear after a short time
      setTimeout(() => this.redrawShapes(), 300);
      return;
    }
    
    // Get click position relative to canvas
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Check if a shape was clicked
    let shapeClicked = false;
    for (const shape of this.shapes) {
      const centerX = shape.x + shape.size/2;
      const centerY = shape.y + shape.size/2;
      const distance = Math.sqrt((x - centerX)**2 + (y - centerY)**2);
      
      // FIXED: Increased clickable radius for easier interaction
      const clickRadius = Math.max(this.options.clickableRadius, shape.size/2);
      
      if (distance <= clickRadius) {
        console.log(`Shape clicked: type=${shape.typeIndex}`);
        this.handleShapeClick(shape);
        shapeClicked = true;
        break;
      }
    }
    
    // If no shape was clicked, provide visual feedback
    if (!shapeClicked) {
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.arc(x, y, 15, 0, Math.PI * 2);
      this.ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
      this.ctx.fill();
      this.ctx.restore();
      
      // Make the feedback disappear after a short time
      setTimeout(() => this.redrawShapes(), 200);
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
    console.log(`Shape clicked: ${shape.typeIndex}, expected: ${expectedTypeIndex}, correct: ${isCorrect}`);
    
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
    console.log("MovingShapes.playSequence called with:", sequence);
    
    if (this.isPlayingSequence) {
      console.log("Already playing sequence - ignoring request");
      return;
    }
    
    if (!sequence || sequence.length === 0) {
      console.error("Cannot play empty sequence");
      
      if (this.onSequencePlay) {
        this.onSequencePlay({
          sequence: [],
          ready: true,
          error: "Empty sequence"
        });
      }
      return;
    }
    
    this.activeSequence = [...sequence];
    this.playerSequence = [];
    this.isPlayingSequence = true;
    this.canPlayerInteract = false;
    this.currentPlayIndex = 0;
    
    console.log("Playing sequence:", this.activeSequence);
    
    // FIXED: Display a "Watch the sequence!" message
    const watchMessage = document.createElement('div');
    watchMessage.textContent = 'Watch the sequence!';
    watchMessage.style.position = 'absolute';
    watchMessage.style.top = '20px';
    watchMessage.style.left = '50%';
    watchMessage.style.transform = 'translateX(-50%)';
    watchMessage.style.fontSize = '24px';
    watchMessage.style.color = '#fff';
    watchMessage.style.textShadow = '0 0 10px rgba(255, 255, 255, 0.5)';
    watchMessage.style.zIndex = '100';
    this.container.appendChild(watchMessage);
    
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
        
        // Change message to "Your turn!"
        watchMessage.textContent = 'Your turn!';
        watchMessage.style.color = '#4CAF50';
        
        // Remove message after a few seconds
        setTimeout(() => {
          if (watchMessage.parentNode) {
            watchMessage.parentNode.removeChild(watchMessage);
          }
        }, 2000);
        
        if (this.onSequencePlay) {
          this.onSequencePlay({
            sequence: [...this.activeSequence],
            ready: true
          });
        }
      }
    };
    
    // Start playing sequence after a short delay
    setTimeout(playNextInSequence, 1000);
  }
  
  activateShape(shape) {
    // Visual feedback
    shape.active = true;
    
    // FIXED: Add temporary freezing of shape movement when activated
    const originalSpeedX = shape.speedX;
    const originalSpeedY = shape.speedY;
    const originalRotationSpeed = shape.rotationSpeed;
    
    // Freeze movement while active
    shape.speedX = 0;
    shape.speedY = 0;
    shape.rotationSpeed = 0;
    
    // Sound callback
    if (this.onShapeActivate) {
      this.onShapeActivate({
        typeIndex: shape.typeIndex
      });
    }
    
    // Deactivate after a short time
    setTimeout(() => {
      shape.active = false;
      
      // Restore movement with slight variation
      shape.speedX = originalSpeedX * (0.8 + Math.random() * 0.4);
      shape.speedY = originalSpeedY * (0.8 + Math.random() * 0.4);
      shape.rotationSpeed = originalRotationSpeed * (0.8 + Math.random() * 0.4);
    }, 500);
  }
  
  // Reset for a new game
  reset() {
    this.activeSequence = [];
    this.playerSequence = [];
    this.isPlayingSequence = false;
    this.canPlayerInteract = false;
    
    // FIXED: Reset shapes to spaced-out positions
    for (let i = 0; i < this.shapes.length; i++) {
      const shape = this.shapes[i];
      const typeIndex = shape.typeIndex;
      
      // Recalculate position to ensure shapes are well-spaced
      const section = this.canvas.width / this.shapesData.length;
      const x = (section * typeIndex) + (section - shape.size) * Math.random() * 0.7;
      const y = Math.random() * (this.canvas.height - shape.size);
      
      // Update position
      shape.x = x;
      shape.y = y;
      
      // Add some movement variation to shapes
      shape.speedX = (Math.random() - 0.5) * this.randomRange(this.options.speed.min, this.options.speed.max) * 2;
      shape.speedY = (Math.random() - 0.5) * this.randomRange(this.options.speed.min, this.options.speed.max) * 2;
      shape.rotationSpeed = (Math.random() - 0.5) * 2;
      
      // Reset active state
      shape.active = false;
    }
  }
}