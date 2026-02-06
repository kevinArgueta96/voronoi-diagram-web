import type { RGB } from './types';

/**
 * Calculate Euclidean distance between two points
 */
export function distance(x1: number, y1: number, x2: number, y2: number): number {
	return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

/**
 * Generate a random HSL color with good saturation and lightness
 */
export function randomColor(): string {
	const hue = Math.random() * 360;
	return `hsl(${hue}, 70%, 60%)`;
}

/**
 * Convert HSL color string to RGB object
 */
export function hslToRgb(hsl: string): RGB {
	const match = hsl.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
	if (!match) return { r: 0, g: 0, b: 0 };

	const h = parseInt(match[1]) / 360;
	const s = parseInt(match[2]) / 100;
	const l = parseInt(match[3]) / 100;

	let r: number, g: number, b: number;

	if (s === 0) {
		r = g = b = l;
	} else {
		const hue2rgb = (p: number, q: number, t: number): number => {
			if (t < 0) t += 1;
			if (t > 1) t -= 1;
			if (t < 1/6) return p + (q - p) * 6 * t;
			if (t < 1/2) return q;
			if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
			return p;
		};

		const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		const p = 2 * l - q;
		r = hue2rgb(p, q, h + 1/3);
		g = hue2rgb(p, q, h);
		b = hue2rgb(p, q, h - 1/3);
	}

	return {
		r: Math.round(r * 255),
		g: Math.round(g * 255),
		b: Math.round(b * 255)
	};
}
