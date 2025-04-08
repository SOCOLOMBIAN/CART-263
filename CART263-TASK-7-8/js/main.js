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
  } catch (error){
    console.error(error.message);

}
}
