/**
 * animation.js
 * Provides visual animation effects for the game.
 * Collection of static methods for screen shake, flashes, and other visual feedback.
 */

class AnimationEffects {
  // Create a screen shake effect
  static screenShake(element, intensity = 5, duration = 500) {
    const startTime= performance.now();
    
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

  
/**
 * changes the background color then to put it back to the original color
 */
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
  
/**
 * higlights the activ shape, then remove the effect
 */
  static highlightShape(element, duration = 500) {
    element.classList.add('active-shape');
    
    setTimeout(() => {
      element.classList.remove('active-shape');
    }, duration);
  }
  
/**
 * use for the user when click
 */
  static createRipple(event, color = 'rgba(255, 255, 255, 0.4)') {
    const button = event.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    // Get the button's position
    const rect = button.getBoundingClientRect();

    circle.classList.add('ripple-effect');
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - rect.left - radius}px`;
    circle.style.top = `${event.clientY - rect.top - radius}px`;
    
    if (color !== 'rgba(255, 255, 255, 0.4)') {
      circle.style.backgroundColor = color;
    }
    
    button.appendChild(circle);
    setTimeout(() => circle.remove(), 600);
  }
    
 /**
 * make element grow size and return to normal
 */
  static pulseElement(element, scale = 1.1, duration = 500) {
    // Store original transform
    const originalTransform = element.style.transform || 'scale(1)';
    element.style.transition = `transform ${duration/2}ms ease-in-out`;
    element.style.transform = `${originalTransform.includes('scale') ? originalTransform : originalTransform + ' scale(1)'} scale(${scale})`; // Scale up
          
  // Reset transition
      setTimeout(() => {
        element.style.transition = originalTransition;
    }, duration/2);
  }
  
 /**
 *  Create a floating animation for elements
 */
  static floatElement(element, duration = 2000) {
    // Apply animation
    element.style.animation = `float ${duration}ms ease-in-out infinite`;
  }
}