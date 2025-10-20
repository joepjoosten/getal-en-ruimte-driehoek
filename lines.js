// --- Visibility toggles for each element ---
let showMedians = false;
let showAltitudes = false;
let showBisectors = false;
let showPerpBisectors = false;
let showIncircle = false;
let showCircumcircle = false;
let showCoordinates = true;

// --- Global variables for calculated values ---
let scaled_AC_ratio = 0;
let scaled_BC_ratio = 0;
let scaled_inradius_to_circumradius_ratio = 0;
let scaled_triangle_area = 0;

// Draw all special lines and circles
function drawSpecialLines() {
  const lenAB_actual = dist(pA.x, pA.y, pB.x, pB.y);
  const lenBC_actual = dist(pB.x, pB.y, pC.x, pC.y);
  const lenCA_actual = dist(pC.x, pC.y, pA.x, pA.y);

  // Calculate scaled side ratios (AB = 1)
  if (lenAB_actual > 0) {
    scaled_AC_ratio = lenCA_actual / lenAB_actual;
    scaled_BC_ratio = lenBC_actual / lenAB_actual;
  } else {
    scaled_AC_ratio = 0;
    scaled_BC_ratio = 0;
  }

  // Calculate actual triangle area
  const actualArea = triangleArea(pA, pB, pC);

  // Calculate scaled triangle area (where AB has length 1)
  if (lenAB_actual > 0) {
    scaled_triangle_area = actualArea / (lenAB_actual * lenAB_actual);
  } else {
    scaled_triangle_area = 0;
  }

  // Draw medians
  drawMedians();

  // Draw altitudes
  drawAltitudes();

  // Draw angle bisectors and incircle
  const actual_inradius = drawBisectorsAndIncircle();

  // Draw perpendicular bisectors and circumcircle
  const actual_circumradius = drawPerpBisectorsAndCircumcircle();

  // Calculate scaled inradius/circumradius ratio
  if (lenAB_actual > 0 && actual_circumradius > 0) {
    const scaled_inradius = actual_inradius / lenAB_actual;
    const scaled_circumradius = actual_circumradius / lenAB_actual;
    scaled_inradius_to_circumradius_ratio =
      scaled_inradius / scaled_circumradius;
  } else {
    scaled_inradius_to_circumradius_ratio = 0;
  }
}

// 1. Zwaartelijnen (Medians) - Red
function drawMedians() {
  if (showMedians) {
    stroke(255, 0, 0); // Red
    strokeWeight(1);
    const mAB = getMidpoint(pA, pB);
    const mBC = getMidpoint(pB, pC);
    const mCA = getMidpoint(pC, pA);

    drawInfiniteLine(pA, mBC);
    drawInfiniteLine(pB, mCA);
    drawInfiniteLine(pC, mAB);

    // Draw equal segment indicators on each side (showing midpoint divides into equal parts)
    drawEqualSegmentMarks(pB, mBC, 1); // One mark on B to midpoint of BC
    drawEqualSegmentMarks(mBC, pC, 1); // One mark on midpoint to C
    drawEqualSegmentMarks(pC, mCA, 2); // Two marks on C to midpoint of CA
    drawEqualSegmentMarks(mCA, pA, 2); // Two marks on midpoint to A
    drawEqualSegmentMarks(pA, mAB, 3); // Three marks on A to midpoint of AB
    drawEqualSegmentMarks(mAB, pB, 3); // Three marks on midpoint to B

    const centroid = lineLineIntersection(pA, mBC, pB, mCA);
    if (centroid) {
      fill(255, 0, 0);
      noStroke();
      ellipse(centroid.x, centroid.y, 6); // Draw centroid
    }
  }
}

// 2. Hoogtelijnen (Altitudes) - Green
function drawAltitudes() {
  if (showAltitudes) {
    stroke(0, 150, 0); // Green
    strokeWeight(1);

    // Altitude from A to BC
    const vecSideBC = p5.Vector.sub(pC, pB);
    const normalBC = vecSideBC.copy().normalize().rotate(HALF_PI); // Perpendicular to BC
    const end1_altA = p5.Vector.add(pA, p5.Vector.mult(normalBC, 100));
    const end2_altA = p5.Vector.sub(pA, p5.Vector.mult(normalBC, 100));
    drawInfiniteLine(end1_altA, end2_altA);

    // Find foot of altitude on BC and draw right angle indicator
    const footA = lineLineIntersection(end1_altA, end2_altA, pB, pC);
    if (footA) {
      drawRightAngleIndicator(footA, pA, pB);
    }

    // Altitude from B to AC
    const vecSideAC = p5.Vector.sub(pC, pA);
    const normalAC = vecSideAC.copy().normalize().rotate(HALF_PI); // Perpendicular to AC
    const end1_altB = p5.Vector.add(pB, p5.Vector.mult(normalAC, 100));
    const end2_altB = p5.Vector.sub(pB, p5.Vector.mult(normalAC, 100));
    drawInfiniteLine(end1_altB, end2_altB);

    // Find foot of altitude on AC and draw right angle indicator
    const footB = lineLineIntersection(end1_altB, end2_altB, pA, pC);
    if (footB) {
      drawRightAngleIndicator(footB, pB, pA);
    }

    // Altitude from C to AB
    const vecSideAB = p5.Vector.sub(pB, pA);
    const normalAB = vecSideAB.copy().normalize().rotate(HALF_PI); // Perpendicular to AB
    const end1_altC = p5.Vector.add(pC, p5.Vector.mult(normalAB, 100));
    const end2_altC = p5.Vector.sub(pC, p5.Vector.mult(normalAB, 100));
    drawInfiniteLine(end1_altC, end2_altC);

    // Find foot of altitude on AB and draw right angle indicator
    const footC = lineLineIntersection(end1_altC, end2_altC, pA, pB);
    if (footC) {
      drawRightAngleIndicator(footC, pC, pA);
    }

    const orthocenter = lineLineIntersection(
      end1_altA,
      end2_altA,
      end1_altB,
      end2_altB,
    );
    if (orthocenter) {
      fill(0, 150, 0);
      noStroke();
      ellipse(orthocenter.x, orthocenter.y, 6); // Draw orthocenter
    }
  }
}

