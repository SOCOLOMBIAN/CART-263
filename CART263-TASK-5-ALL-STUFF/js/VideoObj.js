class VideoObj {
  constructor(x, y, w, h, videoElement, context) {
    this.videoElement = videoElement;
    this.context = context;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.shapeX = 10;
    this.shapeY =10;
    this.shapeCol = "#000000";
    this.newCol= "#b27eef";
 
    // blur button call
    let filterButton_blur = document.getElementById("filter_button_blur");
    let blurInput = document.getElementById("blurnum");
    this.userProvidedBlur  = 0;
   
    // sepia button call
    let filterButton_sepia = document.getElementById("filter_button_sepia");
    let sepiaInput = document.getElementById("sepianum");
    this.userProvidedSepia= 0;

    // hue rotate  button call 
    let filterButton_hue = document.getElementById("filter_button_hue");
    let hueInput = document.getElementById("huenum");
    this.userProvidedHue= 0;

    // invert rotate  button call 
    let filterButton_invert = document.getElementById("filter_button_invert");
    let invertInput = document.getElementById("invertnum");
    this.userProvidedInvert= 0;
    

    let self = this;

    // filters 
    filterButton_blur.addEventListener("click", function () {
      //get value from input field
      self.userProvidedBlur = blurInput.value;
      console.log(self.userProvidedBlur);
    });

    filterButton_sepia.addEventListener("click", function () {
      //get value from input field
      self.userProvidedSepia = sepiaInput.value;
      console.log(self.userProvidedSepia);
    });

    filterButton_hue.addEventListener("click", function () {
      //get value from input field
      self.userProvidedHue = hueInput.value;
      console.log(self.userProvidedHue);
    });

    filterButton_invert.addEventListener("click", function () {
      //get value from input field
      self.userProvidedInvert = invertInput.value;
      console.log(self.userProvidedInvert);
    });

  }

  display() {
    this.context.save();
    //console.log(this.userProvidedHue)
    this.context.filter = `blur(${this.userProvidedBlur}px) sepia(${this.userProvidedSepia*5}%) hue-rotate(${this.userProvidedHue}deg) invert(${this.userProvidedInvert}%) `;
    this.context.drawImage(this.videoElement, this.x, this.y, this.w, this.h);
    this.context.fillStyle = this.shapeCol;
    this.context.fillRect(this.shapeX, this.shapeY, 50,50)
    this.context.restore();
  }

    //called when rectangle color is to be updated
  changeColor(newCol){
   /** FILL IN */
   console.log(newCol)
   this.shapeCol=newCol;

  }
  //called when rectangle Pos is to be updated
  updatePositionRect(mx,my){
     /** FILL IN */
     console.log(mx,my)
     this.shapeX = mx;
     this.shapeY=  my;

  }
  update(videoElement) {
    this.videoElement = videoElement;
  }
}
