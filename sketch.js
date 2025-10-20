// Main sketch file that coordinates all modules
// This file requires the following to be loaded in order:
// 1. utility.js
// 2. triangle.js
// 3. lines.js
// 4. legend.js
// 5. inputs.js
// 6. controls.js

// --- Panning variables ---
let isPanning = false;
let panStartX = 0;
let panStartY = 0;

// --- Setup Function ---
function setup() {
  createCanvas(windowWidth, windowHeight);

  // Center the origin on screen initially
  cameraOffsetX = windowWidth / 2 - originX;
  cameraOffsetY = windowHeight / 2 - originY;

  // Initialize triangle vertices
  initTriangle();
}

// Handle window resize
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// --- Drawing Function ---
function draw() {
  background(220);

  // Draw grid first (in background)
  drawGrid();

  // Draw coordinate system (axes and labels in screen space)
  if (showCoordinates) {
    drawCoordinateSystem();
  }

  // Apply camera transformation for all world-space objects
  push();
  translate(cameraOffsetX, cameraOffsetY);

  // Get current triangle measurements
  const measurements = getTriangleMeasurements();

  // Draw triangle
  drawTriangle();

  // Draw and update points
  drawTrianglePoints();

  // Draw all special lines and circles
  drawSpecialLines();

  // Update and draw edge controls
  const worldMouseX = mouseX - cameraOffsetX;
  const worldMouseY = mouseY - cameraOffsetY;
  updateEdgeHover(worldMouseX, worldMouseY);
  drawEdgeControls(hoveredEdge);

  pop(); // End camera transformation

  // Draw legend (in screen space, after pop)
  drawLegend(
    measurements.angleA,
    measurements.angleB,
    measurements.angleC,
    measurements.lenAB,
    measurements.lenBC,
    measurements.lenCA
  );

  // Update cursor based on hover state
  updateCursor();
}

// --- Interaction Functions ---

function mousePressed() {
  // Check legend clicks first (in screen space)
  if (handleLegendClick()) {
    return; // Legend click was handled
  }

  // Convert mouse position to world space for triangle interaction
  const worldMouseX = mouseX - cameraOffsetX;
  const worldMouseY = mouseY - cameraOffsetY;

  // Check edge control clicks (in world space)
  if (handleControlMousePressed(worldMouseX, worldMouseY)) {
    return; // Control was clicked
  }

  // Check triangle vertex clicks (in world space)
  if (handleTriangleMousePressed(worldMouseX, worldMouseY)) {
    return; // Triangle vertex was clicked
  }

  // Start panning if clicking on empty space
  isPanning = true;
  panStartX = mouseX - cameraOffsetX;
  panStartY = mouseY - cameraOffsetY;
}

function mouseDragged() {
  const worldMouseX = mouseX - cameraOffsetX;
  const worldMouseY = mouseY - cameraOffsetY;

  // Check if dragging a control
  if (handleControlDragged(worldMouseX, worldMouseY)) {
    return; // Control is being dragged
  }

  if (isPanning) {
    // Update camera offset for panning
    cameraOffsetX = mouseX - panStartX;
    cameraOffsetY = mouseY - panStartY;
    cursor('grabbing');
  } else {
    // Dragging a triangle vertex
    handleTriangleMouseDragged();
  }
}

function mouseReleased() {
  handleControlReleased();
  isPanning = false;
  handleTriangleMouseReleased();
}

// Update cursor based on what's under the mouse
function updateCursor() {
  // Check if hovering over legend (legend handles its own cursor)
  if (window.legendItems) {
    for (let item of window.legendItems) {
      if (mouseX >= item.x && mouseX <= item.x + item.width &&
          mouseY >= item.y && mouseY <= item.y + item.height) {
        return; // Legend handles cursor
      }
    }
  }

  // Check if hovering over triangle vertices (in world space)
  const worldMouseX = mouseX - cameraOffsetX;
  const worldMouseY = mouseY - cameraOffsetY;

  // Check if hovering over controls
  if (isHoveringControl()) {
    cursor('pointer');
    return;
  }

  if (dist(worldMouseX, worldMouseY, pA.x, pA.y) < 15 ||
      dist(worldMouseX, worldMouseY, pB.x, pB.y) < 15 ||
      dist(worldMouseX, worldMouseY, pC.x, pC.y) < 15) {
    cursor('move');
    return;
  }

  // Default cursor for panning
  if (isPanning || isControlActive()) {
    cursor('grabbing');
  } else {
    cursor('grab');
  }
}
