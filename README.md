# Driehoek P5.js - Interactive Triangle Geometry

[![Deploy static site to GitHub Pages](https://github.com/joepjoosten/getal-en-ruimte-driehoek/actions/workflows/pages.yml/badge.svg)](https://github.com/joepjoosten/getal-en-ruimte-driehoek/actions/workflows/pages.yml)

An interactive p5.js visualization for exploring triangle geometry, including special lines (medians, altitudes, angle bisectors, perpendicular bisectors) and circles (incircle, circumcircle).

Live Demo: https://joepjoosten.github.io/getal-en-ruimte-driehoek/

## Features

- **Interactive Triangle**: Drag vertices to modify the triangle shape
- **Grid Snapping**: Vertices snap to a 1cm grid when dragging
- **Special Lines**: Visualize medians, altitudes, angle bisectors, and perpendicular bisectors (all rendered as dashed infinite lines)
- **Special Circles**: View incircle and circumcircle
- **Interactive Legend**: Click legend items to show/hide geometric elements
- **Input Controls**: Set angles and distances precisely using input fields
  - Angles automatically adjust to sum to 180°
  - Distances in centimeters matching the grid

## File Structure

The project is organized into modular files:

```
├── index.html          # Main HTML file that loads all modules
├── sketch.js           # Main p5.js sketch (coordinates all modules)
├── utility.js          # Common utility functions (geometry, grid, drawing)
├── triangle.js         # Triangle drawing and interaction
├── lines.js            # Special geometric lines and circles
├── legend.js           # Legend UI and click handling
└── inputs.js           # Input field creation and handling
```

### Module Details

**utility.js**
- Grid settings and grid drawing
- Snap-to-grid function
- Dashed line drawing utilities
- Geometric calculation functions (midpoint, line intersection, angle calculation, etc.)

**triangle.js**
- Triangle vertex management
- Triangle and vertex point drawing
- Mouse interaction for dragging vertices
- Triangle measurements calculation

**lines.js**
- Visibility toggle management
- Drawing functions for:
  - Medians (red)
  - Altitudes (green)
  - Angle bisectors (blue)
  - Perpendicular bisectors (purple)
  - Incircle (orange)
  - Circumcircle (cyan)

**legend.js**
- Legend rendering with hover effects
- Click handling for toggling visibility

**inputs.js**
- Input field creation (angles and distances)
- Smart angle calculation (automatically maintains 180° sum)
- Triangle recalculation from inputs
- Input field value synchronization

**sketch.js**
- Main setup and draw loop
- Coordinates all modules
- Handles mouse events

## Usage

### Running Locally

1. Open `index.html` in a web browser
2. Drag triangle vertices to modify the shape
3. Click legend items to show/hide geometric elements
4. Enter values in input fields to set specific angles or distances

### For p5.js Web Editor

To use this in the p5.js web editor:

1. Copy the contents of all `.js` files (except sketch.js) into the editor
2. Copy the contents of `sketch.js` at the end
3. The code will run as a single file

## Controls

- **Mouse Drag**: Click and drag vertices A, B, or C to move them (snaps to grid)
- **Legend**: Click any legend item to toggle visibility
- **Angle Inputs**: Enter an angle in degrees - other angles auto-adjust to sum to 180°
- **Distance Inputs**: Enter distances in cm - triangle recalculates automatically

## Technical Details

- **Grid Size**: 38 pixels ≈ 1cm (based on 96 DPI standard)
- **Canvas Size**: 800x600 pixels
- **Coordinate System**: p5.js default (origin at top-left)
- **Line Style**: All special lines are dashed and extend infinitely across canvas
