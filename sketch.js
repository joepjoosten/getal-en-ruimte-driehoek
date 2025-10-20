// Main sketch file that coordinates all modules
// This file requires the following to be loaded in order:
// 1. utility.js
// 2. triangle.js
// 3. lines.js
// 4. legend.js
// 5. inputs.js

// --- Setup Function ---
function setup() {
  createCanvas(windowWidth, windowHeight);

  // Initialize triangle vertices
  initTriangle();

  // Create input fields
  createInputFields();
}

// Handle window resize
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  repositionInputFields();
}

// --- Drawing Function ---
function draw() {
  background(220);

  // Draw grid first (in background)
  drawGrid();

  // Get current triangle measurements
  const measurements = getTriangleMeasurements();

  // Update input fields with current values
  updateInputFieldValues(
    measurements.angleA,
    measurements.angleB,
    measurements.angleC,
    measurements.lenAB,
    measurements.lenBC,
    measurements.lenCA
  );

  // Draw legend (before triangle to ensure proper layering)
  drawLegend();

  // Draw triangle
  drawTriangle();

  // Draw and update points with angles
  drawTrianglePoints(
    measurements.angleA,
    measurements.angleB,
    measurements.angleC
  );

  // Draw all special lines and circles
  drawSpecialLines();
}

// --- Interaction Functions ---

function mousePressed() {
  // Check legend clicks first
  if (handleLegendClick()) {
    return; // Legend click was handled
  }

  // Check triangle vertex clicks
  handleTriangleMousePressed();
}

function mouseDragged() {
  handleTriangleMouseDragged();
}

function mouseReleased() {
  handleTriangleMouseReleased();
}
