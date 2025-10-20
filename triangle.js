// --- Triangle Management ---

let pA, pB, pC; // Vertices of the triangle
let draggingPoint = null; // Stores which point is being dragged

// Initialize triangle vertices
function initTriangle() {
  pA = createVector(snapToGrid(38 * 3), snapToGrid(38 * 2));
  pB = createVector(snapToGrid(38 * 15), snapToGrid(38 * 8));
  pC = createVector(snapToGrid(38 * 3), snapToGrid(38 * 14));
}

// Draw the triangle
function drawTriangle() {
  strokeWeight(2);
  stroke(255); // White
  fill(255, 100); // Semi-transparent white
  triangle(pA.x, pA.y, pB.x, pB.y, pC.x, pC.y);
}

// Draw a point with label and angle
function drawPoint(p, label, angle) {
  fill(0);
  noStroke();
  ellipse(p.x, p.y, 10);
  fill(0); // Text color for label
  text(label, p.x + 8, p.y + 3);

  // Display angle
  const angleText = angle.toFixed(1) + "°"; // Round to 1 decimal place
  fill(0); // Text color for angle
  text(angleText, p.x + 8, p.y + 18); // Display below the label
}

// Draw all triangle points
function drawTrianglePoints(angleA, angleB, angleC) {
  drawPoint(pA, "A", angleA);
  drawPoint(pB, "B", angleB);
  drawPoint(pC, "C", angleC);
}

// Check if mouse is pressed on a triangle vertex
function handleTriangleMousePressed() {
  if (dist(mouseX, mouseY, pA.x, pA.y) < 15) {
    draggingPoint = pA;
    return true;
  } else if (dist(mouseX, mouseY, pB.x, pB.y) < 15) {
    draggingPoint = pB;
    return true;
  } else if (dist(mouseX, mouseY, pC.x, pC.y) < 15) {
    draggingPoint = pC;
    return true;
  }
  return false;
}

// Handle dragging of triangle vertices
function handleTriangleMouseDragged() {
  if (draggingPoint) {
    // Snap to grid while dragging
    draggingPoint.x = snapToGrid(mouseX);
    draggingPoint.y = snapToGrid(mouseY);
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
