"use strict";


function setup() {
    console.log("go")

    createCanvas(600, 600);
    background(0,0,0);

    
    drawEllipse(50,90,35,50);
    drawEllipse(60,150,45,65);
    drawEllipse(70,200,55,75);
}

function draw() {
  

}

function drawEllipse(x,y,w,h,r,g,b) { 
    push();
    fill(r,g,b);
    ellipse(x,y,w,h);
    pop();

}