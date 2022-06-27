const donutCanvas = document.getElementById("donutCanvas");
donutCanvas.width = donutCanvas.offsetWidth;
donutCanvas.height = donutCanvas.offsetHeight;
const donutCtx = donutCanvas.getContext('2d');
donutCtx.translate(donutCanvas.width / 2, donutCanvas.height / 2);
let torusFrame = 0;
let torusFrameTime = 25;
const framesPerFullYTurn = 100;
let xAngle = Math.PI/2;
const donutScale = 0.6;
const speedLose = 1.003;
let lastSeenAt = null;
const speedPerDistance = 0.002;
const maxSpeed = 25;
const minSpeed = 1;

window.addEventListener('resize', () => {
  donutCanvas.width = donutCanvas.offsetWidth;
  donutCanvas.height = donutCanvas.offsetHeight;
  donutCtx.resetTransform();
  donutCtx.translate(donutCanvas.width / 2, donutCanvas.height / 2);
}, false);

const tubeSteps = 30;
const torusSteps = 30;

function getTorusCoord(omega, theta, r, R) {
  const x = (R + (r * Math.cos(omega))) * Math.cos(theta)
  const y = (R + (r * Math.cos(omega))) * Math.sin(theta)
  const z = r * Math.sin(omega)
  return [x, y, z]
}


function getRing(theta, r, R) {
  const ret = []
  for (let i = 0; i < tubeSteps; i++) {
    ret.push(getTorusCoord(2 * Math.PI * i / tubeSteps, theta, r, R))
  }
  return ret
}

function rotateX(coord, theta){
  const X = coord[0];
  const Y = coord[1]* Math.cos(theta) - coord[2]* Math.sin(theta)
  const Z = coord[1]* Math.sin(theta) + coord[2]* Math.cos(theta);
  return [X, Y, Z]
}

function rotateY(coord, theta){
  const X = coord[0]* Math.cos(theta) + coord[2]* Math.sin(theta);
  const Y = coord[1];
  const Z = coord[2]* Math.cos(theta) - coord[0]* Math.sin(theta);
  return [X, Y, Z]
}

function drawTorus() {
  clearCanvas(donutCtx, donutCanvas);
  const R = donutScale*Math.max(donutCanvas.width, donutCanvas.height)/3;
  const r = R / 2;
  const yAngle = Math.PI*2*(torusFrame % framesPerFullYTurn)/framesPerFullYTurn;
  const rings = [];
  for (let i = 0; i < torusSteps; i++) {
    rings.push(getRing(2 * Math.PI * i / torusSteps, r, R))
  }


  let surfaces = []

  for (let i = 0; i < rings.length; i++) {
    const r1 = rings[i];
    const r2 = rings[(i + 1) % rings.length];
    for (let j = 0; j < r1.length; j++) {
      const p1 = rotateY(rotateX(r1[j], xAngle), yAngle);
      const p2 = rotateY(rotateX(r1[(j + 1) % r1.length], xAngle), yAngle);
      const p3 = rotateY(rotateX(r2[j], xAngle), yAngle);
      const p4 = rotateY(rotateX(r2[(j + 1) % r2.length], xAngle), yAngle);
      surfaces.push([p1, p2, p3, p4]);
    }
  }

  surfaces = surfaces.sort((a, b) => {
    const x = Math.max(...a.map( n => n[2]))
    const y = Math.max(...b.map( n => n[2]))
    if (x < y) {
      return -1;
    }
    if (x > y) {
      return 1;
    }
    return 0;
  })

  for (let i = 0; i < surfaces.length; i++) {
    const surface = surfaces[i]
    donutCtx.strokeStyle = "#0fb";
    donutCtx.fillStyle = '#313131';
    donutCtx.beginPath();
    donutCtx.moveTo(surface[0][0], surface[0][1]);
    donutCtx.lineTo(surface[1][0], surface[1][1]);
    donutCtx.lineTo(surface[3][0], surface[3][1]);
    donutCtx.lineTo(surface[2][0], surface[2][1]);
    donutCtx.closePath();
    donutCtx.fill();
    donutCtx.stroke();
  }
}

function torusFrameRun(){
  drawTorus();
  torusFrame++;
  torusFrameTime *= speedLose;
  torusFrameTime = Math.min(maxSpeed, torusFrameTime)
  sleep(torusFrameTime).then(torusFrameRun);
}

document.addEventListener('scroll', function(e) {
  const y = (window.scrollY - donutCanvas.offsetHeight) + donutCanvas.height/2;
  xAngle = clamp(Math.PI/2*((y/donutCanvas.height)*2 - 1), -Math.PI/2, Math.PI/2);
})

document.getElementById("part2").addEventListener('mousemove', function (e){
  torusFrameTime -= speedPerDistance*Math.abs(lastSeenAt - e.clientX);
  torusFrameTime = Math.max(torusFrameTime, minSpeed);
  lastSeenAt = e.clientX;
})


torusFrameRun();