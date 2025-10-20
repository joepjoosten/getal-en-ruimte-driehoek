// --- Grid settings ---
// Assuming standard screen DPI of ~96 pixels per inch
// 1 cm = 1/2.54 inches ≈ 0.3937 inches
// At 96 DPI: 1 cm ≈ 37.8 pixels
const gridSize = 38; // Grid spacing in pixels (approximately 1cm)

// --- Camera/Viewport offset for panning ---
let cameraOffsetX = 0;
let cameraOffsetY = 0;

// --- Origin position in world space ---
// Position origin slightly left of center
const originX = -gridSize * 2;
const originY = 0;

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

// Function to draw the coordinate system (axes, origin, and labels)
function drawCoordinateSystem() {
  // Screen position of origin
  const screenOriginX = originX + cameraOffsetX;
  const screenOriginY = originY + cameraOffsetY;

  // Draw axes in dark gray
  stroke(80, 80, 80);
  strokeWeight(2);

  // X-axis (horizontal)
  line(0, screenOriginY, width, screenOriginY);

  // Y-axis (vertical)
  line(screenOriginX, 0, screenOriginX, height);

  // Draw origin circle
  fill(80, 80, 80);
  noStroke();
  ellipse(screenOriginX, screenOriginY, 8, 8);

  // Draw tick labels
  fill(80, 80, 80);
  noStroke();
  textSize(10);
  textAlign(CENTER, TOP);

  // Calculate which grid lines are visible
  const startX = Math.floor((0 - cameraOffsetX) / gridSize) * gridSize;
  const startY = Math.floor((0 - cameraOffsetY) / gridSize) * gridSize;

  // X-axis labels (every grid tick)
  for (let x = startX; x <= startX + width; x += gridSize) {
    const screenX = x + cameraOffsetX;
    if (screenX >= 0 && screenX <= width) {
      // Calculate coordinate value relative to origin
      const coordValue = Math.round((x - originX) / gridSize);
      if (coordValue !== 0) { // Skip zero, we'll draw it at origin
        // Position label below x-axis
        const labelY = screenOriginY < height - 15 ? screenOriginY + 5 : screenOriginY - 15;
        text(coordValue, screenX, labelY);
      }
    }
  }

  // Y-axis labels (every grid tick)
  textAlign(RIGHT, CENTER);
  for (let y = startY; y <= startY + height; y += gridSize) {
    const screenY = y + cameraOffsetY;
    if (screenY >= 0 && screenY <= height) {
      // Calculate coordinate value relative to origin (negative y goes up)
      const coordValue = -Math.round((y - originY) / gridSize);
      if (coordValue !== 0) { // Skip zero
        // Position label to left of y-axis
        const labelX = screenOriginX > 20 ? screenOriginX - 5 : screenOriginX + 20;
        text(coordValue, labelX, screenY);
      }
    }
  }

  // Draw "0" at origin
  textAlign(RIGHT, TOP);
  const zeroX = screenOriginX > 15 ? screenOriginX - 5 : screenOriginX + 15;
  const zeroY = screenOriginY < height - 15 ? screenOriginY + 5 : screenOriginY - 15;
  text("0", zeroX, zeroY);

  // Reset text alignment
  textAlign(LEFT, BASELINE);
}

// Function to draw a solid line that extends infinitely across the canvas
// Takes two points that define the line direction
function drawInfiniteLine(p1, p2) {
  // Calculate direction vector
  const dir = p5.Vector.sub(p2, p1).normalize();

  // Find intersections with canvas boundaries
  // We'll extend the line far in both directions and let canvas clipping handle it
  const farDistance = width + height; // Large enough to reach any canvas edge
  const start = p5.Vector.sub(p1, p5.Vector.mult(dir, farDistance));
  const end = p5.Vector.add(p1, p5.Vector.mult(dir, farDistance));

  // Draw solid line
  line(start.x, start.y, end.x, end.y);
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
