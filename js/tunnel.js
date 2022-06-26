const parts = 100;
const depth = 30;
const partDelta = 1.2;
const framesPerLevel = 30;
let frame = 0;
const tunnelFrameTime = 10;
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

function drawCircle(radius, i, j){
  const r = radius/(partDelta**i);
  const x1 = r*Math.cos(2*Math.PI*j/parts)
  const y1 = r*Math.sin(2*Math.PI*j/parts)
  const x2 = r*Math.cos(2*Math.PI*(j + 1)/parts)
  const y2 = r*Math.sin(2*Math.PI*(j + 1)/parts)
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  return [x1, y1]
}

function drawTunnel(){
  clearCanvas();
  const cHeight = canvas.height;
  const cWidth = canvas.width;
  const radius = (Math.sqrt(cHeight**2 + cWidth**2)/2) *(partDelta**((frame%framesPerLevel)/framesPerLevel));
  const outer = [];
  const inner = [];


  for (let j = 0; j < parts; j++) {
    inner.push(drawCircle(radius, depth - 1, j));
  }
  for (let i = depth - 1; i >=0; i--) {
    for (let j = 0; j < parts; j++) {
      drawCircle(radius, i, j);
    }
  }
  for (let j = 0; j < parts; j++) {
    outer.push(drawCircle(radius, 0, j));
  }

  for (let i = 0; i < outer.length; i++) {
    ctx.beginPath();
    ctx.moveTo(outer[i][0], outer[i][1]);
    ctx.lineTo(inner[i][0], inner[i][1]);
    ctx.stroke();
  }
  frame++;
  sleep(tunnelFrameTime).then(drawTunnel);
}

drawTunnel();

window.addEventListener('resize', resizeCanvas, false);
