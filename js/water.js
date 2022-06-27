const waterGraphicsContainer = document.getElementById("water-graphics-container");
const waterWidth = 100;
const waterHeight = 60;
const waterFrameTime = 50;
const frameSecondFraction = waterFrameTime / 1000;
const gravityPerFrame = 9.81 * frameSecondFraction / 10;
const meterPerRow = 0.5;
const obstacleVerticalTransferFactor = 0.5;
const waterVerticalTransferFactor = 0.5;
const pushGiveFactor = 0.2;
const pushKeepFactor = 0.3;
const horFrictionFactor = 0.5;
const waterTressHold = 0.01;

const waterState = [];
const xSpeed = [];
const ySpeed = [];
const toRun = [];
for (let i = 0; i < waterWidth; i++) {
  waterState.push(new Array(waterHeight).fill(0));
  xSpeed.push(new Array(waterHeight).fill(0));
  ySpeed.push(new Array(waterHeight).fill(0));
  toRun.push(new Array(waterHeight).fill(false));
}

function draw(x, y, w, h, type) {
  for (let i = 0; i < w; i++) {
    for (let j = 0; j < h; j++) {
      if (x + i >= 0 && x + i < waterWidth && y + j >= 0 && y + j < waterHeight)
        waterState[x + i][y + j] = type;
    }
  }
}

function drawRandomPlatform() {
  draw(Math.round(Math.random() * (waterWidth - 10)), Math.round(Math.random() * waterHeight / 2 + 20), Math.round(Math.random() * 30), 1, 2); // floor
}

function isFree(x, y) {
  return x >= 0 && x < waterWidth && y >= 0 && y < waterHeight && waterState[x][y] === 0;
}

function randomSign() {
  return Math.random() < 0.5 ? -1 : 1;
}

function sim() {
  for (let i = 0; i < waterWidth; i++) {
    for (let j = 0; j < waterHeight; j++) {
      toRun[i][j] = (waterState[i][j] === 1)
    }
  }

  for (let i = 0; i < waterHeight; i++) { // Loop bottom right to top
    for (let j = 0; j < waterWidth; j++) {
      if (toRun[j][i]) { // if water

        if (isFree(j, i - 1) || true) {
          ySpeed[j][i] += gravityPerFrame;// Add gravity
        }

        const ySteps = ySpeed[j][i] * frameSecondFraction / meterPerRow; // Steps to move

        let newI = i;
        for (let k = 0; k < ySteps; k++) {
          const step = i - k;
          if (isFree(j, step - 1)) { // Can we fall
            waterState[j][step] = 0;
            waterState[j][step - 1] = 1;
            xSpeed[j][step - 1] = xSpeed[j][step];
            ySpeed[j][step - 1] = ySpeed[j][step];
            xSpeed[j][step] = 0;
            ySpeed[j][step] = 0;
            newI--;
          } else {
            let sgn = Math.sign(xSpeed[j][step])
            if (Math.abs(xSpeed[j][step]) <= waterTressHold) {
              sgn = randomSign();
            }
            if (step - 1 >= 0 && waterState[j][step - 1] === 1) {
              ySpeed[j][step - 1] += Math.sign(ySpeed[j][step - 1]) * Math.abs(waterVerticalTransferFactor * ySpeed[j][step]);
            }
            xSpeed[j][step] += ySpeed[j][step] * obstacleVerticalTransferFactor * sgn;
            ySpeed[j][step] = 0;
            break;
          }
        }

        const xSteps = Math.abs(xSpeed[j][newI] * frameSecondFraction / meterPerRow);
        const sgn = Math.sign(xSpeed[j][newI])
        let newJ = j;
        for (let k = 0; k < xSteps; k++) {
          const step = j + sgn * k;
          if (isFree(step + sgn, newI)) { // Can we fall
            waterState[step][newI] = 0;
            waterState[step + sgn][newI] = 1;
            xSpeed[step + sgn][newI] = xSpeed[step][newI];
            ySpeed[step + sgn][newI] = ySpeed[step][newI];
            xSpeed[step][newI] = 0;
            ySpeed[step][newI] = 0;
            newJ += sgn;
          } else {
            const pos = step + sgn
            if (pos >= 0 && pos < waterWidth) {
              if (waterState[pos][newI] === 1) {
                xSpeed[pos][newI] += pushGiveFactor * xSpeed[step][newI]; // Bounc off of other water
                xSpeed[step][newI] = -pushKeepFactor * xSpeed[step][newI];
              } else if (waterState[pos][newI] === 2) {
                xSpeed[step][newI] = -pushKeepFactor; // Bounce off of obstacle
              }
            } else if (pos === -1 || pos === waterWidth) {
              xSpeed[step][newI] *= -pushKeepFactor; // Bounce off walls
            }
          }
        }
        xSpeed[newJ][newI] *= horFrictionFactor;
        if (Math.abs(xSpeed[newJ][newI]) < waterTressHold) {
          xSpeed[newJ][newI] = 0;
        }
      }
    }
  }
}

function printState() {
  let res = ""
  for (let i = 0; i < waterHeight; i++) {
    for (let j = 0; j < waterWidth; j++) {
      const nr = waterState[j][waterHeight - 1 - i]
      res += (nr === 1 ? "<span style='color: #e31b6d'>O</span>" : nr === 2 ? "X" : "&nbsp;")
    }
    res += '<br>';
  }
  waterGraphicsContainer.innerHTML = res;
}


//draw(0, 0, width, 1, 2); // floor
for (let i = 0; i < 8; i++) {
  drawRandomPlatform();
}

//draw(0, height - 5, width, 4, 1);
draw(30, waterHeight - 6, 50, 5, 1);
draw(0, 1, waterWidth, 1, 2);

function runWaterFrame() {
  draw(0, 0, waterWidth, 1, 0);
  sim();
  printState();
}

runWaterFrame();
//setInterval(frame, frameTime);