window.onload = function(){
    let canvas = document.getElementById("testCanvas");
    //get the context
    let context = canvas.getContext("2d");

   // Then lets make two triangle objects:
    window.onload = function () {
      let canvas = document.getElementById("testCanvas");
      //get the context
      let context = canvas.getContext("2d");
     
      let triangleA = new Triangle(
        canvas.width / 2,
        canvas.height / 2,
        50,
        "#FFFFFF",
        "#156cc8",
        2,
        1,
        1
      );
      triangleA.display(context);
     
       let triangleB = new Triangle(
        400,
        10,
        25,
        "#FFFFFF",
        "#C81582",
        2,
        -1,
        1
      );
    //   triangleB.display(context);
    
   
 requestAnimationFrame(animate);
 
  function animate() {
    //repaint with a black rect..
    context.clearRect(0, 0, canvas.width, canvas.height);
    triangleA.setPoints();
    triangleA.update();
    triangleA.display(context);
 
    triangleB.setPoints();
    triangleB.update();
    triangleB.display(context);
 
    requestAnimationFrame(animate);
  }
};
}


