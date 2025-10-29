// Additional ML Algorithm Visualizations - Part 2
// Include this file after ml_sunburst.js

/*
// Naive Bayes Visualization
// Naive Bayes Visualization – Conceptual Demo
function visualizeNaiveBayes(svg, width, height) {
  const margin = { top: 60, right: 40, bottom: 60, left: 50 };
  const w = width - margin.left - margin.right;
  const h = height - margin.top - margin.bottom;

  const g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // === 1. Generate Data: Two Gaussian Distributions ===
  const n = 200;
  const classA = [], classB = [];
  for (let i = 0; i <= n; i++) {
    const x = i / n;
    classA.push({ x, y: Math.exp(-Math.pow(x - 0.3, 2) / 0.02) });
    classB.push({ x, y: Math.exp(-Math.pow(x - 0.7, 2) / 0.02) });
  }

  // Normalize heights for better visual comparison
  const maxY = Math.max(
    d3.max(classA, d => d.y),
    d3.max(classB, d => d.y)
  );

  // === 2. Scales ===
  const xScale = d3.scaleLinear().domain([0, 1]).range([0, w]);
  const yScale = d3.scaleLinear().domain([0, maxY * 1.2]).range([h, 0]);

  // === 3. Line generator ===
  const line = d3.line()
    .x(d => xScale(d.x))
    .y(d => yScale(d.y))
    .curve(d3.curveBasis);

  // === 4. Draw Probability Curves ===
  g.append("path")
    .datum(classA)
    .attr("d", line)
    .attr("stroke", "#5a67d8")
    .attr("stroke-width", 3)
    .attr("fill", "none");

  g.append("path")
    .datum(classB)
    .attr("d", line)
    .attr("stroke", "#ed64a6")
    .attr("stroke-width", 3)
    .attr("fill", "none");

  // === 5. Shaded Overlap Region (Uncertainty Zone) ===
  const overlap = classA.map((d, i) => ({
    x: d.x,
    y: Math.min(d.y, classB[i].y)
  }));

  g.append("path")
    .datum(overlap)
    .attr("d", d3.area()
      .x(d => xScale(d.x))
      .y0(h)
      .y1(d => yScale(d.y))
      .curve(d3.curveBasis))
    .attr("fill", "#cbd5e0")
    .attr("opacity", 0.4);

  // === 6. Decision Boundary ===
  const boundary = 0.5;
  g.append("line")
    .attr("x1", xScale(boundary))
    .attr("y1", 0)
    .attr("x2", xScale(boundary))
    .attr("y2", h)
    .attr("stroke", "#2b6cb0")
    .attr("stroke-width", 2)
    .attr("stroke-dasharray", "5,5");

  // === 7. Axes ===
  g.append("g")
    .attr("transform", `translate(0,${h})`)
    .call(d3.axisBottom(xScale).ticks(5))
    .selectAll("text")
    .style("font-size", "11px");

  g.append("g")
    .call(d3.axisLeft(yScale).ticks(4))
    .selectAll("text")
    .style("font-size", "11px");

  // Axis Labels
  g.append("text")
    .attr("x", w / 2)
    .attr("y", h + 40)
    .attr("text-anchor", "middle")
    .style("font-size", "12px")
    .text("Feature Value (x)");

  g.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -h / 2)
    .attr("y", -35)
    .attr("text-anchor", "middle")
    .style("font-size", "12px")
    .text("Probability Density P(x|Class)");

  // === 8. Title & Description ===
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", 25)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("font-weight", "600")
    .text("Naive Bayes Classification Intuition");

  svg.append("text")
    .attr("x", width / 2)
    .attr("y", 45)
    .attr("text-anchor", "middle")
    .style("font-size", "11px")
    .attr("fill", "#4a5568")
    .text("Each curve shows P(x|Class). The dashed line marks where the classifier switches classes.");

  // === 9. Legend ===
  const legend = svg.append("g")
    .attr("transform", `translate(${width - 150}, ${margin.top})`);

  legend.append("line")
    .attr("x1", 0).attr("x2", 25)
    .attr("stroke", "#5a67d8")
    .attr("stroke-width", 3);
  legend.append("text")
    .attr("x", 35).attr("y", 5)
    .style("font-size", "11px")
    .text("Class A: P(x|A)");

  legend.append("line")
    .attr("x1", 0).attr("x2", 25)
    .attr("y1", 20).attr("y2", 20)
    .attr("stroke", "#ed64a6")
    .attr("stroke-width", 3);
  legend.append("text")
    .attr("x", 35).attr("y", 25)
    .style("font-size", "11px")
    .text("Class B: P(x|B)");

  legend.append("rect")
    .attr("x", -2)
    .attr("y", 35)
    .attr("width", 28)
    .attr("height", 10)
    .attr("fill", "#cbd5e0")
    .attr("opacity", 0.4);
  legend.append("text")
    .attr("x", 35)
    .attr("y", 44)
    .style("font-size", "11px")
    .text("Overlap Region (Uncertainty)");
}
*/
  
  // Ridge/Lasso Regression Visualization
  function visualizeRidgeLasso(svg, width, height) {
    const margin = {top: 60, right: 40, bottom: 50, left: 60};
    const w = width - margin.left - margin.right;
    const h = height - margin.top - margin.bottom;
    
    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
    
    // Generate data
    const data = [];
    for (let i = 0; i < 50; i++) {
      const x = i / 50;
      const y = 0.3 + 0.6 * x + (Math.random() - 0.5) * 0.25;
      data.push({x, y});
    }
    
    const xScale = d3.scaleLinear().domain([0, 1]).range([0, w]);
    const yScale = d3.scaleLinear().domain([0, 1]).range([h, 0]);
    
    // Axes
    g.append("g")
      .attr("transform", `translate(0,${h})`)
      .call(d3.axisBottom(xScale));
    
    g.append("g")
      .call(d3.axisLeft(yScale));
    
    // Regular regression line (overfitting)
    g.append("path")
      .datum(data)
      .attr("d", d3.line()
        .x(d => xScale(d.x))
        .y(d => yScale(d.y))
        .curve(d3.curveBasis))
      .attr("fill", "none")
      .attr("stroke", "#ccc")
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", "5,5");
    
    // Regularized line (simpler)
    g.append("line")
      .attr("x1", xScale(0))
      .attr("y1", yScale(0.3))
      .attr("x2", xScale(1))
      .attr("y2", yScale(0.9))
      .attr("stroke", "#667eea")
      .attr("stroke-width", 3);
    
    // Data points
    g.selectAll(".point")
      .data(data)
      .join("circle")
      .attr("cx", d => xScale(d.x))
      .attr("cy", d => yScale(d.y))
      .attr("r", 4)
      .attr("fill", "#4facfe")
      .attr("opacity", 0.6);
    
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", 25)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-weight", "600")
      .text("Ridge/Lasso: Regularization Prevents Overfitting");
    
    // Legend
    const legend = svg.append("g")
      .attr("transform", `translate(${width - 180}, 60)`);
    
    legend.append("line")
      .attr("x1", 0).attr("x2", 30)
      .attr("stroke", "#667eea")
      .attr("stroke-width", 3);
    legend.append("text")
      .attr("x", 35).attr("y", 5)
      .style("font-size", "11px")
      .text("Regularized");
    
    legend.append("line")
      .attr("x1", 0).attr("x2", 30)
      .attr("y1", 20).attr("y2", 20)
      .attr("stroke", "#ccc")
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", "5,5");
    legend.append("text")
      .attr("x", 35).attr("y", 25)
      .style("font-size", "11px")
      .text("Overfit");
  }
  
