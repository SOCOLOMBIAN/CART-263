setup_B();
/** THEME: CHAOS  */
function setup_B() {
  console.log("in b");
  /**************************************************** */
  //get the buttons
  activateButtons_B(`#TEAM_B`, "ani_canvB");

  /**************************************************** */
  /* NO NEED TO MODIFY THIS FUNCTION :) */
  /*** helper function to activate buttons */
  /**************************************************** */
  function activateButtons_B(team, teamCanvas) {
    let teamButtons = document.querySelectorAll(`${team} .team-nav p`);
    //2:
    console.log(teamButtons);
    for (let button of teamButtons) {
      button.addEventListener("click", buttonCallBack);

      function buttonCallBack(e) {
        switch (this.textContent) {
          case "1": {
            console.log("A");
            //reset the canvases
            resetCanvases(`${team} .aniCanvas`);
            //reset buttons
            resetButtons(teamButtons, this);
            //activate canvas A
            document.getElementById(`${teamCanvas}_A`).style.display = "block";
            //run first
            aniA(document.getElementById(`${teamCanvas}_A`));

            break;
          }
          case "2": {
            console.log("B");
            resetCanvases(`${team} .aniCanvas`);
            //reset buttons
            resetButtons(teamButtons, this);
            //activate canvas B
            document.getElementById(`${teamCanvas}_B`).style.display = "block";
            //run second
            aniB(document.getElementById(`${teamCanvas}_B`));
            break;
          }
          case "3": {
            console.log("C");
            //reset the canvases
            resetCanvases(`${team} .aniCanvas`);
            //reset buttons
            resetButtons(teamButtons, this);
            //activate canvas C
            document.getElementById(`${teamCanvas}_C`).style.display = "block";
            //run third
            aniC(document.getElementById(`${teamCanvas}_C`));
            break;
          }
          case "4": {
            console.log("D");
            break;
          }
          case "5": {
            console.log("E");
            break;
          }
          case "6": {
            console.log("F");
            break;
          }
        }
      }
    } //for
  }
   /**************** ANI A ************************************ */
  /** PUT ALL YOUR CODE FOR ANIMATION A INSIDE  HERE */
  /**************** ANI A ************************************ */
  /**************** TASK *******************************************
   * YOU CAN USE ALL NOTES --- and see my examples in team-h.js for inspiration and possibly help:)
   * 1: use the function window.requestAnimationFrame() to create an animation
   * i.e. a reoccuring pattern - you can use simple shapes and colors, images etc...
   * 2: create a way to start and stop the animation using a
   * custom made button and add a mouse click event listener to either start/stop the animation
   *
   * NOTE::: PLEASE::: if you add any custom css PLEASE use the style.css and prefix any class names with your team label
   * i.e. you want to create a custom div class and you are in "Team_A" then call your class TEAM_A_ANI_A_Div -
   * this is so that your styles are not overriden by other teams.
   * NOTE::: All your code is to be added here inside this function -
   * remember you can define other functions inside....
   * Do not change any code above or the HTML markup.
   * **/
  function aniA(parentCanvas) {
    console.log("in A");
  
    // Create a button element
    let button = document.createElement("div");
    button.classList.add("TEAM_B_box");
    button.textContent = "CLICK";
    parentCanvas.appendChild(button);
  
    let rectPs = []; // 2D Array to store rectangles
    let offset = 40; // Offset for positioning
    let step = 0; // Keeps track of which row/column to change
    let mode = "row"; // Start with rows, then switch to columns
    let activeRects = []; // Store currently active elements
    let animationInterval; // Store animation loop
  
    const colors = ["red", "blue", "green", "yellow", "purple", "orange"];
    let colorIndex = 0;
  
    // Function to set up the grid of rectangles
    function setupAnimation() {
      for (let i = 0; i < 13; i++) {
        rectPs[i] = []; // Initialize each row
        for (let j = 0; j < 13; j++) {
          let rectP = document.createElement("p");
          rectP.classList.add("TEAM_B_rect");
          rectP.style.width = `20px`;
          rectP.style.height = `20px`;
          rectP.style.position = "absolute";
          rectP.style.left = offset + i * 25 + "px";
          rectP.style.top = offset + j * 25 + "px";
  
          parentCanvas.appendChild(rectP);
          rectPs[i].push(rectP);
        }
      }
    }

    // Function to animate the selected row/column continuously
    function startAnimation(rects) {
      // Stop the previous animation
      if (animationInterval) clearInterval(animationInterval);
      
      activeRects = rects; // Store currently animated elements
      let newColor = colors[colorIndex]; // Get the next color
  
      // Start animation loop
      animationInterval = setInterval(() => {
        activeRects.forEach((rectP) => {
          rectP.classList.toggle("pop-animation"); // Toggle animation
          rectP.style.backgroundColor = newColor;
        });
      }, 500); // Adjust for desired speed
    }
  
    // Function to handle button clicks
    function animationHandler() {
      // Reset previously active rectangles
      activeRects.forEach((rectP) => rectP.classList.remove("pop-animation"));
  
      let newRects = mode === "row" ? rectPs[step] : rectPs.map((row) => row[step]);
  
      startAnimation(newRects); // Start new animation
  
      // Cycle to the next color
      colorIndex = (colorIndex + 1) % colors.length;
  
      // Move to the next row/column
      step++;
      if (step >= 13) {
        step = 0;
        mode = mode === "row" ? "col" : "row"; // Switch between row & column
      }
    }
  
    // Add event listener to the button
    button.addEventListener("click", animationHandler);
  
    // Call setupAnimation to initialize the grid
    setupAnimation();
  }
  

  
  /**************** ANI B ************************************ */
  /** PUT ALL YOUR CODE FOR ANIMATION B INSIDE  HERE */
  /**************** ANI B ************************************ */
  /**************** TASK *******************************************
   * YOU CAN USE ALL NOTES --- and see my examples in team-h.js for inspiration and possibly help:)
   * 1: use the function window.setInterval() to create a pattern that changes over time
   * i.e. fading out/ in, growing bigger/smaller, appear/disappear, add, remove...
   *  - you can use simple shapes and colors, images etc...
   * 2: add in a / some mouse click event listener(s) somewhere to make the sketch interactive

   *
   * NOTE::: PLEASE::: if you add any custom css PLEASE use the style.css and prefix any class names with your team label
   * i.e. you want to create a custom div class and you are in "Team_A" then call your class TEAM_A_ANI_A_Div -
   * this is so that your styles are not overriden by other teams.
   * NOTE::: All your code is to be added here inside this function -
   * remember you can define other functions inside....
   * Do not change any code above or the HTML markup.
   * **/



  function aniB(parentCanvas) {
    let colorIndex=0;
    console.log("in B"); 
    
        //set background color  of canvas
        parentCanvas.style.backgroundColor = "rgb(222, 218, 218)";

        // add the event 
        parentCanvas.addEventListener("click", clickEventHandlerOnP);

        function clickEventHandlerOnP(event){
          let clickedElement=event.target;
           createB(event.clientX,event.clientY)

        
        function createB(mouseX,mouseY) {

        
        let p = document.createElement("div");
        p.classList.add("TEAM_H_h_circle");
        let shades = [
          "#7fb3d5", 
          "#76d7c4",
          "#f7dc6f",
          "#eb984e",
          "#cb4335",
          "#8e44ad",
          "#2e4053",
          "#e5e7e9",
        ];
        //styling of the new ball
        p.style.width = `30px`;
        p.style.height = `30px`;
        p.style.borderRadius = `10px`;
        p.style.position= "absolute";
        p.style.backgroundColor = shades[colorIndex];
        colorIndex = (colorIndex + 1) % shades.length;
        
        let offsetX= mouseX -
        parentCanvas.getBoundingClientRect().left;
        let offsetY= mouseY -
        parentCanvas.getBoundingClientRect().top;

        p.style.left = offsetX+ "px";
        p.style.top= offsetY+ "px";

        parentCanvas.appendChild(p);
        console.log("added")
      }
  }
    
        }
  
        //window.addEventListener("keydown", windowKeyDownRef);
        //window.addEventListener("keyup", windowKeyUpRef);
      

  /**************** ANI C ************************************ */
  /** PUT ALL YOUR CODE FOR INTERACTIVE PATTERN C INSIDE  HERE */
  /**************** ANI C ************************************ */
 /**************** TASK *******************************************
   * YOU CAN USE ALL NOTES --- and see my examples in team-h.js for inspiration and possibly help:)
   * 1: use the PROVIDED keyup/down callbacks `windowKeyDownRef` and/or `windowKeyUpnRef` to handle keyboard events
   * 2: create an interactive pattern/sketch based on keyboard input. Anything goes.
   * do not use  requestAnimationFrame(), setInterval() nor setTimeout() -> meaning keep it simple ;)
   * 
   * NOTE::: PLEASE::: if you add any custom css PLEASE use the style.css and prefix any class names with your team label
   * i.e. you want to create a custom div class and you are in "Team_A" then call your class TEAM_A_ANI_A_Div -
   * this is so that your styles are not overriden by other teams.
   * NOTE::: All your code is to be added here inside this function -
   * remember you can define other functions inside....
   * Do not change any code above or the HTML markup.
   * **/


  function aniC(parentCanvas) {
    // 1. create new <div> -> called divElement
    let divElement = document.createElement("div");
    // 2. style div
    divElement.style.width = "375px";
    divElement.style.height = "375px";
    divElement.style.backgroundColor = "black";
    // so we can see multiple squares side-by-side
    divElement.style.display = "flex";
    divElement.style.flexWrap = "wrap";

    // 3. append to parent 
    parentCanvas.appendChild(divElement);

    console.log("in C");

    /*** THIS IS THE CALLBACK FOR KEY DOWN ( DO NOT CHANGE THE NAME..) */
    windowKeyDownRef = function (e) {
      console.log("Key down:", e.code);

      // 4. change the big square color when key is pressed
      divElement.style.backgroundColor = "blue";

      // 5. Create smaller squares inside the main div as a pattern
      for (let i = 0; i < 5; i++) {
        let newSquare = document.createElement("div");
        newSquare.style.width = "20px";
        newSquare.style.height = "20px";
        newSquare.style.margin = "2px";
        newSquare.style.backgroundColor = getRandomColor();

        newSquare.style.display = "inline-block";

        divElement.appendChild(newSquare);
      }
    };

    /*** THIS IS THE CALLBACK FOR KEY UP ( DO NOT CHANGE THE NAME..) */
    windowKeyUpRef = function (e) {
      console.log("Key up:", e.code);

      // 6. revert color (or do something else) on key release
      divElement.style.backgroundColor = "black";
    };

    //DO NOT REMOVE
    window.addEventListener("keydown", windowKeyDownRef);
    window.addEventListener("keyup", windowKeyUpRef);

    // Helper function to pick a random color
    function getRandomColor() {
      // array of colors
      const colors = ["red", "blue", "green", "orange", "purple", "yellow", "pink"];
      let randomIndex = Math.floor(Math.random() * colors.length);
      return colors[randomIndex];
    }
  }
}

  //   console.log("in C");
  //   /*** THIS IS THE CALLBACK FOR KEY DOWN ( DO NOT CHANGE THE NAME..) */
  //   windowKeyDownRef = function (e) {
  //     //code for key down in here
  //     console.log(e)
  //     //SAMPLE KEY CHECK (you do not have to use)
  //     if (e.code === "Space") {
  //       console.log("team-space down")
  //     }
  //   };

  //   /*** THIS IS THE CALLBACK FOR KEY UP ( DO NOT CHANGE THE NAME..) */
  //   windowKeyUpRef = function (e) {
  //   //SAMPLE KEY CHECK (you do not have to use)
  //     if (e.code === "Space") {
  //       console.log("space up");
  //       console.log("team-space up")
  //     }

  //   };

  //   //DO NOT REMOVE
  //   window.addEventListener("keydown", windowKeyDownRef);
  //   window.addEventListener("keyup", windowKeyUpRef);

