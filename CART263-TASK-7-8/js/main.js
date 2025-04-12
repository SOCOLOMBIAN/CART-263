window.onload = async function(){
    console.log("task 7-8");

try{

    // data from the json file
    const response= await fetch('data/iris.json');

    // check the fetch 
    if(!response.ok)
    {
        throw new Error(`Response status: ${response.status}`);  
    }

    const json= await response.json();
    console.log(json);
    
// possible colors 
let possibleColor= ["#5d3fd3","#a73fd3","#d33fb5","#d35d3f","#d3a73f"];

// map the possible colors
 const irisesWithColors= json.map(item => {
    const addRandomColor= possibleColor[Math.floor(Math.random()* possibleColor.length)];
    return{
        ...item,
        color: addRandomColor
    };
  });

  const visualization= new irisVisualization(irisesWithColorsSorted);
  visualization.init();
 
 console.log(" colors",irisesWithColors);


// new array and filtered irises 
const filteredIrises = irisesWithColors.filter(
    function (iris) {
        return(iris.sepalWidth >=4);
    }
);
console.log("irises:",filteredIrises);

// sum and average of the petal length
const sum =irisesWithColors.reduce(
    function(accum,iris)
    {
       return(accum + iris.petalLength)
    },0
);

// average of the petal length
const averagePetalLength= sum / irisesWithColors.length;

    console.log(sum);
    console.log(averagePetalLength);

//  find the petalWidth on the irises
const petal= irisesWithColors.find(
    function(iris) {
    return( iris.petalWidth > 1.0)
}
);
console.log(petal);

// find object in the irises with >10
const theSome = irisesWithColors.some(
    function (iris){
        return( iris.petalLength > 10 );
    }
);
console.log(theSome);

// find object in the irises with == 4.2
const theSome2 = irisesWithColors.some(
    function (iris){
        return( iris.petalLength == 4.2 );
    }
);
console.log(theSome2);


// find the every object <3 
const theEvery = irisesWithColors.every(
    function (iris){
        return(iris.petalWidth < 3);
    });
console.log(theEvery); 

// find the object on the irises >1.2
const theEvery2 = irisesWithColors.every(
    function (iris){
        return(iris.sepalWidth > 1.2);
    });
console.log(theEvery2); 


// toSorted irisesWithColors on petal width smalles to largest 
const irisesWithColorsSorted = irisesWithColors.toSorted((a, b) => a.petalWidth - b.petalWidth);

console.log (irisesWithColorsSorted);

} catch (error){
    console.error(error.message);
 }

}
