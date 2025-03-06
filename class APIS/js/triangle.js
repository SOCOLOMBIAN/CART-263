class Triangle {
    constructor(
      xRef,
      yRef,
      lineLength,
      strokeColor,
      fillColor,
      lineWidth,
      xSpeed,
      ySpeed
    ) {
      this.xRef = xRef;
      this.yRef = yRef;
      this.lineLength = lineLength;
      this.strokeColor = strokeColor;
      this.fillColor = fillColor;
      this.lineWidth = lineWidth;
      this.xSpeed = xSpeed;
      this.ySpeed = ySpeed;
   
      // the points
      this.x1 = this.xRef;
      this.y1 = this.yRef;
      this.x2 = this.xRef + this.lineLength;
      this.y2 = this.yRef;
      this.x3 = this.xRef + this.lineLength / 2;
      this.y3 = this.yRef - this.lineLength;
    }
   
    display(context) {
      context.beginPath(); //start a path
      context.moveTo(this.x1, this.y1); //where to start drawing
      context.lineTo(this.x2, this.y2); //lineTo(where to go from last...)
      context.lineTo(this.x3, this.y3);
      context.lineTo(this.x1, this.y1);
      context.fillStyle = this.fillColor; // change the color we are using
      context.fill();
      context.strokeStyle = this.strokeColor; // change the color we are using
      context.lineWidth = this.lineWidth;
      context.stroke();
      context.closePath(); //end a path ..
    }
  }