class AnimationEffects {
  // Create a screen shake effect
  static screenShake(element, intensity = 5, duration = 500) {
    const originalPosition = {
      x: 0,
      y: 0
    };
    
    const startTime = performance.now();
    
    function shake(currentTime) {
      const elapsed = currentTime - startTime;
      
      if (elapsed < duration) {
        // Calculate decreasing intensity as the animation progresses
        const currentIntensity = intensity * (1 - elapsed / duration);
        
        // Generate random offsets
        const offsetX = (Math.random() - 0.5) * 2 * currentIntensity;
        const offsetY = (Math.random() - 0.5) * 2 * currentIntensity;
        
        // Apply transform
        element.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
        
        // Continue animation
        requestAnimationFrame(shake);
      } else {
        // Reset to original position
        element.style.transform = `translate(${originalPosition.x}px, ${originalPosition.y}px)`;
      }
    }
    
    // Start the animation
    requestAnimationFrame(shake);
  }
  
  // Flash the background with a color
  static flashBackground(element, color, duration = 500) {
    const originalColor = element.style.backgroundColor;
    
    // Set flash color
    element.style.backgroundColor = color;
    element.style.transition = `background-color ${duration/2}ms ease-in-out`;
    
    // Reset after duration
    setTimeout(() => {
      element.style.backgroundColor = originalColor;
    }, duration);
  }
  
  // Highlight a shape with pulsating effect
  static highlightShape(element, duration = 500) {
    element.classList.add('active-shape');
    
    setTimeout(() => {
      element.classList.remove('active-shape');
    }, duration);
  }
  
  // Animate shape movement on canvas
  static animateShapeOnCanvas(canvasElement, shapeIndex, duration = 1000) {
    const canvas = canvasElement;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Create a temporary SVG element to render the shape
    const tempSvg = document.createElement('div');
    tempSvg.innerHTML = [raro, prisma, estrella, circle][shapeIndex];
    const svgElement = tempSvg.firstChild;
    
    // Convert SVG to image for canvas rendering
    const data = new XMLSerializer().serializeToString(svgElement);
    const img = new Image();
    const svgBlob = new Blob([data], {type: 'image/svg+xml'});
    const url = URL.createObjectURL(svgBlob);
    
    // Start position (center)
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Random target position within canvas (not too close to edges)
    const targetX = width * 0.2 + Math.random() * width * 0.6;
    const targetY = height * 0.2 + Math.random() * height * 0.6;
    
    // Animation variables
    const startTime = performance.now();
    const size = 80;
    
    function animate(currentTime) {
      // Calculate progress (0 to 1)
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Clear the canvas for this animation frame
      ctx.clearRect(0, 0, width, height);
      
      // Calculate current position with easing
      const easeProgress = AnimationEffects.easeInOutQuad(progress);
      const currentX = centerX + (targetX - centerX) * easeProgress;
      const currentY = centerY + (targetY - centerY) * easeProgress;
      
      // Scale effect - grow and shrink
      const scale = 1 + 0.3 * Math.sin(progress * Math.PI);
      
      // Draw the SVG as an image with rotation
      ctx.save();
      ctx.translate(currentX, currentY);
      ctx.rotate(progress * Math.PI * 2); // Rotate fully once
      ctx.scale(scale, scale);
      
      // The image might not be loaded immediately, so check
      if (img.complete) {
        ctx.drawImage(img, -size/2, -size/2, size, size);
      }
      
      ctx.restore();
      
      // Continue animation if not complete
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Clean up
        URL.revokeObjectURL(url);
      }
    }
    
    // Start animation when image loads
    img.onload = () => {
      requestAnimationFrame(animate);
    };
    img.src = url;
  }
  
  // Easing function for smoother animations
  static easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }
  
  // Create a ripple effect on click
  static createRipple(event, color = 'rgba(255, 255, 255, 0.4)') {
    const button = event.currentTarget;
    
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    
    // Position and style the ripple
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.getBoundingClientRect().left - radius}px`;
    circle.style.top = `${event.clientY - button.getBoundingClientRect().top - radius}px`;
    circle.style.position = 'absolute';
    circle.style.borderRadius = '50%';
    circle.style.backgroundColor = color;
    circle.style.transform = 'scale(0)';
    circle.style.animation = 'ripple 600ms linear';
    
    // Add ripple style if not already in document
    if (!document.querySelector('style#ripple-animation')) {
      const style = document.createElement('style');
      style.id = 'ripple-animation';
      style.textContent = `
        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
    
    // Set position to relative for the button if not already
    const computedStyle = window.getComputedStyle(button);
    if (computedStyle.position !== 'relative') {
      button.style.position = 'relative';
    }
    button.style.overflow = 'hidden';
    
    // Add and clean up
    button.appendChild(circle);
    setTimeout(() => circle.remove(), 600);
  }
}