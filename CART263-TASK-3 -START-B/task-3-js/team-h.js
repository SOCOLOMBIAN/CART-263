setup_H();
function setup_H() {
  console.log("in h");
  /**************************************************** */
  //get the buttons
  activateButtons_H(`#TEAM_H`, "ani_canvH");

  /**************************************************** */
  /* NO NEED TO MODIFY THIS FUNCTION :) */
  /*** helper function to activate buttons */
  /**************************************************** */
  function activateButtons_H(team, teamCanvas) {
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
   * i.e. a reoccuring pattern - YOU MUST USE TEXT SOMEHOW (VISUALLY)- i.e. a p tag with a letter inside..
   * 2: create a way to CHANGE the animation somehow whenever a button is clicked ->
   * so: create a custom made button and add a mouse click event listener to change some attribute of the animation
   *
   * NOTE::: PLEASE::: if you add any custom css PLEASE use the style.css and prefix any class names with your team label
   * i.e. you want to create a custom div class and you are in "Team_A" then call your class TEAM_A_ANI_A_Div -
   * this is so that your styles are not overriden by other teams.
   * NOTE::: All your code is to be added here inside this function a -
   * remember you can define other functions inside....
   * Do not change any code above or the HTML markup.
   * **/

  function aniA(parentCanvas) {
    console.log("in H_A");

    // //create a button element
    let button = document.createElement("div");
    button.classList.add("TEAM_H_box");
    button.textContent = "GO";
    parentCanvas.appendChild(button);
    let rectPs = []; //empty array of circles
    let aniSpeed = 1;
    let changingNum = 1;

    //call to setup the animation before running
    setupAnimation();

    function setupAnimation() {
      //offset
      let offset = 40;
      //make a grid of circles - STATIC
      for (let i = 0; i < 13; i++) {
        for (let j = 0; j < 13; j++) {
          let rectP = document.createElement("p");
          rectP.classList.add("TEAM_H_rect");
          rectP.style.width = `20px`;
          rectP.style.height = `20px`;
          if (j % 2 === 0) {
            rectP.textContent = "E";
          } else {
            rectP.textContent = "O";
          }

          rectP.style.left = offset + i * 25 + "px";
          rectP.style.top = offset + j * 25 + "px";
          rectP.style.fontSize = `13px`;
          parentCanvas.appendChild(rectP);
          rectPs.push(rectP);
        }
      }
      aniRef = window.requestAnimationFrame(animate);
    }

    //add event listener to the button
    button.addEventListener("click", animationHandler);

    function animationHandler() {
      this.textContent = "GO";
      console.log("click");

      //reset
      for (let i = 0; i < rectPs.length; i++) {
        rectPs[i].style.width = `20px`;
        rectPs[i].style.height = `20px`;
        rectPs[i].style.fontSize = `13px`;
      }

      //change where h=the ani happens
      if (changingNum < rectPs.length) {
        changingNum += 1;
      } else {
        changingNum = 1;
      }
    }

    function animate() {
      console.log("go");

      //check to change speed
      if (
        parseInt(rectPs[0].style.width) > 28 ||
        parseInt(rectPs[0].style.width) < 1
      ) {
        aniSpeed *= -1;
      }

      //only animate every changing num
      for (let i = 0; i < rectPs.length; i += changingNum) {
        rectPs[i].style.width =
          parseInt(rectPs[i].style.width) + aniSpeed + "px";
        rectPs[i].style.height =
          parseInt(rectPs[i].style.height) + aniSpeed + "px";
        rectPs[i].style.fontSize =
          parseInt(rectPs[i].style.fontSize) + aniSpeed + "px";
      }

      //CONTINUE ANIMATION
      aniRef = window.requestAnimationFrame(animate);
    }
  }
  /****************ANI B ************************************ */
  /** PUT ALL YOUR CODE FOR ANIMATION B INSIDE  HERE */
  /****************ANI B ************************************ */
  /**************** TASK *******************************************
   * YOU CAN USE ALL NOTES --- and see my examples in team-h.js for inspiration and possibly help:)
   * 1: use the function window.setInterval() to create a pattern that changes over time
   * i.e. fading out/ in, growing bigger/smaller, appear/disappear, add, remove...
   *  - AGAIn use MUST use TEXT in the animation.... and a way to use MOD(%)
   * 2: add in some mouse click event listeners somewhere to make the sketch interactive

   *
   * NOTE::: PLEASE::: if you add any custom css PLEASE use the style.css and prefix any class names with your team label
   * i.e. you want to create a custom div class and you are in "Team_A" then call your class TEAM_A_ANI_A_Div -
   * this is so that your styles are not overriden by other teams.
   * NOTE::: All your code is to be added here inside this function a -
   * remember you can define other functions inside....
   * Do not change any code above or the HTML markup.
   * **/

  function aniB(parentCanvas) {
    console.log("in H_B");

    //get the rendered bounding Box of parent and use the width and height
    let boundingBoxParent = parentCanvas.getBoundingClientRect();
    console.log(boundingBoxParent);

    //make a grid of cells
    for (let i = 20; i < boundingBoxParent.width; i += 30) {
      for (let j = 20; j < boundingBoxParent.height; j += 80) {
        //create a div and place in the grid
        let rect = document.createElement("div");
        rect.classList.add("TEAM_H_h_cell");
        parentCanvas.appendChild(rect);
        rect.style.left = `${j + 10}px`;
        rect.style.top = `${i}px`;
        rect.textContent = "test";
        rect.style.width = "40px";
        rect.style.height = "20px";
        rect.style.opacity = 1;

        if (j % 3 === 1) {
          rect.style.background = "orange";
        } else if (j % 3 === 2) {
          rect.style.background = "red";
        }
        rect.setAttribute("isactive", "false");

        //add an event listener to each div...
        rect.addEventListener("click", clickEventHandlerOnRec);
      }
    }

    /****** callback for click on a rect in the grid **********/
    function clickEventHandlerOnRec() {
      //this is the element that was clicked on
      //ensure that this only works for the FIRST MOUSE CLICK
      if (this.getAttribute("isactive") === "false") {
        //add ONE set interval call for each rect when it is clicked
        //the callback will be opacityChange
        let intervalRef = window.setInterval(opacityChange, 50); //for fade out
        let upInterval = null;
        this.setAttribute("isactive", "true");
        //keep track of this... why?
        let self = this;

        //callback function triggered by the setInterval
        function opacityChange() {
          console.log("go");
          self.style.opacity = parseFloat(self.style.opacity) - 0.05;

          //will cancel the setInterval when complete...
          if (parseFloat(self.style.opacity) <= 0) {
            clearInterval(intervalRef);
            //then set ANOTHER to start to fade back in
            upInterval = setInterval(opacityChangeII, 50);
          }
        }

        //callback function triggered by the setInterval
        function opacityChangeII() {
          // console.log("go-new");
          self.style.opacity = parseFloat(self.style.opacity) + 0.05;

          //will cancel the setInterval when complete...
          if (parseFloat(self.style.opacity) >= 1) {
            clearInterval(upInterval);
            //reset
            self.setAttribute("isactive", "false");
          }
        }
      }
    }
  }
  /****************ANI C ************************************ */
  /** PUT ALL YOUR CODE FOR INTERACTIVE PATTERN C INSIDE  HERE */
  /****************ANI C************************************ */
  /**************** TASK *******************************************
   * YOU CAN USE ALL NOTES --- and see my examples in team-h.js for inspiration and possibly help:)
   * 1: use the PROVIDED keyup/down callbacks `windowKeyDownRef` and/or `windowKeyUpnRef` to handle keyboard events
   * 2: create an interactive pattern/sketch based on keyboard input. ANYTHING GOES BUT NO TEXT.
   *
   * DO NOT USE requestAnimationFrame(), setInterval() nor setTimeout() -> meaning keep it simple ;)
   * NOTE::: PLEASE::: if you add any custom css PLEASE use the style.css and prefix any class names with your team label
   * i.e. you want to create a custom div class and you are in "Team_A" then call your class TEAM_A_ANI_A_Div -
   * this is so that your styles are not overriden by other teams.
   * NOTE::: All your code is to be added here inside this function a -
   * remember you can define other functions inside....
   * Do not change any code above or the HTML markup.
   * **/

  /* TASK: make an interactive pattern ..ANYTHING GOES BUT NO TEXT
   * using  ONLY key down and/or keyup -- any keys::
   * NO requestAnimationFrame(), setInterval() nor setTimeout()
   */

  function aniC(parentCanvas) {
    console.log("in H_C");

    let ellipseColor = {
      r: 181,
      g: 213,
      b: 255,
    };

    //set background color  of canvas
    console.log(parentCanvas.getBoundingClientRect());
    // parentCanvas.style.backgroundColor = "rgb(175, 47, 83)";
    let p = document.createElement("div");
    p.classList.add("TEAM_H_h_circle");
    parentCanvas.appendChild(p);
    p.style.width = `10px`;
    p.style.height = `10px`;
    p.style.borderRadius = `10px`;
    p.style.left = parentCanvas.getBoundingClientRect().width / 2 + "px";
    p.style.top = parentCanvas.getBoundingClientRect().height / 2 + "px";
    let speedChange = 10;

    /*** THIS IS THE CALLBACK FOR KEY DOWN (* DO NOT CHANGE THE NAME *..) */
    windowKeyDownRef = function (e) {
      //code for key down in here
      console.log(e);

      if (e.key === "ArrowLeft") {
        if (parseInt(p.style.width) > 10) {
          p.style.width = parseInt(p.style.width) - speedChange + "px";
          p.style.height = parseInt(p.style.height) - speedChange + "px";
          p.style.borderRadius =
            parseInt(p.style.borderRadius) - speedChange / 2 + "px";
        }
      } else if (e.key === "ArrowRight") {
        if (parseInt(p.style.width) < 250) {
          p.style.width = parseInt(p.style.width) + speedChange + "px";
          p.style.height = parseInt(p.style.height) + speedChange + "px";
          p.style.borderRadius =
            parseInt(p.style.borderRadius) + speedChange / 2 + "px";
        }
      }

      //to white
      else if (e.key === "-") {
        if (ellipseColor.r < 255) {
          ellipseColor.r += 5;
        }
        if (ellipseColor.g < 255) {
          ellipseColor.g += 3;
        }

        if (ellipseColor.b < 255) {
          ellipseColor.b += 2;
        }

        p.style.background = `rgb(${ellipseColor.r},${ellipseColor.g},${ellipseColor.b})`;
      }

      //to blue
      else if (e.key === "+") {
        if (ellipseColor.r > 181) {
          ellipseColor.r -= 5;
        }

        if (ellipseColor.g > 213) {
          ellipseColor.g -= 3;
        }

        if (ellipseColor.b < 255) {
          ellipseColor.b -= 2;
        }

        p.style.background = `rgb(${ellipseColor.r},${ellipseColor.g},${ellipseColor.b})`;
      }

      //   //add a new word when we press space
      //   if (e.code === "Space") {
      //     console.log("h-space down");
      //     let newWord = document.createElement("span");
      //     let randomIndex = Math.floor(Math.random() * randomWords.length);

      //     newWord.textContent = randomWords[randomIndex];
      //     newWord.classList.add("TEAM_H_h_word");
      //     parentCanvas.appendChild(newWord);
      //   }
      //   //remove a word when we press backspace
      //   else if (e.code === "Backspace") {
      //     console.log("h-backspace down");
      //     let words = document.querySelectorAll(".TEAM_H_h_word");
      //     if (words.length !== 0) {
      //       words[words.length - 1].remove();
      //     }
      //   }
    };

    /*** THIS IS THE CALLBACK FOR KEY UP (*DO NOT CHANGE THE NAME..) */
    windowKeyUpRef = function (e) {
      //code for key down in here
      if (e.code === "Space") {
        console.log("space up");
        console.log("h-space up");
      }
    };

    //DO NOT REMOVE
    window.addEventListener("keydown", windowKeyDownRef);
    window.addEventListener("keyup", windowKeyUpRef);
  }
}
