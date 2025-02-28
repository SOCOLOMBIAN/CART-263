class Flower_E {

    constructor(x,y,size,stemLength,petalColor) {
    // position and size information 
    this.x = x;
    this.y = y;
    this.size = size;
    this.stemLength = stemLength;

    this.stemThickness = 5;
    this.petalThickness = 4;
    this.numPetals = 8; // Number of petals around the center

    //DOM elements 

    this.flowerStemDiv = document.createElement("div");
    this.flowerCenterDiv = document.createElement("div");
    this.flowerContainer = document.createElement("div");
    this.petals = []; // Will hold all petal elements

    this.stemColor={
        r: 50,
        g: 150,
        b: 50,
      };

      this.petalColor= petalColor;

      this.centreColor ={

        r: 255,
        g: 215,
        b: 0,
      };

      let self= this;

      this.flowerContainer.addEventListener("click", changeColor);
      function changeColor(e) {

       // generate a random color 
        self.petalColor = {
            r: Math.floor(Math.random() * 256),
            g: Math.floor(Math.random() * 256),
            b: Math.floor(Math.random() * 256)
          }; 
          
          //update color of the petals 

          for (let petal of self.petals) {
            petal.style.backgroundColor = `rgb(${self.petalColor.r},${self.petalColor.g},${self.petalColor.b})`;
          }
        }    
      }

      renderFlower_E() {
        // Create container for the entire flower
        this.flowerContainer.classList.add("Flower_E-container");
        this.flowerContainer.style.position = "absolute";
        this.flowerContainer.style.width = this.size + "px";
        this.flowerContainer.style.height = this.size + "px";
        this.flowerContainer.style.left = (this.x - this.size/2) + "px";
        this.flowerContainer.style.top = (this.y - this.stemLength - this.size/2) + "px";
        this.flowerContainer.style.cursor = "pointer";

        //the style of the stem 

        this.flowerStemDiv.classList.add("Flower_E-stem");
        this.flowerStemDiv.style.position = "absolute";
        this.flowerStemDiv.style.width = this.stemThickness + "px";
        this.flowerStemDiv.style.height = this.stemLength + "px";
        this.flowerStemDiv.style.background = `rgb(${this.stemColor.r},${this.stemColor.g},${this.stemColor.b})`;
        this.flowerStemDiv.style.left = this.x + "px";
        this.flowerStemDiv.style.top = this.y - this.stemLength + "px";
        this.flowerStemDiv.style.zIndex = "1";
        
        // add stem to the DOM
        document.getElementsByClassName("grass")[0].appendChild(this.flowerStemDiv);
        
        this.flowerCenterDiv.classList.add("Flower_E-stem");
        this.flowerCenterDiv.style.position = "absolute";
        this.flowerCenterDiv.style.width = (this.size * 0.3) + "px";
        this.flowerCenterDiv.style.height = (this.size * 0.3) + "px";
        this.flowerCenterDiv.style.borderRadius = "50%";
        this.flowerCenterDiv.style.background = `rgb(${this.centreColor.r},${this.centreColor.g},${this.centreColor.b})`;
        this.flowerCenterDiv.style.left = "50%";
        this.flowerCenterDiv.style.top = "50%";
        this.flowerCenterDiv.style.transform = "translate(-50%, -50%)";
        this.flowerCenterDiv.style.zIndex = "3";
        
        // add stem to the DOM
        this.flowerContainer.appendChild(this.flowerCenterDiv);

        //position the petals in a cirlc e
        for (let i = 0; i < this.numPetals; i++) {
            const petal = document.createElement("div");
            petal.classList.add("Flower_E-petal");
            
            //petals 
            petal.style.position = "absolute";
            petal.style.width = (this.size * 0.4) + "px";
            petal.style.height = (this.size * 0.2) + "px";
            petal.style.backgroundColor = `rgb(${this.petalColor.r},${this.petalColor.g},${this.petalColor.b})`;
            petal.style.borderRadius = "50%";
            petal.style.zIndex = "2";

                   // Position petals in a circle
      const angle = (i * Math.PI / 4); // 8 petals evenly distributed
      const distance = this.size * 0.35;
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;
      
      petal.style.left = "50%";
      petal.style.top = "50%";
      petal.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${angle + Math.PI/2}rad)`;
      
      this.petals.push(petal);
      this.flowerContainer.appendChild(petal);
    }

    document.getElementsByClassName("grass")[0].appendChild(this.flowerContainer);
    
    return this.flowerContainer;
  }


  }
