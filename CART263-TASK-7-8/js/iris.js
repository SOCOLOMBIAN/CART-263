class Iris {
    constructor(data, index, canvas, canvasWidth, canvasHeight) {
      // iris data 
      this.sepalLength = data.sepalLength;
      this.sepalWidth = data.sepalWidth;
      this.petalLength = data.petalLength;
      this.petalWidth = data.petalWidth;
      this.species = data.species;
      this.color = data.color;
      this.index = index;
  
      // properties 
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.canvasWidth = canvasWidth;
      this.canvasHeight = canvasHeight;
  
      // animation properties
      this.x = Math.random() * canvasWidth;
      this.y = Math.random() * canvasHeight;
      this.targetX = this.x;
      this.targetY = this.y;
      this.movementSpeed = 0.02 + Math.random() * 0.03;
      this.scale = 0.5 + (this.petalWidth * 2);
      
      // interaction properties
      this.isHovered = false;
      this.isSelected = false;
    }
  
    moveTowards(targetX, targetY) {
      this.targetX = targetX;
      this.targetY = targetY;
    }
  
    update() {
      // Move towards target position
      this.x += (this.targetX - this.x) * this.movementSpeed;
      this.y += (this.targetY - this.y) * this.movementSpeed;
    }
  
    //draw iris on the canvas
    draw() {
      const ctx = this.ctx;
      
      //save current state 
      ctx.save();
  
      //move iris position 
      ctx.translate(this.x, this.y);
      
      this.drawFlower(ctx);
      
      if (this.isHovered || this.isSelected) {
        this.drawInfo(ctx);
      }
      
      ctx.restore();
    }
  
    drawFlower(ctx) {
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.arc(0, 0, 5, 0, Math.PI * 2);
      ctx.fill();
  
      ctx.fillStyle = this.getSpeciesColor();
      
      //draw 5 petals
      for (let i = 0; i < 5; i++) {
        const angle = (i / 5) * Math.PI * 2;
        const petalLength = this.petalLength * 5;
        const petalWidth = this.petalWidth * 10;
        
        ctx.save();
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.ellipse(
          petalLength / 2, 0, 
          petalLength / 2, petalWidth / 2, 
          0, 0, Math.PI * 2
        );
        ctx.fill();
        ctx.restore();
      }
    }
  
    //information about the iris
    drawInfo(ctx) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(-60, 20, 120, 60);
      
      ctx.fillStyle = '#fff';
      ctx.font = '10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`Species: ${this.species}`, 0, 35);
      ctx.fillText(`Sepal: ${this.sepalLength}×${this.sepalWidth}`, 0, 50);
      ctx.fillText(`Petal: ${this.petalLength}×${this.petalWidth}`, 0, 65);
    }
  
    // point inside the iris
    containsPoint(mouseX, mouseY) {
      const distance = Math.sqrt(
        Math.pow(mouseX - this.x, 2) + 
        Math.pow(mouseY - this.y, 2)
      );
      return distance < 15 * this.scale;
    }
    
    getSpeciesColor() {
      switch (this.species) {
        case 'setosa':
          return '#FF5252'; // Red
        case 'versicolor':
          return '#4CAF50'; // Green
        case 'virginica':
          return '#2196F3'; // Blue
        default:
          return this.color; // Use assigned color
      }
    }
  }