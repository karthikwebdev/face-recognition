/* importing libraries as mentioned in documentation */
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(startVideo)

/* function to initialize face recognition */

function startVideo() {
  console.log('started');

  /* setup webcam to the browser */
  Webcam.set({
    width:320,
    height:240,
    image_format: 'png',
    jpeg_quality: 100
 });
/* attach web cam into div tag with video id */
 Webcam.attach( '#video' );

 /* selecting video tag inside div with id 'video' which will be appended by webcam js library */
 let video = document.querySelector('#video video')

 /* recognizing face from video when playing using event listeners */
 video.addEventListener('play', () => {

  /* create canvas to draw rectangles on video, createCanvasFromMedia(video) is a function from faceapi which can take img or video tag*/
  const canvas = faceapi.createCanvasFromMedia(video)

  /* append that canvas to html page */
  document.body.append(canvas)

  /* set dimensions of video to canvas */
  const displaySize = { width: 320, height: 240 }
  faceapi.matchDimensions(canvas, displaySize)

  /* recognizing face for every 100 milliseconds we can change to what interval we want*/
  setInterval(async () => {

    /* detect all faces from video and returns a JSON object with all features of face */
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()

    /* resize the detections according to video size */
    const resizedDetections = faceapi.resizeResults(detections, displaySize)

    /* removing the canvas from before detections  */
    canvas.getContext('2d').clearRect(0, 0, 320, 240)

    /* draw all detections,landmarks,expressions */
    faceapi.draw.drawDetections(canvas, resizedDetections)
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
  }, 100)
})
}

