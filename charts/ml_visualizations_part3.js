// Additional ML Algorithm Visualizations - Part 3
// Advanced algorithms: Time Series, RL, Generative Models

// t-SNE Visualization
function visualizeTSNE(svg, width, height) {
    const margin = {top: 60, right: 40, bottom: 40, left: 40};
    const w = width - margin.left - margin.right;
    const h = height - margin.top - margin.bottom;
    
    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
    
    // Simulate high-dimensional data projected to 2D
    const clusters = [
      {cx: w * 0.25, cy: h * 0.3, n: 30, color: "#667eea"},
      {cx: w * 0.75, cy: h * 0.35, n: 30, color: "#f093fb"},
      {cx: w * 0.5, cy: h * 0.7, n: 30, color: "#4facfe"}
    ];
    
    const points = [];
    clusters.forEach(cluster => {
      for (let i = 0; i < cluster.n; i++) {
        points.push({
          x: cluster.cx + (Math.random() - 0.5) * 100,
          y: cluster.cy + (Math.random() - 0.5) * 100,
          color: cluster.color
        });
      }
    });
    
    // Draw points
    g.selectAll(".point")
      .data(points)
      .join("circle")
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .attr("r", 5)
      .attr("fill", d => d.color)
      .attr("opacity", 0.7);
    
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", 25)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-weight", "600")
      .text("t-SNE: High-Dimensional → 2D Projection");
    
    // Axes labels
    g.append("text")
      .attr("x", w / 2)
      .attr("y", h + 30)
      .attr("text-anchor", "middle")
      .style("font-size", "11px")
      .style("fill", "#999")
      .text("Component 1");
    
    g.append("text")
      .attr("transform", `translate(-30, ${h/2}) rotate(-90)`)
      .attr("text-anchor", "middle")
      .style("font-size", "11px")
      .style("fill", "#999")
      .text("Component 2");
  }
  
  /*
// UMAP Visualization: Dimensionality Reduction Preserving Topology
function visualizeUMAP(svg, width, height) {
  const margin = { top: 60, right: 40, bottom: 60, left: 40 };
  const w = width - margin.left - margin.right;
  const h = height - margin.top - margin.bottom;

  const g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Parameters
  const numPoints = 120;
  const numClusters = 4;
  const manifoldRadius = 100;
  const noiseLevel = 15;

  // Generate points along a smooth 2D manifold (like a curved high-dimensional structure)
  const points = [];
  for (let i = 0; i < numPoints; i++) {
    const t = (i / numPoints) * 2 * Math.PI;         // parameter along manifold
    const cluster = Math.floor((t / (2 * Math.PI)) * numClusters); // cluster assignment
    const r = manifoldRadius + Math.random() * 10;   // slight radius variation
    points.push({
      x: w / 2 + r * Math.cos(t) + (Math.random() - 0.5) * noiseLevel,
      y: h / 2 + r * Math.sin(t) + (Math.random() - 0.5) * noiseLevel,
      cluster: cluster
    });
  }

  // Draw local neighborhood connections to illustrate topology preservation
  const epsilon = 25;
  points.forEach(p => {
    points.forEach(q => {
      const dx = p.x - q.x;
      const dy = p.y - q.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < epsilon && p !== q) {
        g.append("line")
          .attr("x1", p.x)
          .attr("y1", p.y)
          .attr("x2", q.x)
          .attr("y2", q.y)
          .attr("stroke", "#ccc")
          .attr("stroke-width", 1)
          .attr("opacity", 0.3);
      }
    });
  });

  // Assign colors for clusters to highlight structure
  const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

  // Draw points
  g.selectAll(".point")
    .data(points)
    .join("circle")
    .attr("cx", d => d.x)
    .attr("cy", d => d.y)
    .attr("r", 6)
    .attr("fill", d => colorScale(d.cluster))
    .attr("opacity", 0.9)
    .attr("stroke", "#333")
    .attr("stroke-width", 0.5);

  // Title
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", 25)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("font-weight", "600")
    .text("UMAP: Visualizing High-Dimensional Data in 2D");

  // Explanation
  g.append("text")
    .attr("x", w / 2)
    .attr("y", h + 40)
    .attr("text-anchor", "middle")
    .style("font-size", "13px")
    .style("fill", "#666")
    .text("Points preserve local and global structure; colors show clusters");
}
*/
  
