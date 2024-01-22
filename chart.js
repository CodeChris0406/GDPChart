// Fetch the dataset
fetch('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json')
  .then(response => response.json())
  .then(data => {
      createBarChart(data.data);
  });

function createBarChart(dataset) {
    const margin = {top: 30, right: 20, bottom: 30, left: 50},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // Parse the date / time
    const parseTime = d3.timeParse("%Y-%m-%d");

    // Set the ranges
    const x = d3.scaleTime().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);

    // Define the axes
    const xAxis = d3.axisBottom(x),
          yAxis = d3.axisLeft(y);

    // Define the div for the tooltip
    const tooltip = d3.select("body").append("div")	
        .attr("id", "tooltip")				
        .style("opacity", 0);

    // Append the svg obgect to the body of the page
    const svg = d3.select(".visHolder").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", 
              "translate(" + margin.left + "," + margin.top + ")");

    // Format the data
    dataset.forEach(function(d) {
        d[0] = parseTime(d[0]);
        d[1] = +d[1];
    });

    // Scale the range of the data in the domains
    x.domain(d3.extent(dataset, function(d) { return d[0]; }));
    y.domain([0, d3.max(dataset, function(d) { return d[1]; })]);
  
    // Format the date to YYYY-MM-DD
    const formatDate = d3.timeFormat("%Y-%m-%d");

    // Append the rectangles for the bar chart
    svg.selectAll(".bar")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", function(d) { return x(d[0]); })
    .attr("width", width / dataset.length)
    .attr("y", function(d) { return y(d[1]); })
    .attr("height", function(d) { return height - y(d[1]); })
    .attr("data-date", function(d) { 
        return formatDate(d[0]);  // Ensure this returns the date in 'YYYY-MM-DD' format
    })
    .attr("data-gdp", function(d) { return d[1]; })
          .on("mouseover", function(event, d) {		
              const gdpFormatted = `$${d[1].toFixed(1)} Billion`;
        tooltip.transition()        
            .duration(200)        
            .style("opacity", .9);        
        tooltip.html(`${formatDate(d[0])}<br>${gdpFormatted}`)    
            .style("left", (event.pageX) + "px")        
            .style("top", (event.pageY - 28) + "px")
            .attr("data-date", formatDate(d[0])); // Format the date for tooltip
    })                    
    .on("mouseout", function(d) {        
        tooltip.transition()        
            .duration(500)        
            .style("opacity", 0);    
    });

   // Add the X Axis
svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .attr("id", "x-axis");

// Add the Y Axis
svg.append("g")
    .call(yAxis)
    .attr("id", "y-axis");

    // Add a title
    svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .style("text-decoration", "underline")  
        .text("United States GDP Over Time");
}

