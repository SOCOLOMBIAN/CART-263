window.onload = function(){
    console.log("move");

// we want to do something when the mouse is over the box :)
let drawBox = document.querySelector("#draw-box-a");
 
//A: add event listener + callback
drawBox.addEventListener("mousemove", moveCallBack);
 
function moveCallBack(e){
    console.log("mouse move");
    // B: note these are the same ... 
    //console.log(this);
    //console.log(e.target);

    //C: get the mouse coords
   //drawBox.innerHTML= `<p> x: ${e.clientX}, y:${e.clientY} </p>`;
   //relative to the WINDOW...

   let rect = this.getBoundingClientRect();
    console.log(rect);

    //DIFFERENCE TO ENSURE COORDS ARE RELATIVE
    let offsetX = e.clientX-rect.x;
    let offsetY = e.clientY-rect.y;
   //drawBox.innerHTML+= `<p> offset_x: ${offsetX}, offset_y:${offsetY} </p>`;

   let p = document.createElement("div");
    p.classList.add("point");
    p.style.left = offsetX+"px";
    p.style.top = offsetY+"px";
    this.appendChild(p);

}

}