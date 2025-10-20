// --- Legend Management (HTML-based) ---

// Initialize legend event listeners
function initLegend() {
  const legendItems = document.querySelectorAll('.legend-item[data-toggle]');

  legendItems.forEach(item => {
    const toggle = item.getAttribute('data-toggle');

    // Set initial state
    updateLegendItemState(item, toggle);

    // Add click handler
    item.addEventListener('click', () => {
      handleLegendToggle(toggle);
      updateLegendItemState(item, toggle);
    });
  });
}

// Handle toggle clicks
function handleLegendToggle(toggle) {
  switch (toggle) {
    case 'triangle':
      showTriangle = !showTriangle;
      break;
    case 'medians':
      showMedians = !showMedians;
      break;
    case 'altitudes':
      showAltitudes = !showAltitudes;
      break;
    case 'bisectors':
      showBisectors = !showBisectors;
      break;
    case 'perpBisectors':
      showPerpBisectors = !showPerpBisectors;
      break;
    case 'incircle':
      showIncircle = !showIncircle;
      break;
    case 'circumcircle':
      showCircumcircle = !showCircumcircle;
      break;
    case 'coordinates':
      showCoordinates = !showCoordinates;
      break;
  }
}

// Update visual state of legend item
function updateLegendItemState(item, toggle) {
  let isEnabled = true;

  switch (toggle) {
    case 'triangle':
      isEnabled = showTriangle;
      break;
    case 'medians':
      isEnabled = showMedians;
      break;
    case 'altitudes':
      isEnabled = showAltitudes;
      break;
    case 'bisectors':
      isEnabled = showBisectors;
      break;
    case 'perpBisectors':
      isEnabled = showPerpBisectors;
      break;
    case 'incircle':
      isEnabled = showIncircle;
      break;
    case 'circumcircle':
      isEnabled = showCircumcircle;
      break;
    case 'coordinates':
      isEnabled = showCoordinates;
      break;
  }

  if (isEnabled) {
    item.classList.remove('disabled');
  } else {
    item.classList.add('disabled');
  }
}

// Update measurements display
function updateLegendMeasurements(angleA, angleB, angleC, lenAB, lenBC, lenCA) {
  // Update angles
  document.getElementById('angle-a').textContent = `∠A: ${angleA.toFixed(1)}°`;
  document.getElementById('angle-b').textContent = `∠B: ${angleB.toFixed(1)}°`;
  document.getElementById('angle-c').textContent = `∠C: ${angleC.toFixed(1)}°`;

  // Update distances
  document.getElementById('dist-ab').textContent = `AB: ${(lenAB / gridSize).toFixed(2)} cm`;
  document.getElementById('dist-bc').textContent = `BC: ${(lenBC / gridSize).toFixed(2)} cm`;
  document.getElementById('dist-ac').textContent = `AC: ${(lenCA / gridSize).toFixed(2)} cm`;

  // Update coordinates
  const coordAX = (pA.x - originX) / gridSize;
  const coordAY = -(pA.y - originY) / gridSize;
  const coordBX = (pB.x - originX) / gridSize;
  const coordBY = -(pB.y - originY) / gridSize;
  const coordCX = (pC.x - originX) / gridSize;
  const coordCY = -(pC.y - originY) / gridSize;

  document.getElementById('coord-a').textContent = `A: (${coordAX.toFixed(1)}, ${coordAY.toFixed(1)})`;
  document.getElementById('coord-b').textContent = `B: (${coordBX.toFixed(1)}, ${coordBY.toFixed(1)})`;
  document.getElementById('coord-c').textContent = `C: (${coordCX.toFixed(1)}, ${coordCY.toFixed(1)})`;
}

// Highlight which measurement is currently being edited
function updateLegendEditingState() {
  // Clear all editing states
  document.querySelectorAll('.measurement-item.editing').forEach(el => el.classList.remove('editing'));

  // Highlight by control drag (angle or length)
  if (typeof activeControl !== 'undefined' && activeControl) {
    if (activeControl.type === 'angle') {
      const id = `angle-${activeControl.endpoint.toLowerCase()}`;
      const el = document.getElementById(id);
      if (el) el.classList.add('editing');
      return;
    }
    if (activeControl.type === 'length') {
      let suffix = activeControl.edge === 'CA' ? 'ac' : activeControl.edge.toLowerCase();
      const id = `dist-${suffix}`;
      const el = document.getElementById(id);
      if (el) el.classList.add('editing');
      return;
    }
  }

  // Highlight by vertex drag (coordinates)
  if (typeof draggingPoint !== 'undefined' && draggingPoint) {
    let id = null;
    if (draggingPoint === pA) id = 'coord-a';
    else if (draggingPoint === pB) id = 'coord-b';
    else if (draggingPoint === pC) id = 'coord-c';
    if (id) {
      const el = document.getElementById(id);
      if (el) el.classList.add('editing');
    }
  }
}
