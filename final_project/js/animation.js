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
    // Store original background color
    const computedStyle = window.getComputedStyle(element);
    const originalColor = computedStyle.backgroundColor;
    
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
  
  // Create a ripple effect on click
  static createRipple(event, color = 'rgba(255, 255, 255, 0.4)') {
    const button = event.currentTarget;
    
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    
    // Get the button's position
    const rect = button.getBoundingClientRect();
    
    // Position and style the ripple
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - rect.left - radius}px`;
    circle.style.top = `${event.clientY - rect.top - radius}px`;
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
  
  // Easing function for smoother animations
  static easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }
  
  // Pulse animation for an element
  static pulseElement(element, scale = 1.1, duration = 500) {
    // Store original transform
    const originalTransform = element.style.transform || 'scale(1)';
    
    // Add transition property if not present
    const originalTransition = element.style.transition;
    element.style.transition = `transform ${duration/2}ms ease-in-out`;
    
    // Scale up
    element.style.transform = `${originalTransform.includes('scale') ? originalTransform : originalTransform + ' scale(1)'} scale(${scale})`;
    
    // Scale back down
    setTimeout(() => {
      element.style.transform = originalTransform;
      
      // Reset transition
      setTimeout(() => {
        element.style.transition = originalTransition;
      }, duration/2);
    }, duration/2);
  }
  
  // Create a floating animation for elements
  static floatElement(element, duration = 2000, distance = 15) {
    // Create animation if not already in document
    if (!document.querySelector('style#float-animation')) {
      const style = document.createElement('style');
      style.id = 'float-animation';
      style.textContent = `
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-${distance}px); }
          100% { transform: translateY(0px); }
        }
      `;
      document.head.appendChild(style);
    }
    
    // Apply animation
    element.style.animation = `float ${duration}ms ease-in-out infinite`;
  }
}