window.onload = function () {
 function animate() {}

       console.log("animate");
       let p = document.getElementById("particle");
       p.style.left = parseInt(p.style.left) + 2+ "px";
       p.style.top = parseInt(p.style.top) + 3 + "px";
      window.requestAnimationFrame(animate);
       }
      
 
        window.requestAnimationFrame(animate);
       
        let speedX = 2;
        let speedY =3;
       
        function animate() {
        let p = document.getElementById("particle");
       
        p.style.left = parseInt(p.style.left) + speedX+ "px";
        p.style.top = parseInt(p.style.top) + speedY + "px";
        window.requestAnimationFrame(animate);
        checkBounds(document.getElementById("parent"), p);
       
      }
       
      function checkBounds(parent, p) {
        let bounds = parent.getBoundingClientRect();
       
        if (parseInt(p.style.left) > bounds.right) {
          speedX*=-1;
       
       
        } else if (parseInt(p.style.left) < bounds.left) {
          speedX*=-1;
       
        }
       
        if (parseInt(p.style.top) > bounds.bottom) {
          speedY*=-1;
       
        } else if (parseInt(p.style.top) < bounds.top) {
          speedY*=-1;
       
        }
       }
      
 //window.setInterval(addOtherText, 500);
 //let ref = window.setInterval(addOtherText, 500);
 //let counter =0;
  //function addOtherText() {

     // let sp = document.createElement("span");
     // sp.textContent = " ***-*** ";
     // sp.classList.add("appearInStarText");
     // document.getElementById("parent").appendChild(sp);
     // counter++;
    //if(counter ===10){
    //    clearInterval(ref);
     // }
    //}

    //let gridArray = [];
    //for (let i = 0; i < 24; i++) {
      //for each x - make a column of changing y's
      //let gridCol = [];
      //for (let j = 0; j < 1; j++) {
        //create a grid cell with a div
        //let parent = document.getElementById("parent");
       // let d = document.createElement("div");
       // d.classList.add("grid-cell");
        //parent.appendChild(d);
   
       // d.style.left = (i + 1) * 25 + "px";
        //d.style.top = (j + 1) * 25 + "px";
       // gridCol[j] = d;
     // }
      //put each grid row into the grid array
      //gridArray[i] = gridCol;
    //}
    //console.log(gridArray);

    //the divisor
//let num=2;
 
//for (let i = 0; i < 24; i++) {
  //for (let j = 0; j < 24; i++) {
    //check the j--> y value for color choice (all same ys will have the same color (a row))
   // let d = gridArray[i][j];
   // if (i % num === 0) {
    //  d.style.background = shades[0];
   // } else if (i % num === 1) {
   //   d.style.background = shades[1];
 //   }
 // }
//}

///setInterval(animate_cells_mod_rows,1000);

//for (let i = 0; i < 24; i++) {
   // for (let j = 0; j < 24; j++) {
       // let d = gridArray[i][j]

  //check the j--> y value for color choice (all same ys will have the same color (a row))
       // if (j % num === 0) {
        //  d.style.background = shades[0];
       // } else if (j % num === 1) {
       //   d.style.background = shades[1];
        //} else if (j % num === 2) {
       //   d.style.background = shades[2];
        //} else if (j % num === 3) {
        //  d.style.background = shades[3];
        //} else if (j % num === 4) {
        //  d.style.background = shades[4];
        //} else if (j % num === 5) {
        // d.style.background = shades[5];
        //} else if (j % num === 6) {
         // d.style.background = shades[6];
        //} else if (j % num === 7) {
        //  d.style.background = shades[7];
       // }
     // }
   // }
 
//function animate_cells_mod_rows() {
 //  num+=1;
  // console.log(num);
  //if(num ===9){num=1}
//}

//};


