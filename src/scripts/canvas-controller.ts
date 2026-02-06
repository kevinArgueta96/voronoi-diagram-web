import type { Point, VoronoiConfig } from './voronoi/types';
import { randomColor } from './voronoi/math';
import { clearCanvas, drawPoints, drawVoronoiBoundaries } from './voronoi/renderer';
import { generateVoronoi, generateVoronoiAnimated, getClosestPoint } from './voronoi/voronoi-generator';

/**
 * Controller class for managing the Voronoi canvas and user interactions
 */
export class VoronoiCanvasController {
	private canvas: HTMLCanvasElement;
	private ctx: CanvasRenderingContext2D;
	private points: Point[] = [];
	private isAnimating: boolean = false;
	private config: VoronoiConfig;
	private pointCountElement: HTMLElement | null = null;
	private animatedMode: boolean = false;
	private cancelAnimation: (() => void) | null = null;
	private animationSpeed: number = 15;

	constructor(canvasId: string, config?: Partial<VoronoiConfig>) {
		this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
		if (!this.canvas) {
			throw new Error(`Canvas with id "${canvasId}" not found`);
		}

		const context = this.canvas.getContext('2d');
		if (!context) {
			throw new Error('Could not get 2D context from canvas');
		}
		this.ctx = context;

		this.config = {
			width: config?.width ?? this.canvas.width,
			height: config?.height ?? this.canvas.height,
			backgroundColor: config?.backgroundColor ?? '#f8f9fa'
		};

		this.initialize();
	}

	/**
	 * Initialize the canvas and clear it
	 */
	private initialize(): void {
		clearCanvas(this.ctx, this.config.width, this.config.height, this.config.backgroundColor);
	}

	/**
	 * Set the point count display element
	 */
	setPointCountElement(element: HTMLElement): void {
		this.pointCountElement = element;
		this.updatePointCount();
	}

	/**
	 * Set animation mode (true for animated expansion, false for instant)
	 */
	setAnimatedMode(animated: boolean): void {
		this.animatedMode = animated;
	}

	/**
	 * Get current animation mode
	 */
	getAnimatedMode(): boolean {
		return this.animatedMode;
	}

	/**
	 * Set animation speed (pixels per frame)
	 */
	setAnimationSpeed(speed: number): void {
		this.animationSpeed = Math.max(1, Math.min(100, speed)); // Clamp between 1-100
	}

	/**
	 * Get current animation speed
	 */
	getAnimationSpeed(): number {
		return this.animationSpeed;
	}

	/**
	 * Update the point count display
	 */
	private updatePointCount(): void {
		if (this.pointCountElement) {
			this.pointCountElement.textContent = `Points: ${this.points.length}`;
		}
	}

	/**
	 * Add a point to the canvas
	 */
	addPoint(x: number, y: number): void {
		if (this.isAnimating) return;

		this.points.push({
			x,
			y,
			color: randomColor()
		});

		this.redraw();
	}

	/**
	 * Handle canvas click event
	 */
	handleCanvasClick(event: MouseEvent): void {
		if (this.isAnimating) return;

		const rect = this.canvas.getBoundingClientRect();
		const scaleX = this.canvas.width / rect.width;
		const scaleY = this.canvas.height / rect.height;
		const x = (event.clientX - rect.left) * scaleX;
		const y = (event.clientY - rect.top) * scaleY;

		this.addPoint(x, y);
	}

	/**
	 * Generate the Voronoi diagram
	 */
	generate(): void {
		if (this.points.length === 0) {
			alert('Please place some points first!');
			return;
		}

		if (this.isAnimating) return;

		this.isAnimating = true;

		if (this.animatedMode) {
			// Generate with animation
			this.cancelAnimation = generateVoronoiAnimated(
				this.ctx,
				this.points,
				this.config.width,
				this.config.height,
				() => {
					// On animation complete, draw boundaries
					drawVoronoiBoundaries(
						this.ctx,
						this.points,
						this.config.width,
						this.config.height,
						(x: number, y: number) => getClosestPoint(x, y, this.points)
					);
					drawPoints(this.ctx, this.points);
					this.isAnimating = false;
					this.cancelAnimation = null;
				},
				this.config.backgroundColor,
				this.animationSpeed
			);
		} else {
			// Generate instantly
			generateVoronoi(this.ctx, this.points, this.config.width, this.config.height);

			// Draw cell boundaries
			drawVoronoiBoundaries(
				this.ctx,
				this.points,
				this.config.width,
				this.config.height,
				(x: number, y: number) => getClosestPoint(x, y, this.points)
			);

			// Draw points on top
			drawPoints(this.ctx, this.points);

			this.isAnimating = false;
		}
	}

	/**
	 * Clear all points and reset canvas
	 */
	clear(): void {
		this.points = [];
		clearCanvas(this.ctx, this.config.width, this.config.height, this.config.backgroundColor);
		this.updatePointCount();
	}

	/**
	 * Generate random points
	 */
	generateRandomPoints(count?: number): void {
		this.points = [];
		const numPoints = count ?? (15 + Math.floor(Math.random() * 20));

		for (let i = 0; i < numPoints; i++) {
			this.points.push({
				x: Math.random() * this.config.width,
				y: Math.random() * this.config.height,
				color: randomColor()
			});
		}

		this.redraw();
	}

	/**
	 * Redraw the canvas with current points
	 */
	private redraw(): void {
		clearCanvas(this.ctx, this.config.width, this.config.height, this.config.backgroundColor);
		drawPoints(this.ctx, this.points);
		this.updatePointCount();
	}

	/**
	 * Get current points
	 */
	getPoints(): Point[] {
		return [...this.points];
	}

	/**
	 * Get canvas dimensions
	 */
	getDimensions(): { width: number; height: number } {
		return {
			width: this.config.width,
			height: this.config.height
		};
	}
}
