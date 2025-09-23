export const drawRect = (detections, ctx, canvasWidth) => {
  detections.forEach(prediction => {
    const [x, y, width, height] = prediction.bbox;
    const text = prediction.class;
    const confidence = (prediction.score * 100).toFixed(2); // e.g. 92.45%

    // Flip x-coordinate for mirrored video
    const flippedX = canvasWidth - x - width;

    // Color
    const color = "aqua";
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.font = '18px Arial';
    ctx.lineWidth = 2;

    // Draw rectangle
    ctx.beginPath();
    ctx.rect(flippedX, y, width, height);
    ctx.stroke();

    // Draw text with confidence
    ctx.fillText(`${text} (${confidence}%)`, flippedX, y > 10 ? y - 5 : y + 15);
  });
};
