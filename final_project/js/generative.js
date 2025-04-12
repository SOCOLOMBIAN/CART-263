// generative-art.js - 

class GenerativeArt {
    constructor(canvasId) {
      this.canvas = document.getElementById(canvasId);
      this.ctx = this.canvas.getContext('2d');
      this.width = this.canvas.width || 300;
      this.height = this.canvas.height || 300;
      
      // Make sure canvas size is set
      this.canvas.width = this.width;
      this.canvas.height = this.height;
      
      // Art style parameters
      this.styles = [
        this.generatePolygonArt.bind(this),
        this.generateCircleArt.bind(this),
        this.generateFlowFieldArt.bind(this),
        this.generateWaveArt.bind(this)
      ];
    }
    
    // Generate art based on sequence and level
    generateArt(sequence, level, score) {
      // Clear canvas
      this.ctx.clearRect(0, 0, this.width, this.height);
      
      // Set background
      this.ctx.fillStyle = '#111';
      this.ctx.fillRect(0, 0, this.width, this.height);
      
      // Choose art style based on level
      const styleIndex = (level - 1) % this.styles.length;
      const generator = this.styles[styleIndex];
      
      // Generate art
      generator(sequence, level, score);
      
      // Return the canvas data URL for saving
      return this.canvas.toDataURL('image/png');
    }
    
    // Create color palette from sequence
    createPalette(sequence) {
      const baseColors = [
        '#FF4136', // Red
        '#0074D9', // Blue
        '#2ECC40', // Green
        '#FFDC00'  // Yellow
      ];
      
      // Map sequence to colors
      return sequence.map(index => baseColors[index]);
    }
    
    // Style 1: Polygon-based art
    generatePolygonArt(sequence, level, score) {
      const palette = this.createPalette(sequence);
      const complexity = Math.min(10, level + 3);
      const center = { x: this.width / 2, y: this.height / 2 };
      
      // Create layered polygons
      for (let i = 0; i < complexity; i++) {
        const sides = 3 + (i % 5);
        const radius = (this.width * 0.4) * (1 - i / complexity);
        const rotation = (i * Math.PI / complexity) + (sequence.reduce((sum, val) => sum + val, 0) / 10);
        const color = palette[i % palette.length];
        
        this.drawPolygon(center, sides, radius, rotation, color, i / complexity);
      }
      
      // Add particles based on sequence
      sequence.forEach((val, i) => {
        const angle = (i / sequence.length) * Math.PI * 2;
        const distance = this.width * 0.3;
        const x = center.x + Math.cos(angle) * distance;
        const y = center.y + Math.sin(angle) * distance;
        
        this.drawParticleCluster(x, y, palette[val], 20 + val * 10);
      });
    }
    
    // Style 2: Circle-based art
    generateCircleArt(sequence, level, score) {
      const palette = this.createPalette(sequence);
      const layers = Math.min(15, level + 5);
      
      // Create background gradient
      const gradient = this.ctx.createRadialGradient(
        this.width / 2, this.height / 2, 0,
        this.width / 2, this.height / 2, this.width / 2
      );
      gradient.addColorStop(0, '#111');
      gradient.addColorStop(1, '#000');
      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(0, 0, this.width, this.height);
      
      // Convert sequence to values for art
      const values = sequence.map(val => val / 3); // Normalize to 0-1 range
      
      // Draw concentric circles
      for (let i = 0; i < layers; i++) {
        const radius = (this.width * 0.45) * (1 - i / layers);
        const colorIndex = (i + sequence[i % sequence.length]) % palette.length;
        const lineWidth = 2 + (i % 3);
        
        // Add variation based on sequence
        const distortion = values[(i + 1) % values.length] * 20;
        
        this.drawDistortedCircle(
          this.width / 2, 
          this.height / 2, 
          radius, 
          distortion,
          palette[colorIndex],
          lineWidth
        );
      }
      
      // Add focal points based on sequence
      sequence.forEach((val, i) => {
        const angle = (i / sequence.length) * Math.PI * 2;
        const radius = this.width * 0.25 * values[i % values.length];
        const x = this.width / 2 + Math.cos(angle) * radius;
        const y = this.height / 2 + Math.sin(angle) * radius;
        
        this.ctx.beginPath();
        this.ctx.arc(x, y, 5 + val * 2, 0, Math.PI * 2);
        this.ctx.fillStyle = palette[val];
        this.ctx.fill();
        
        // Add glow
        this.ctx.beginPath();
        const glowGradient = this.ctx.createRadialGradient(x, y, 0, x, y, 20 + val * 5);
        glowGradient.addColorStop(0, palette[val] + '80');
        glowGradient.addColorStop(1, 'transparent');
        this.ctx.fillStyle = glowGradient;
        this.ctx.arc(x, y, 20 + val * 5, 0, Math.PI * 2);
        this.ctx.fill();
      });
    }
    
