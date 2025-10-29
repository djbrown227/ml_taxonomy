// Core ML Algorithm Visualizations - Part 1
// Basic supervised learning algorithms

// Improved K-Means Clustering Visualization with Axes and Intuition (no step label)
function visualizeKMeans(svg, width, height) {
  const margin = { top: 40, right: 40, bottom: 50, left: 50 };
  const w = width - margin.left - margin.right;
  const h = height - margin.top - margin.bottom;

  const g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Scales
  const xScale = d3.scaleLinear().domain([0, w]).range([0, w]);
  const yScale = d3.scaleLinear().domain([0, h]).range([h, 0]);

  // Axes
  g.append("g")
    .attr("transform", `translate(0,${h})`)
    .call(d3.axisBottom(xScale).ticks(5))
    .append("text")
    .attr("x", w / 2)
    .attr("y", 35)
    .attr("fill", "black")
    .attr("text-anchor", "middle")
    .text("Feature 1");

  g.append("g")
    .call(d3.axisLeft(yScale).ticks(5))
    .append("text")
    .attr("x", -h / 2)
    .attr("y", -35)
    .attr("transform", "rotate(-90)")
    .attr("fill", "black")
    .attr("text-anchor", "middle")
    .text("Feature 2");

  // Generate random data
  const numPoints = 100;
  const clusters = [
    { x: w * 0.3, y: h * 0.3, color: "#667eea" },
    { x: w * 0.7, y: h * 0.4, color: "#f093fb" },
    { x: w * 0.5, y: h * 0.7, color: "#4facfe" }
  ];

  const points = d3.range(numPoints).map(() => ({
    x: Math.random() * w,
    y: Math.random() * h,
    cluster: null
  }));

  // Assign points to nearest centroid
  function assignClusters() {
    points.forEach(p => {
      let minDist = Infinity;
      clusters.forEach(c => {
        const dist = Math.hypot(p.x - c.x, p.y - c.y);
        if (dist < minDist) {
          minDist = dist;
          p.cluster = c.color;
        }
      });
    });
  }

  // Recompute centroids
  function updateCentroids() {
    clusters.forEach(c => {
      const clusterPoints = points.filter(p => p.cluster === c.color);
      if (clusterPoints.length > 0) {
        c.x = d3.mean(clusterPoints, d => d.x);
        c.y = d3.mean(clusterPoints, d => d.y);
      }
    });
  }

  // Initial assignment
  assignClusters();

  // Draw points
  const pointSel = g.selectAll(".point")
    .data(points)
    .join("circle")
    .attr("class", "point")
    .attr("r", 4)
    .attr("cx", d => d.x)
    .attr("cy", d => yScale.invert(d.y))
    .attr("fill", d => d.cluster)
    .attr("opacity", 0.6);

  // Draw centroids
  const centroidSel = g.selectAll(".centroid")
    .data(clusters)
    .join("circle")
    .attr("class", "centroid")
    .attr("r", 10)
    .attr("cx", d => d.x)
    .attr("cy", d => yScale.invert(d.y))
    .attr("fill", d => d.color)
    .attr("stroke", "black")
    .attr("stroke-width", 2);

  // Title
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", 25)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("font-weight", "600")
    .text("K-Means Clustering (k = 3)");

  // Animation loop
  let step = 0;
  function iterate() {
    if (step >= 6) return; // stop after a few iterations

    assignClusters();

    pointSel.transition()
      .duration(800)
      .attr("fill", d => d.cluster);

    updateCentroids();

    centroidSel.transition()
      .duration(1000)
      .attr("cx", d => d.x)
      .attr("cy", d => yScale.invert(d.y))
      .on("end", () => {
        step++;
        setTimeout(iterate, 1000);
      });
  }

  iterate();
}



  
// Linear Regression Visualization – Simplified
function visualizeLinearRegression(svg, width, height) {
  const margin = { top: 60, right: 40, bottom: 55, left: 60 };
  const w = width - margin.left - margin.right;
  const h = height - margin.top - margin.bottom;

  const g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // === 1. Generate synthetic data with noise ===
  const data = [];
  const trueIntercept = 0.3;
  const trueSlope = 0.6;

  for (let i = 0; i < 50; i++) {
    const x = i / 50;
    const y = trueIntercept + trueSlope * x + (Math.random() - 0.5) * 0.2;
    data.push({ x, y });
  }

  // === 2. Scales ===
  const xScale = d3.scaleLinear().domain([0, 1]).range([0, w]);
  const yScale = d3.scaleLinear().domain([0, 1]).range([h, 0]);

  // === 3. Axes ===
  g.append("g")
    .attr("transform", `translate(0,${h})`)
    .call(d3.axisBottom(xScale).ticks(5))
    .selectAll("text")
    .style("font-size", "11px");

  g.append("g")
    .call(d3.axisLeft(yScale).ticks(5))
    .selectAll("text")
    .style("font-size", "11px");

  // Axis Labels
  g.append("text")
    .attr("x", w / 2)
    .attr("y", h + 40)
    .attr("text-anchor", "middle")
    .style("font-size", "12px")
    .text("Feature (x)");

  g.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -h / 2)
    .attr("y", -45)
    .attr("text-anchor", "middle")
    .style("font-size", "12px")
    .text("Target (y)");

  // === 4. Regression Line ===
  const regression = { m: trueSlope, b: trueIntercept };
  const lineY = x => regression.b + regression.m * x;

  // Confidence band
  const bandData = d3.range(0, 1.01, 0.02).map(x => ({
    x,
    y1: lineY(x) + 0.08,
    y2: lineY(x) - 0.08
  }));

  g.append("path")
    .datum(bandData)
    .attr("d", d3.area()
      .x(d => xScale(d.x))
      .y0(d => yScale(d.y1))
      .y1(d => yScale(d.y2))
      .curve(d3.curveBasis))
    .attr("fill", "#c3dafe")
    .attr("opacity", 0.4);

  // Regression line
  g.append("line")
    .attr("x1", xScale(0))
    .attr("y1", yScale(lineY(0)))
    .attr("x2", xScale(1))
    .attr("y2", yScale(lineY(1)))
    .attr("stroke", "#5a67d8")
    .attr("stroke-width", 3);

  // === 5. Residual lines ===
  g.selectAll(".residual")
    .data(data)
    .join("line")
    .attr("class", "residual")
    .attr("x1", d => xScale(d.x))
    .attr("x2", d => xScale(d.x))
    .attr("y1", d => yScale(d.y))
    .attr("y2", d => yScale(lineY(d.x)))
    .attr("stroke", "#fc8181")
    .attr("stroke-width", 1.5)
    .attr("opacity", 0.8);

  // === 6. Data points ===
  g.selectAll(".point")
    .data(data)
    .join("circle")
    .attr("class", "point")
    .attr("cx", d => xScale(d.x))
    .attr("cy", d => yScale(d.y))
    .attr("r", 5)
    .attr("fill", "#4facfe")
    .attr("opacity", 0.8);
}


  
  
