// --- Input fields for angles and distances ---
let inputAngleA, inputAngleB, inputAngleC;
let inputDistAB, inputDistBC, inputDistAC;
let isUpdatingFromInput = false; // Flag to prevent circular updates
let lastEditedAngle = null; // Track which angle was last edited (before current)

// Store references to all label divs for repositioning
let labelHoeken, labelAngleA, labelAngleB, labelAngleC;
let labelAfstanden, labelDistAB, labelDistBC, labelDistAC;

// Create all input fields
function createInputFields() {
  // Create input fields for angles
  const inputX = width - 170;
  let inputY = height - 300;

  labelHoeken = createDiv('Hoeken:').style('font-size', '12px').style('font-weight', 'bold');
  labelHoeken.position(inputX, inputY);
  inputY += 20;

  labelAngleA = createDiv('∠A (°):').style('font-size', '11px');
  labelAngleA.position(inputX, inputY);
  inputAngleA = createInput('').size(50, 18);
  inputAngleA.position(inputX + 50, inputY);
  inputAngleA.style('font-size', '11px');
  inputAngleA.changed(() => updateTriangleFromAngles('A'));
  inputY += 25;

  labelAngleB = createDiv('∠B (°):').style('font-size', '11px');
  labelAngleB.position(inputX, inputY);
  inputAngleB = createInput('').size(50, 18);
  inputAngleB.position(inputX + 50, inputY);
  inputAngleB.style('font-size', '11px');
  inputAngleB.changed(() => updateTriangleFromAngles('B'));
  inputY += 25;

  labelAngleC = createDiv('∠C (°):').style('font-size', '11px');
  labelAngleC.position(inputX, inputY);
  inputAngleC = createInput('').size(50, 18);
  inputAngleC.position(inputX + 50, inputY);
  inputAngleC.style('font-size', '11px');
  inputAngleC.changed(() => updateTriangleFromAngles('C'));
  inputY += 30;

  // Create input fields for distances
  labelAfstanden = createDiv('Afstanden (cm):').style('font-size', '12px').style('font-weight', 'bold');
  labelAfstanden.position(inputX, inputY);
  inputY += 20;

  labelDistAB = createDiv('AB:').style('font-size', '11px');
  labelDistAB.position(inputX, inputY);
  inputDistAB = createInput('').size(50, 18);
  inputDistAB.position(inputX + 50, inputY);
  inputDistAB.style('font-size', '11px');
  inputDistAB.changed(() => updateTriangleFromDistances('AB'));
  inputY += 25;

  labelDistBC = createDiv('BC:').style('font-size', '11px');
  labelDistBC.position(inputX, inputY);
  inputDistBC = createInput('').size(50, 18);
  inputDistBC.position(inputX + 50, inputY);
  inputDistBC.style('font-size', '11px');
  inputDistBC.changed(() => updateTriangleFromDistances('BC'));
  inputY += 25;

  labelDistAC = createDiv('AC:').style('font-size', '11px');
  labelDistAC.position(inputX, inputY);
  inputDistAC = createInput('').size(50, 18);
  inputDistAC.position(inputX + 50, inputY);
  inputDistAC.style('font-size', '11px');
  inputDistAC.changed(() => updateTriangleFromDistances('AC'));
}

// Reposition input fields (called when window is resized)
function repositionInputFields() {
  const inputX = width - 170;
  let inputY = height - 200;

  labelHoeken.position(inputX, inputY);
  inputY += 20;

  labelAngleA.position(inputX, inputY);
  inputAngleA.position(inputX + 50, inputY);
  inputY += 25;

  labelAngleB.position(inputX, inputY);
  inputAngleB.position(inputX + 50, inputY);
  inputY += 25;

  labelAngleC.position(inputX, inputY);
  inputAngleC.position(inputX + 50, inputY);
  inputY += 30;

  labelAfstanden.position(inputX, inputY);
  inputY += 20;

  labelDistAB.position(inputX, inputY);
  inputDistAB.position(inputX + 50, inputY);
  inputY += 25;

  labelDistBC.position(inputX, inputY);
  inputDistBC.position(inputX + 50, inputY);
  inputY += 25;

  labelDistAC.position(inputX, inputY);
  inputDistAC.position(inputX + 50, inputY);
}

// --- Functions to update triangle from inputs ---

