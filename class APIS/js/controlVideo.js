window.onload = function () {
    console.log("go");
    let video = document.getElementById("video");
    let playButton = document.getElementById("play");
    let pauseButton = document.getElementById("pause");
   
    playButton.addEventListener("click", function () {
      video.play();
    });
   
    pauseButton.addEventListener("click", function () {
      video.pause();
    });
   
    //set video.loop to true by default... BUT could be a button :)
   
    video.loop = true;
  };