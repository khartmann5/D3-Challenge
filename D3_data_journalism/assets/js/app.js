const svgWidth = 960;
const svgHeight = 500;

const margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

const width = svgWidth - margin.left - margin.right;
const height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
const svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight +20);

// Append an SVG group
const chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
let chosenXAxis = "poverty";
let chosenYAxis = "healthcare";

// function used for updating x-scale const upon click on axis label
// function xScale(censusData, chosenXAxis) {
//     // create scales
//     const xLinearScale = d3.scaleLinear()
//       .domain([d3.min(censusData, d => d[chosenXAxis]),
//         d3.max(censusData, d => d[chosenXAxis])
//       ])
//       .range([0, width]);
  
//     return xLinearScale;
  
//   }

//   // function used for updating xAxis const upon click on axis label
// function renderAxes(newXScale, xAxis) {
//     const bottomAxis = d3.axisBottom(newXScale);
  
//     xAxis.transition()
//       .duration(1000)
//       .call(bottomAxis);
  
//     return xAxis;
//   }

// // function used for updating circles group with a transition to
// // new circles
// function renderCircles(circlesGroup, newXScale, chosenXAxis) {

//     circlesGroup.transition()
//       .duration(1000)
//       .attr("cx", d => newXScale(d[chosenXAxis]));
  
//     return circlesGroup;
//   }

//   // function used for updating circles group with new tooltip
// function updateToolTip(chosenXAxis, circlesGroup) {

//     let label;
  
//     if (chosenXAxis === "poverty") {
//       label = "In Poverty (%)";
//     }
//     else {
//       label = "Age (Median)";
//     }
  
//     const toolTip = d3.tip()
//       .attr("class", "tooltip")
//       .offset([80, -60])
//       .html(d => `${d.state}<br>${label} ${d[chosenXAxis]}`);
  
//     circlesGroup.call(toolTip);
  
//     circlesGroup.on("mouseover", function(data) {
//         toolTip.show(data);
//       })
//       // onmouseout event
//       .on("mouseout", function(data) {
//         toolTip.hide(data);
//       });
  
//     return circlesGroup;
//   }

  // Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(censusData => {
  
    // parse data
    censusData.forEach(data => {
      data.poverty = +data.poverty;
      data.age = +data.age;
      data.healthcare = +data.healthcare;
      data.smokes = +data.smokes;
      data.obesity = +data.obesity;
      data.income = +data.income;
    });

    // console.log(censusData);
    
    // initialize scale functions
    let xLinearScale = xScale(censusData, chosenXAxis);
    let yLinearScale = yScale(censusData, chosenYAxis);
  
    // // Create y scale function
    // const yLinearScale = d3.scaleLinear()
    //   .domain([0, d3.max(censusData, d => d.healthcare)])
    //   .range([height, 0]);
  
    // Create initial axis functions
    const bottomAxis = d3.axisBottom(xLinearScale);
    const leftAxis = d3.axisLeft(yLinearScale);
  
    // append x axis
    let xAxis = chartGroup.append("g")
    //   .classed("x-axis", true)
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);
  
    // append y axis
    let yAxis = chartGroup.append("g")
      .call(leftAxis);
  
    // append initial circles
    let circlesGroup = chartGroup.selectAll("circle")
      .data(censusData)
      .enter()
      .append("circle")

    let circlesXY = circlesGroup.append("cicle")
      .attr("cx", d => xLinearScale(d[chosenXAxis]))
      .attr("cy", d => yLinearScale(d[chosenYAxis]))
      .attr("r", 15)
      .classed("stateCircle", true);

    let circlesText = circlesGroup.append("text")
        .text(d => d.abbr)
        .attr("dx", d => xLinearScale(d[chosenXAxis]))
        .attr("dy", d => yLinearScale(d[chosenYAxis]) + 5)
        .classed("stateText", true)
  
    // Create group for three x-axis labels
    const xlabelsGroup = chartGroup.append("g")
      .attr("transform", `translate(${width / 2}, ${height + 20})`);
  
    const povertyLabel = xlabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 20)
      .attr("value", "poverty") // value to grab for event listener
      .classed("active", true)
      .text("In Poverty (%)");
  
    const ageLabel = xlabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 40)
      .attr("value", "age") // value to grab for event listener
      .classed("inactive", true)
      .text("Age (Median)");

    const incomeLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "income") // value to grab for event listener
        .classed("inactive", true)
        .text("Household Income (Median)");
  
    // Create group for three y-axis labels  
    const ylabelsGroup = chartGroup.append("g");

    const healthcareLabel = ylabelsGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -40)
      .attr("x", 0 - (height / 2))
      .attr("value", "healthcare") // value to grab for event listener
      .attr("dy", "1em")
      .classed("active", true)
      .text("Lacks Healthcare (%)");

      const smokesLabel = ylabelsGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -60)
      .attr("x", 0 - (height / 2))
      .attr("value", "smokes") // value to grab for event listener
      .attr("dy", "1em")
      .classed("inactive", true)
      .text("Smokes (%)");
  
      const obesityLabel = ylabelsGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -80)
      .attr("x", 0 - (height / 2))
      .attr("value", "obesity") // value to grab for event listener
      .attr("dy", "1em")
      .classed("inactive", true)
      .text("Obese (%)");

    // updateToolTip function above csv import
    circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
  
    // x axis labels event listener
    xlabelsGroup.selectAll("text")
      .on("click", function() {
        // get value of selection
        const value = d3.select(this).attr("value");
        if (value !== chosenXAxis) {
  
          // replaces chosenXAxis with value
          chosenXAxis = value;
  
          console.log(chosenXAxis)
  
          // functions here found above csv import
          // updates x scale for new data
          xLinearScale = xScale(censusData, chosenXAxis);
  
          // updates x axis with transition
          xAxis = renderAxes(xLinearScale, xAxis);
  
          // updates circles with new x values
          circlesXY = renderXCircles(circlesXY, xLinearScale, chosenXAxis);

          // update circle text with new x values
          circlesText = renderXText(circlesText, xLinearScale, chosenXAxis);
  
          // updates tooltips with new info
          circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
  
          // changes classes to change bold text
          if (chosenXAxis === "poverty") {
            povertyLabel
              .classed("active", true)
              .classed("inactive", false);
            ageLabel
              .classed("active", false)
              .classed("inactive", true);
            incomeLabel
                .classed("active", false)
                .classed("inactive", true);
          }
          else if (chosenXAxis === "age") {
            povertyLabel
              .classed("active", false)
              .classed("inactive", true);
            ageLabel
              .classed("active", true)
              .classed("inactive", false);
            incomeLabel
                .classed("active", false)
                .classed("inactive", true);
          }
          else {
            povertyLabel
              .classed("active", false)
              .classed("inactive", true);
            ageLabel
                .classed("active", false)
                .classed("inactive", true);
            incomeLabel
                .classed("active", true)
                .classed("inactive", false);
          }
        }
      });

    
  }).catch(error => console.log(error));