// XGBoost/GBM Visualization with final improved tree
function visualizeXGBoost(svg, width, height) {
  const margin = {top: 60, right: 40, bottom: 60, left: 40};
  const w = width - margin.left - margin.right;
  const h = height - margin.top - margin.bottom;

  const g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Sequential boosting stages
  const stages = [
    {x: w * 0.15, label: "Tree 1", color: "#667eea"},
    {x: w * 0.35, label: "+", color: "#000"},
    {x: w * 0.45, label: "Tree 2", color: "#f093fb"},
    {x: w * 0.65, label: "+", color: "#000"},
    {x: w * 0.75, label: "Tree 3", color: "#4facfe"},
    {x: w * 0.88, label: "=", color: "#000"}
  ];

  stages.forEach(stage => {
    if (stage.label.includes("Tree")) {
      const treeY = h * 0.3;

      // Root
      g.append("circle")
        .attr("cx", stage.x)
        .attr("cy", treeY)
        .attr("r", 12)
        .attr("fill", stage.color)
        .attr("stroke", "#000")
        .attr("stroke-width", 2);

      // Child nodes
      [-20, 20].forEach(dx => {
        g.append("circle")
          .attr("cx", stage.x + dx)
          .attr("cy", treeY + 40)
          .attr("r", 8)
          .attr("fill", stage.color)
          .attr("opacity", 0.6);

        g.append("line")
          .attr("x1", stage.x)
          .attr("y1", treeY)
          .attr("x2", stage.x + dx)
          .attr("y2", treeY + 40)
          .attr("stroke", "#999")
          .attr("stroke-width", 1);
      });

      // Label
      g.append("text")
        .attr("x", stage.x)
        .attr("y", treeY + 70)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .style("font-weight", "600")
        .text(stage.label);

    } else {
      // Operator
      g.append("text")
        .attr("x", stage.x)
        .attr("y", h * 0.35)
        .attr("text-anchor", "middle")
        .style("font-size", "24px")
        .style("font-weight", "bold")
        .text(stage.label);

      // If "=" stage, draw larger final tree
      if (stage.label === "=") {
        const finalX = stage.x + 50; // shifted a bit right
        const finalY = h * 0.3;
        const rootR = 18;

        // Root
        g.append("circle")
          .attr("cx", finalX)
          .attr("cy", finalY)
          .attr("r", rootR)
          .attr("fill", "#00d2ff")
          .attr("stroke", "#000")
          .attr("stroke-width", 2);

        // Children
        [-30, 0, 30].forEach(dx => {
          g.append("circle")
            .attr("cx", finalX + dx)
            .attr("cy", finalY + 60)
            .attr("r", 12)
            .attr("fill", "#00d2ff")
            .attr("opacity", 0.7);

          g.append("line")
            .attr("x1", finalX)
            .attr("y1", finalY)
            .attr("x2", finalX + dx)
            .attr("y2", finalY + 60)
            .attr("stroke", "#666")
            .attr("stroke-width", 1.5);
        });

        g.append("text")
          .attr("x", finalX)
          .attr("y", finalY + 90)
          .attr("text-anchor", "middle")
          .style("font-size", "12px")
          .style("font-weight", "600")
          .text("Final Strong Model");
      }
    }
  });

  // Title and explanation
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", 25)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("font-weight", "600")
    .text("GBM/XGBoost: Sequential Boosting");

  g.append("text")
    .attr("x", w / 2)
    .attr("y", h - 20)
    .attr("text-anchor", "middle")
    .style("font-size", "13px")
    .style("fill", "#666")
    .text("Each tree learns from previous errors; final tree combines them");
}

  /*
  // Hierarchical Clustering Visualization
  function visualizeHierarchicalClustering(svg, width, height) {
    const margin = {top: 60, right: 40, bottom: 40, left: 40};
    const w = width - margin.left - margin.right;
    const h = height - margin.top - margin.bottom;
    
    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
    
    // Create dendrogram data
    const dendrogramData = {
      name: "root",
      children: [
        {
          name: "cluster1",
          children: [
            {name: "A"},
            {name: "B"}
          ]
        },
        {
          name: "cluster2",
          children: [
            {
              name: "cluster3",
              children: [
                {name: "C"},
                {name: "D"}
              ]
            },
            {name: "E"}
          ]
        }
      ]
    };
    
    const tree = d3.cluster()
      .size([w, h - 60])
      .separation((a, b) => 1);
    
    const root = d3.hierarchy(dendrogramData);
    tree(root);
    
    // Draw links
    g.selectAll(".link")
      .data(root.links())
      .join("path")
      .attr("d", d => `
        M${d.source.x},${d.source.y}
        V${d.target.y}
        H${d.target.x}
      `)
      .attr("fill", "none")
      .attr("stroke", "#667eea")
      .attr("stroke-width", 2);
    
    // Draw nodes
    g.selectAll(".node")
      .data(root.descendants())
      .join("circle")
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .attr("r", d => d.children ? 6 : 8)
      .attr("fill", d => d.children ? "#667eea" : "#4facfe")
      .attr("stroke", "#000")
      .attr("stroke-width", 2);
    
    // Labels for leaf nodes
    g.selectAll(".label")
      .data(root.leaves())
      .join("text")
      .attr("x", d => d.x)
      .attr("y", d => d.y + 25)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("font-weight", "600")
      .text(d => d.data.name);
    
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", 25)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-weight", "600")
      .text("Hierarchical Clustering: Dendrogram");
  }
*/  


