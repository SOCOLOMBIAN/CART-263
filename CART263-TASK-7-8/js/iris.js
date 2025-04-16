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
    this.ctx=getContext('2d');
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