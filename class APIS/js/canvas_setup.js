window.onload = function () {
    // get the canvas
    let canvas = document.getElementById("testCanvas");
    //get the context
    let context = canvas.getContext("2d");

      //a draw a rect:
  context.fillStyle = "rgba(255,0,0,255)"; // the color 
  // draw a rect
  context.fillRect(canvas.width / 2, canvas.height / 2, 50, 50);
  // cut out a rect inside
  context.clearRect(canvas.width / 2 + 12.5, canvas.height / 2 + 12.5, 25, 25);
  };