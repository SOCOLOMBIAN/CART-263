/* WELCOME TO TASK 2 CART 263 */

window.onload = setup;

function setup () {
    console.log("go task 2");

 
/* GIVEN * : An object containing the current settings for drawing 
*  THESE  presets will need to be modified ... 
*/  
    let currentPresets = {
        color: "red",
        stroke: 1,
        shape: "square",
        borderRadius: "0px",
        isDrawing: true,
        drawingMode: "mouse-move",
        opacity:1.0,
      };

/* GIVEN *  a reference to the div in which we will allow for drawing ... 
*
*/
let pCanvas = document.getElementById("mouseCanvas");

/* GIVEN *  the event listener to detect if the mouse is moving in the div 
* with id `mouseCanvas`. The callback function is addAPoint
*
*/
  pCanvas.addEventListener("mousemove", addAPoint);


/* GIVEN *  this function when called will check if drawing 
* is true and the drawing mode is mouse-move then it will call the function to create a new point
*
*/

function addAPoint(event) {
    if (currentPresets.isDrawing === true && currentPresets.drawingMode === "mouse-move") {
      createNewDrawingPoint(event.clientX, event.clientY);
    }
  }


 /* GIVEN *  the event listener to detect if the mouse is being clicked in the div 
  * with id `mouseCanvas`
  * TO DO *
  * WILL HAVE DUAL FUNCTIONALITY (DEPENDENT ON THE DDRAWING MODE)
  * EITHER WILL SWITCH DRAWING OFF (LIKE LIFTING UP YOUR PEN)
  * OR
  * WILL ADD A POINT TO THE CANVAS 
  
  */


/* GIVEN * function to create a new drawing point.
*
*/
function createNewDrawingPoint(mouseX, mouseY) {
    //get the mouse canvas
    let pCanvas = document.getElementById("mouseCanvas");
    // get the RENDERED coordinates
    let renderedCoordinates = pCanvas.getBoundingClientRect();

    //create a new DIV
    let newDiv = document.createElement("div");
    newDiv.classList.add("point");

    //calculate the point to draw on the canvas
    let offsetX = Math.floor(mouseX - renderedCoordinates.x);
    let offsetY = Math.floor(mouseY - renderedCoordinates.y);
 

    // set the left and top
    newDiv.style.left = offsetX + "px";
    newDiv.style.top = offsetY + "px";

    //add the dot to the canvas
    pCanvas.appendChild(newDiv);


    //set the stroke width
    newDiv.style.width = currentPresets.stroke + "px";
    newDiv.style.height = currentPresets.stroke + "px";

        /**** NOTE HOW THE PRESETS ARE USED TO ASSIGN THE STYLE */
    //also set the border radius
    newDiv.style.borderRadius = currentPresets.borderRadius;
    //color
    newDiv.style.background = currentPresets.color;
    //opacity
    newDiv.style.opacity = currentPresets.opacity;
  }

  /**************************BUTTONS************************* */

  /*A:: COLOR BUTTONS ********************************************/
  /* TO DO: 
  *  1: Access each color button and assign an event listener to listen for the click event
  *  2:Write a callback function - that when a specific color button is clicked,
  *  access its id - and use the id to set the current drawing color (currentPresets.color)
  *  3: Finally access all the current points drawn (hint: they all have the class name `point`)
     and change their current background color to the selected color.
  */
  let colorButtons= document.querySelectorAll(".color-button");


// add event listener to each button
for (button of colorButtons) {
  button.addEventListener("click", changeColor);
}

function changeColor(e) {
  console.log(e)
  console.log(this.id)

  // loop through each point and update their color
  let points = document.querySelectorAll(".point")
  for (point of points) {
    point.style.background = this.id
  }
  
  // change current preset
  currentPresets.color = this.id
}
   
   /*B:: STROKE BUTTON ********************************************/
  /* TO DO: 
  *  1: Access the stroke button and assign an event listener to listen for the click event
  *  2: Write a callback function - that when the stroke button is clicked, access  the variable
  *   currentPresets.stroke - and check if it is < 10  - if it is add by 1, else set it to 1.
  *   Update the value in the button
  *  3: Finally access all the current points drawn (hint: they all have the class name `point`)
     and change their current stroke value to the updated value.
  */
     let strokeButton = document.querySelector("#change-stroke-button");

     strokeButton.addEventListener("click", updateStroke)
    
    
    
     function updateStroke(e) {
    
    
    
     if (currentPresets.stroke < 10) {
    
     currentPresets.stroke++
    
     }
    
     else {
    
     currentPresets.stroke = 1
    
     }
    
    
    
     this.innerHTML = `<p>${currentPresets.stroke}</p>`
    
    
    
     let allPoints = document.querySelectorAll(".point")
    
    
    
     for (let point of allPoints) {
    
     point.style.width = currentPresets.stroke + "px"
    
     point.style.height = currentPresets.stroke + "px"
    
     }
    
    
    
     }



  /*C:: SHAPE BUTTON ********************************************/
  /* TO DO: 
  *  1: Access the shape and assign an event listener to listen for the click event
  *  2: Write a callback function - that when the shape button is clicked, access the variable
  *   currentPresets.shape - and check if it is "circle" or "square"  
  *   - if it is "square": set the currentPresets.shape  to "circle" and the opposite (circle to square)
  *   Upate currentPresets.borderRadius to "0px" if the updated preset is square and to "5px" otherwise
  *   Update the value in the  shape button as well
  *  3: Finally access all the current points drawn (hint: they all have the class name `point`)
     and change their current border-radius value to the updated value.
  */
     let shapeButton = document.querySelector("#change-shape-button");

     shapeButton.addEventListener('click', callbackFunc);
   
     function callbackFunc() {
      let pTag = document.querySelector(`#${this.id} p`);
      let pointsDrawn = document.querySelectorAll('.point');
   
       if (currentPresets.shape == 'circle') {
         pTag.innerHTML = currentPresets.shape
         currentPresets.borderRadius = `${0}px`;
         currentPresets.shape = 'square';
        
       } else if
         (currentPresets.shape == 'square') {
         currentPresets.borderRadius = `${5}px`;
         pTag.innerHTML = currentPresets.shape
         currentPresets.shape = 'circle';
   
       }
   
       pointsDrawn.forEach((singlePoint)=>{
         singlePoint.style.borderRadius = currentPresets.borderRadius;
       })
   
   
    }


   /*D:: CHANGE DRAWING MODE ********************************************/
  /* TO DO: 
  *  1: Access the shape and assign an event listener to listen for the click event
  *  2: Write a callback function - that when the mode button is clicked, access the variable
  *   currentPresets.drawingMode - and check if it is "mouse-move" or "mouse-click"  
  *   - if it is "mouse-move": set the currentPresets.drawingMode  to "mouse-click" and the opposite (mouse-click to mouse-move)
  *   Update the value in the  shape button as well
  *  3: FILL IN THE CONDITION IN THE GIVEN EVENT listener for clicking the mouse and add the codeto add a point if the drawing mode is mouse-click
  *  OR 
  *   FILL IN THE CONDITION IN THE GIVEN EVENT listener for clicking the mouse and add the code to  toggle the drawing mode:
  *   turn drawing off it is on or on if it is off (when the drawing mode is mouse-move)
  */
  
// create variable to store the change mode button
let modeButton = document.querySelector("#change-mode-button");
//using the modeButton and adding the click event to it,clickCallback
modeButton.addEventListener("click", clickCallback);
//when click happens...
function clickCallback(e){
// check if the drawing mode is mouse move
if( currentPresets.drawingMode ==="mouse-move"){
currentPresets.drawingMode = "mouse-click";
modeButton.innerHTML = "<p>mouse-click</p>";
}
else {
currentPresets.drawingMode = "mouse-move";
modeButton.innerHTML = "<p>mouse-move</p>";
}
}

pCanvas.addEventListener("click", canvasClick);
function canvasClick(e){
createNewDrawingPoint(e.clientX,e.clientY);

 
}

   /*E:: OPACITY BUTTON ********************************************/
  /* TO DO: 
  *  1: Access the opacity button and assign an event listener to listen for the click event
  *  2: Write a callback function - that when the opacity button is clicked, access  the variable
  *   currentPresets.opacity - and check if it is > 0.0  - if it is  then decrement it by 0.1, else set it to 1.0.
  *   Update the value in the button
  *  3: Finally access all the current points drawn (hint: they all have the class name `point`)
     and change their current opacity value to the updated value.
  */
   
let opacityButton = document.querySelector("#change-opacity-button");

opacityButton.addEventListener("click",callback); // Add eventlistener when clicking on opacity button and call the Callback function

// Function that is called when the opacity button is clicked
function callback() {
if (currentPresets.opacity>0.1) {
currentPresets.opacity -= 0.1; // reduce opacity everytime opacity button is clicked
console.log(currentPresets.opacity);
}
else if (currentPresets.opacity <= 0.1){
currentPresets.opacity = 1.0; // Reset the opacity back to 1.0 if it reaches 0.0
console.log(currentPresets.opacity);
}

// Update button text to show current opacity value
let opacityText = opacityButton.querySelector("p"); // fetch the paragraph in the opacity button text
opacityText.textContent = currentPresets.opacity.toFixed(1); // change the paragraph to the current present's value and fixe it to one decimal
 
// Change all points opacity
let points = document.querySelectorAll(".point"); // look for all the points
points.forEach(point => {
point.style.opacity = currentPresets.opacity; // set the opacity of all the points to the current opacity
});
 }

  /*F:: ERASE BUTTON ********************************************/
  /* TO DO: 
  *  1: Access the erase button and assign an event listener to listen for the click event
  *  2: Write a callback function - that when the erase button is clicked, 
  *  remove all points (hint: they all have the class name `point`) from the drawing div
  */



  let eraseButton = document.querySelector("#change-erase-button");
  eraseButton.addEventListener("click", eraserCallBack);
   
  

  function eraserCallBack(e){
   
  let toRemove = document.querySelectorAll(".point");
  console.log(toRemove);
   
  
  for ( let i = 0; i < toRemove.length; i++ ){
  toRemove[i].remove();
  }
   
  }


} //end setup
