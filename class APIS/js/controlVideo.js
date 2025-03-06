window.onload = function () {
    console.log("go");

let canvas = document.getElementById("videoCanvas");
  let context = canvas.getContext("2d");

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
    /*** instead of using the video object we can use the canvas **/
  requestAnimationFrame(run);
  function run() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.save();
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    context.fillStyle = "#FFFFFF";
    context.restore();
    context.fillRect(canvas.width/2+50, canvas.height/2,50,50);
    requestAnimationFrame(run);
  }
  };