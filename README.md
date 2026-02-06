# 🎨 Voronoi Diagram Generator

An interactive web application to create and visualize Voronoi diagrams with real-time animations, built with **Astro** and **TypeScript**.

![Voronoi Diagram](https://img.shields.io/badge/Astro-5.17-BC52EE?style=for-the-badge&logo=astro&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

## ✨ Features

- **🖱️ Full Interactivity**: Place points with a simple click on the canvas
- **🎬 Progressive Animation**: Watch how Voronoi regions expand from each point
- **⚡ Speed Control**: Adjust animation speed in real-time with an intuitive slider
- **🎲 Random Generation**: Create random patterns with a single click
- **🎨 Vibrant Colors**: Each region has a unique auto-generated color
- **🚀 High Performance**: Optimized algorithms for smooth rendering
- **📱 Responsive**: Adaptable design for different screen sizes

## 🎯 Demo

### Instant Mode
Generates the Voronoi diagram immediately, perfect for quick visualization.

### Animated Mode
Watch the progressive expansion of regions from each point, with full speed control.

## 🛠️ Technologies

- **[Astro](https://astro.build)** - Modern web framework with islands architecture
- **TypeScript** - Static typing for robust and maintainable code
- **HTML5 Canvas API** - High-performance 2D graphics rendering
- **CSS3** - Modern styles with gradients and animations

## 📦 Installation

### Prerequisites

- Node.js 18+
- npm or pnpm

### Steps

```bash
# Clone the repository
git clone https://github.com/your-username/voronoi-diagram-web.git

# Navigate to directory
cd voronoi-diagram-web

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:4321/`

## 🎮 Usage

### Main Controls

1. **Place Points**: Click anywhere on the canvas
2. **Generate Diagram**: Click the "✨ Generate Voronoi" button
3. **Random Points**: Click "🎲 Random Points" (generates 15-35 points)
4. **Clear All**: Click "🗑️ Clear All"

### Animation Configuration

- **🎬 Animated Expansion**: Enable/disable animation mode
- **⚡ Animation Speed**: Slider to control speed (5-50 px/frame)
  - **Slow**: Detailed and smooth animation
  - **Fast**: Quick animation

## 🏗️ Project Architecture

### File Structure

```
src/
├── components/
│   └── VoronoiCanvas.astro          # Main canvas component
├── scripts/
│   ├── voronoi/
│   │   ├── types.ts                 # Type definitions
│   │   ├── math.ts                  # Mathematical functions
│   │   ├── renderer.ts              # Canvas rendering
│   │   └── voronoi-generator.ts     # Voronoi algorithm
│   └── canvas-controller.ts         # Event and state controller
└── pages/
    └── index.astro                   # Main page
```

### Design Principles

#### ✅ Modularity
- Clear separation of concerns
- Each module has a specific function
- Easy to maintain and extend

#### ✅ Islands Architecture (Astro)
- Server-side rendering by default
- JavaScript only where interactivity is needed
- Better performance and SEO

#### ✅ Strict TypeScript
- Complete typing for greater safety
- Better development experience with IntelliSense
- Compile-time error detection

## ⚙️ Main Components

### 1. **Canvas Controller** (`canvas-controller.ts`)
Main class that manages:
- Point state
- Canvas and button events
- Generation modes (instant/animated)
- Speed configuration

### 2. **Voronoi Generator** (`voronoi-generator.ts`)
Generation algorithms:
- `generateVoronoi()`: Instant generation
- `generateVoronoiAnimated()`: Progressive animation generation
- `getClosestPoint()`: Closest point calculation

### 3. **Renderer** (`renderer.ts`)
Drawing functions:
- `clearCanvas()`: Clears the canvas
- `drawPoints()`: Draws the points
- `drawVoronoiBoundaries()`: Draws borders between regions

### 4. **Math Utilities** (`math.ts`)
Mathematical utilities:
- `distance()`: Euclidean distance
- `randomColor()`: HSL color generation
- `hslToRgb()`: Color conversion

## 🚀 Optimizations

### Animation Performance

1. **Incremental Algorithm**
   - Only processes new pixels in each frame
   - Uses `Uint8Array` for fast tracking of colored pixels
   - Reduces complexity from O(n²) to O(n)

2. **Progressive Border Drawing**
   - Draws borders during animation (every 3 frames)
   - Eliminates latency at completion
   - Smoother visual experience

3. **Border Optimization**
   - Uses 4-pixel steps instead of 1 (16x faster)
   - Groups lines into a single path
   - Single `stroke()` call

4. **Efficient Canvas API**
   - Direct use of `ImageData` for pixel manipulation
   - Minimizes drawing operations
   - `requestAnimationFrame` for GPU synchronization

## 📊 Voronoi Algorithm

The Voronoi diagram divides a plane into regions based on distance to a set of points. Each region contains all points in the plane closest to a specific point.

### Implementation

1. **For each pixel on the canvas**:
   - Calculate distance to all points
   - Assign pixel to the nearest point's region

2. **Border Drawing**:
   - Compare nearest points of adjacent pixels
   - Draw line if they are different

3. **Animated Mode**:
   - Gradually expands radius from each point
   - Only colors pixels within current radius
   - Creates "territory conquest" effect

## 🎨 Customization

### Modify Colors

Edit the `randomColor()` function in `src/scripts/voronoi/math.ts`:

```typescript
export function randomColor(): string {
	const hue = Math.random() * 360;
	return `hsl(${hue}, 70%, 60%)`; // Adjust saturation and brightness
}
```

### Adjust Canvas Size

Modify the `VoronoiCanvas.astro` component:

```astro
<canvas id="canvas" width="1000" height="600"></canvas>
```

### Change Animation Speed

Adjust slider limits in `VoronoiCanvas.astro`:

```astro
<input
	type="range"
	id="speedSlider"
	min="5"
	max="50"    <!-- Adjust maximum -->
	value="15"
	step="5"
/>
```

## 🧪 Available Commands

```bash
# Development
npm run dev              # Development server on port 4321

# Production
npm run build            # Build for production
npm run preview          # Preview the build

# Utilities
npx tsc --noEmit        # Verify TypeScript without compiling
```

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a branch for your feature (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Future Improvements

- [ ] Export diagram as PNG/SVG image
- [ ] Edit mode: move/delete individual points
- [ ] Different coloring algorithms
- [ ] Transition animations between states
- [ ] 3D mode with WebGL
- [ ] Predefined pattern presets
- [ ] Undo/Redo actions
- [ ] Share diagrams via URL

## 📄 License

This project is under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

Developed with ❤️ using Astro and TypeScript

---

## 🔗 Useful Links

- [Astro Documentation](https://docs.astro.build)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Canvas API MDN](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [Voronoi Diagram - Wikipedia](https://en.wikipedia.org/wiki/Voronoi_diagram)

---

**⭐ If you like this project, give it a star on GitHub!**
