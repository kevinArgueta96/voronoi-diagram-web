import type { Point } from './types';

/**
 * Clear the canvas with a background color
 */
export function clearCanvas(
	ctx: CanvasRenderingContext2D,
	width: number,
	height: number,
	backgroundColor: string = '#f8f9fa'
): void {
	ctx.fillStyle = backgroundColor;
	ctx.fillRect(0, 0, width, height);
}

/**
 * Draw all points on the canvas
 */
export function drawPoints(ctx: CanvasRenderingContext2D, points: Point[]): void {
	points.forEach(point => {
		ctx.fillStyle = point.color;
		ctx.beginPath();
		ctx.arc(point.x, point.y, 6, 0, Math.PI * 2);
		ctx.fill();
		ctx.strokeStyle = 'white';
		ctx.lineWidth = 2;
		ctx.stroke();
	});
}

/**
 * Draw boundaries between Voronoi cells (optimized version)
 */
export function drawVoronoiBoundaries(
	ctx: CanvasRenderingContext2D,
	points: Point[],
	width: number,
	height: number,
	getClosestPointFn: (x: number, y: number) => number
): void {
	ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
	ctx.lineWidth = 2;

	// Use a step to reduce the number of pixels checked (makes it faster)
	const step = 2;

	ctx.beginPath();

	for (let y = 0; y < height - step; y += step) {
		for (let x = 0; x < width - step; x += step) {
			const current = getClosestPointFn(x, y);
			const right = getClosestPointFn(x + step, y);
			const bottom = getClosestPointFn(x, y + step);

			// Draw vertical boundary
			if (current !== right) {
				ctx.moveTo(x + step, y);
				ctx.lineTo(x + step, y + step);
			}

			// Draw horizontal boundary
			if (current !== bottom) {
				ctx.moveTo(x, y + step);
				ctx.lineTo(x + step, y + step);
			}
		}
	}

	ctx.stroke();
}