function updateTriangleFromAngles(currentEditedAngle) {
  if (isUpdatingFromInput) return;
  isUpdatingFromInput = true;

  // Get the current value of the edited angle
  let angleA = parseFloat(inputAngleA.value());
  let angleB = parseFloat(inputAngleB.value());
  let angleC = parseFloat(inputAngleC.value());

  // Validate the currently edited angle
  const currentValue = currentEditedAngle === 'A' ? angleA :
                       currentEditedAngle === 'B' ? angleB : angleC;

  if (isNaN(currentValue) || currentValue <= 0 || currentValue >= 180) {
    isUpdatingFromInput = false;
    return;
  }

  // Auto-calculate the other angles to sum to 180
  const remainder = 180 - currentValue;

  if (lastEditedAngle === null || lastEditedAngle === currentEditedAngle) {
    // No previous angle or editing the same angle again: split remainder in two
    const splitValue = remainder / 2;
    if (currentEditedAngle === 'A') {
      angleB = splitValue;
      angleC = splitValue;
      inputAngleB.value(angleB.toFixed(1));
      inputAngleC.value(angleC.toFixed(1));
    } else if (currentEditedAngle === 'B') {
      angleA = splitValue;
      angleC = splitValue;
      inputAngleA.value(angleA.toFixed(1));
      inputAngleC.value(angleC.toFixed(1));
    } else { // C
      angleA = splitValue;
      angleB = splitValue;
      inputAngleA.value(angleA.toFixed(1));
      inputAngleB.value(angleB.toFixed(1));
    }
  } else {
    // There's a previously edited angle: keep it and adjust only the third angle
    if (currentEditedAngle === 'A') {
      if (lastEditedAngle === 'B') {
        angleC = remainder - angleB;
        if (angleC <= 0 || angleC >= 180) {
          isUpdatingFromInput = false;
          return;
        }
        inputAngleC.value(angleC.toFixed(1));
      } else { // lastEditedAngle === 'C'
        angleB = remainder - angleC;
        if (angleB <= 0 || angleB >= 180) {
          isUpdatingFromInput = false;
          return;
        }
        inputAngleB.value(angleB.toFixed(1));
      }
    } else if (currentEditedAngle === 'B') {
      if (lastEditedAngle === 'A') {
        angleC = remainder - angleA;
        if (angleC <= 0 || angleC >= 180) {
          isUpdatingFromInput = false;
          return;
        }
        inputAngleC.value(angleC.toFixed(1));
      } else { // lastEditedAngle === 'C'
        angleA = remainder - angleC;
        if (angleA <= 0 || angleA >= 180) {
          isUpdatingFromInput = false;
          return;
        }
        inputAngleA.value(angleA.toFixed(1));
      }
    } else { // currentEditedAngle === 'C'
      if (lastEditedAngle === 'A') {
        angleB = remainder - angleA;
        if (angleB <= 0 || angleB >= 180) {
          isUpdatingFromInput = false;
          return;
        }
        inputAngleB.value(angleB.toFixed(1));
      } else { // lastEditedAngle === 'B'
        angleA = remainder - angleB;
        if (angleA <= 0 || angleA >= 180) {
          isUpdatingFromInput = false;
          return;
        }
        inputAngleA.value(angleA.toFixed(1));
      }
    }
  }

  // Update lastEditedAngle for next time
  lastEditedAngle = currentEditedAngle;

  // Now update the triangle geometry
  // Keep current position of A and distance AB
  const currentDistAB = dist(pA.x, pA.y, pB.x, pB.y);
  const currentAngleAB = atan2(pB.y - pA.y, pB.x - pA.x);

  // Calculate new position of C using law of sines
  // We'll keep A and B fixed, and move C
  const angleAtA_rad = radians(angleA);
  const angleAtB_rad = radians(angleB);
  const angleAtC_rad = radians(angleC);

  // Using law of sines: BC/sin(A) = AB/sin(C)
  const distBC = currentDistAB * sin(angleAtA_rad) / sin(angleAtC_rad);

  // Position C relative to B
  const angleBtoC = currentAngleAB + PI - angleAtB_rad;
  const newCx = pB.x + distBC * cos(angleBtoC);
  const newCy = pB.y + distBC * sin(angleBtoC);

  pC.x = newCx;
  pC.y = newCy;

  isUpdatingFromInput = false;
}

function updateTriangleFromDistances(changedSide) {
  if (isUpdatingFromInput) return;
  isUpdatingFromInput = true;

  const distAB = parseFloat(inputDistAB.value());
  const distBC = parseFloat(inputDistBC.value());
  const distAC = parseFloat(inputDistAC.value());

  // Validate that we have valid distances
  if (isNaN(distAB) || isNaN(distBC) || isNaN(distAC)) {
    isUpdatingFromInput = false;
    return;
  }

  // Convert cm to pixels
  const pixelAB = distAB * gridSize;
  const pixelBC = distBC * gridSize;
  const pixelAC = distAC * gridSize;

  // Check triangle inequality
  if (pixelAB + pixelBC <= pixelAC || pixelAB + pixelAC <= pixelBC || pixelBC + pixelAC <= pixelAB) {
    alert('Deze afstanden vormen geen geldige driehoek');
    isUpdatingFromInput = false;
    return;
  }

  // Keep A fixed, and the direction of AB
  const currentAngleAB = atan2(pB.y - pA.y, pB.x - pA.x);

  // Update B position based on AB distance
  pB.x = pA.x + pixelAB * cos(currentAngleAB);
  pB.y = pA.y + pixelAB * sin(currentAngleAB);

  // Calculate C position using distances AC and BC
  // Using the law of cosines to find angle at A
  const angleAtA = acos((pixelAB * pixelAB + pixelAC * pixelAC - pixelBC * pixelBC) / (2 * pixelAB * pixelAC));

  // Position C relative to A (we'll place it on one side of AB)
  const angleToCfromA = currentAngleAB + angleAtA;
  pC.x = pA.x + pixelAC * cos(angleToCfromA);
  pC.y = pA.y + pixelAC * sin(angleToCfromA);

  isUpdatingFromInput = false;
}

// Update input field values to match current triangle
function updateInputFieldValues(angleA, angleB, angleC, lenAB, lenBC, lenCA) {
  // Update input fields with current values (only if not currently being edited)
  if (!isUpdatingFromInput && document.activeElement !== inputAngleA.elt &&
      document.activeElement !== inputAngleB.elt && document.activeElement !== inputAngleC.elt &&
      document.activeElement !== inputDistAB.elt && document.activeElement !== inputDistBC.elt &&
      document.activeElement !== inputDistAC.elt) {
    inputAngleA.value(angleA.toFixed(1));
    inputAngleB.value(angleB.toFixed(1));
    inputAngleC.value(angleC.toFixed(1));
    inputDistAB.value((lenAB / gridSize).toFixed(2));
    inputDistBC.value((lenBC / gridSize).toFixed(2));
    inputDistAC.value((lenCA / gridSize).toFixed(2));
  }
}
