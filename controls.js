// --- Edge controls for rotating and extending triangle sides ---

// Control state
let hoveredEdge = null; // Which edge is being hovered: 'AB', 'BC', 'CA', or null
let activeControl = null; // Which control is being dragged: {edge: 'AB', type: 'angle'/'length', endpoint: 'A'/'B'}
let controlStartMouseAngle = 0; // Starting mouse angle for rotation
let controlStartAngle = 0; // Starting angle of the edge
let controlStartLength = 0; // Starting length of the edge
let controlStartPos = null; // Starting position for length adjustment
let controlSnappedStartAngle = 0; // Snapped starting angle for rotation
let controlSnappedStartLength = 0; // Snapped starting length

const CONTROL_SPACING = 30; // Spacing between controls along the line
const CONTROL_GAP_SIZE = 30; // Extra gap in the middle to separate left/right groups

// Control icon size and detection radius
const CONTROL_ICON_SIZE = 12;
const CONTROL_DETECT_RADIUS = 15;
const EDGE_HOVER_DISTANCE = 10; // Distance from edge to trigger hover

// Check if mouse is near a triangle edge (in world space)
function checkEdgeHover(worldMouseX, worldMouseY) {
  const distToAB = distToSegment(worldMouseX, worldMouseY, pA.x, pA.y, pB.x, pB.y);
  const distToBC = distToSegment(worldMouseX, worldMouseY, pB.x, pB.y, pC.x, pC.y);
  const distToCA = distToSegment(worldMouseX, worldMouseY, pC.x, pC.y, pA.x, pA.y);

  // Find closest edge
  const minDist = Math.min(distToAB, distToBC, distToCA);

  if (minDist < EDGE_HOVER_DISTANCE) {
    if (minDist === distToAB) return 'AB';
    if (minDist === distToBC) return 'BC';
    if (minDist === distToCA) return 'CA';
  }

  return null;
}

// Distance from point to line segment
function distToSegment(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lengthSq = dx * dx + dy * dy;

  if (lengthSq === 0) return dist(px, py, x1, y1);

  let t = ((px - x1) * dx + (py - y1) * dy) / lengthSq;
  t = Math.max(0, Math.min(1, t));

  const projX = x1 + t * dx;
  const projY = y1 + t * dy;

  return dist(px, py, projX, projY);
}

// Draw control icons for a hovered edge
function drawEdgeControls(edge) {
  if (!edge) return;

  // Get endpoints
  let p1, p2, labelP1, labelP2;
  if (edge === 'AB') { p1 = pA; p2 = pB; labelP1 = 'A'; labelP2 = 'B'; }
  else if (edge === 'BC') { p1 = pB; p2 = pC; labelP1 = 'B'; labelP2 = 'C'; }
  else if (edge === 'CA') { p1 = pC; p2 = pA; labelP1 = 'C'; labelP2 = 'A'; }

  // Calculate positions for control icons (offset from endpoints)
  const edgeVec = p5.Vector.sub(p2, p1);
  const edgeLength = edgeVec.mag();
  const edgeDir = edgeVec.normalize();

  // Convert to world mouse position
  const worldMouseX = mouseX - cameraOffsetX;
  const worldMouseY = mouseY - cameraOffsetY;

  // Calculate midpoint of the edge
  const midpoint = p5.Vector.add(p1, p2).div(2);

  // === All 4 controls positioned directly on the line ===
  // Layout: [Length P1] [Angle P1] --- GAP --- [Angle P2] [Length P2]

  // Length control at P1 (leftmost)
  const lengthControlP1 = p5.Vector.add(midpoint, p5.Vector.mult(edgeDir, -(CONTROL_SPACING + CONTROL_GAP_SIZE)));
  const hoverLengthP1 = dist(worldMouseX, worldMouseY, lengthControlP1.x, lengthControlP1.y) < CONTROL_DETECT_RADIUS;

  // Angle control at P1 (left side, near gap)
  const angleControlP1 = p5.Vector.add(midpoint, p5.Vector.mult(edgeDir, -CONTROL_GAP_SIZE));
  const hoverAngleP1 = dist(worldMouseX, worldMouseY, angleControlP1.x, angleControlP1.y) < CONTROL_DETECT_RADIUS;

  // Angle control at P2 (right side, near gap)
  const angleControlP2 = p5.Vector.add(midpoint, p5.Vector.mult(edgeDir, CONTROL_GAP_SIZE));
  const hoverAngleP2 = dist(worldMouseX, worldMouseY, angleControlP2.x, angleControlP2.y) < CONTROL_DETECT_RADIUS;

  // Length control at P2 (rightmost)
  const lengthControlP2 = p5.Vector.add(midpoint, p5.Vector.mult(edgeDir, CONTROL_SPACING + CONTROL_GAP_SIZE));
  const hoverLengthP2 = dist(worldMouseX, worldMouseY, lengthControlP2.x, lengthControlP2.y) < CONTROL_DETECT_RADIUS;

  // Draw all four controls
  drawAngleControl(angleControlP1, hoverAngleP1, edge, labelP1);
  drawLengthControl(lengthControlP1, edgeDir, hoverLengthP1, edge, labelP1);
  drawAngleControl(angleControlP2, hoverAngleP2, edge, labelP2);
  drawLengthControl(lengthControlP2, edgeDir, hoverLengthP2, edge, labelP2);
}

