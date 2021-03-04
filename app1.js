var svgWidth = 960;
var svgHeight = 500;
var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);
 
d3.csv("data.csv").then(function(healthdata) {
    
    console.log(healthdata);
  
      healthdata.forEach(function(data) {
            data.poverty = +data.poverty;
            data.healthcare = +data.healthcare;
            console.log("parseData", data);
        });  

    var xLinearScale = d3.scaleLinear()
        .domain([7, d3.max(healthdata, d => d.poverty)])
        .range([0, width]); 
    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(healthdata, d => d.healthcare)])
        .range([height, 0]);
    // Step 3: Create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
    // Step 4: Append Axes to the chart
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);
    chartGroup.append("g")
      .call(leftAxis);
      // Step 5: Create Circles
    var circlesGroup = chartGroup.selectAll("circle")
    .data(healthdata)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "10")
    .attr("fill", "red")

    // add abbreviations
   
     chartGroup.selectAll("null").data(healthdata)
     .enter()
     .append("text")
     .text(function(d){
        return d.abbr;})
    .attr("x",d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.healthcare))
    .attr("text-anchor", "middle")
    .attr('fill', 'white')
    .attr('font-size', 10);

    //add tooltip
    
    var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
    return (`${d.abbr}<br>Poverty: ${d.poverty}<br>Healthcare: ${d.healthcare}`);
    });
 
   
    chartGroup.call(toolTip);
    
    
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
     
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });
    
    chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "5px")
    .attr("class", "axisText")
    .attr('style', "font-weight: bold;")
    .text(" Lack of Healthcare (%) ");
    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .attr('style', "font-weight: bold;")
      .text(" Poverty (%) ");    

});