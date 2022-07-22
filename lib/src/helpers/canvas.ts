export const drawCircle = (
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	radius: number
) => {
	ctx.beginPath();
  ctx.fillStyle = 'black';
	ctx.arc(x, y, radius, 0, 2 * Math.PI);
	ctx.stroke();
};