// Neural Network Visualization – Conceptual Demo
function visualizeNeuralNetwork(svg, width, height) {
  const margin = { top: 60, right: 40, bottom: 60, left: 40 };
  const w = width - margin.left - margin.right;
  const h = height - margin.top - margin.bottom;
  
  const g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);
  
  // Define layers and neurons
  const layers = [
    { neurons: 3, x: 100, label: "Input" },
    { neurons: 4, x: 300, label: "Hidden 1" },
    { neurons: 4, x: 500, label: "Hidden 2" },
    { neurons: 2, x: 700, label: "Output" }
  ];
  
  const nodeRadius = 20;
  
  // Draw connections between layers
  for (let i = 0; i < layers.length - 1; i++) {
    const layer1 = layers[i];
    const layer2 = layers[i + 1];
    
    for (let j = 0; j < layer1.neurons; j++) {
      for (let k = 0; k < layer2.neurons; k++) {
        const y1 = (h / (layer1.neurons + 1)) * (j + 1);
        const y2 = (h / (layer2.neurons + 1)) * (k + 1);
        
        g.append("line")
          .attr("x1", layer1.x)
          .attr("y1", y1)
          .attr("x2", layer2.x)
          .attr("y2", y2)
          .attr("stroke", "#aaa")
          .attr("stroke-width", 1)
          .attr("opacity", 0.3);
      }
    }
  }
  
  // Draw neurons and conceptual labels
  layers.forEach((layer, layerIndex) => {
    const neuronColor = d3.interpolateBlues((layerIndex + 1) / layers.length);
    
    for (let i = 0; i < layer.neurons; i++) {
      const y = (h / (layer.neurons + 1)) * (i + 1);
      
      // Neuron circle
      g.append("circle")
        .attr("cx", layer.x)
        .attr("cy", y)
        .attr("r", nodeRadius)
        .attr("fill", neuronColor)
        .attr("stroke", "#000")
        .attr("stroke-width", 1.5);
      
      // Conceptual label above neuron
      g.append("text")
        .attr("x", layer.x)
        .attr("y", y - nodeRadius - 5)
        .attr("text-anchor", "middle")
        .style("font-size", "10px")
        .attr("fill", "#333")
        .text(layerIndex === 0 ? `x${i+1}` : `Σ·w + b → σ`);
    }
    
    // Layer label below
    g.append("text")
      .attr("x", layer.x)
      .attr("y", h + 30)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("font-weight", "600")
      .text(layer.label);
  });
  
  // Optional explanation
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", 25)
    .attr("text-anchor", "middle")
    .style("font-size", "14px")
    .style("font-weight", "600")
    .text("Neural Network: weighted sums + activation → predictions");
}

  /*
  // k-Nearest Neighbors Visualization
  function visualizeKNN(svg, width, height) {
    const margin = {top: 60, right: 40, bottom: 60, left: 40};
    const w = width - margin.left - margin.right;
    const h = height - margin.top - margin.bottom;
    
    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
    
    // Generate data points
    const classA = Array.from({length: 20}, () => ({
      x: w * 0.3 + (Math.random() - 0.5) * 150,
      y: h * 0.4 + (Math.random() - 0.5) * 150,
      class: "A"
    }));
    
    const classB = Array.from({length: 20}, () => ({
      x: w * 0.7 + (Math.random() - 0.5) * 150,
      y: h * 0.6 + (Math.random() - 0.5) * 150,
      class: "B"
    }));
    
    const points = [...classA, ...classB];
    const testPoint = {x: w * 0.5, y: h * 0.5};
    
    // Draw points
    g.selectAll(".point")
      .data(points)
      .join("circle")
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .attr("r", 6)
      .attr("fill", d => d.class === "A" ? "#667eea" : "#f093fb")
      .attr("opacity", 0.6);
    
    // Draw test point
    g.append("circle")
      .attr("cx", testPoint.x)
      .attr("cy", testPoint.y)
      .attr("r", 10)
      .attr("fill", "#4facfe")
      .attr("stroke", "#000")
      .attr("stroke-width", 3);
    
    // Draw circle around test point (k=5)
    g.append("circle")
      .attr("cx", testPoint.x)
      .attr("cy", testPoint.y)
      .attr("r", 100)
      .attr("fill", "none")
      .attr("stroke", "#4facfe")
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", "5,5");
    
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", 25)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-weight", "600")
      .text("k-Nearest Neighbors (k=5)");
    
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height - 15)
      .attr("text-anchor", "middle")
      .style("font-size", "13px")
      .style("fill", "#666")
      .text("Classify blue point based on nearest neighbors within circle");
  }
  */

