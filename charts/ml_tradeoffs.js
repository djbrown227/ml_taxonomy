d3.csv("data/ml_tradeoffs.csv").then(data => {
  const width = 800,
        height = 500,
        margin = { top: 60, right: 40, bottom: 60, left: 160 };

  const svg = d3.select("#tradeoffs")
    .append("svg")
    .attr("viewBox", [0, 0, width, height]);

  // Extract the metric columns (excluding algorithm & family)
  const metrics = data.columns.slice(2);

  // Y-axis (algorithms)
  const y = d3.scaleBand()
    .domain(data.map(d => d.algorithm))
    .range([margin.top, height - margin.bottom])
    .padding(0.1);

  // X-axis (metrics)
  const x = d3.scaleBand()
    .domain(metrics)
    .range([margin.left, width - margin.right])
    .padding(0.05);

  // Color scale
  const color = d3.scaleSequential(d3.interpolateViridis)
    .domain([0, 1]); // 0 = low, 1 = high

  // Tooltip
  const tooltip = d3.select("body").append("div")
    .style("position", "absolute")
    .style("background", "white")
    .style("border", "1px solid #ccc")
    .style("padding", "5px 10px")
    .style("border-radius", "5px")
    .style("visibility", "hidden")
    .style("font-size", "12px");

  // Draw heatmap cells
  metrics.forEach(metric => {
    svg.selectAll(`.cell-${metric}`)
      .data(data)
      .join("rect")
      .attr("x", x(metric))
      .attr("y", d => y(d.algorithm))
      .attr("width", x.bandwidth())
      .attr("height", y.bandwidth())
      .attr("fill", d => color(+d[metric]))
      .attr("stroke", "white")
      .attr("stroke-width", 1)
      .on("mouseover", function (event, d) {
        d3.select(this).attr("stroke", "#333");
        tooltip.style("visibility", "visible")
          .text(`${metric}: ${(+d[metric]).toFixed(2)}`);
      })
      .on("mousemove", event => {
        tooltip.style("top", (event.pageY - 20) + "px")
          .style("left", (event.pageX + 10) + "px");
      })
      .on("mouseout", function () {
        d3.select(this).attr("stroke", "white");
        tooltip.style("visibility", "hidden");
      });
  });

  // X-axis
  svg.append("g")
    .attr("transform", `translate(0,${margin.top - 10})`)
    .call(d3.axisTop(x))
    .selectAll("text")
    .style("text-anchor", "middle")
    .style("font-weight", "bold");

  // Y-axis
  svg.append("g")
    .attr("transform", `translate(${margin.left - 10},0)`)
    .call(d3.axisLeft(y))
    .selectAll("text")
    .style("font-weight", "bold");

  // Title
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", 30)
    .attr("text-anchor", "middle")
    .style("font-size", "18px")
    .style("font-weight", "600")
    .text("Machine Learning Algorithm Tradeoffs (Heatmap)");

  // Color legend
  const legendWidth = 200, legendHeight = 12;
  const legendScale = d3.scaleLinear().domain([0, 1]).range([0, legendWidth]);

  const legend = svg.append("g")
    .attr("transform", `translate(${width / 2 - legendWidth / 2}, ${height - 30})`);

  const defs = svg.append("defs");
  const linearGradient = defs.append("linearGradient")
    .attr("id", "legend-gradient");

  linearGradient.selectAll("stop")
    .data(d3.ticks(0, 1, 10))
    .join("stop")
    .attr("offset", d => `${d * 100}%`)
    .attr("stop-color", d => color(d));

  legend.append("rect")
    .attr("width", legendWidth)
    .attr("height", legendHeight)
    .style("fill", "url(#legend-gradient)");

  legend.append("g")
    .attr("transform", `translate(0, ${legendHeight})`)
    .call(d3.axisBottom(legendScale).ticks(5))
    .select(".domain").remove();
});
