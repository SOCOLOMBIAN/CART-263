window.onload = run;

function run() {
  document.querySelector("#stepOneButton").addEventListener("click", fetchText);
 

/****** PART A:: FETCH */  
async function fetchText() {
  console.log("in fetch");
  let raw_rainbow_text = "";
  try {
   
    let response= await fetch("files/rainbow.txt")
    let raw_rainbow_text= await response.text();
    console.log(rainbowText);
    //document.querySelector("#resetButton").addEventListener("click", resetPoem);
    runPartB(raw_rainbow_text);
  } catch (e) {}
}
  
  /****** PART B:: TEXT PROCESSING  */
  function runPartB(originalRainBowText) {
    document
      .querySelector("#produce-poem")
      .addEventListener("click", producePoem);

   /* FILL IN HERE */
    function producePoem() {
      //console.log(originalRainBowText)

      //getting the user input 
      const value = document.getElementById("phrase").value;
      console.log(phrase_as_array);
      
      // split for the array 1
      let phrase_as_array= imputUser.split(/["".?!\n|]/);

      //slip for the text

      let rainbow_tokens= originalRainBowText.slipt(/["".?!\n|]/);

      //SR
      runPartC(rainbow_tokens, phrase_as_array);

    }
  }

 /****** PART C:: POEM CREATION  */
  function runPartC(rainbow_words, seed_phrase_array) {
    console.log(rainbow_words);
    console.log(seed_phrase_array);

    // the poem sentence
    let poem_sentence="";
    
    // iteration on the seed_phrase_array
    for (let i= 0; i < seed_phrase_array.length; i++){
       const currentWord= seed_phrase_array[i];// the word from the seed 

    // current word
    for (let j= 0; j < currentWord.length; j++ ){
       const nextChar= currentWord[j];

    for (let k= 0; k < rainbow_words.lenght; k++){
        const rainbow= rainbow_words[k];
    
        if (rainbow.lenght > j && rainbow[j] === nextChar )
        {
          if (poem_sentence.length >0){
            poem_sentence += "";
          }
          poem_sentence += rainbow;
          break

        }
      }
  }
}
    
    //to next stage
    runPartD(poem_sentence);

  
   /****** PART D:: VISUALIZE  */
  function runPartD(new_sentence){

  }

  /****** PART E:: RESET  */
  function resetPoem() {
  /*** TO FILL IN */
  
  }
 //window onload
}
}