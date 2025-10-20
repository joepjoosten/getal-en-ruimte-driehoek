// --- Triangle Management ---

let pA, pB, pC; // Vertices of the triangle
let draggingPoint = null; // Stores which point is being dragged

// Initialize triangle vertices
function initTriangle() {
  // Coordinates relative to origin: A(-4,5), B(4,1), C(-4,-3)
  // Convert from coordinate system to world space:
  // worldX = originX + coordX * gridSize
  // worldY = originY - coordY * gridSize (negative because Y is inverted in screen space)
  pA = createVector(originX + (-4 * gridSize), originY - (5 * gridSize));
  pB = createVector(originX + (4 * gridSize), originY - (1 * gridSize));
  pC = createVector(originX + (-4 * gridSize), originY - (-3 * gridSize));
}

// Draw the triangle
function drawTriangle() {
  if (showTriangle) {
    strokeWeight(2);
    stroke(255); // White
    fill(255, 100); // Semi-transparent white
    triangle(pA.x, pA.y, pB.x, pB.y, pC.x, pC.y);
  }
}

// Draw a point with label
function drawPoint(p, label) {
  fill(0);
  noStroke();
  ellipse(p.x, p.y, 10);
  fill(0); // Text color for label
  text(label, p.x + 8, p.y + 3);
}

// Draw all triangle points
function drawTrianglePoints() {
  drawPoint(pA, "A");
  drawPoint(pB, "B");
  drawPoint(pC, "C");
}

// Check if mouse is pressed on a triangle vertex
// worldMouseX and worldMouseY are in world space coordinates
function handleTriangleMousePressed(worldMouseX, worldMouseY) {
  if (dist(worldMouseX, worldMouseY, pA.x, pA.y) < 15) {
    draggingPoint = pA;
    return true;
  } else if (dist(worldMouseX, worldMouseY, pB.x, pB.y) < 15) {
    draggingPoint = pB;
    return true;
  } else if (dist(worldMouseX, worldMouseY, pC.x, pC.y) < 15) {
    draggingPoint = pC;
    return true;
  }
  return false;
}

// Handle dragging of triangle vertices
function handleTriangleMouseDragged() {
  if (draggingPoint) {
    // Convert mouse position to world space and snap to grid
    const worldMouseX = mouseX - cameraOffsetX;
    const worldMouseY = mouseY - cameraOffsetY;
    draggingPoint.x = snapToGrid(worldMouseX);
    draggingPoint.y = snapToGrid(worldMouseY);
  }
}

// Release dragging point
function handleTriangleMouseReleased() {
  draggingPoint = null;
}

// Get current triangle measurements
function getTriangleMeasurements() {
  const angleA = degrees(calculateAngle(pA, pB, pC));
  const angleB = degrees(calculateAngle(pB, pC, pA));
  const angleC = degrees(calculateAngle(pC, pA, pB));

  const lenAB = dist(pA.x, pA.y, pB.x, pB.y);
  const lenBC = dist(pB.x, pB.y, pC.x, pC.y);
  const lenCA = dist(pC.x, pC.y, pA.x, pA.y);

  return {
    angleA,
    angleB,
    angleC,
    lenAB,
    lenBC,
    lenCA
  };
}
