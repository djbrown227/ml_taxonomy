d3.json("data/ml_workflow.json").then(data => {

    const width = 900, height = 250;
  
    const svg = d3.select("#workflow").append("svg")
      .attr("viewBox", [0, 0, width, height])
      .style("font-family", "Inter, sans-serif");
  
    const stepWidth = width / data.length;
  
    const g = svg.append("g")
      .attr("transform", `translate(0, ${height / 2})`);
  
    const color = d3.scaleSequential(d3.interpolateBlues)
      .domain([0, data.length - 1]);
  
    // Arrows between steps
    for (let i = 0; i < data.length - 1; i++) {
      g.append("line")
        .attr("x1", i * stepWidth + stepWidth / 2)
        .attr("x2", (i + 1) * stepWidth + stepWidth / 2 - 30)
        .attr("y1", 0)
        .attr("y2", 0)
        .attr("stroke", "#aaa")
        .attr("marker-end", "url(#arrow)");
    }
  
    // Define arrow marker
    svg.append("defs").append("marker")
      .attr("id", "arrow")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 10)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "#aaa");
  
    // Steps
    g.selectAll("rect")
      .data(data)
      .join("rect")
        .attr("x", (d, i) => i * stepWidth)
        .attr("y", -40)
        .attr("width", stepWidth - 40)
        .attr("height", 80)
        .attr("rx", 10)
        .attr("fill", (d, i) => color(i));
  
    // Step labels
    g.selectAll("text")
      .data(data)
      .join("text")
        .attr("x", (d, i) => i * stepWidth + (stepWidth - 40) / 2)
        .attr("text-anchor", "middle")
        .attr("y", 5)
        .attr("fill", "white")
        .attr("font-weight", "600")
        .text(d => d.step);
  
    // Descriptions
    svg.selectAll(".desc")
      .data(data)
      .join("text")
        .attr("class", "desc")
        .attr("x", (d, i) => i * stepWidth + (stepWidth - 40) / 2)
        .attr("y", height - 20)
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("fill", "#444")
        .text(d => d.description);
  });
  