// 3. Bissectrices (Angle Bisectors) - Blue and Incircle - Orange
function drawBisectorsAndIncircle() {
  let actual_inradius = 0;
  if (showBisectors) {
    stroke(0, 0, 255); // Blue
    strokeWeight(1);

    // Angle bisector at A
    let vecAB_norm = p5.Vector.sub(pB, pA).normalize();
    let vecAC_norm = p5.Vector.sub(pC, pA).normalize();
    let bisectorA_dir = p5.Vector.add(vecAB_norm, vecAC_norm).normalize();
    let endA_bisector = p5.Vector.add(pA, p5.Vector.mult(bisectorA_dir, 100));
    drawInfiniteLine(pA, endA_bisector);

    // Draw equal angle arcs at A (showing bisection)
    drawEqualAngleArc(pA, pB, endA_bisector, 1);
    drawEqualAngleArc(pA, endA_bisector, pC, 1);

    // Angle bisector at B
    let vecBA_norm = p5.Vector.sub(pA, pB).normalize();
    let vecBC_norm = p5.Vector.sub(pC, pB).normalize();
    let bisectorB_dir = p5.Vector.add(vecBA_norm, vecBC_norm).normalize();
    let endB_bisector = p5.Vector.add(pB, p5.Vector.mult(bisectorB_dir, 100));
    drawInfiniteLine(pB, endB_bisector);

    // Draw equal angle arcs at B (showing bisection)
    drawEqualAngleArc(pB, pA, endB_bisector, 2);
    drawEqualAngleArc(pB, endB_bisector, pC, 2);

    // Angle bisector at C
    let vecCA_norm = p5.Vector.sub(pA, pC).normalize();
    let vecCB_norm = p5.Vector.sub(pB, pC).normalize();
    let bisectorC_dir = p5.Vector.add(vecCA_norm, vecCB_norm).normalize();
    let endC_bisector = p5.Vector.add(pC, p5.Vector.mult(bisectorC_dir, 100));
    drawInfiniteLine(pC, endC_bisector);

    // Draw equal angle arcs at C (showing bisection)
    drawEqualAngleArc(pC, pB, endC_bisector, 3);
    drawEqualAngleArc(pC, endC_bisector, pA, 3);

    const incenter = lineLineIntersection(pA, endA_bisector, pB, endB_bisector);
    if (incenter) {
      fill(0, 0, 255);
      noStroke();
      ellipse(incenter.x, incenter.y, 6); // Draw incenter

      // Calculate inradius for incircle and metrics
      actual_inradius = distPointLine(incenter, pA, pB);

      // 6. Ingeschreven Cirkel (Incircle) - Orange
      if (showIncircle) {
        stroke(255, 165, 0); // Orange
        noFill();
        ellipse(incenter.x, incenter.y, actual_inradius * 2);
      }
    }
  } else if (showIncircle) {
    // Need to calculate incenter even if bisectors are hidden, for incircle
    let vecAB_norm = p5.Vector.sub(pB, pA).normalize();
    let vecAC_norm = p5.Vector.sub(pC, pA).normalize();
    let bisectorA_dir = p5.Vector.add(vecAB_norm, vecAC_norm).normalize();
    let endA_bisector = p5.Vector.add(pA, p5.Vector.mult(bisectorA_dir, 100));

    let vecBA_norm = p5.Vector.sub(pA, pB).normalize();
    let vecBC_norm = p5.Vector.sub(pC, pB).normalize();
    let bisectorB_dir = p5.Vector.add(vecBA_norm, vecBC_norm).normalize();
    let endB_bisector = p5.Vector.add(pB, p5.Vector.mult(bisectorB_dir, 100));

    const incenter = lineLineIntersection(pA, endA_bisector, pB, endB_bisector);
    if (incenter) {
      actual_inradius = distPointLine(incenter, pA, pB);
      stroke(255, 165, 0); // Orange
      noFill();
      ellipse(incenter.x, incenter.y, actual_inradius * 2);
    }
  }
  return actual_inradius;
}

