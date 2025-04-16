class iris{
    constructor(data,index,canvas,canvasWidth,canvasHeight){
     // iris data 
    this.sepalLength = data.sepalLength;
    this.sepalWidth = data.sepalWidth;
    this.petalLength = data.petalLength;
    this.petalWidth = data.petalWidth;
    this.species = data.species;
    this.color = data.color;
    this.index = index;

    //propieties 
    this.canvas=canvas;
    this.ctx= canvas.getContext('2d');
    this.canvasWidth;
    this.canvasHeight=canvasHeight;

    //animation propieties
    this.x = Math.random() * canvasWidth;
    this.y = Math.random() * canvasHeight;
    this.targetX = this.x;
    this.targetY = this.y;
    this.movementSpeed= 0.02 + Math.random() * 0.03;
    this.scale= 0.5 + (this.petalWidth *2); 
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
        const ctx= this.ctx;
        
        //save current state 
        ctx.save();

        //move iris position 
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotationAngle);

        //scale size
        const pulseScale = this.isHovered || this.isSelected ? 1 + (this.pulseValue * 0.2) : 1;
        const finalScale = this.scale * pulseScale;
        ctx.scale(finalScale, finalScale);

        this.drawFlower(ctx);

        //restor the context of the flower
        ctx.restore();
}
}