// Helper function to draw angle control icon
function drawAngleControl(pos, hover, edge, endpoint) {
  push();
  if (hover || (activeControl && activeControl.type === 'angle' && activeControl.edge === edge && activeControl.endpoint === endpoint)) {
    fill(100, 100, 255, 200);
    stroke(50, 50, 200);
  } else {
    fill(150, 150, 255, 150);
    stroke(100, 100, 200);
  }
  strokeWeight(2);
  ellipse(pos.x, pos.y, CONTROL_ICON_SIZE);

  // Draw arrow arc symbol
  noFill();
  arc(pos.x, pos.y, CONTROL_ICON_SIZE * 0.6, CONTROL_ICON_SIZE * 0.6, -QUARTER_PI, PI + QUARTER_PI);
  // Arrow head
  const arrowX = pos.x + cos(PI + QUARTER_PI) * CONTROL_ICON_SIZE * 0.3;
  const arrowY = pos.y + sin(PI + QUARTER_PI) * CONTROL_ICON_SIZE * 0.3;
  line(arrowX, arrowY, arrowX - 2, arrowY + 2);
  line(arrowX, arrowY, arrowX + 2, arrowY + 1);
  pop();
}

// Helper function to draw length control icon
function drawLengthControl(pos, edgeDir, hover, edge, endpoint) {
  push();
  if (hover || (activeControl && activeControl.type === 'length' && activeControl.edge === edge && activeControl.endpoint === endpoint)) {
    fill(255, 100, 100, 200);
    stroke(200, 50, 50);
  } else {
    fill(255, 150, 150, 150);
    stroke(200, 100, 100);
  }
  strokeWeight(2);
  ellipse(pos.x, pos.y, CONTROL_ICON_SIZE);

  // Draw double arrow symbol
  const arrowLen = CONTROL_ICON_SIZE * 0.4;
  const arrowAngle = atan2(edgeDir.y, edgeDir.x);
  const cx = pos.x;
  const cy = pos.y;

  // Main line
  line(cx - cos(arrowAngle) * arrowLen, cy - sin(arrowAngle) * arrowLen,
       cx + cos(arrowAngle) * arrowLen, cy + sin(arrowAngle) * arrowLen);

  // Arrow heads
  const headSize = 2;
  const leftX = cx - cos(arrowAngle) * arrowLen;
  const leftY = cy - sin(arrowAngle) * arrowLen;
  const rightX = cx + cos(arrowAngle) * arrowLen;
  const rightY = cy + sin(arrowAngle) * arrowLen;

  line(leftX, leftY, leftX + cos(arrowAngle + QUARTER_PI) * headSize, leftY + sin(arrowAngle + QUARTER_PI) * headSize);
  line(leftX, leftY, leftX + cos(arrowAngle - QUARTER_PI) * headSize, leftY + sin(arrowAngle - QUARTER_PI) * headSize);
  line(rightX, rightY, rightX - cos(arrowAngle + QUARTER_PI) * headSize, rightY - sin(arrowAngle + QUARTER_PI) * headSize);
  line(rightX, rightY, rightX - cos(arrowAngle - QUARTER_PI) * headSize, rightY - sin(arrowAngle - QUARTER_PI) * headSize);
  pop();
}

