function clearCanvas(ctx, canvas) {
  ctx.save();

  // Use the identity matrix while clearing the canvas
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Restore the transform
  ctx.restore();
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const clamp = (x, a, b) => Math.max( a, Math.min(x, b) )