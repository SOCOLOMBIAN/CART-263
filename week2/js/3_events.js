
window.onload = setup;



function setup(){
    let introSection=document.querySelector("#intro");
    console.log(introSection)

    
    introSection.addEventListener("click", clickCallback);
      
function clickCallback(e){
    console.log(this);
    console.log(e)

    //a:
        this.style.background = `rgba(214, 110, 239, 0.5)`

}

}