// Check if mouse is over a control icon
function checkControlIconClick(worldMouseX, worldMouseY, edge) {
  if (!edge) return null;

  let p1, p2, labelP1, labelP2;
  if (edge === 'AB') { p1 = pA; p2 = pB; labelP1 = 'A'; labelP2 = 'B'; }
  else if (edge === 'BC') { p1 = pB; p2 = pC; labelP1 = 'B'; labelP2 = 'C'; }
  else if (edge === 'CA') { p1 = pC; p2 = pA; labelP1 = 'C'; labelP2 = 'A'; }

  const edgeVec = p5.Vector.sub(p2, p1);
  const edgeDir = edgeVec.normalize();

  // Calculate midpoint of the edge
  const midpoint = p5.Vector.add(p1, p2).div(2);

  // === All 4 controls positioned directly on the line ===
  // Layout: [Length P1] [Angle P1] --- GAP --- [Angle P2] [Length P2]

  // Length control at P1 (leftmost)
  const lengthControlP1 = p5.Vector.add(midpoint, p5.Vector.mult(edgeDir, -(CONTROL_SPACING + CONTROL_SPACING)));

  // Angle control at P1 (left side, near gap)
  const angleControlP1 = p5.Vector.add(midpoint, p5.Vector.mult(edgeDir, -CONTROL_SPACING));

  // Angle control at P2 (right side, near gap)
  const angleControlP2 = p5.Vector.add(midpoint, p5.Vector.mult(edgeDir, CONTROL_SPACING));

  // Length control at P2 (rightmost)
  const lengthControlP2 = p5.Vector.add(midpoint, p5.Vector.mult(edgeDir, CONTROL_SPACING + CONTROL_SPACING));

  // Check all four controls
  if (dist(worldMouseX, worldMouseY, angleControlP1.x, angleControlP1.y) < CONTROL_DETECT_RADIUS) {
    return { edge: edge, type: 'angle', endpoint: labelP1 };
  }

  if (dist(worldMouseX, worldMouseY, lengthControlP1.x, lengthControlP1.y) < CONTROL_DETECT_RADIUS) {
    return { edge: edge, type: 'length', endpoint: labelP1 };
  }

  if (dist(worldMouseX, worldMouseY, angleControlP2.x, angleControlP2.y) < CONTROL_DETECT_RADIUS) {
    return { edge: edge, type: 'angle', endpoint: labelP2 };
  }

  if (dist(worldMouseX, worldMouseY, lengthControlP2.x, lengthControlP2.y) < CONTROL_DETECT_RADIUS) {
    return { edge: edge, type: 'length', endpoint: labelP2 };
  }

  return null;
}

// Handle control mouse press
function handleControlMousePressed(worldMouseX, worldMouseY) {
  const control = checkControlIconClick(worldMouseX, worldMouseY, hoveredEdge);

  if (control) {
    activeControl = control;

    if (control.type === 'angle') {
      // Store starting angle for rotation
      // Pivot is the endpoint specified in control.endpoint
      // The other endpoint is the one that will move
      let pivotPoint, otherPoint, thirdPoint;

      if (control.edge === 'AB') {
        if (control.endpoint === 'A') {
          pivotPoint = pA;
          otherPoint = pB;
          thirdPoint = pC;
        } else {
          pivotPoint = pB;
          otherPoint = pA;
          thirdPoint = pC;
        }
      } else if (control.edge === 'BC') {
        if (control.endpoint === 'B') {
          pivotPoint = pB;
          otherPoint = pC;
          thirdPoint = pA;
        } else {
          pivotPoint = pC;
          otherPoint = pB;
          thirdPoint = pA;
        }
      } else if (control.edge === 'CA') {
        if (control.endpoint === 'C') {
          pivotPoint = pC;
          otherPoint = pA;
          thirdPoint = pB;
        } else {
          pivotPoint = pA;
          otherPoint = pC;
          thirdPoint = pB;
        }
      }

      controlStartAngle = atan2(otherPoint.y - pivotPoint.y, otherPoint.x - pivotPoint.x);
      controlStartMouseAngle = atan2(worldMouseY - pivotPoint.y, worldMouseX - pivotPoint.x);

      // Calculate the current interior angle at the pivot point
      const vec1 = p5.Vector.sub(otherPoint, pivotPoint);
      const vec2 = p5.Vector.sub(thirdPoint, pivotPoint);
      const currentInteriorAngle = abs(p5.Vector.angleBetween(vec1, vec2));

      // Round the interior angle to nearest degree
      const currentInteriorAngleDegrees = degrees(currentInteriorAngle);
      const snappedInteriorAngleDegrees = round(currentInteriorAngleDegrees);

      // Calculate what the edge angle should be to achieve this snapped interior angle
      const angle2 = atan2(thirdPoint.y - pivotPoint.y, thirdPoint.x - pivotPoint.x);
      const interiorAngleDiff = currentInteriorAngleDegrees - snappedInteriorAngleDegrees;

      controlSnappedStartAngle = controlStartAngle - radians(interiorAngleDiff);
    } else if (control.type === 'length') {
      // Store starting length and position
      let p1, p2;
      if (control.edge === 'AB') { p1 = pA; p2 = pB; }
      else if (control.edge === 'BC') { p1 = pB; p2 = pC; }
      else if (control.edge === 'CA') { p1 = pC; p2 = pA; }

      controlStartLength = dist(p1.x, p1.y, p2.x, p2.y);
      controlStartPos = createVector(worldMouseX, worldMouseY);

      // Round the starting length to nearest 0.5cm
      const startLengthCm = controlStartLength / gridSize;
      const snappedStartLengthCm = round(startLengthCm * 2) / 2; // Round to 0.5 intervals
      controlSnappedStartLength = snappedStartLengthCm * gridSize;
    }

    return true;
  }

  return false;
}

