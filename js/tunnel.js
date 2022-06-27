const tunnelParts = 100;
const tunnelDepth = 25;
const partDelta = 1.2;
const framesPerLevel = 14;
let tunnelFrame = 0;
const tunnelFrameTime = 50;
const tunnelCanvas = document.getElementById("tunnelCanvas")
const tunnelCtx = tunnelCanvas.getContext('2d');
const part1 = document.getElementById("part1");
let horDelta = -0.5;
let verDelta = -0.5;

function resizeCanvas() {
  tunnelCanvas.width = part1.offsetWidth;
  tunnelCanvas.height = part1.offsetHeight;
  tunnelCtx.resetTransform();
  tunnelCtx.translate(tunnelCanvas.width / 2, tunnelCanvas.height / 2);
}

resizeCanvas();

function getCoord(r, j) {
  const x1 = r * Math.cos(2 * Math.PI * j / tunnelParts)
  const y1 = r * Math.sin(2 * Math.PI * j / tunnelParts)
  return [x1, y1]
}

tunnelCanvas.addEventListener('mousemove', e => {
  const rect = tunnelCanvas.getBoundingClientRect();
  const x = (e.clientX - rect.left);
  const y = (e.clientY - rect.top);
  horDelta = (x/tunnelCanvas.width)*2 - 1;
  verDelta = (y/tunnelCanvas.height)*2 - 1;
})

function drawTunnel() {
  clearCanvas(tunnelCtx, tunnelCanvas);
  const cHeight = tunnelCanvas.height;
  const cWidth = tunnelCanvas.width;
  const maxVerDelta = cHeight/2;
  const maxHorDelta = cWidth/2;
  const radius = (Math.sqrt((cHeight + maxHorDelta) ** 2 + (cWidth + maxVerDelta) ** 2) / 2) * (partDelta ** ((tunnelFrame % framesPerLevel) / framesPerLevel));

  let inner = [];
  let current = [];

  for (let j = 0; j < tunnelParts; j++) {
    const r = radius / (partDelta ** (tunnelDepth - 1));
    inner.push(getCoord(r, j));
  }
  for (let i = tunnelDepth - 1; i >= 0; i--) {
    for (let j = 0; j < tunnelParts; j++) {
      const r = radius / (partDelta ** i);
      let coords = getCoord(r, j);
      const edgeRad = i - (tunnelFrame % framesPerLevel) / framesPerLevel
      coords[0] += maxHorDelta * Math.sin(2 * Math.PI * edgeRad / tunnelParts * horDelta)
      coords[1] += maxVerDelta * Math.sin(2 * Math.PI * edgeRad / tunnelParts * verDelta)
      current.push(coords);
    }
    for (let j = 0; j < inner.length; j++) {
      const jn = (j + 1) % inner.length;
      tunnelCtx.strokeStyle = "#1e1e1e";
      tunnelCtx.fillStyle = i === tunnelDepth - 1 ? "#1e1e1e" : '#313131';
      tunnelCtx.beginPath();
      tunnelCtx.moveTo(inner[j][0], inner[j][1]);
      tunnelCtx.lineTo(current[j][0], current[j][1]);
      tunnelCtx.lineTo(current[jn][0], current[jn][1]);
      tunnelCtx.lineTo(inner[jn][0], inner[jn][1]);
      tunnelCtx.closePath();
      tunnelCtx.fill();
      tunnelCtx.stroke();
    }
    inner = current;
    current = [];
  }

  tunnelFrame++;
  sleep(tunnelFrameTime).then(drawTunnel);
}

drawTunnel();

window.addEventListener('resize', resizeCanvas, false);