// Autoencoder Visualization: Compression & Reconstruction
function visualizeAutoencoder(svg, width, height) {
  const margin = {top: 60, right: 60, bottom: 50, left: 60};
  const w = width - margin.left - margin.right;
  const h = height - margin.top - margin.bottom;

  const g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const layers = [
    {neurons: 5, x: 0, label: "Input\n(High-D)"},
    {neurons: 3, x: w * 0.35, label: "Encoder"},
    {neurons: 2, x: w * 0.5, label: "Latent\n(Low-D)"},
    {neurons: 3, x: w * 0.65, label: "Decoder"},
    {neurons: 5, x: w, label: "Output\n(Reconstructed)"}
  ];

  // Draw connections with arrows toward latent space
  for (let i = 0; i < layers.length - 1; i++) {
    const l1 = layers[i];
    const l2 = layers[i + 1];

    for (let j = 0; j < l1.neurons; j++) {
      for (let k = 0; k < l2.neurons; k++) {
        const y1 = (h / (l1.neurons + 1)) * (j + 1);
        const y2 = (h / (l2.neurons + 1)) * (k + 1);

        g.append("line")
          .attr("x1", l1.x)
          .attr("y1", y1)
          .attr("x2", l2.x)
          .attr("y2", y2)
          .attr("stroke", "#ddd")
          .attr("stroke-width", 1)
          .attr("opacity", l2.x === layers[2].x ? 0.8 : 0.3); // emphasize bottleneck
      }
    }
  }

  // Draw neurons
  layers.forEach((layer, layerIdx) => {
    for (let i = 0; i < layer.neurons; i++) {
      const y = (h / (layer.neurons + 1)) * (i + 1);
      g.append("circle")
        .attr("cx", layer.x)
        .attr("cy", y)
        .attr("r", layerIdx === 2 ? 14 : 10)
        .attr("fill", layerIdx === 2 ? "#f093fb" : "#667eea")
        .attr("stroke", "#000")
        .attr("stroke-width", 2);
    }

    // Layer labels
    g.append("text")
      .attr("x", layer.x)
      .attr("y", h + 35)
      .attr("text-anchor", "middle")
      .style("font-size", "10px")
      .style("font-weight", "600")
      .selectAll("tspan")
      .data(layer.label.split("\n"))
      .join("tspan")
      .attr("x", layer.x)
      .attr("dy", (d, i) => i * 12)
      .text(d => d);
  });

  // Show compression factor
  g.append("text")
    .attr("x", (layers[0].x + layers[2].x)/2)
    .attr("y", h + 15)
    .attr("text-anchor", "middle")
    .style("font-size", "12px")
    .style("fill", "#666")
    .text("Compression: 5 → 2");

  g.append("text")
    .attr("x", (layers[2].x + layers[4].x)/2)
    .attr("y", h + 15)
    .attr("text-anchor", "middle")
    .style("font-size", "12px")
    .style("fill", "#666")
    .text("Reconstruction: 2 → 5");

  // Title
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", 25)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("font-weight", "600")
    .text("Autoencoder: Compression & Reconstruction");
}

  
  // ARIMA Time Series Visualization
  function visualizeARIMA(svg, width, height) {
    const margin = {top: 60, right: 40, bottom: 50, left: 60};
    const w = width - margin.left - margin.right;
    const h = height - margin.top - margin.bottom;
    
    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
    
    // Generate time series data with trend and seasonality
    const data = [];
    const forecast = [];
    for (let i = 0; i < 100; i++) {
      const t = i / 100;
      const trend = 0.3 + 0.4 * t;
      const seasonal = 0.1 * Math.sin(t * 4 * Math.PI);
      const noise = (Math.random() - 0.5) * 0.05;
      
      if (i < 70) {
        data.push({t: t, y: trend + seasonal + noise, type: "historical"});
      } else {
        forecast.push({t: t, y: trend + seasonal + noise, type: "forecast"});
      }
    }
    
    const xScale = d3.scaleLinear().domain([0, 1]).range([0, w]);
    const yScale = d3.scaleLinear().domain([0, 1]).range([h, 0]);
    
    // Axes
    g.append("g")
      .attr("transform", `translate(0,${h})`)
      .call(d3.axisBottom(xScale));
    
    g.append("g")
      .call(d3.axisLeft(yScale));
    
    // Historical data line
    const line = d3.line()
      .x(d => xScale(d.t))
      .y(d => yScale(d.y));
    
    g.append("path")
      .datum(data)
      .attr("d", line)
      .attr("fill", "none")
      .attr("stroke", "#667eea")
      .attr("stroke-width", 2);
    
    // Forecast line
    g.append("path")
      .datum([data[data.length - 1], ...forecast])
      .attr("d", line)
      .attr("fill", "none")
      .attr("stroke", "#f093fb")
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", "5,5");
    
    // Vertical line separating historical/forecast
    g.append("line")
      .attr("x1", xScale(0.7))
      .attr("y1", 0)
      .attr("x2", xScale(0.7))
      .attr("y2", h)
      .attr("stroke", "#999")
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "3,3");
    
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", 25)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-weight", "600")
      .text("ARIMA: Time Series Forecasting");
    
    g.append("text")
      .attr("x", w / 2)
      .attr("y", h + 40)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .text("Time");
  }
  