// Handle control dragging
function handleControlDragged(worldMouseX, worldMouseY) {
  if (!activeControl) return false;

  if (activeControl.type === 'angle') {
    // Rotate the edge around pivot point
    let pivotPoint, movingPoint;

    if (activeControl.edge === 'AB') {
      if (activeControl.endpoint === 'A') {
        pivotPoint = pA;
        movingPoint = pB;
      } else {
        pivotPoint = pB;
        movingPoint = pA;
      }
    } else if (activeControl.edge === 'BC') {
      if (activeControl.endpoint === 'B') {
        pivotPoint = pB;
        movingPoint = pC;
      } else {
        pivotPoint = pC;
        movingPoint = pB;
      }
    } else if (activeControl.edge === 'CA') {
      if (activeControl.endpoint === 'C') {
        pivotPoint = pC;
        movingPoint = pA;
      } else {
        pivotPoint = pA;
        movingPoint = pC;
      }
    }

    // Calculate current mouse angle relative to pivot
    const currentMouseAngle = atan2(worldMouseY - pivotPoint.y, worldMouseX - pivotPoint.x);

    // Calculate angle change and snap to 1 degree
    let angleDiff = currentMouseAngle - controlStartMouseAngle;
    angleDiff = round(degrees(angleDiff)); // Snap to whole degrees
    angleDiff = radians(angleDiff);

    // Apply rotation starting from snapped angle
    const newAngle = controlSnappedStartAngle + angleDiff;
    const edgeLength = dist(pivotPoint.x, pivotPoint.y, movingPoint.x, movingPoint.y);

    movingPoint.x = pivotPoint.x + cos(newAngle) * edgeLength;
    movingPoint.y = pivotPoint.y + sin(newAngle) * edgeLength;

  } else if (activeControl.type === 'length') {
    // Extend/shorten the edge from the specified endpoint
    let fixedPoint, movingPoint;

    if (activeControl.edge === 'AB') {
      if (activeControl.endpoint === 'A') {
        // Extending/shortening from A towards B
        fixedPoint = pB;
        movingPoint = pA;
      } else {
        // Extending/shortening from B towards A
        fixedPoint = pA;
        movingPoint = pB;
      }
    } else if (activeControl.edge === 'BC') {
      if (activeControl.endpoint === 'B') {
        fixedPoint = pC;
        movingPoint = pB;
      } else {
        fixedPoint = pB;
        movingPoint = pC;
      }
    } else if (activeControl.edge === 'CA') {
      if (activeControl.endpoint === 'C') {
        fixedPoint = pA;
        movingPoint = pC;
      } else {
        fixedPoint = pC;
        movingPoint = pA;
      }
    }

    // Calculate distance change along the edge direction
    const edgeDir = p5.Vector.sub(movingPoint, fixedPoint).normalize();
    const mouseDelta = createVector(worldMouseX - controlStartPos.x, worldMouseY - controlStartPos.y);
    const projectedDelta = p5.Vector.dot(mouseDelta, edgeDir);

    // Snap to 0.5 cm intervals (gridSize/2)
    const snappedDelta = round(projectedDelta / (gridSize / 2)) * (gridSize / 2);

    // Apply new length starting from snapped length (minimum 0.5cm)
    let newLength = controlSnappedStartLength + snappedDelta;
    newLength = Math.max(gridSize / 2, newLength); // Minimum 0.5cm

    const angle = atan2(movingPoint.y - fixedPoint.y, movingPoint.x - fixedPoint.x);
    movingPoint.x = fixedPoint.x + cos(angle) * newLength;
    movingPoint.y = fixedPoint.y + sin(angle) * newLength;
  }

  return true;
}

// Handle control release
function handleControlReleased() {
  if (activeControl) {
    activeControl = null;
    return true;
  }
  return false;
}

// Update hovered edge (call in draw loop)
function updateEdgeHover(worldMouseX, worldMouseY) {
  // Don't update hover state if dragging a control or a vertex
  if (!activeControl && !isDraggingVertex()) {
    hoveredEdge = checkEdgeHover(worldMouseX, worldMouseY);
  } else if (isDraggingVertex()) {
    // Clear hover state when dragging vertex
    hoveredEdge = null;
  }
}

// Check if a vertex is being dragged
function isDraggingVertex() {
  return draggingPoint !== null;
}

// Check if controls should override vertex dragging
function isControlActive() {
  return activeControl !== null;
}

// Check if hovering over controls
function isHoveringControl() {
  return hoveredEdge !== null;
}
