const graphicsContainer = document.getElementById("graphics-container");
const pixelSize = 10;
const width = Math.floor(graphicsContainer.offsetWidth / pixelSize);
const height = Math.floor(graphicsContainer.offsetHeight / pixelSize) + 1;

const state = new Array(width).fill(new Array(height).fill(0));

for (let i = 0; i < width; i++) {
  state[i][0] = 2;
}

for (let i = 0; i < width; i++) {
  state[i][height - 1] = 1;
}


console.log(width)
console.log(height)

function printState() {
  let res = ""
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      const nr = state[j][height - 1 - i]
      res += (nr === 1 ? "O" : nr === 2 ? "X" : " ")
    }
    res += '\n';
  }
  graphicsContainer.innerText = res;
}

printState();