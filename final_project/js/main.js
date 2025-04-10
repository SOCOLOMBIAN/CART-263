window.onload = go;

//start

function go(){

    //audio api context 
    window.addEventListener("click", activateSound);

    function activateSound(){
        let newSound= new SoundObject(audioCtx,100,"sine",5);
    
    }
}
