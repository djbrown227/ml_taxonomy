d3.json("data/ml_algorithms_hierarchy.json").then(data => {

  // -------------------------
  // Configuration
  // -------------------------
  const dx = 20;                  // Vertical spacing between nodes
  const levelSpacing = 120;       // Horizontal spacing per tree level
  const fontSize = 14;            // Node label font size
  const circleRadius = 7;         // Node circle radius

  // -------------------------
  // Prepare Hierarchy
  // -------------------------
  const root = d3.hierarchy(data);
  root.sort((a, b) => d3.ascending(a.data.name, b.data.name));

  const treeLayout = d3.cluster().nodeSize([dx, levelSpacing]);
  treeLayout(root);

  // Compute vertical extent for dynamic SVG height
  const xMin = d3.min(root.descendants(), d => d.x) - dx;
  const xMax = d3.max(root.descendants(), d => d.x) + dx;
  const height = xMax - xMin + 40;
  const width = (root.height + 1) * levelSpacing;

  // -------------------------
  // Create SVG
  // -------------------------
  const svg = d3.select("#tree").append("svg")
      .attr("width", "100%")
      .attr("height", height)
      .attr("viewBox", [0, xMin, width, height])
      .style("font-family", "sans-serif")
      .style("font-size", fontSize + "px");

  // -------------------------
  // Draw links (skip root)
  // -------------------------
  svg.append("g")
      .attr("fill", "none")
      .attr("stroke", "#555")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 2)
    .selectAll("path")
    .data(root.links().filter(d => d.source.depth > 0)) // skip root links
    .join("path")
      .attr("d", d3.linkHorizontal()
        .x(d => d.y)
        .y(d => d.x));

  // -------------------------
  // Draw nodes (skip root)
  // -------------------------
  const nodes = svg.append("g")
      .attr("stroke-linejoin", "round")
      .attr("stroke-width", 2)
    .selectAll("g")
    .data(root.descendants().filter(d => d.depth > 0)) // skip root node
    .join("g")
      .attr("transform", d => `translate(${d.y},${d.x})`);

  nodes.append("circle")
      .attr("r", circleRadius)
      .attr("fill", d => d.children ? "#667eea" : "#f093fb");

  nodes.append("text")
      .attr("dy", "0.35em")
      .attr("x", d => d.children ? -10 : 10)
      .attr("text-anchor", d => d.children ? "end" : "start")
      .text(d => d.data.name)
      .attr("stroke", "white")
      .attr("paint-order", "stroke")
      .style("font-size", fontSize)
      .style("font-weight", 600);

});
