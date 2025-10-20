// --- Grid settings ---
// Assuming standard screen DPI of ~96 pixels per inch
// 1 cm = 1/2.54 inches ≈ 0.3937 inches
// At 96 DPI: 1 cm ≈ 37.8 pixels
const gridSize = 38; // Grid spacing in pixels (approximately 1cm)

// --- Camera/Viewport offset for panning ---
let cameraOffsetX = 0;
let cameraOffsetY = 0;

// --- Helper Functions for Geometric Calculations ---

// Function to snap a value to the nearest grid point
function snapToGrid(value) {
  return Math.round(value / gridSize) * gridSize;
}

// Function to draw the background grid
function drawGrid() {
  stroke(255, 255, 255, 255);
  strokeWeight(0.5);

  // Calculate the starting position based on camera offset
  // Use modulo to ensure we always have a grid line visible on screen
  const startX = (cameraOffsetX % gridSize) - gridSize;
  const startY = (cameraOffsetY % gridSize) - gridSize;

  // Draw vertical lines
  for (let x = startX; x <= width + gridSize; x += gridSize) {
    line(x, 0, x, height);
  }

  // Draw horizontal lines
  for (let y = startY; y <= height + gridSize; y += gridSize) {
    line(0, y, width, y);
  }
}

// Function to draw a dashed line that extends infinitely across the canvas
// Takes two points that define the line direction
function drawInfiniteDashedLine(p1, p2) {
  // Calculate direction vector
  const dir = p5.Vector.sub(p2, p1).normalize();

  // Find intersections with canvas boundaries
  // We'll extend the line far in both directions and let canvas clipping handle it
  const farDistance = width + height; // Large enough to reach any canvas edge
  const start = p5.Vector.sub(p1, p5.Vector.mult(dir, farDistance));
  const end = p5.Vector.add(p1, p5.Vector.mult(dir, farDistance));

  // Draw dashed line
  drawDashedLine(start.x, start.y, end.x, end.y, 5, 5);
}

// Helper function to draw a dashed line
function drawDashedLine(x1, y1, x2, y2, dashLength, gapLength) {
  const totalLength = dist(x1, y1, x2, y2);
  const dashCount = totalLength / (dashLength + gapLength);

  const dx = x2 - x1;
  const dy = y2 - y1;

  for (let i = 0; i < dashCount; i++) {
    const startRatio = i * (dashLength + gapLength) / totalLength;
    const endRatio = (i * (dashLength + gapLength) + dashLength) / totalLength;

    if (startRatio > 1) break;

    const sx = x1 + dx * startRatio;
    const sy = y1 + dy * startRatio;
    const ex = x1 + dx * Math.min(endRatio, 1);
    const ey = y1 + dy * Math.min(endRatio, 1);

    line(sx, sy, ex, ey);
  }
}

// Function to find the midpoint of two points
function getMidpoint(p1, p2) {
  return p5.Vector.add(p1, p2).div(2);
}

// Function to find the intersection of two lines
// Lines are defined by two points: (p1, p2) and (p3, p4)
function lineLineIntersection(p1, p2, p3, p4) {
  const x1 = p1.x,
    y1 = p1.y;
  const x2 = p2.x,
    y2 = p2.y;
  const x3 = p3.x,
    y3 = p3.y;
  const x4 = p4.x,
    y4 = p4.y;

  const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
  if (den === 0) {
    return null; // Lines are parallel or collinear
  }

  const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
  // const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den; // Not needed for intersection point

  const intersectionX = x1 + t * (x2 - x1);
  const intersectionY = y1 + t * (y2 - y1);

  return createVector(intersectionX, intersectionY);
}

// Function to get the distance from a point to a line
// Line is defined by two points: (p1, p2)
function distPointLine(point, p1, p2) {
  const numerator = abs(
    (p2.y - p1.y) * point.x -
      (p2.x - p1.x) * point.y +
      p2.x * p1.y -
      p2.y * p1.x,
  );
  const denominator = dist(p1.x, p1.y, p2.x, p2.y);
  return numerator / denominator;
}

// Function to calculate the angle at a vertex
// Given the vertex itself (pA) and the other two points that form the angle (pB, pC)
function calculateAngle(vertex, p1, p2) {
  const vec1 = p5.Vector.sub(p1, vertex);
  const vec2 = p5.Vector.sub(p2, vertex);
  return abs(p5.Vector.angleBetween(vec1, vec2)); // Returns absolute angle in radians
}

// Function to calculate the area of a triangle given its vertices
function triangleArea(p1, p2, p3) {
  // Using Shoelace formula (or determinant formula)
  return abs(
    (p1.x * (p2.y - p3.y) + p2.x * (p3.y - p1.y) + p3.x * (p1.y - p2.y)) / 2,
  );
}