// 4. Middelloodlijnen (Perpendicular Bisectors) - Purple and Circumcircle - Cyan
function drawPerpBisectorsAndCircumcircle() {
  let actual_circumradius = 0;
  if (showPerpBisectors) {
    stroke(128, 0, 128); // Purple
    strokeWeight(1);

    // Perpendicular bisector of AB
    const midAB_pb = getMidpoint(pA, pB);
    const normalAB_pb = p5.Vector.sub(pB, pA).normalize().rotate(HALF_PI);
    const end1_perpAB = p5.Vector.add(midAB_pb, p5.Vector.mult(normalAB_pb, 100));
    const end2_perpAB = p5.Vector.sub(midAB_pb, p5.Vector.mult(normalAB_pb, 100));
    drawInfiniteLine(end1_perpAB, end2_perpAB);

    // Draw equal segment marks and right angle indicator for AB
    drawEqualSegmentMarks(pA, midAB_pb, 1);
    drawEqualSegmentMarks(midAB_pb, pB, 1);
    drawRightAngleIndicator(midAB_pb, pA, end1_perpAB);

    // Perpendicular bisector of BC
    const midBC_pb = getMidpoint(pB, pC);
    const normalBC_pb = p5.Vector.sub(pC, pB).normalize().rotate(HALF_PI);
    const end1_perpBC = p5.Vector.add(midBC_pb, p5.Vector.mult(normalBC_pb, 100));
    const end2_perpBC = p5.Vector.sub(midBC_pb, p5.Vector.mult(normalBC_pb, 100));
    drawInfiniteLine(end1_perpBC, end2_perpBC);

    // Draw equal segment marks and right angle indicator for BC
    drawEqualSegmentMarks(pB, midBC_pb, 2);
    drawEqualSegmentMarks(midBC_pb, pC, 2);
    drawRightAngleIndicator(midBC_pb, pB, end1_perpBC);

    // Perpendicular bisector of CA
    const midCA_pb = getMidpoint(pC, pA);
    const normalCA_pb = p5.Vector.sub(pA, pC).normalize().rotate(HALF_PI);
    const end1_perpCA = p5.Vector.add(midCA_pb, p5.Vector.mult(normalCA_pb, 100));
    const end2_perpCA = p5.Vector.sub(midCA_pb, p5.Vector.mult(normalCA_pb, 100));
    drawInfiniteLine(end1_perpCA, end2_perpCA);

    // Draw equal segment marks and right angle indicator for CA
    drawEqualSegmentMarks(pC, midCA_pb, 3);
    drawEqualSegmentMarks(midCA_pb, pA, 3);
    drawRightAngleIndicator(midCA_pb, pC, end1_perpCA);

    const circumcenter = lineLineIntersection(
      end1_perpAB,
      end2_perpAB,
      end1_perpBC,
      end2_perpBC,
    );
    if (circumcenter) {
      fill(128, 0, 128);
      noStroke();
      ellipse(circumcenter.x, circumcenter.y, 6); // Draw circumcenter

      // Calculate circumradius for circumcircle and metrics
      actual_circumradius = dist(
        circumcenter.x,
        circumcenter.y,
        pA.x,
        pA.y,
      );

      // 7. Omgeschreven Cirkel (Circumcircle) - Cyan
      if (showCircumcircle) {
        stroke(0, 255, 255); // Cyan
        noFill();
        ellipse(circumcenter.x, circumcenter.y, actual_circumradius * 2);
      }
    }
  } else if (showCircumcircle) {
    // Need to calculate circumcenter even if perp bisectors are hidden, for circumcircle
    const midAB_pb = getMidpoint(pA, pB);
    const normalAB_pb = p5.Vector.sub(pB, pA).normalize().rotate(HALF_PI);
    const end1_perpAB = p5.Vector.add(midAB_pb, p5.Vector.mult(normalAB_pb, 100));
    const end2_perpAB = p5.Vector.sub(midAB_pb, p5.Vector.mult(normalAB_pb, 100));

    const midBC_pb = getMidpoint(pB, pC);
    const normalBC_pb = p5.Vector.sub(pC, pB).normalize().rotate(HALF_PI);
    const end1_perpBC = p5.Vector.add(midBC_pb, p5.Vector.mult(normalBC_pb, 100));
    const end2_perpBC = p5.Vector.sub(midBC_pb, p5.Vector.mult(normalBC_pb, 100));

    const circumcenter = lineLineIntersection(
      end1_perpAB,
      end2_perpAB,
      end1_perpBC,
      end2_perpBC,
    );
    if (circumcenter) {
      actual_circumradius = dist(
        circumcenter.x,
        circumcenter.y,
        pA.x,
        pA.y,
      );
      stroke(0, 255, 255); // Cyan
      noFill();
      ellipse(circumcenter.x, circumcenter.y, actual_circumradius * 2);
    }
  }
  return actual_circumradius;
}
