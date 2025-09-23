export const drawRect = (detections, ctx, canvasWidth) => {
  detections.forEach(prediction => {
    const [x, y, width, height] = prediction.bbox;
    const text = prediction.class;

    // Flip x-coordinate for mirrored video
    const flippedX = canvasWidth - x - width;

    // Random color
    const color = "aqua";
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.font = '18px Arial';
    ctx.lineWidth = 2;

    // Draw rectangle
    ctx.beginPath();
    ctx.rect(flippedX, y, width, height);
    ctx.stroke();

    // Draw text readable
    ctx.fillText(text, flippedX, y > 10 ? y - 5 : y + 15);
  });
};
