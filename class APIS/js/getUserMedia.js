window.onload = getLiveVideo;
 
window.onload = getLiveVideo;
 
async function getLiveVideo() {
  console.log("loaded");
  let video = document.getElementById("video");
  console.log(video.srcObject);
 
  try {
    let stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: 320,
        height: 240,
      },
    });
    video.srcObject = stream;
    console.log(video.srcObject) //here there is something
  } catch (err) {
    /* handle the error */
    console.log("had an error getting the camera");
  }
  requestAnimationFrame(run_pixels);
 function run_pixels() {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(video, 0, 0, canvas.width / 2, canvas.height);
      context.fillStyle = "#FFFFFF";
      context.fillRect(canvas.width / 2 + 50, canvas.height / 2, 50, 50);
      let frame = context.getImageData(0, 0, canvas.width / 2, canvas.height);
      // every pixel has an r,g,b,a value ... and so in the array - every 4 values== 1 pixel
      for (let i = 0; i < frame.data.length; i += 4) {
        let r = frame.data[i];
        let g = frame.data[i + 1];
        let b = frame.data[i + 2];
        let a = frame.data[i + 3];
        frame.data[i] = r;
        frame.data[i + 1] = 0;
        frame.data[i + 2] = 0;
        // make every 8th pixel have an alpha of 0/
        if (i % 32 == 0) {
          frame.data[i + 3] = 0;
        }
      }
      context.putImageData(frame, 0, 0);
      //can draw on top ...
      context.fillRect(0, canvas.height / 2, 50, 50);
 
      requestAnimationFrame(run_pixels);
    }
}