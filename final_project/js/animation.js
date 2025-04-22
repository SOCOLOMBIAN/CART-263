/**
 * animation.js
 * Provides visual animation effects for the game.
 * Collection of static methods for screen shake, flashes, and other visual feedback.
 */

class AnimationEffects {
  // Create a screen shake effect
  static screenShake(element, intensity = 5, duration = 500) {
    const startTime = performance.now();
    const originalPosition = { x: 0, y: 0 }; // Default position
    
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
        element.style.transform = '';
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
    
    // Make sure we clean up old ripples
    const oldRipple = button.querySelector('.ripple-effect');
    if (oldRipple) {
      oldRipple.remove();
    }
    
    button.appendChild(circle);
    setTimeout(() => {
      if (circle.parentNode === button) {
        circle.remove();
      }
    }, 600);
  }
    
 /**
 * make element grow size and return to normal
 */
  static pulseElement(element, scale = 1.1, duration = 500) {
    // Store original transform and transition
    const originalTransform = element.style.transform || 'scale(1)';
    const originalTransition = element.style.transition || '';
    
    // Apply new transform with transition
    element.style.transition = `transform ${duration/2}ms ease-in-out`;
    element.style.transform = `${originalTransform.includes('scale') ? originalTransform : originalTransform + ' scale(1)'} scale(${scale})`; // Scale up
    
    // Reset to original after duration
    setTimeout(() => {
      element.style.transform = originalTransform;
      setTimeout(() => {
        element.style.transition = originalTransition;
      }, duration/2);
    }, duration/2);
  }
  
 /**
 *  Create a floating animation for elements
 */
  static floatElement(element, duration = 2000) {
    // Define the keyframes if not already in the stylesheet
    if (!document.querySelector('#float-keyframes')) {
      const style = document.createElement('style');
      style.id = 'float-keyframes';
      style.textContent = `
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
      `;
      document.head.appendChild(style);
    }
    
    // Apply animation
    element.style.animation = `float ${duration}ms ease-in-out infinite`;
  }
}