    // Style 3: Flow field art
    generateFlowFieldArt(sequence, level, score) {
      const palette = this.createPalette(sequence);
      const particleCount = Math.min(1000, level * 100);
      const particles = [];
      
      // Use sequence to seed the flow field
      const noiseScale = 0.005 + (sequence.reduce((sum, val) => sum + val, 0) / 100);
      const flowField = this.generateFlowField(noiseScale, sequence);
      
      // Create particles
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          vx: 0,
          vy: 0,
          color: palette[i % palette.length],
          life: Math.random() * 20 + 10
        });
      }
      
      // Update particles
      for (let step = 0; step < 20; step++) {
        particles.forEach(p => {
          // Get flow field direction
          const xIndex = Math.floor(p.x / 20);
          const yIndex = Math.floor(p.y / 20);
          const index = (yIndex * Math.ceil(this.width / 20) + xIndex) % flowField.length;
          const angle = flowField[index];
          
          // Update velocity
          p.vx = Math.cos(angle) * 2;
          p.vy = Math.sin(angle) * 2;
          
          // Update position
          p.x += p.vx;
          p.y += p.vy;
          p.life -= 0.5;
          
          // Draw particle
          if (p.life > 0) {
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, 1, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color + Math.floor((p.life / 30) * 255).toString(16).padStart(2, '0');
            this.ctx.fill();
          }
        });
      }
    }
    
    // Style 4: Wave pattern art
    generateWaveArt(sequence, level, score) {
      const palette = this.createPalette(sequence);
      const waveCount = Math.min(20, level + 3);
      
      // Convert sequence to wave parameters
      const amplitudes = sequence.map(val => 10 + val * 5);
      const frequencies = sequence.map(val => 0.01 + val * 0.005);
      const phases = sequence.map(val => val * Math.PI / 2);
      
      // Draw waves
      for (let i = 0; i < waveCount; i++) {
        const ampIndex = i % amplitudes.length;
        const freqIndex = (i + 1) % frequencies.length;
        const phaseIndex = (i + 2) % phases.length;
        
        const amplitude = amplitudes[ampIndex];
        const frequency = frequencies[freqIndex];
        const phase = phases[phaseIndex] + (i * Math.PI / 10);
        
        const y = (this.height / (waveCount + 1)) * (i + 1);
        const color = palette[i % palette.length];
        
        this.drawWave(y, amplitude, frequency, phase, color);
      }
      
      // Add intersections
      for (let i = 0; i < sequence.length; i++) {
        const x = (this.width / (sequence.length + 1)) * (i + 1);
        const y = this.height / 2 + (sequence[i] - 1.5) * 40;
        
        this.ctx.beginPath();
        this.ctx.arc(x, y, 5 + sequence[i] * 2, 0, Math.PI * 2);
        this.ctx.fillStyle = palette[i % palette.length];
        this.ctx.fill();
      }
    }
    
    // Helper: Draw polygon
    drawPolygon(center, sides, radius, rotation, color, opacity) {
      this.ctx.beginPath();
      for (let i = 0; i < sides; i++) {
        const angle = rotation + (i * 2 * Math.PI / sides);
        const x = center.x + radius * Math.cos(angle);
        const y = center.y + radius * Math.sin(angle);
        
        if (i === 0) {
          this.ctx.moveTo(x, y);
        } else {
          this.ctx.lineTo(x, y);
        }
      }
      this.ctx.closePath();
      
      // Style
      this.ctx.strokeStyle = color;
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
      
      // Fill with translucent color
      this.ctx.fillStyle = color + Math.floor(opacity * 50).toString(16).padStart(2, '0');
      this.ctx.fill();
    }
    
    // Helper: Draw particle cluster
    drawParticleCluster(x, y, color, count) {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 30;
        const px = x + Math.cos(angle) * distance;
        const py = y + Math.sin(angle) * distance;
        const size = Math.random() * 2 + 1;
        
        this.ctx.beginPath();
        this.ctx.arc(px, py, size, 0, Math.PI * 2);
        this.ctx.fillStyle = color + Math.floor(Math.random() * 100 + 155).toString(16).padStart(2, '0');
        this.ctx.fill();
      }
    }
    
    // Helper: Draw distorted circle
    drawDistortedCircle(x, y, radius, distortion, color, lineWidth) {
      this.ctx.beginPath();
      
      const points = 100;
      for (let i = 0; i <= points; i++) {
        const angle = (i / points) * Math.PI * 2;
        const noise = (Math.sin(angle * 5) + Math.cos(angle * 3)) * distortion;
        const r = radius + noise;
        
        const px = x + r * Math.cos(angle);
        const py = y + r * Math.sin(angle);
        
        if (i === 0) {
          this.ctx.moveTo(px, py);
        } else {
          this.ctx.lineTo(px, py);
        }
      }
      
      this.ctx.closePath();
      this.ctx.strokeStyle = color;
      this.ctx.lineWidth = lineWidth;
      this.ctx.stroke();
    }
    
    // Helper: Generate flow field
    generateFlowField(scale, sequence) {
      const cols = Math.ceil(this.width / 20);
      const rows = Math.ceil(this.height / 20);
      const field = new Array(cols * rows);
      
      const seedX = sequence[0] || 0;
      const seedY = sequence[1] || 0;
      
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          // Use a simple deterministic noise function
          const nx = x * scale + seedX / 10;
          const ny = y * scale + seedY / 10;
          const angle = this.simpleNoise(nx, ny) * Math.PI * 2;
          field[y * cols + x] = angle;
        }
      }
      
      return field;
    }
    
    // Helper: Simple noise function
    simpleNoise(x, y) {
      // Simple deterministic noise function
      return (Math.sin(x * 10 + y * 3) * Math.cos(x * 4 - y * 7) + 1) / 2;
    }
    
    // Helper: Draw wave
    drawWave(baseY, amplitude, frequency, phase, color) {
      this.ctx.beginPath();
      
      for (let x = 0; x < this.width; x++) {
        const y = baseY + Math.sin(x * frequency + phase) * amplitude;
        
        if (x === 0) {
          this.ctx.moveTo(x, y);
        } else {
          this.ctx.lineTo(x, y);
        }
      }
      
      this.ctx.strokeStyle = color;
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
    }
    
    // Save artwork to gallery
    saveArtwork(dataUrl, sequence, level, score) {
      // Create a thumbnail element
      const thumbnail = document.createElement('div');
      thumbnail.className = 'gallery-item';
      
      // Add image to thumbnail
      const img = document.createElement('img');
      img.src = dataUrl;
      img.style.width = '100%';
      img.style.height = '100%';
      thumbnail.appendChild(img);
      
      // Add info tooltip
      thumbnail.title = `Level: ${level}, Score: ${score}`;
      
      // Add to gallery
      const gallery = document.getElementById('gallery');
      gallery.appendChild(thumbnail);
      
      return { dataUrl, sequence, level, score };
    }
  }