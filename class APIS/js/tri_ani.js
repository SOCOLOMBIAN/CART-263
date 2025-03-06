window.onload = function () {
    // get the canvas
    let canvas = document.getElementById("testCanvas");
    //get the context
    let context = canvas.getContext("2d");
    let lineLength =50;

// triangle obj 1:
let triangle_1= {
    x1: canvas.width/2,
    y1: canvas.height/2,
    x2: canvas.width/2+lineLength,
    y2: canvas.height/2,
    x3: canvas.width/2+(lineLength/2),
    y3:canvas.height/2-lineLength,
    strokeColor:"#FFFFFF",
    fillColor:"#C81582",
    lineWidth:2,
    xSpeed:1, 
    ySpeed:1,
    xRef:1,
    yRef:1,
    };

    function display(tri){
        context.beginPath(); //start a path
        context.moveTo(tri.x1,tri.y1); //where to start drawing
        context.lineTo(tri.x2,tri.y2); //lineTo(where to go from last...)
        context.lineTo(tri.x3,tri.y3);
        context.lineTo(tri.x1,tri.y1);
        context.fillStyle = tri.fillColor; // change the color we are using
        context.fill();
        context.strokeStyle = tri.strokeColor; // change the color we are using
        context.lineWidth =tri.lineWidth;
        context.stroke();
        context.closePath(); //end a path ...
       }
    
     //method to update the points ... of triangle given one x and one y
     function setPoints(tri){
        //p1
        tri.x1 = tri.xRef;
        tri.y1 = tri.yRef;
        //p2
        tri.x2 = tri.x1+lineLength;
        tri.y2 = tri.y1;
        //p3
        tri.x3 = tri.x1+(lineLength/2);
        tri.y3 = tri.y1-lineLength;
}

 display(triangle_1);
requestAnimationFrame(animate);
function animate(){
    context.clearRect(0,0,canvas.width,canvas.height);
    display(triangle_1);
    triangle_1.xRef+=triangle_1.xSpeed;
    triangle_1.yRef+=triangle_1.ySpeed;
    setPoints(triangle_1);
console.log("go")
requestAnimationFrame(animate);
}




}

