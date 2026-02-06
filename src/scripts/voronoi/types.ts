/**
 * Point interface representing a position on the canvas with associated color
 */
export interface Point {
	x: number;
	y: number;
	color: string;
}

/**
 * RGB color representation
 */
export interface RGB {
	r: number;
	g: number;
	b: number;
}

/**
 * Configuration for the Voronoi canvas
 */
export interface VoronoiConfig {
	width: number;
	height: number;
	backgroundColor: string;
}

/**
 * Animation state for progressive Voronoi generation
 */
export interface AnimationState {
	currentRadius: number;
	maxRadius: number;
	isAnimating: boolean;
	animationFrameId?: number;
}