// PCA Visualization – Conceptual Demo
function visualizePCA(svg, width, height) {
  const margin = { top: 60, right: 40, bottom: 50, left: 60 };
  const w = width - margin.left - margin.right;
  const h = height - margin.top - margin.bottom;
  
  const g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);
  
  // Generate correlated 2D data
  const data = Array.from({ length: 100 }, () => {
    const t = Math.random() * 2 - 1;
    return {
      x: 0.5 + 0.4 * t + (Math.random() - 0.5) * 0.2,
      y: 0.5 + 0.3 * t + (Math.random() - 0.5) * 0.15
    };
  });
  
  const xScale = d3.scaleLinear().domain([0, 1]).range([0, w]);
  const yScale = d3.scaleLinear().domain([0, 1]).range([h, 0]);
  
  // Draw points
  g.selectAll(".point")
    .data(data)
    .join("circle")
    .attr("cx", d => xScale(d.x))
    .attr("cy", d => yScale(d.y))
    .attr("r", 4)
    .attr("fill", "#667eea")
    .attr("opacity", 0.5);
  
  // Draw principal components with arrows
  const pc1 = { x1: 0.1, y1: 0.27, x2: 0.9, y2: 0.73 };
  const pc2 = { x1: 0.3, y1: 0.7, x2: 0.7, y2: 0.3 };
  
  // PC1
  g.append("line")
    .attr("x1", xScale(pc1.x1))
    .attr("y1", yScale(pc1.y1))
    .attr("x2", xScale(pc1.x2))
    .attr("y2", yScale(pc1.y2))
    .attr("stroke", "#f093fb")
    .attr("stroke-width", 3)
    .attr("marker-end", "url(#arrow)");
  
  // PC1 label
  g.append("text")
    .attr("x", xScale(pc1.x2) + 5)
    .attr("y", yScale(pc1.y2))
    .style("font-size", "12px")
    .attr("fill", "#f093fb")
    .text("PC1 (max variance)");
  
  // PC2
  g.append("line")
    .attr("x1", xScale(pc2.x1))
    .attr("y1", yScale(pc2.y1))
    .attr("x2", xScale(pc2.x2))
    .attr("y2", yScale(pc2.y2))
    .attr("stroke", "#4facfe")
    .attr("stroke-width", 3)
    .attr("marker-end", "url(#arrow)");
  
  // PC2 label
  g.append("text")
    .attr("x", xScale(pc2.x2) + 5)
    .attr("y", yScale(pc2.y2))
    .style("font-size", "12px")
    .attr("fill", "#4facfe")
    .text("PC2");
  
  // Define arrow marker
  svg.append("defs")
    .append("marker")
    .attr("id", "arrow")
    .attr("viewBox", [0, 0, 6, 6])
    .attr("refX", 3)
    .attr("refY", 3)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto-start-reverse")
    .append("path")
    .attr("d", "M0,0 L6,3 L0,6 Z")
    .attr("fill", "#000");
  
  // Axes
  g.append("g")
    .attr("transform", `translate(0,${h})`)
    .call(d3.axisBottom(xScale).ticks(5));
  
  g.append("g")
    .call(d3.axisLeft(yScale).ticks(5));
  
  // Conceptual note
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", 25)
    .attr("text-anchor", "middle")
    .style("font-size", "14px")
    .style("font-weight", "600")
    .text("PCA: find directions that maximize variance in the data");
}

  
// Random Forest Visualization – Conceptual Demo
function visualizeRandomForest(svg, width, height) {
  const margin = {top: 60, right: 40, bottom: 40, left: 40};
  const w = width - margin.left - margin.right;
  const h = height - margin.top - margin.bottom;

  const g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const treePositions = [
    {x: w * 0.2, label: "Tree 1", color: "#f56565"},
    {x: w * 0.5, label: "Tree 2", color: "#48bb78"},
    {x: w * 0.8, label: "Tree 3", color: "#4299e1"}
  ];

  treePositions.forEach((pos, idx) => {
    // Draw a shaded box to indicate this tree's data subset
    g.append("rect")
      .attr("x", pos.x - 50)
      .attr("y", h * 0.05)
      .attr("width", 100)
      .attr("height", h * 0.25)
      .attr("fill", pos.color)
      .attr("opacity", 0.1)
      .attr("stroke", pos.color)
      .attr("stroke-dasharray", "4 4");

    // Draw root node
    g.append("circle")
      .attr("cx", pos.x)
      .attr("cy", h * 0.2)
      .attr("r", 15)
      .attr("fill", pos.color)
      .attr("stroke", "#000")
      .attr("stroke-width", 2);

    // Draw child nodes
    const children = [
      {x: pos.x - 40, y: h * 0.5},
      {x: pos.x + 40, y: h * 0.5}
    ];

    children.forEach(child => {
      g.append("line")
        .attr("x1", pos.x)
        .attr("y1", h * 0.2)
        .attr("x2", child.x)
        .attr("y2", child.y)
        .attr("stroke", "#999")
        .attr("stroke-width", 2);

      g.append("circle")
        .attr("cx", child.x)
        .attr("cy", child.y)
        .attr("r", 12)
        .attr("fill", pos.color)
        .attr("stroke", "#000")
        .attr("stroke-width", 2);
    });

    // Tree label
    g.append("text")
      .attr("x", pos.x)
      .attr("y", h * 0.7)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("font-weight", "600")
      .text(pos.label);

    // Draw sampled data points for this tree
    for (let j = 0; j < 10; j++) {
      g.append("circle")
        .attr("cx", pos.x - 40 + Math.random() * 80)
        .attr("cy", h * 0.05 + Math.random() * h * 0.25)
        .attr("r", 4)
        .attr("fill", pos.color)
        .attr("opacity", 0.7);
    }
  });

  // Voting arrow / ensemble
  g.append("text")
    .attr("x", w / 2)
    .attr("y", h * 0.85)
    .attr("text-anchor", "middle")
    .style("font-size", "14px")
    .style("font-weight", "600")
    .text("↓ Majority Vote ↓");

  // Title
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", 25)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("font-weight", "600")
    .text("Random Forest: Ensemble of Decision Trees");
}


  
  // SVM Visualization
  function visualizeSVM(svg, width, height) {
    const margin = {top: 60, right: 40, bottom: 40, left: 40};
    const w = width - margin.left - margin.right;
    const h = height - margin.top - margin.bottom;
    
    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
    
    // Generate two classes of points
    const classA = Array.from({length: 30}, () => ({
      x: w * 0.25 + (Math.random() - 0.5) * 150,
      y: h * 0.5 + (Math.random() - 0.5) * 200,
      class: "A"
    }));
    
    const classB = Array.from({length: 30}, () => ({
      x: w * 0.75 + (Math.random() - 0.5) * 150,
      y: h * 0.5 + (Math.random() - 0.5) * 200,
      class: "B"
    }));
    
    const points = [...classA, ...classB];
    
    // Draw points
    g.selectAll(".point")
      .data(points)
      .join("circle")
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .attr("r", 5)
      .attr("fill", d => d.class === "A" ? "#667eea" : "#f093fb")
      .attr("opacity", 0.6);
    
    // Draw decision boundary (vertical line)
    g.append("line")
      .attr("x1", w / 2)
      .attr("y1", 0)
      .attr("x2", w / 2)
      .attr("y2", h)
      .attr("stroke", "#000")
      .attr("stroke-width", 3);
    
    // Draw margin lines
    g.append("line")
      .attr("x1", w / 2 - 60)
      .attr("y1", 0)
      .attr("x2", w / 2 - 60)
      .attr("y2", h)
      .attr("stroke", "#4facfe")
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", "5,5");
    
    g.append("line")
      .attr("x1", w / 2 + 60)
      .attr("y1", 0)
      .attr("x2", w / 2 + 60)
      .attr("y2", h)
      .attr("stroke", "#4facfe")
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", "5,5");
    
    // Support vectors
    g.append("circle")
      .attr("cx", w / 2 - 60)
      .attr("cy", h * 0.3)
      .attr("r", 8)
      .attr("fill", "none")
      .attr("stroke", "#000")
      .attr("stroke-width", 3);
    
    g.append("circle")
      .attr("cx", w / 2 + 60)
      .attr("cy", h * 0.6)
      .attr("r", 8)
      .attr("fill", "none")
      .attr("stroke", "#000")
      .attr("stroke-width", 3);
    
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", 25)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-weight", "600")
      .text("Support Vector Machine (SVM)");
    
    // Legend
    g.append("text")
      .attr("x", w / 2)
      .attr("y", h - 20)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("fill", "#666")
      .text("Maximizes margin between classes");
  }
  
  // Logistic Regression Visualization
  function visualizeLogisticRegression(svg, width, height) {
    const margin = {top: 60, right: 40, bottom: 50, left: 60};
    const w = width - margin.left - margin.right;
    const h = height - margin.top - margin.bottom;
    
    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
    
    // Generate points for two classes
    const data = [];
    for (let i = 0; i < 40; i++) {
      const x = Math.random();
      const prob = 1 / (1 + Math.exp(-10 * (x - 0.5)));
      const y = Math.random() < prob ? 1 : 0;
      data.push({x, y: y + (Math.random() - 0.5) * 0.1});
    }
    
    const xScale = d3.scaleLinear().domain([0, 1]).range([0, w]);
    const yScale = d3.scaleLinear().domain([-0.2, 1.2]).range([h, 0]);
    
    // Axes
    g.append("g")
      .attr("transform", `translate(0,${h})`)
      .call(d3.axisBottom(xScale));
    
    g.append("g")
      .call(d3.axisLeft(yScale).ticks(2).tickFormat(d => d === 0 ? "Class 0" : d === 1 ? "Class 1" : ""));
    
    // Sigmoid curve
    const sigmoidData = [];
    for (let i = 0; i <= 100; i++) {
      const x = i / 100;
      const y = 1 / (1 + Math.exp(-10 * (x - 0.5)));
      sigmoidData.push({x, y});
    }
    
    const line = d3.line()
      .x(d => xScale(d.x))
      .y(d => yScale(d.y));
    
    g.append("path")
      .datum(sigmoidData)
      .attr("d", line)
      .attr("fill", "none")
      .attr("stroke", "#667eea")
      .attr("stroke-width", 3);
    
    // Data points
    g.selectAll(".point")
      .data(data)
      .join("circle")
      .attr("cx", d => xScale(d.x))
      .attr("cy", d => yScale(d.y))
      .attr("r", 5)
      .attr("fill", d => d.y > 0.5 ? "#f093fb" : "#4facfe")
      .attr("opacity", 0.6);
    
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", 25)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-weight", "600")
      .text("Logistic Regression: Sigmoid Function");
    
    g.append("text")
      .attr("x", w / 2)
      .attr("y", h + 40)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .text("Feature Value");
  }
  
  // Generic placeholder for other algorithms
  function visualizeGeneric(svg, width, height, algorithmName) {
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height / 2 - 20)
      .attr("text-anchor", "middle")
      .style("font-size", "18px")
      .style("fill", "#999")
      .text(`Visualization for ${algorithmName}`);
    
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height / 2 + 20)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .style("fill", "#bbb")
      .text("coming soon!");
  }

  // Decision Tree Visualization
