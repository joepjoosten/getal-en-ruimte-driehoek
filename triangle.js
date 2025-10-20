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

/**
 * Draw a point (dot). Label is drawn separately along the external angle bisector.
 */
function drawPoint(p, label) {
  push();
  fill(0);
  noStroke();
  ellipse(p.x, p.y, 10);
  pop();
}

// Draw vertex label along the external direction of the angle bisector
function drawVertexLabelOnExternalBisector(vertex, other1, other2, label) {
  push();
  fill(0);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(12);

  // Compute internal angle bisector direction
  const v1 = p5.Vector.sub(other1, vertex).normalize();
  const v2 = p5.Vector.sub(other2, vertex).normalize();
  let bis = p5.Vector.add(v1, v2);

  // Handle degenerate case (straight line) by using a perpendicular to v1
  if (bis.mag() < 1e-6) {
    bis = createVector(-v1.y, v1.x);
  } else {
    bis.normalize();
  }

  // External direction: opposite of the internal bisector
  const outward = p5.Vector.mult(bis, -1);
  const offset = 16; // pixels away from vertex
  const pos = p5.Vector.add(vertex, p5.Vector.mult(outward, offset));

  text(label, pos.x, pos.y);
  pop();
}

// Draw all triangle points
function drawTrianglePoints() {
  // Draw points
  drawPoint(pA, "A");
  drawPoint(pB, "B");
  drawPoint(pC, "C");

  // Place labels along the external angle bisectors (outside the triangle)
  drawVertexLabelOnExternalBisector(pA, pB, pC, "A");
  drawVertexLabelOnExternalBisector(pB, pA, pC, "B");
  drawVertexLabelOnExternalBisector(pC, pA, pB, "C");
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
