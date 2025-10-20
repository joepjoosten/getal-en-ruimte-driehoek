// --- Legend Function ---
function drawLegend(angleA, angleB, angleC, lenAB, lenBC, lenCA) {
  const legendX = width - 180;
  let legendY = 20;
  const lineHeight = 18;

  fill(0);
  noStroke();
  textSize(14);
  textStyle(BOLD);
  text("Legenda (klik om te verbergen):", legendX - 20, legendY);
  legendY += lineHeight;
  textStyle(NORMAL);

  // Store legend item positions for click detection
  window.legendItems = [];

  // Triangle (not clickable)
  fill(255);
  rect(legendX, legendY, 15, 10);
  fill(0);
  text("Driehoek ABC", legendX + 25, legendY + 10);
  legendY += lineHeight;

  // Helper function to draw legend item with hover effect
  function drawLegendItem(yPos, visible, label, drawIcon) {
    const itemX = legendX - 5;
    const itemY = yPos - 2;
    const itemWidth = 175;
    const itemHeight = 16;

    // Store position for click detection
    window.legendItems.push({
      x: itemX,
      y: itemY,
      width: itemWidth,
      height: itemHeight,
      label: label
    });

    // Hover effect
    if (mouseX >= itemX && mouseX <= itemX + itemWidth &&
        mouseY >= itemY && mouseY <= itemY + itemHeight) {
      fill(200, 200, 200, 100);
      noStroke();
      rect(itemX, itemY, itemWidth, itemHeight, 3);
      cursor(HAND);
    }

    // Draw icon
    drawIcon();

    // Draw text with strikethrough if hidden
    fill(visible ? 0 : 150);
    noStroke();
    text(label, legendX + 25, yPos + 10);

    if (!visible) {
      stroke(150);
      strokeWeight(1);
      line(legendX + 25, yPos + 6, legendX + 25 + textWidth(label), yPos + 6);
    }
  }

  // Zwaartelijnen
  drawLegendItem(legendY, showMedians, "Zwaartelijnen (Medianen)", () => {
    stroke(showMedians ? color(255, 0, 0) : color(150));
    strokeWeight(1);
    line(legendX, legendY + 5, legendX + 15, legendY + 5);
  });
  legendY += lineHeight;

  // Hoogtelijnen
  drawLegendItem(legendY, showAltitudes, "Hoogtelijnen (Altitudes)", () => {
    stroke(showAltitudes ? color(0, 150, 0) : color(150));
    strokeWeight(1);
    line(legendX, legendY + 5, legendX + 15, legendY + 5);
  });
  legendY += lineHeight;

  // Bissectrices
  drawLegendItem(legendY, showBisectors, "Bissectrices (Hoeklijnen)", () => {
    stroke(showBisectors ? color(0, 0, 255) : color(150));
    strokeWeight(1);
    line(legendX, legendY + 5, legendX + 15, legendY + 5);
  });
  legendY += lineHeight;

  // Middelloodlijnen
  drawLegendItem(legendY, showPerpBisectors, "Middelloodlijnen", () => {
    stroke(showPerpBisectors ? color(128, 0, 128) : color(150));
    strokeWeight(1);
    line(legendX, legendY + 5, legendX + 15, legendY + 5);
  });
  legendY += lineHeight;

  // Ingeschreven Cirkel
  drawLegendItem(legendY, showIncircle, "Ingeschreven Cirkel", () => {
    stroke(showIncircle ? color(255, 165, 0) : color(150));
    noFill();
    ellipse(legendX + 7, legendY + 5, 10);
  });
  legendY += lineHeight;

  // Omgeschreven Cirkel
  drawLegendItem(legendY, showCircumcircle, "Omgeschreven Cirkel", () => {
    stroke(showCircumcircle ? color(0, 255, 255) : color(150));
    noFill();
    ellipse(legendX + 7, legendY + 5, 10);
  });
  legendY += lineHeight;

  // Coordinate System
  drawLegendItem(legendY, showCoordinates, "Coördinatensysteem", () => {
    stroke(showCoordinates ? color(80, 80, 80) : color(150));
    strokeWeight(1);
    // Draw mini axes
    line(legendX + 3, legendY + 7, legendX + 12, legendY + 7); // X-axis
    line(legendX + 7, legendY + 3, legendX + 7, legendY + 11); // Y-axis
  });
  legendY += lineHeight + 10; // Add extra space before measurements

  // === Measurements Section (Read-only) ===
  fill(0);
  noStroke();
  textSize(14);
  textStyle(BOLD);
  text("Metingen:", legendX - 20, legendY);
  legendY += lineHeight;
  textStyle(NORMAL);
  textSize(11);

  // Angles
  fill(0);
  text("∠A: " + angleA.toFixed(1) + "°", legendX, legendY);
  legendY += lineHeight;
  text("∠B: " + angleB.toFixed(1) + "°", legendX, legendY);
  legendY += lineHeight;
  text("∠C: " + angleC.toFixed(1) + "°", legendX, legendY);
  legendY += lineHeight + 5;

  // Distances (in cm)
  text("AB: " + (lenAB / gridSize).toFixed(2) + " cm", legendX, legendY);
  legendY += lineHeight;
  text("BC: " + (lenBC / gridSize).toFixed(2) + " cm", legendX, legendY);
  legendY += lineHeight;
  text("AC: " + (lenCA / gridSize).toFixed(2) + " cm", legendX, legendY);
  legendY += lineHeight + 5;

  // Coordinates
  const coordAX = (pA.x - originX) / gridSize;
  const coordAY = -(pA.y - originY) / gridSize;
  const coordBX = (pB.x - originX) / gridSize;
  const coordBY = -(pB.y - originY) / gridSize;
  const coordCX = (pC.x - originX) / gridSize;
  const coordCY = -(pC.y - originY) / gridSize;

  text("A: (" + coordAX.toFixed(1) + ", " + coordAY.toFixed(1) + ")", legendX, legendY);
  legendY += lineHeight;
  text("B: (" + coordBX.toFixed(1) + ", " + coordBY.toFixed(1) + ")", legendX, legendY);
  legendY += lineHeight;
  text("C: (" + coordCX.toFixed(1) + ", " + coordCY.toFixed(1) + ")", legendX, legendY);

  // Reset cursor if not hovering over any legend item
  let hovering = false;
  for (let item of window.legendItems) {
    if (mouseX >= item.x && mouseX <= item.x + item.width &&
        mouseY >= item.y && mouseY <= item.y + item.height) {
      hovering = true;
      break;
    }
  }
  if (!hovering) {
    cursor(ARROW);
  }
}

// Handle legend click events
function handleLegendClick() {
  // Check if clicking on a legend item
  if (window.legendItems) {
    for (let item of window.legendItems) {
      if (mouseX >= item.x && mouseX <= item.x + item.width &&
          mouseY >= item.y && mouseY <= item.y + item.height) {
        // Toggle visibility based on label
        if (item.label === "Zwaartelijnen (Medianen)") {
          showMedians = !showMedians;
        } else if (item.label === "Hoogtelijnen (Altitudes)") {
          showAltitudes = !showAltitudes;
        } else if (item.label === "Bissectrices (Hoeklijnen)") {
          showBisectors = !showBisectors;
        } else if (item.label === "Middelloodlijnen") {
          showPerpBisectors = !showPerpBisectors;
        } else if (item.label === "Ingeschreven Cirkel") {
          showIncircle = !showIncircle;
        } else if (item.label === "Omgeschreven Cirkel") {
          showCircumcircle = !showCircumcircle;
        } else if (item.label === "Coördinatensysteem") {
          showCoordinates = !showCoordinates;
        }
        return true; // Handled
      }
    }
  }
  return false; // Not handled
}