function visualizeDecisionTree(svg, width, height) {
  const margin = {top: 60, right: 40, bottom: 60, left: 40};
  const w = width - margin.left - margin.right;
  const h = height - margin.top - margin.bottom;
  
  const g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Example tree structure
  const treeData = {
    name: "Feature A ≤ 5",
    children: [
      {
        name: "Feature B ≤ 3",
        children: [
          {name: "Class 0", leaf: true},
          {name: "Class 1", leaf: true}
        ]
      },
      {
        name: "Feature B ≤ 7",
        children: [
          {name: "Class 1", leaf: true},
          {name: "Class 0", leaf: true}
        ]
      }
    ]
  };

  // D3 tree layout
  const root = d3.hierarchy(treeData);
  const treeLayout = d3.tree().size([w, h]);
  treeLayout(root);

  // Links
  g.selectAll(".link")
    .data(root.links())
    .join("line")
    .attr("x1", d => d.source.x)
    .attr("y1", d => d.source.y)
    .attr("x2", d => d.target.x)
    .attr("y2", d => d.target.y)
    .attr("stroke", "#999")
    .attr("stroke-width", 2);

  // Nodes
  g.selectAll(".node")
    .data(root.descendants())
    .join("circle")
    .attr("cx", d => d.x)
    .attr("cy", d => d.y)
    .attr("r", d => d.data.leaf ? 12 : 10)
    .attr("fill", d => d.data.leaf ? "#f093fb" : "#667eea")
    .attr("stroke", "#000")
    .attr("stroke-width", 2);

  // Labels
  g.selectAll(".label")
    .data(root.descendants())
    .join("text")
    .attr("x", d => d.x)
    .attr("y", d => d.y - 15)
    .attr("text-anchor", "middle")
    .style("font-size", "12px")
    .style("font-weight", "600")
    .text(d => d.data.name);

  // Title
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", 25)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("font-weight", "600")
    .text("Decision Tree: Feature-based Splits");
}