// LSTM/RNN Visualization: Sequential + Memory Flow
function visualizeLSTM(svg, width, height) {
  const margin = {top: 60, right: 40, bottom: 60, left: 40};
  const w = width - margin.left - margin.right;
  const h = height - margin.top - margin.bottom;

  const g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const numCells = 5;
  const cellWidth = 80;
  const cellHeight = 100;
  const spacing = (w - numCells * cellWidth) / (numCells + 1);
  
  // Arrow marker for connections
  svg.append("defs").append("marker")
    .attr("id", "arrowhead")
    .attr("markerWidth", 10)
    .attr("markerHeight", 10)
    .attr("refX", 9)
    .attr("refY", 3)
    .attr("orient", "auto")
    .append("polygon")
    .attr("points", "0 0, 10 3, 0 6")
    .attr("fill", "#f093fb");

  for (let i = 0; i < numCells; i++) {
    const x = spacing + i * (cellWidth + spacing);
    const y = h / 2 - cellHeight / 2;

    // Cell body
    g.append("rect")
      .attr("x", x)
      .attr("y", y)
      .attr("width", cellWidth)
      .attr("height", cellHeight)
      .attr("rx", 8)
      .attr("fill", "#667eea")
      .attr("stroke", "#000")
      .attr("stroke-width", 2);

    // Cell state representation (memory)
    g.append("rect")
      .attr("x", x + 10)
      .attr("y", y + 10)
      .attr("width", cellWidth - 20)
      .attr("height", cellHeight - 20)
      .attr("rx", 5)
      .attr("fill", "#f093fb")
      .attr("opacity", 0.3);

    // Hidden state connection to next cell
    if (i < numCells - 1) {
      const nextX = spacing + (i + 1) * (cellWidth + spacing);
      g.append("line")
        .attr("x1", x + cellWidth / 2)
        .attr("y1", y - 20)
        .attr("x2", nextX + cellWidth / 2)
        .attr("y2", y - 20)
        .attr("stroke", "#9b59b6")
        .attr("stroke-width", 3)
        .attr("marker-end", "url(#arrowhead)");

      g.append("text")
        .attr("x", (x + nextX + cellWidth) / 2)
        .attr("y", y - 25)
        .attr("text-anchor", "middle")
        .style("font-size", "10px")
        .style("fill", "#9b59b6")
        .text("Hidden State hₜ →");
    }

    // Input arrow
    g.append("line")
      .attr("x1", x + cellWidth / 2)
      .attr("y1", y + cellHeight + 30)
      .attr("x2", x + cellWidth / 2)
      .attr("y2", y + cellHeight)
      .attr("stroke", "#3498db")
      .attr("stroke-width", 2)
      .attr("marker-end", "url(#arrowhead)");

    g.append("text")
      .attr("x", x + cellWidth / 2)
      .attr("y", y + cellHeight + 40)
      .attr("text-anchor", "middle")
      .style("font-size", "11px")
      .style("fill", "#3498db")
      .text(`x${i+1}`);

    // Output arrow
    g.append("line")
      .attr("x1", x + cellWidth / 2)
      .attr("y1", y)
      .attr("x2", x + cellWidth / 2)
      .attr("y2", y - 30)
      .attr("stroke", "#2ecc71")
      .attr("stroke-width", 2)
      .attr("marker-end", "url(#arrowhead)");

    g.append("text")
      .attr("x", x + cellWidth / 2)
      .attr("y", y - 35)
      .attr("text-anchor", "middle")
      .style("font-size", "11px")
      .style("fill", "#2ecc71")
      .text(`y${i+1}`);

    // Cell label
    g.append("text")
      .attr("x", x + cellWidth / 2)
      .attr("y", y + cellHeight / 2)
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .style("fill", "white")
      .style("font-size", "12px")
      .style("font-weight", "600")
      .text(`t=${i+1}`);
  }

  // Title
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", 25)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("font-weight", "600")
    .text("LSTM/RNN: Sequential Processing with Memory");
}

  /*
  // Q-Learning Visualization
  function visualizeQLearning(svg, width, height) {
    const margin = {top: 60, right: 40, bottom: 40, left: 40};
    const w = width - margin.left - margin.right;
    const h = height - margin.top - margin.bottom;
    
    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
    
    // Create grid world
    const gridSize = 5;
    const cellSize = Math.min(w, h) / gridSize;
    
    // Draw grid
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const isGoal = i === gridSize - 1 && j === gridSize - 1;
        const isStart = i === 0 && j === 0;
        const isObstacle = (i === 2 && j === 2) || (i === 3 && j === 1);
        
        g.append("rect")
          .attr("x", j * cellSize)
          .attr("y", i * cellSize)
          .attr("width", cellSize)
          .attr("height", cellSize)
          .attr("fill", isGoal ? "#4facfe" : isObstacle ? "#333" : "#f5f5f5")
          .attr("stroke", "#999")
          .attr("stroke-width", 1);
        
        if (isStart) {
          g.append("circle")
            .attr("cx", j * cellSize + cellSize / 2)
            .attr("cy", i * cellSize + cellSize / 2)
            .attr("r", cellSize / 4)
            .attr("fill", "#667eea");
        }
        
        if (isGoal) {
          g.append("text")
            .attr("x", j * cellSize + cellSize / 2)
            .attr("y", i * cellSize + cellSize / 2)
            .attr("text-anchor", "middle")
            .attr("dy", "0.35em")
            .style("font-size", "20px")
            .text("★");
        }
      }
    }
    
    // Draw optimal path
    const path = [
      {i: 0, j: 0}, {i: 0, j: 1}, {i: 0, j: 2}, {i: 1, j: 2},
      {i: 1, j: 3}, {i: 2, j: 3}, {i: 3, j: 3}, {i: 4, j: 3}, {i: 4, j: 4}
    ];
    
    for (let k = 0; k < path.length - 1; k++) {
      const from = path[k];
      const to = path[k + 1];
      
      g.append("line")
        .attr("x1", from.j * cellSize + cellSize / 2)
        .attr("y1", from.i * cellSize + cellSize / 2)
        .attr("x2", to.j * cellSize + cellSize / 2)
        .attr("y2", to.i * cellSize + cellSize / 2)
        .attr("stroke", "#f093fb")
        .attr("stroke-width", 3)
        .attr("opacity", 0.7);
    }
    
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", 25)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-weight", "600")
      .text("Q-Learning: Find Optimal Path");
  }
  */
 
  // GAN Visualization
  function visualizeGAN(svg, width, height) {
    const margin = {top: 60, right: 60, bottom: 60, left: 60};
    const w = width - margin.left - margin.right;
    const h = height - margin.top - margin.bottom;
    
    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
    
    // Generator box
    g.append("rect")
      .attr("x", w * 0.1)
      .attr("y", h * 0.2)
      .attr("width", w * 0.3)
      .attr("height", h * 0.3)
      .attr("rx", 8)
      .attr("fill", "#667eea")
      .attr("stroke", "#000")
      .attr("stroke-width", 2);
    
    g.append("text")
      .attr("x", w * 0.25)
      .attr("y", h * 0.35)
      .attr("text-anchor", "middle")
      .style("fill", "white")
      .style("font-size", "16px")
      .style("font-weight", "600")
      .text("Generator");
    
    // Discriminator box
    g.append("rect")
      .attr("x", w * 0.6)
      .attr("y", h * 0.2)
      .attr("width", w * 0.3)
      .attr("height", h * 0.3)
      .attr("rx", 8)
      .attr("fill", "#f093fb")
      .attr("stroke", "#000")
      .attr("stroke-width", 2);
    
    g.append("text")
      .attr("x", w * 0.75)
      .attr("y", h * 0.35)
      .attr("text-anchor", "middle")
      .style("fill", "white")
      .style("font-size", "16px")
      .style("font-weight", "600")
      .text("Discriminator");
    
    // Arrows and labels
    // Noise input
    g.append("line")
      .attr("x1", w * 0.1)
      .attr("y1", h * 0.35)
      .attr("x2", w * 0.05)
      .attr("y2", h * 0.35)
      .attr("stroke", "#000")
      .attr("stroke-width", 2)
      .attr("marker-start", "url(#arrowback)");
    
    g.append("text")
      .attr("x", w * 0.02)
      .attr("y", h * 0.32)
      .attr("text-anchor", "end")
      .style("font-size", "11px")
      .text("Noise");
    
    // Generated to Discriminator
    g.append("line")
      .attr("x1", w * 0.4)
      .attr("y1", h * 0.35)
      .attr("x2", w * 0.6)
      .attr("y2", h * 0.35)
      .attr("stroke", "#4facfe")
      .attr("stroke-width", 3)
      .attr("marker-end", "url(#arrowblue)");
    
    g.append("text")
      .attr("x", w * 0.5)
      .attr("y", h * 0.32)
      .attr("text-anchor", "middle")
      .style("font-size", "11px")
      .text("Fake Data");
    
    // Real data to Discriminator
    g.append("line")
      .attr("x1", w * 0.75)
      .attr("y1", h * 0.2)
      .attr("x2", w * 0.75)
      .attr("y2", h * 0.1)
      .attr("stroke", "#4facfe")
      .attr("stroke-width", 3)
      .attr("marker-start", "url(#arrowblue)");
    
    g.append("text")
      .attr("x", w * 0.78)
      .attr("y", h * 0.15)
      .attr("text-anchor", "start")
      .style("font-size", "11px")
      .text("Real Data");
    
    // Feedback loop
    g.append("path")
      .attr("d", `M ${w * 0.75} ${h * 0.5} Q ${w * 0.5} ${h * 0.65} ${w * 0.25} ${h * 0.5}`)
      .attr("fill", "none")
      .attr("stroke", "#f093fb")
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", "5,5")
      .attr("marker-end", "url(#arrowpink)");
    
    g.append("text")
      .attr("x", w * 0.5)
      .attr("y", h * 0.7)
      .attr("text-anchor", "middle")
      .style("font-size", "11px")
      .style("fill", "#f093fb")
      .text("Adversarial Feedback");
    
    // Arrow markers
    svg.append("defs").append("marker")
      .attr("id", "arrowblue")
      .attr("markerWidth", 10)
      .attr("markerHeight", 10)
      .attr("refX", 9)
      .attr("refY", 3)
      .attr("orient", "auto")
      .append("polygon")
      .attr("points", "0 0, 10 3, 0 6")
      .attr("fill", "#4facfe");
    
    svg.append("defs").append("marker")
      .attr("id", "arrowpink")
      .attr("markerWidth", 10)
      .attr("markerHeight", 10)
      .attr("refX", 9)
      .attr("refY", 3)
      .attr("orient", "auto")
      .append("polygon")
      .attr("points", "0 0, 10 3, 0 6")
      .attr("fill", "#f093fb");
    
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", 25)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-weight", "600")
      .text("GANs: Adversarial Training");
  }
  
  // VAE Visualization
  function visualizeVAE(svg, width, height) {
    const margin = {top: 60, right: 40, bottom: 60, left: 40};
    const w = width - margin.left - margin.right;
    const h = height - margin.top - margin.bottom;
    
    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
    
    // Similar to autoencoder but with sampling in middle
    const layers = [
      {neurons: 4, x: w * 0.1, label: "Input"},
      {neurons: 3, x: w * 0.3, label: "Encoder"},
      {neurons: 2, x: w * 0.5, label: "μ, σ"},
      {neurons: 3, x: w * 0.7, label: "Decoder"},
      {neurons: 4, x: w * 0.9, label: "Output"}
    ];
    
    // Draw connections (simplified)
    for (let i = 0; i < layers.length - 1; i++) {
      const l1 = layers[i];
      const l2 = layers[i + 1];
      
      g.append("line")
        .attr("x1", l1.x)
        .attr("y1", h / 2)
        .attr("x2", l2.x)
        .attr("y2", h / 2)
        .attr("stroke", "#ddd")
        .attr("stroke-width", 2);
    }
    
    // Draw layer boxes
    layers.forEach((layer, idx) => {
      const isLatent = idx === 2;
      
      g.append("rect")
        .attr("x", layer.x - 30)
        .attr("y", h / 2 - 40)
        .attr("width", 60)
        .attr("height", 80)
        .attr("rx", 8)
        .attr("fill", isLatent ? "#f093fb" : "#667eea")
        .attr("stroke", "#000")
        .attr("stroke-width", 2);
      
      g.append("text")
        .attr("x", layer.x)
        .attr("y", h / 2)
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .style("fill", "white")
        .style("font-size", "11px")
        .style("font-weight", "600")
        .text(layer.label);
      
      // Label below
      g.append("text")
        .attr("x", layer.x)
        .attr("y", h / 2 + 60)
        .attr("text-anchor", "middle")
        .style("font-size", "10px")
        .text(layer.label);
    });
    
    // Sampling annotation
    g.append("text")
      .attr("x", w * 0.5)
      .attr("y", h / 2 - 60)
      .attr("text-anchor", "middle")
      .style("font-size", "11px")
      .style("fill", "#f093fb")
      .style("font-weight", "600")
      .text("↓ Sample z ~ N(μ, σ)");
    
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", 25)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-weight", "600")
      .text("VAE: Probabilistic Latent Space");
  }