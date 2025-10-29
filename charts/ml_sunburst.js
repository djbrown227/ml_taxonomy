// Load the JSON hierarchy
d3.json("data/ml_algorithms_hierarchy.json").then(function (data) {

  const width = 930;
  const height = width;
  const radius = width / 6;

  // Color scale
  const color = d3.scaleOrdinal(
    d3.quantize(d3.interpolateRainbow, data.children.length + 1)
  );

  // Create the root hierarchy
  const root = d3.hierarchy(data)
    .sum(d => d.children ? 0 : 1)
    .sort((a, b) => d3.ascending(a.data.name, b.data.name));

  d3.partition()
    .size([2 * Math.PI, root.height + 1])(root);

  root.each(d => d.current = d);

  // Arc generator
  const arc = d3.arc()
    .startAngle(d => d.x0)
    .endAngle(d => d.x1)
    .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
    .padRadius(radius * 1.5)
    .innerRadius(d => d.y0 * radius)
    .outerRadius(d => Math.max(d.y0 * radius, d.y1 * radius - 1));

  // Create SVG
  const svg = d3.select("#sunburst").append("svg")
    .attr("viewBox", [-width / 2, -height / 2, width, width])
    .style("font", "10px sans-serif");

  // Paths
  const path = svg.append("g")
    .selectAll("path")
    .data(root.descendants().slice(1))
    .join("path")
      .attr("fill", d => {
        while (d.depth > 1) d = d.parent;
        return color(d.data.name);
      })
      .attr("fill-opacity", d => arcVisible(d.current) ? (d.children ? 0.6 : 0.4) : 0)
      .attr("pointer-events", d => arcVisible(d.current) ? "auto" : "none")
      .attr("d", d => arc(d.current));

  path
    .style("cursor", "pointer")
    .on("click", (event, d) => {
      if (d.children) {
        // Zoom into categories
        clicked(event, d);
      } else {
        // Show algorithm visualization
        showAlgorithmVisualization(d.data);
      }
    });

  // Labels
  const label = svg.append("g")
    .attr("pointer-events", "none")
    .attr("text-anchor", "middle")
    .style("user-select", "none")
    .selectAll("text")
    .data(root.descendants().slice(1))
    .join("text")
      .attr("dy", "0.35em")
      .attr("fill-opacity", d => +labelVisible(d.current))
      .attr("transform", d => labelTransform(d.current))
      .text(d => d.data.name);

  // Central circle for zoom-out
  const parent = svg.append("circle")
    .datum(root)
    .attr("r", radius)
    .attr("fill", "none")
    .attr("pointer-events", "all")
    .on("click", clicked);

  // Info group in center (for algorithm description)
  const infoGroup = svg.append("g")
    .attr("class", "algorithm-info")
    .attr("text-anchor", "middle")
    .attr("transform", "translate(0, 0)");

  const infoTitle = infoGroup.append("text")
    .attr("y", -20)
    .style("font-weight", "bold")
    .style("font-size", "14px")
    .text("Click an algorithm");

  const infoDescription = infoGroup.append("text")
    .attr("y", 0)
    .style("font-size", "12px")
    .style("fill", "#555")
    .call(wrap, 180)
    .text("");

  // Click handler
  function clicked(event, p) {
    parent.datum(p.parent || root);

    root.each(d => d.target = {
      x0: Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
      x1: Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
      y0: Math.max(0, d.y0 - p.depth),
      y1: Math.max(0, d.y1 - p.depth)
    });

    const t = svg.transition().duration(event.altKey ? 7500 : 750);

    path.transition(t)
      .tween("data", function (d) {
        const i = d3.interpolate(d.current, d.target);
        return t => d.current = i(t);
      })
      .attr("fill-opacity", d => arcVisible(d.target) ? (d.children ? 0.6 : 0.4) : 0)
      .attr("pointer-events", d => arcVisible(d.target) ? "auto" : "none")
      .attrTween("d", d => () => arc(d.current));

    label.transition(t)
      .attr("fill-opacity", d => +labelVisible(d.target))
      .attrTween("transform", d => () => labelTransform(d.current));

    // Update central text when a leaf node is clicked
    if (!p.children) {
      infoTitle.text(p.data.name);
      infoDescription.text(p.data.description || "No description available").call(wrap, 180);
    } else {
      infoTitle.text("Click an algorithm");
      infoDescription.text("");
    }
  }

  // Visibility helpers
  function arcVisible(d) {
    return d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0;
  }

  function labelVisible(d) {
    return d.y1 <= 3 && d.y0 >= 1 &&
      (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03;
  }

  function labelTransform(d) {
    const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
    const y = (d.y0 + d.y1) / 2 * radius;
    return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
  }

  function wrap(text, width) {
    text.each(function() {
      const text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            lineHeight = 1.2,
            y = text.attr("y"),
            dy = 0;
      let word, line = [], lineNumber = 0;
      let tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
      while (word = words.pop()) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text.append("tspan")
            .attr("x", 0)
            .attr("y", y)
            .attr("dy", ++lineNumber * lineHeight + dy + "em")
            .text(word);
        }
      }
    });
  }

  // Algorithm visualization function
  function showAlgorithmVisualization(data) {
    // Hide the main sunburst
    svg.style("display", "none");
    
    // Clear any existing visualization
    d3.select("#sunburst").selectAll(".algo-viz").remove();
    
    // Create container for algorithm visualization
    const algoContainer = d3.select("#sunburst")
      .append("div")
      .attr("class", "algo-viz")
      .style("text-align", "center");
    
    // Back button
    algoContainer.append("button")
      .attr("id", "back-button")
      .style("margin-bottom", "20px")
      .style("padding", "8px 16px")
      .style("cursor", "pointer")
      .style("border", "1px solid #667eea")
      .style("background", "#667eea")
      .style("color", "white")
      .style("border-radius", "4px")
      .style("font-size", "14px")
      .text("← Back to Overview")
      .on("click", () => {
        algoContainer.remove();
        svg.style("display", "block");
      });
    
    // Title and description
    algoContainer.append("h2")
      .style("font-family", "'Playfair Display', Georgia, serif")
      .style("font-size", "28px")
      .style("margin-bottom", "12px")
      .style("color", "#0a0a0a")
      .text(data.name);
    
    algoContainer.append("p")
      .style("max-width", "600px")
      .style("margin", "0 auto 30px")
      .style("font-size", "16px")
      .style("line-height", "1.6")
      .style("color", "#4a4a4a")
      .text(data.description || "No description available.");
    
    // Create visualization based on algorithm type
    createAlgorithmVisualization(algoContainer, data.name);
  }
  
  function createAlgorithmVisualization(container, algorithmName) {
    const vizWidth = 800;
    const vizHeight = 500;
    
    const vizSvg = container.append("svg")
      .attr("viewBox", [0, 0, vizWidth, vizHeight])
      .style("max-width", "100%")
      .style("height", "auto")
      .style("background", "#fafafa")
      .style("border-radius", "8px");
    
    // Route to specific visualization based on algorithm
    // All visualization functions are defined in separate files (ml_visualizations_part1.js, part2.js, part3.js)
    switch(algorithmName) {
      // Part 1: Core algorithms
      case "K-Means":
        visualizeKMeans(vizSvg, vizWidth, vizHeight);
        break;
      case "Decision Trees":
        visualizeDecisionTree(vizSvg, vizWidth, vizHeight);
        break;
      case "Linear Regression":
        visualizeLinearRegression(vizSvg, vizWidth, vizHeight);
        break;
      case "Neural Networks":
        visualizeNeuralNetwork(vizSvg, vizWidth, vizHeight);
        break;
      case "kNN":
        visualizeKNN(vizSvg, vizWidth, vizHeight);
        break;
      case "PCA":
        visualizePCA(vizSvg, vizWidth, vizHeight);
        break;
      case "Random Forests":
        visualizeRandomForest(vizSvg, vizWidth, vizHeight);
        break;
      case "SVM":
        visualizeSVM(vizSvg, vizWidth, vizHeight);
        break;
      case "Logistic Regression":
        visualizeLogisticRegression(vizSvg, vizWidth, vizHeight);
        break;
      
      // Part 2: Intermediate algorithms
      case "Naive Bayes":
        visualizeNaiveBayes(vizSvg, vizWidth, vizHeight);
        break;
      case "Ridge/Lasso Regression":
        visualizeRidgeLasso(vizSvg, vizWidth, vizHeight);
        break;
      case "GBM / XGBoost":
        visualizeXGBoost(vizSvg, vizWidth, vizHeight);
        break;
      case "Hierarchical Clustering":
        visualizeHierarchicalClustering(vizSvg, vizWidth, vizHeight);
        break;
      case "DBSCAN":
        visualizeDBSCAN(vizSvg, vizWidth, vizHeight);
        break;
      case "Gaussian Mixture Models":
        visualizeGMM(vizSvg, vizWidth, vizHeight);
        break;
      
      // Part 3: Advanced algorithms
      case "t-SNE":
        visualizeTSNE(vizSvg, vizWidth, vizHeight);
        break;
      case "UMAP":
        visualizeUMAP(vizSvg, vizWidth, vizHeight);
        break;
      case "Autoencoders":
        visualizeAutoencoder(vizSvg, vizWidth, vizHeight);
        break;
      case "ARIMA":
        visualizeARIMA(vizSvg, vizWidth, vizHeight);
        break;
      case "LSTM":
        visualizeLSTM(vizSvg, vizWidth, vizHeight);
        break;
      case "Q-Learning":
        visualizeQLearning(vizSvg, vizWidth, vizHeight);
        break;
      case "GANs":
        visualizeGAN(vizSvg, vizWidth, vizHeight);
        break;
      case "Variational Autoencoders (VAE)":
        visualizeVAE(vizSvg, vizWidth, vizHeight);
        break;
      case "Isolation Forest":
        visualizeIsolationForest(vizSvg, vizWidth, vizHeight);
        break; 
        
      // Default
      default:
        visualizeGeneric(vizSvg, vizWidth, vizHeight, algorithmName);
    }
  }

});