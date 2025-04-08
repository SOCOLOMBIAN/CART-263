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

 const irisesWithColors= json.map(item => {
    const addRandomColor= possibleColor[Math.floor(Math.random()* possibleColor.length)];
    return{
        ...item,
        color: addRandomColor
    };
  });
 
 console.log(" colors",irisesWithColors);


// new array and filtered irises 
const filteredIrises = irisesWithColors.filter(
    function (iris) {
        return(iris.sepalWidth >=4);
    }
);
console.log("irises:",filteredIrises);


const sum =irisesWithColors.reduce(
    function(accum,iris)
    {
       return(accum + iris.petalLength)
    },0
);

const averagePetalLength= sum / irisesWithColors.length;

    console.log(sum);
    console.log(averagePetalLength);


const petal= irisesWithColors.find(
    function(iris) {
    return( iris.petalWidth > 1.0)
}
);
console.log(petal);

// some(): Use some() on irisesWithColors
//  to find out if there is an object that has a petalLength >10





} catch (error){
    console.error(error.message);
 }

}
