const parts = 100;
const depth = 30;
const partDelta = 1.2;
const framesPerLevel = 14;
let frame = 0;
const tunnelFrameTime = 33;
const canvas = document.getElementById("tunnelCanvas")
const ctx = canvas.getContext('2d');

function resizeCanvas(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx.resetTransform();
  ctx.translate(canvas.width/2,canvas.height/2);
  drawTunnel();
}
resizeCanvas();

function clearCanvas(){
  ctx.save();

  // Use the identity matrix while clearing the canvas
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Restore the transform
  ctx.restore();
}

function getCoord(r, j){
  const x1 = r*Math.cos(2*Math.PI*j/parts)
  const y1 = r*Math.sin(2*Math.PI*j/parts)
  return [x1, y1]
}

function drawTunnel(){
  clearCanvas();
  const cHeight = canvas.height;
  const cWidth = canvas.width;
  const radius = (Math.sqrt(cHeight**2 + cWidth**2)/2) *(partDelta**((frame%framesPerLevel)/framesPerLevel));

  let inner = [];
  let current = [];

  for (let j = 0; j < parts; j++) {
    const r = radius/(partDelta**(depth - 1));
    inner.push(getCoord(r, j));
  }
  for (let i = depth - 1; i >=0; i--) {
    for (let j = 0; j < parts; j++) {
      const r = radius/(partDelta**i);
      current.push(getCoord(r, j));
    }
    for (let j = 0; j < inner.length; j++) {
      const jn = (j + 1)%inner.length;
      ctx.fillStyle = '#f00';
      ctx.beginPath();
      ctx.moveTo(inner[j][0], inner[j][1]);
      ctx.lineTo(current[j][0],current[j][1]);
      ctx.lineTo(current[jn][0], current[jn][1]);
      ctx.lineTo(inner[jn][0], inner[jn][1]);
      ctx.closePath();
      ctx.fill();
    }
    inner = current;
    current = [];
  }

  frame++;
  sleep(tunnelFrameTime).then(drawTunnel);
}

drawTunnel();

window.addEventListener('resize', resizeCanvas, false);