// DBSCAN Improved Visualization
function visualizeDBSCAN(svg, width, height) {
  const margin = {top: 60, right: 40, bottom: 60, left: 40};
  const w = width - margin.left - margin.right;
  const h = height - margin.top - margin.bottom;

  const g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Generate clustered data
  const cluster1 = Array.from({length: 25}, () => ({
    x: w * 0.3 + (Math.random() - 0.5) * 120,
    y: h * 0.4 + (Math.random() - 0.5) * 120,
    type: "core"
  }));

  const cluster2 = Array.from({length: 25}, () => ({
    x: w * 0.7 + (Math.random() - 0.5) * 120,
    y: h * 0.6 + (Math.random() - 0.5) * 120,
    type: "core"
  }));

  const borderPoints = Array.from({length: 10}, () => ({
    x: w * 0.5 + (Math.random() - 0.5) * 80,
    y: h * 0.5 + (Math.random() - 0.5) * 80,
    type: "border"
  }));

  const noise = Array.from({length: 8}, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    type: "noise"
  }));

  const points = [...cluster1, ...cluster2, ...borderPoints, ...noise];

  // Draw cluster reachability circles (for core points)
  cluster1.concat(cluster2).forEach(p => {
    g.append("circle")
      .attr("cx", p.x)
      .attr("cy", p.y)
      .attr("r", 25) // epsilon neighborhood
      .attr("fill", "none")
      .attr("stroke", "#ccc")
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "3,3");
  });

  // Draw points
  g.selectAll(".point")
    .data(points)
    .join("circle")
    .attr("cx", d => d.x)
    .attr("cy", d => d.y)
    .attr("r", d => d.type === "core" ? 6 : d.type === "border" ? 5 : 4)
    .attr("fill", d => {
      if (d.type === "core") return d.x < w/2 ? "#667eea" : "#f093fb";
      if (d.type === "border") return "#82cfff";
      return "#999";
    })
    .attr("opacity", d => d.type === "noise" ? 0.4 : 0.8)
    .attr("stroke", d => d.type === "noise" ? "#000" : "#333")
    .attr("stroke-width", 1);

  // Titles and explanation
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", 25)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("font-weight", "600")
    .text("DBSCAN: Density-Based Clustering");

  g.append("text")
    .attr("x", w / 2)
    .attr("y", h + 40)
    .attr("text-anchor", "middle")
    .style("font-size", "13px")
    .style("fill", "#666")
    .text("Core points (large) & border points (lighter), gray points are noise");
}

  /*
  // Gaussian Mixture Models Visualization
  function visualizeGMM(svg, width, height) {
    const margin = {top: 60, right: 40, bottom: 40, left: 40};
    const w = width - margin.left - margin.right;
    const h = height - margin.top - margin.bottom;
    
    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
    
    // Generate data from mixture of Gaussians
    const gaussian = (x, y, mx, my, sigma) => {
      const dx = x - mx;
      const dy = y - my;
      return Math.exp(-(dx*dx + dy*dy) / (2*sigma*sigma));
    };
    
    const numPoints = 150;
    const points = [];
    
    const components = [
      {x: w * 0.3, y: h * 0.4, sigma: 60, weight: 0.4},
      {x: w * 0.6, y: h * 0.5, sigma: 50, weight: 0.35},
      {x: w * 0.5, y: h * 0.7, sigma: 45, weight: 0.25}
    ];
    
    for (let i = 0; i < numPoints; i++) {
      const comp = components[Math.floor(Math.random() * components.length)];
      const angle = Math.random() * 2 * Math.PI;
      const r = Math.random() * comp.sigma;
      points.push({
        x: comp.x + r * Math.cos(angle),
        y: comp.y + r * Math.sin(angle),
        component: components.indexOf(comp)
      });
    }
    
    const colors = ["#667eea", "#f093fb", "#4facfe"];
    
    // Draw ellipses for each Gaussian
    components.forEach((comp, i) => {
      g.append("ellipse")
        .attr("cx", comp.x)
        .attr("cy", comp.y)
        .attr("rx", comp.sigma)
        .attr("ry", comp.sigma)
        .attr("fill", colors[i])
        .attr("opacity", 0.1)
        .attr("stroke", colors[i])
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", "5,5");
    });
    
    // Draw points
    g.selectAll(".point")
      .data(points)
      .join("circle")
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .attr("r", 4)
      .attr("fill", d => colors[d.component])
      .attr("opacity", 0.6);
    
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", 25)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-weight", "600")
      .text("Gaussian Mixture Models");
  }
  */