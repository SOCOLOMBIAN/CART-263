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

} catch (error){
    console.error(error.message)
}

// filter(): Use the filter() on irisesWithColors to output a new array called 
// filteredIrises. The task is to: 
// filter out all objects whose `sepalWidth` >=4















}
