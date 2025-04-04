window.onload = run;

function run() {
  document.querySelector("#stepOneButton").addEventListener("click", fetchText);
 

/****** PART A:: FETCH */  
async function fetchText() {
  console.log("in fetch");
  //let raw_rainbow_text = "";
  try {
    let response= await fetch("files/rainbow.txt")
    let raw_rainbow_text= await response.text();
    console.log(raw_rainbow_text);
 //(B(i))

 document.querySelector("#stepOneButton").remove();
 //(B(ii)) --> SR SHOW 
 document.querySelector("#inputDiv").style.display = "block";
 //(B(iii)) -->> PUT TEXT
 document.querySelector("#rainbow_text").textContent = raw_rainbow_text;

    document.querySelector("#resetButton").addEventListener("click", resetPoem);
    runPartB(raw_rainbow_text);
  } catch (e) {}
}
}
  
  /****** PART B:: TEXT PROCESSING  */
  function runPartB(originalRainBowText) {
    document
      .querySelector("#produce-poem")
      .addEventListener("click", producePoem);

   /* FILL IN HERE */
    function producePoem() {
      console.log(originalRainBowText)

      //getting the user input 
      const value = document.getElementById("phrase").value;
      console.log(value);
      
      // split for the array 1
      let phrase_as_array= value.split(/[" ".?!\n|]/);
      console.log(phrase_as_array)

      //slipt for the text
      let rainbow_tokens= originalRainBowText.split(/[" ".?!\n|]/);
      console.log(rainbow_tokens)

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

    for (let k= 0; k < rainbow_words.length; k++){
        const rainbow= rainbow_words[k];
        if (rainbow.length > j && rainbow[j] === nextChar ) {
          if (poem_sentence.length >0){
            poem_sentence += " ";
          }
          poem_sentence += rainbow;
          break;

      }
    }
  }
}
console.log(poem_sentence);    
    //to next stage
    runPartD(poem_sentence);  
  }
  
   /****** PART D:: VISUALIZE  */
  function runPartD(new_sentence){

    console.log(new_sentence)

    const outputDiv= document.getElementById("output");

    outputDiv.style.display ="block"

    outputDiv.innerHTML="";

    const fonts= [
      "'Comic Sans MS'", "'Impact'", "'verdana'", "'Palantino'"
    ];

    const colors=[
    "#FF5733", "#33FF57", "#3357FF", "#F333FF", "#FF3333", 
    "#33FFF3", "#FFF333", "#8C33FF", "#FF8C33", "#33FF8C"
    ];

    const getRandom= (min,max) => {
      return Math.floor(Math.random() * (max - min +1)) +min;
    };
    
    [...new_sentence].forEach(char => {
      const letterSpan= document.createElement("span");
      letterSpan.textContent= char;
       
      const randomColor= colors[getRandom(0, colors.length -1)];
      letterSpan.style.color= randomColor;

      const randomFont= fonts[getRandom(0,fonts.length -1)];
      letterSpan.style.fontFamily= randomFont;

      letterSpan.addEventListener("click", function() {
      // make it bigger 
      this.style.transform="scale(1.58)";

      setTimeout(() => {
        this.style.transform= "scale(1)";
      }, 300);
      });

      outputDiv.appendChild(letterSpan);
    });
  }
  

  /****** PART E:: RESET  */
  function resetPoem() {
  /*** TO FILL IN */

  // clear the html output 
  document.getElementById("output").innerHTML="";
 
  // hide the element of the output 
  document.getElementById("output").style.display= "none";

  // clear the value of phrase
  document.getElementById("phrase").value= "";

  //clear values on my vizualisation 
  const letterSpans= document.querySelectorAll("#output span");
  letterSpans.forEach(span => {
    span.style.transform= "scale(1)";
  }); 
  }
 //window onload
