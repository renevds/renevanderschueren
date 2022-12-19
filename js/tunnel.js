const tunnelParts = 100;
const tunnelDepth = 25;
const partDelta = 1.2;
const framesPerLevel = 14;
const tunnelFrameTime = 50;
const tunnelCanvas = document.getElementById("tunnelCanvas");
const tunnelCtx = tunnelCanvas.getContext("2d");
const part1 = document.getElementById("part1");
const fadeScrollMultiplier = 3;
const fadeMultiplier = 0.15;
const renderCutOff = 0.01;

let tunnelFrame = 0;
let horDelta = -0.5;
let verDelta = -0.5;
let fade = 1;
let render = true;

// Handle canvas resize and initial canvas setup
function resizeCanvas() {
  tunnelCanvas.width = part1.offsetWidth;
  tunnelCanvas.height = part1.offsetHeight;
  tunnelCtx.resetTransform();
  tunnelCtx.translate(tunnelCanvas.width / 2, tunnelCanvas.height / 2);
  tunnelCtx.lineWidth = 1;
}

window.addEventListener("resize", resizeCanvas, false);
resizeCanvas();

// Handle mouse movement
window.addEventListener("mousemove", e => {
  const rect = tunnelCanvas.getBoundingClientRect();
  const x = (e.clientX - rect.left);
  const y = (e.clientY - rect.top);
  horDelta = (x / tunnelCanvas.width) * 2 - 1;
  verDelta = (y / tunnelCanvas.height) * 2 - 1;
});

// Handle touch movement
window.addEventListener("touchmove ", e => {
  console.log("test");
  const rect = tunnelCanvas.getBoundingClientRect();
  const x = (e.clientX - rect.left);
  const y = (e.clientY - rect.top);
  horDelta = (x / tunnelCanvas.width) * 2 - 1;
  verDelta = (y / tunnelCanvas.height) * 2 - 1;

});

// Handle scroll
document.addEventListener("scroll", function (e) {
  const y = -window.scrollY * fadeScrollMultiplier + tunnelCanvas.offsetHeight;
  fade = Math.max(0, y / tunnelCanvas.height);
  render = fade >= renderCutOff;
  let alpha = fade * 256;
  let color = `rgb(${alpha},${alpha},${alpha})`;
  document.getElementById("scroll").style.borderColor = color;
  document.getElementById("scroll_dot").style.backgroundColor = color;
  document.getElementById("part1_scroll").style.color = color;
});

// Functions for drawint the tunnel
function angularToCartesian(r, j) {
  const x1 = r * Math.cos(2 * Math.PI * j / tunnelParts);
  const y1 = r * Math.sin(2 * Math.PI * j / tunnelParts);
  return [x1, y1];
}

function drawTunnel() {
  clearCanvas(tunnelCtx, tunnelCanvas);
  if (render) {
    const cHeight = tunnelCanvas.height;
    const cWidth = tunnelCanvas.width;
    const maxVerDelta = cHeight / 2;
    const maxHorDelta = cWidth / 2;
    const radius = (Math.sqrt((cHeight + maxHorDelta) ** 2 + (cWidth + maxVerDelta) ** 2) / 2) * (partDelta ** ((tunnelFrame % framesPerLevel) / framesPerLevel));

    let inner = [];
    let current = [];

    for (let i = tunnelDepth - 1; i >= 0; i--) {
      for (let j = 0; j < tunnelParts; j++) {
        const r = radius / (partDelta ** i);
        let coords = angularToCartesian(r, j);
        const edgeRad = i - (tunnelFrame % framesPerLevel) / framesPerLevel;
        coords[0] += maxHorDelta * Math.sin(2 * Math.PI * edgeRad / tunnelParts * horDelta);
        coords[1] += maxVerDelta * Math.sin(2 * Math.PI * edgeRad / tunnelParts * verDelta);
        current.push(coords);
      }
      if (i < tunnelDepth - 1) {
        for (let j = 0; j < inner.length; j++) {
          const jn = (j + 1) % inner.length;
          tunnelCtx.beginPath();
          tunnelCtx.moveTo(inner[j][0], inner[j][1]);
          tunnelCtx.lineTo(current[j][0], current[j][1]);
          tunnelCtx.lineTo(current[jn][0], current[jn][1]);
          tunnelCtx.lineTo(inner[jn][0], inner[jn][1]);
          tunnelCtx.closePath();
          tunnelCtx.fillStyle = "black";
          tunnelCtx.fill();
          let alpha = fade * ((tunnelDepth - i) / tunnelDepth) * fadeMultiplier * 256;
          tunnelCtx.strokeStyle = `rgba(${alpha},${alpha},${alpha})`;
          tunnelCtx.stroke();
        }
      }
      inner = current;
      current = [];
    }
  }
  tunnelFrame++;
  sleep(tunnelFrameTime).then(drawTunnel);
}

drawTunnel();
