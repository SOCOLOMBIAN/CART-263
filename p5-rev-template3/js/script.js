"use strict";


function setup() {
    console.log("go")

    createCanvas(600, 600);
    
}

function draw() {
    background(255);
    drawRectangles();

}

function drawRectangles(){
    
    push();
    fill(245,56,106);
    rect(30,20,55,55);
    pop();
    
    push();
    fill(345,66,106);
    rect(90,20,55,55);
    pop();

    push();
    fill(45,76,106);
    rect(150,20,55,55);
    pop();
}