// Isolation Forest Visualization (Conceptual)
function visualizeIsolationForest(svg, width, height) {
  const margin = {top: 60, right: 40, bottom: 60, left: 40};
  const w = width - margin.left - margin.right;
  const h = height - margin.top - margin.bottom;

  const g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const numTrees = 3;
  const treeSpacing = w / (numTrees + 1);

  // Generate synthetic data
  const points = Array.from({length: 30}, () => ({
    x: Math.random() * 80,
    y: Math.random() * 80,
    anomaly: Math.random() < 0.1
  }));

  for (let t = 0; t < numTrees; t++) {
    const offsetX = treeSpacing * (t + 1);

    // Draw tree box
    g.append("rect")
      .attr("x", offsetX - 40)
      .attr("y", 20)
      .attr("width", 80)
      .attr("height", h - 60)
      .attr("fill", "#fff")
      .attr("stroke", "#667eea")
      .attr("stroke-width", 2)
      .attr("rx", 5);

    // Tree label
    g.append("text")
      .attr("x", offsetX)
      .attr("y", 15)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("font-weight", "600")
      .text(`Tree ${t + 1}`);

    // Draw isolation splits (grid lines)
    for (let i = 1; i <= 3; i++) {
      g.append("line")
        .attr("x1", offsetX - 40)
        .attr("y1", 20 + (i * (h - 60) / 4))
        .attr("x2", offsetX + 40)
        .attr("y2", 20 + (i * (h - 60) / 4))
        .attr("stroke", "#ccc")
        .attr("stroke-dasharray", "4,2");

      g.append("line")
        .attr("x1", offsetX - 40 + i * 80 / 4)
        .attr("y1", 20)
        .attr("x2", offsetX - 40 + i * 80 / 4)
        .attr("y2", h - 40)
        .attr("stroke", "#ccc")
        .attr("stroke-dasharray", "4,2");
    }

    // Draw points inside the tree
    g.selectAll(`.point-${t}`)
      .data(points)
      .join("circle")
      .attr("cx", d => offsetX - 40 + d.x * 80 / 100)
      .attr("cy", d => 20 + d.y * (h - 60) / 100)
      .attr("r", 5)
      .attr("fill", d => d.anomaly ? "#ff4d4d" : "#4facfe")
      .attr("opacity", 0.8);

    // Highlight isolation paths for anomalies (optional)
    points.filter(d => d.anomaly).forEach(d => {
      g.append("line")
        .attr("x1", offsetX - 40 + d.x * 80 / 100)
        .attr("y1", 20)
        .attr("x2", offsetX - 40 + d.x * 80 / 100)
        .attr("y2", 20 + d.y * (h - 60) / 100)
        .attr("stroke", "#ff4d4d")
        .attr("stroke-width", 1.5)
        .attr("stroke-dasharray", "3,2");
    });
  }

  // Title
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", 25)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("font-weight", "600")
    .text("Isolation Forest: Using Trees to Detect Anomalies");

  // Explanation
  g.append("text")
    .attr("x", w / 2)
    .attr("y", h + 30)
    .attr("text-anchor", "middle")
    .style("font-size", "13px")
    .style("fill", "#666")
    .text("Red points are anomalies; paths show how they are isolated quickly by trees");
}
