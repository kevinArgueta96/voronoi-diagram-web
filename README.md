# 🎨 Voronoi Diagram Generator

Una aplicación web interactiva para crear y visualizar diagramas de Voronoi con animaciones en tiempo real, construida con **Astro** y **TypeScript**.

![Voronoi Diagram](https://img.shields.io/badge/Astro-5.17-BC52EE?style=for-the-badge&logo=astro&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

## ✨ Características

- **🖱️ Interactividad Total**: Coloca puntos con un simple click en el canvas
- **🎬 Animación Progresiva**: Observa cómo las regiones de Voronoi se expanden desde cada punto
- **⚡ Control de Velocidad**: Ajusta la velocidad de animación en tiempo real con un slider intuitivo
- **🎲 Generación Aleatoria**: Crea patrones aleatorios con un solo click
- **🎨 Colores Vibrantes**: Cada región tiene un color único generado automáticamente
- **🚀 Alto Rendimiento**: Algoritmos optimizados para renderizado fluido
- **📱 Responsive**: Diseño adaptable a diferentes tamaños de pantalla

## 🎯 Demo

### Modo Instantáneo
Genera el diagrama de Voronoi de forma inmediata, perfecto para visualización rápida.

### Modo Animado
Observa la expansión progresiva de las regiones desde cada punto, con control total de velocidad.

## 🛠️ Tecnologías

- **[Astro](https://astro.build)** - Framework web moderno con arquitectura de islands
- **TypeScript** - Tipado estático para código robusto y mantenible
- **HTML5 Canvas API** - Renderizado de gráficos 2D de alto rendimiento
- **CSS3** - Estilos modernos con gradientes y animaciones

## 📦 Instalación

### Prerequisitos

- Node.js 18+
- npm o pnpm

### Pasos

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/voronoi-diagram-web.git

# Navegar al directorio
cd voronoi-diagram-web

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:4321/`

## 🎮 Uso

### Controles Principales

1. **Colocar Puntos**: Click en cualquier parte del canvas
2. **Generar Diagrama**: Click en el botón "✨ Generate Voronoi"
3. **Puntos Aleatorios**: Click en "🎲 Random Points" (genera 15-35 puntos)
4. **Limpiar Todo**: Click en "🗑️ Clear All"

### Configuración de Animación

- **🎬 Animated Expansion**: Activa/desactiva el modo de animación
- **⚡ Animation Speed**: Slider para controlar la velocidad (5-50 px/frame)
  - **Slow**: Animación detallada y suave
  - **Fast**: Animación rápida

## 🏗️ Arquitectura del Proyecto

### Estructura de Archivos

```
src/
├── components/
│   └── VoronoiCanvas.astro          # Componente principal del canvas
├── scripts/
│   ├── voronoi/
│   │   ├── types.ts                 # Definiciones de tipos
│   │   ├── math.ts                  # Funciones matemáticas
│   │   ├── renderer.ts              # Renderizado del canvas
│   │   └── voronoi-generator.ts     # Algoritmo de Voronoi
│   └── canvas-controller.ts         # Controlador de eventos y estado
└── pages/
    └── index.astro                   # Página principal
```

### Principios de Diseño

#### ✅ Modularidad
- Separación clara de responsabilidades
- Cada módulo tiene una función específica
- Fácil de mantener y extender

#### ✅ Arquitectura de Islands (Astro)
- Renderizado del lado del servidor por defecto
- JavaScript solo donde se necesita interactividad
- Mejor rendimiento y SEO

#### ✅ TypeScript Estricto
- Tipado completo para mayor seguridad
- Mejor experiencia de desarrollo con IntelliSense
- Detección de errores en tiempo de compilación

## ⚙️ Componentes Principales

### 1. **Canvas Controller** (`canvas-controller.ts`)
Clase principal que gestiona:
- Estado de los puntos
- Eventos del canvas y botones
- Modos de generación (instantáneo/animado)
- Configuración de velocidad

### 2. **Voronoi Generator** (`voronoi-generator.ts`)
Algoritmos de generación:
- `generateVoronoi()`: Generación instantánea
- `generateVoronoiAnimated()`: Generación con animación progresiva
- `getClosestPoint()`: Cálculo del punto más cercano

### 3. **Renderer** (`renderer.ts`)
Funciones de dibujo:
- `clearCanvas()`: Limpia el canvas
- `drawPoints()`: Dibuja los puntos
- `drawVoronoiBoundaries()`: Dibuja bordes entre regiones

### 4. **Math Utilities** (`math.ts`)
Utilidades matemáticas:
- `distance()`: Distancia euclidiana
- `randomColor()`: Generación de colores HSL
- `hslToRgb()`: Conversión de colores

## 🚀 Optimizaciones

### Rendimiento de Animación

1. **Algoritmo Incremental**
   - Solo procesa pixels nuevos en cada frame
   - Usa `Uint8Array` para tracking rápido de pixels coloreados
   - Reduce complejidad de O(n²) a O(n)

2. **Dibujo Progresivo de Bordes**
   - Dibuja bordes durante la animación (cada 3 frames)
   - Elimina latencia al finalizar
   - Experiencia visual más fluida

3. **Optimización de Bordes**
   - Usa pasos de 4 pixels en lugar de 1 (16x más rápido)
   - Agrupa líneas en un solo path
   - Una sola llamada a `stroke()`

4. **Canvas API Eficiente**
   - Uso directo de `ImageData` para manipulación de pixels
   - Minimiza operaciones de dibujo
   - `requestAnimationFrame` para sincronización con GPU

## 📊 Algoritmo de Voronoi

El diagrama de Voronoi divide un plano en regiones basadas en la distancia a un conjunto de puntos. Cada región contiene todos los puntos del plano más cercanos a un punto específico.

### Implementación

1. **Para cada pixel del canvas**:
   - Calcula la distancia a todos los puntos
   - Asigna el pixel a la región del punto más cercano

2. **Dibujo de Bordes**:
   - Compara puntos más cercanos de pixels adyacentes
   - Dibuja línea si son diferentes

3. **Modo Animado**:
   - Expande gradualmente el radio desde cada punto
   - Solo colorea pixels dentro del radio actual
   - Crea efecto de "conquista de territorio"

## 🎨 Personalización

### Modificar Colores

Edita la función `randomColor()` en `src/scripts/voronoi/math.ts`:

```typescript
export function randomColor(): string {
	const hue = Math.random() * 360;
	return `hsl(${hue}, 70%, 60%)`; // Ajusta saturación y brillo
}
```

### Ajustar Tamaño del Canvas

Modifica el componente `VoronoiCanvas.astro`:

```astro
<canvas id="canvas" width="1000" height="600"></canvas>
```

### Cambiar Velocidad de Animación

Ajusta los límites del slider en `VoronoiCanvas.astro`:

```astro
<input
	type="range"
	id="speedSlider"
	min="5"
	max="50"    <!-- Ajusta máximo -->
	value="15"
	step="5"
/>
```

## 🧪 Comandos Disponibles

```bash
# Desarrollo
npm run dev              # Servidor de desarrollo en puerto 4321

# Producción
npm run build            # Build para producción
npm run preview          # Preview del build

# Utilidades
npx tsc --noEmit        # Verificar TypeScript sin compilar
```

## 🤝 Contribución

Las contribuciones son bienvenidas! Por favor:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Mejoras Futuras

- [ ] Exportar diagrama como imagen PNG/SVG
- [ ] Modo de edición: mover/eliminar puntos individuales
- [ ] Diferentes algoritmos de coloración
- [ ] Animaciones de transición entre estados
- [ ] Modo 3D con WebGL
- [ ] Presets de patrones predefinidos
- [ ] Undo/Redo de acciones
- [ ] Compartir diagramas vía URL

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 👨‍💻 Autor

Desarrollado con ❤️ usando Astro y TypeScript

---

## 🔗 Enlaces Útiles

- [Documentación de Astro](https://docs.astro.build)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Canvas API MDN](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [Voronoi Diagram - Wikipedia](https://en.wikipedia.org/wiki/Voronoi_diagram)

---

**⭐ Si te gusta este proyecto, dale una estrella en GitHub!**
