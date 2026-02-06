import type { Point, AnimationState } from './types';
import { distance } from './math';
import { hslToRgb } from './math';

/**
 * Get the index of the closest point to given coordinates
 */
export function getClosestPoint(x: number, y: number, points: Point[]): number {
	let minDist = Infinity;
	let closestIndex = -1;

	for (let i = 0; i < points.length; i++) {
		const dist = distance(x, y, points[i].x, points[i].y);
		if (dist < minDist) {
			minDist = dist;
			closestIndex = i;
		}
	}

	return closestIndex;
}

/**
 * Generate Voronoi diagram by coloring each pixel based on nearest point
 */
export function generateVoronoi(
	ctx: CanvasRenderingContext2D,
	points: Point[],
	width: number,
	height: number
): void {
	const imageData = ctx.createImageData(width, height);
	const data = imageData.data;

	// For each pixel, find the closest point and color accordingly
	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			let minDist = Infinity;
			let closestPoint: Point | null = null;

			// Find closest point
			for (const point of points) {
				const dist = distance(x, y, point.x, point.y);
				if (dist < minDist) {
					minDist = dist;
					closestPoint = point;
				}
			}

			// Color the pixel
			if (closestPoint) {
				const pixelIndex = (y * width + x) * 4;
				const rgb = hslToRgb(closestPoint.color);
				data[pixelIndex] = rgb.r;
				data[pixelIndex + 1] = rgb.g;
				data[pixelIndex + 2] = rgb.b;
				data[pixelIndex + 3] = 255;
			}
		}
	}

	ctx.putImageData(imageData, 0, 0);
}

/**
 * Generate Voronoi diagram with animation showing expansion from points
 * Optimized version: only draws new pixels in each frame (incremental)
 */
export function generateVoronoiAnimated(
	ctx: CanvasRenderingContext2D,
	points: Point[],
	width: number,
	height: number,
	onComplete: () => void,
	backgroundColor: string = '#f8f9fa',
	animationSpeed: number = 15
): () => void {
	// Calculate max possible distance (diagonal of canvas)
	const maxDistance = Math.sqrt(width * width + height * height);
	let currentRadius = 0;
	let frameId: number;

	// Clear canvas first
	ctx.fillStyle = backgroundColor;
	ctx.fillRect(0, 0, width, height);

	// Pre-create image data for better performance
	const imageData = ctx.createImageData(width, height);
	const data = imageData.data;

	// Track which pixels have been colored
	const colored = new Uint8Array(width * height);

	let frameCount = 0;
	const boundaryStep = 3; // Draw boundaries every N frames

	const animate = () => {
		const prevRadius = currentRadius;
		currentRadius += animationSpeed;

		// Only process pixels in the ring between prevRadius and currentRadius
		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				const pixelIndex = y * width + x;

				// Skip if already colored
				if (colored[pixelIndex]) continue;

				let closestPoint: Point | null = null;
				let minDist = Infinity;

				// Find the closest point
				for (const point of points) {
					const dist = distance(x, y, point.x, point.y);
					if (dist < minDist) {
						minDist = dist;
						closestPoint = point;
					}
				}

				// Color the pixel if within current radius
				if (closestPoint && minDist <= currentRadius) {
					const dataIndex = pixelIndex * 4;
					const rgb = hslToRgb(closestPoint.color);
					data[dataIndex] = rgb.r;
					data[dataIndex + 1] = rgb.g;
					data[dataIndex + 2] = rgb.b;
					data[dataIndex + 3] = 255;
					colored[pixelIndex] = 1;
				}
			}
		}

		// Put the image data on canvas
		ctx.putImageData(imageData, 0, 0);

		// Draw boundaries progressively (every few frames to reduce overhead)
		frameCount++;
		if (frameCount % boundaryStep === 0) {
			drawPartialBoundaries(ctx, points, width, height, currentRadius);
		}

		// Draw points on top
		points.forEach(point => {
			ctx.fillStyle = point.color;
			ctx.beginPath();
			ctx.arc(point.x, point.y, 6, 0, Math.PI * 2);
			ctx.fill();
			ctx.strokeStyle = 'white';
			ctx.lineWidth = 2;
			ctx.stroke();
		});

		// Continue animation or finish
		if (currentRadius < maxDistance) {
			frameId = requestAnimationFrame(animate);
		} else {
			onComplete();
		}
	};

	// Helper function to draw boundaries within a certain radius
	function drawPartialBoundaries(
		ctx: CanvasRenderingContext2D,
		points: Point[],
		width: number,
		height: number,
		maxRadius: number
	): void {
		ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
		ctx.lineWidth = 1;
		ctx.beginPath();

		const step = 4; // Check every 4 pixels for performance

		for (let y = 0; y < height - step; y += step) {
			for (let x = 0; x < width - step; x += step) {
				const pixelIndex = y * width + x;
				if (!colored[pixelIndex]) continue;

				// Check if this pixel is near a boundary
				const rightIndex = y * width + (x + step);
				if (rightIndex < colored.length && colored[rightIndex] && colored[pixelIndex]) {
					const currentClosest = getClosestPoint(x, y, points);
					const rightClosest = getClosestPoint(x + step, y, points);

					if (currentClosest !== rightClosest) {
						ctx.moveTo(x + step, y);
						ctx.lineTo(x + step, y + step);
					}
				}

				const bottomIndex = (y + step) * width + x;
				if (bottomIndex < colored.length && colored[bottomIndex] && colored[pixelIndex]) {
					const currentClosest = getClosestPoint(x, y, points);
					const bottomClosest = getClosestPoint(x, y + step, points);

					if (currentClosest !== bottomClosest) {
						ctx.moveTo(x, y + step);
						ctx.lineTo(x + step, y + step);
					}
				}
			}
		}

		ctx.stroke();
	}

	// Start animation
	frameId = requestAnimationFrame(animate);

	// Return cancel function
	return () => {
		if (frameId) {
			cancelAnimationFrame(frameId);
		}
	};
}
