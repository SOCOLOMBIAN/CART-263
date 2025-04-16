class IrisVisualization {
    constructor(irisData){
    this.irisData = irisData;
    this.irises = [];
    this.canvas = null;
    this.ctx = null;
    this.canvasWidth = 0;
    this.canvasHeight = 0;
    this.mouseX = 0;
    this.mouseY = 0;
    }
    
init() {
    // Create canvas element
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = this.canvasWidth;
    this.canvas.height = this.canvasHeight;

    this.createIrises();

    this.setupEventListeners();

    this.aniamte();

    this.positionBySpecies();
}

//create irises with the data 
createIrises() {
    this.irises = this.irisData.map((data, index) => {
      return new Iris(data, index, this.canvas, this.canvasWidth, this.canvasHeight);
    });
  }

  setupEventListeners() {
    this.canvas.addEventListener('mousemove', (event) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouseX = event.clientX - rect.left;
      this.mouseY = event.clientY - rect.top;
      
      // Check for hover
      for (const iris of this.irises) {
        iris.isHovered = iris.containsPoint(this.mouseX, this.mouseY);
      }
    });
    
    this.canvas.addEventListener('click', () => {
      for (const iris of this.irises) {
        if (iris.containsPoint(this.mouseX, this.mouseY)) {
          iris.isSelected = !iris.isSelected;
        } else {
          iris.isSelected = false;
        }
      }
    });
  }

  positionBySpecies(){
    const species = [...new Set(this.irisData.map(iris => iris.species))];

    for (const iris of this.irises) {
        let targetX, targetY;

        if (iris.species === 'setosa') {
            targetX = this.canvasWidth * 0.25;
            targetY = this.canvasHeight * 0.5;
          } else if (iris.species === 'versicolor') {
            targetX = this.canvasWidth * 0.5;
            targetY = this.canvasHeight * 0.5;
          } else if (iris.species === 'virginica') {
            targetX = this.canvasWidth * 0.75;
            targetY = this.canvasHeight * 0.5;
          } 
          
    targetX += (Math.random() - 0.5) * 150;
    targetY += (Math.random() - 0.5) * 150;
      
      iris.moveTowards(targetX, targetY);
    }
  }
  
  animate (){
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

    for (const iris of this.irises) {
        iris.update();
        iris.draw();
      }

      requestAnimationFrame(() => this.animate());
    }
  }



