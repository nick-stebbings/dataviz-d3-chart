import { loadAndProcessData } from "./dataLoader.js";
import { colorLegend } from "../../lib/d3-legend.js";

const svgWidth = document.body.clientWidth;
const svgHeight = document.body.clientHeight;

let width = 960, // don't forget to copy to axis component ticks
    height = 700,
    svg = d3.select("#vis");

    let topPadding = 55,
        sidePadding = 0,
        
        margins = {
          top: 20,
          right: 10,
          bottom: 50,
          left: 90,
        },
        headerHeight = 100;

svg.attr("viewBox", `0 0 ${svgWidth} ${svgHeight}`)
  .append("rect")
    .attr("width", Math.min(svgWidth, width + 150))
    .attr("height", Math.min(svgHeight, height + 150))
    .attr("rx", 40);
  
const mainG = svg.append('g')
                .attr('transform', `translate( ${sidePadding}, ${topPadding} )`);



let titleText = "Flowers",
    titleYPadding = 20,
    subtitleText =
      "This chart shows the dimensions of petals and sepals for different flower species",
    subtitleYPadding = 30,
    xLabel = "Petal Length",
    yLabel = "Petal Width",
    circlesRadius = 5,
    xValue = (d) => +d.petalLength,
    yValue = (d) => +d.petalWidth;
        
const heading = svg
  .append("g")
    .attr("width", width)
    .attr("height", headerHeight)
    .classed("header", true);

const plot = mainG
  .append("g")
    .attr('transform', 'translate(' + margins.left + ',' + margins.top + ')')
    .classed("chart", true)
  .chart("ScatterPlot", { margins, xValue, yValue, xLabel, yLabel })
    .headerHeight(headerHeight)
    .width(width)
    .height(height)
    .margin(margins)
    .radius(circlesRadius)
    .addTitle(titleText, titleYPadding)
    .addSubtitle(subtitleText, subtitleYPadding);

const legendG = svg
  .append("g")
  .attr("class", "legendG")
  .attr("class", "axis-group")
  .attr("transform", `translate(${width + margins.left + margins.right },${margins.top})`)
  .call(colorLegend, { plot: plot, circleSize: 8, circleSpacing: 20} );
  
loadAndProcessData(plot);
export default {
  plot,
};