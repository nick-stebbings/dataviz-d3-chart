import "./styles.less";

import * as d3 from "d3";
// import {
//   loadAndRenderData
// } from "./dataLoader.js";
import * as fc from "d3fc";

// loadAndRenderData(d3, fc);

/* globals d3 */
// detail the URL from which to fetch the relevant data
const URL = 'wheel.json';
// target the single container
const container = d3.select('div');
// detail the formatting function for the thousand digit
// const format = d3.format(',');

// INTRODUCTORY ELEMENTS
container
  .append('h1')
  .attr('class', 'title')
  .text('Coffee Sensation Wheel');

// TOOLTIP
const tooltip = container
  .append('div')
  .attr('id', 'tooltip')
  .style('position', 'absolute')
  .style('opacity', 0)
  .style('pointer-events', 'none');

// before fetching the data, as to allocate the space for each visualization
// detail HTML elements and SVG frames (these do not rely on the actual data)
// LEGEND
// const legendContainer = container
//   .append('div')
//   .attr('class', 'legend');

// legendContainer
//   .append('h2')
//   .attr('class', 'subtitle')
//   .text('Legend');

// legendContainer
//   .append('p')
//   .attr('class', 'subdescription')
//   .text('Hover to visualize each category.');

// const legendWidth = 200;
// const legendHeight = 20;
// // for the legend detail a simple rectangular area, to be filled with one rectangle and one text element per category
// const legendSVG = legendContainer
//   .append('svg')
//   .attr('viewBox', `0, 0 ${legendWidth} ${legendHeight}`);

// for the actual visualizations include introductory html elements (in the form of heading/possibly paragraph)
// add then the SVG frame, benefiting from the same widht and height
const width = 500;
const height = 500;

// TREEMAP
// const treemapContainer = container
//   .append('div')
//   .attr('class', 'viz');

// treemapContainer
//   .append('h2')
//   .attr('class', 'subtitle')
//   .text('Treemap Diagram of Coffee Flavours');

// treemapContainer
//   .append('p')
//   .attr('class', 'subdescription')
//   .text('Hover to highlight each subdivision');

// const treemapSVG = treemapContainer
//   .append('svg')
//   .attr('viewBox', `0, 0 ${width} ${height}`);

// CIRCULAR PACKING
const packingContainer = container
  .append('div')
  .attr('class', 'viz');

packingContainer
  .append('h2')
  .attr('class', 'subtitle')
  .text('Circular Packing');

packingContainer
  .append('p')
  .attr('class', 'subdescription')
  .text('Hover to highlight each aroma or flavour component');

const packingSVG = packingContainer
  .append('svg')
  .attr('viewBox', `0, 0 ${width} ${height}`);


// /* define a function to detail SVG elements for
// - legend
// - viz:
//   - treemap
//   - circular packing
// */
function drawViz(data) {
  // console.log(data);
  // compute a hierarchy based on the JSON data
  const hierarchy = d3.hierarchy(data);
  // compute for each node the relative weight, through the _value_ property
  console.log(hierarchy, " hierarchy");
  hierarchy.count();
  console.log(hierarchy, " counted");
  //   // consider every node
  const descendants = hierarchy.descendants();
  console.log(descendants, " descendants");

  //   // split the categories from the actual projects
  const categories = descendants.filter((descendant) => descendant.depth === 1);
  console.log(categories, " categories");
  //   // LEGEND
  //   // add a group element for each category (to later nest connected rect and text elements)
  //   // show the text element only when hovering on the rectangle elments
  //   // when hovering also expand the rectangle being hovered
  //   const legendGroups = legendSVG
  //     .selectAll('g.legend')
  //     .data(categories)
  //     .enter()
  //     .append('g')
  //     .attr('class', 'legend')
  //     .on('mouseenter', function () {
  //       // expand the selected rectangle, contract every other one
  //       // restore on mouseout
  //       d3
  //         .selectAll('g.legend rect')
  //         .transition()
  //         .attr('width', 0);
  //       d3
  //         .select(this)
  //         .select('rect')
  //         .transition()
  //         .attr('x', 0)
  //         .attr('width', legendWidth);

  //       // introduce the text element with a small delay
  //       d3
  //         .select(this)
  //         .select('text')
  //         .transition()
  //         .delay(200)
  //         .style('opacity', 1);
  //     })
  //     .on('mouseout', function () {
  //       d3
  //         .selectAll('g.legend rect')
  //         .transition()
  //         .attr('x', (d, i) => legendWidth / categories.length * i)
  //         .attr('width', legendWidth / categories.length);

  //       d3
  //         .select(this)
  //         .select('text')
  //         .transition()
  //         .style('opacity', 0);
  //     });

  //   // add colored rectangles for each category
  //   legendGroups
  //     .append('rect')
  //     .attr('x', (d, i) => legendWidth / categories.length * i)
  //     .attr('y', 0)
  //     .attr('width', legendWidth / categories.length)
  //     .attr('height', legendHeight)
  //     .attr('fill', (d, i) => `hsl(${360 / categories.length * i}, 60%, 50%)`);

  //   // add text elements right above the rectangle elements
  //   legendGroups
  //     .append('text')
  //     .attr('x', legendWidth / 15)
  //     .attr('y', legendHeight / 2)
  //     .text(d => d.data.name)
  //     .attr('font-size', '0.6rem')
  //     .attr('fill', '#fff')
  //     .attr('alignment-baseline', 'middle')
  //     .style('pointer-events', 'none')
  //     .style('opacity', 0);

  // //   // TREEMAP
  // //   // define the layout function
  //   const treemap = d3.treemap();
  // //   // format the data through the layout function
  // //   // the function adds four important values in x0, x1, y0 and y1, to describe the starting and ending point
  // //   // values in the 0-1 range
  //   const treemapData = treemap(hierarchy);
  //   // console.log(treemapData, " treemapdata");

  // //   // ! it is not possible to use the same descendants as before, as those do not possess the values just included through the layout function
  //   const descendantsTreemap = treemapData.descendants();
  //   const categoriesTreemap = descendantsTreemap.filter(descendant => descendant.depth === 1);
  //   console.log(categoriesTreemap, 'treemapcats');
  //   const subtypesTreemap = descendantsTreemap.filter(descendant => descendant.depth === 2);
  //   console.log(subtypesTreemap, 'subtypes');

  // //   // include one rectangle for each category, with a color picked from the 0-360 spectrum
  //   treemapSVG
  //     .selectAll('rect.category')
  //     .data(categoriesTreemap)
  //     .enter()
  //     .append('rect')
  //     .attr('class', 'category')
  //     .attr('x', d => d.x0 * width)
  //     .attr('y', d => d.y0 * height)
  //     .attr('width', d => (d.x1 - d.x0) * width)
  //     .attr('height', d => (d.y1 - d.y0) * height)
  //     .attr('fill', (d, i) => `hsl(${360 / categories.length * i}, 60%, 50%)`);

  //   // include one re ctangle for each subtype, but show only the stroke
  //   treemapSVG
  //     .selectAll('rect.subtype')
  //     .data(subtypesTreemap)
  //     .enter()
  //     .append('rect')
  //     .attr('class', 'subtype')
  //     .attr('x', d => d.x0 * width)
  //     .attr('y', d => d.y0 * height)
  //     .attr('width', d => (d.x1 - d.x0) * width)
  //     .attr('height', d => (d.y1 - d.y0) * height)
  //     // ! setting the fill to none causes mouse events to be fired only when crossing the stroke
  //     .attr('fill', 'transparent')
  //     .attr('stroke', '#33333322')
  //     // on mousenter highlight the selected rectangle and include pertinent information in the tooltip
  //     .on('mouseenter', function (event, d) {
  //       d3.select(this)
  //         .attr("fill", "#33333311")
  //         .attr("stroke", "#333333aa");
  //       // tooltip
  //       //   .append('p')
  //       //   .text(d.data.category)
  //       //   .style('font-weight', 'bold');

  //       tooltip.style("opacity", 1).append("p").text(d.data.name);

  //       // tooltip
  //       //   .append('p')
  //       //   .text(`$ ${format(d.data.value)}`);

  //       // retrieve the element for the tooltip, to position the same atop the cursor
  //       const tooltipElement = tooltip.node().getBoundingClientRect();
  //       const { height: heightElement } = tooltipElement;
  //       tooltip
  //         .style("left", `${event.pageX}px`)
  //         .style("top", `${event.pageY - heightElement}px`);
  //     })
  //     .on('mouseout', function () {
  //       d3.select(this)
  //         .attr('fill', 'transparent')
  //         .attr('stroke', '#33333322');

  //       tooltip
  //         .style('opacity', 0)
  //         .selectAll('p')
  //         .remove();
  //     });

  //   // PACKING
  //   // repeat the same logc used in the treemap
  //   // layout function
  const packData = d3.pack().size([width, height]).padding(3)(hierarchy);
  console.log(packData, "pack data");
  //   // packData now has x, y and r values, for the coordinates of each circle and their radii
  console.log(d3.group(hierarchy.descendants(), (d) => d.height));
  //   // consider the categories and the subtypes repeating the same structure used for the treemap
  const descendantsPack = packData.descendants();
  const categoriesPack = descendantsPack.filter(
    (descendant) => descendant.depth === 1
  );
  const subtypesPack = descendantsPack.filter(
    (descendant) => descendant.depth === 2
  );

  const color = d3.scaleOrdinal(d3.schemeOranges[7].reverse());

  const node = packingSVG
    .selectAll("g")
    .data(d3.group(hierarchy.descendants(), (d) => d.height))
    .join("g")
    .selectAll("g")
    .data((d) => d[1])
    .join("g")
    .attr("transform", (d) => `translate(${d.x + 1},${d.y + 1})`);

  //   // instead of drawing rectangles, draw circle elements
  //   // based on the packData values
  node
    .append("circle")
    .attr("r", (d) => d.r)
    .attr("fill", (d, i) => {
      if (i === 0) console.log(d.data);
      return d.data.colour ? d.data.colour : color(d.depth);
    })
    .on("mouseenter", function (event, d) {
      d3.select(this).attr("stroke", "#fff");
      tooltip.append("p").text(d.data.name);
      tooltip.append("p").text(d.value);

      //       // retrieve the element for the tooltip, to position the same atop the cursor
      const tooltipElement = tooltip.node().getBoundingClientRect();
      const {
        height: heightElement
      } = tooltipElement;
      tooltip
        .style("opacity", 1)
        .style("background", 'aliceblue')
        .style("left", `${event.pageX}px`)
        .style("top", `${event.pageY - heightElement}px`);
    })
    .on('mouseout', function () {
      d3.select(this)
        .attr('stroke', '#33333322');

      tooltip
        .style('opacity', 0)
        .selectAll('p')
        .remove();
    });
  // packingSVG
  //   .selectAll('circle.category')
  //   .data(categoriesPack)
  //   .enter()
  //   .append('circle')
  //   .attr('class', 'category')
  //   .attr('cx', d => d.x * width)
  //   .attr('cy', d => d.y * height)
  //   .attr('r', d => d.r * width)
  //   .attr('fill', (d, i) => `hsl(${360 / categories.length * i}, 60%, 50%)`);
  const leaf = node.filter((d) => !d.children);
  console.log(leaf, "leaves");
  //   // add the projects always as circles, but highlighting only the stroke
  //   // on hover detail the specific values
  //   packingSVG
  //     .selectAll('circle.project')
  //     .data(projectsPack)
  //     .enter()
  //     .append('circle')
  //     .attr('class', 'project')
  //     .attr('cx', d => d.x * width)
  //     .attr('cy', d => d.y * height)
  //     .attr('r', d => d.r * width)
  //     .attr('fill', 'transparent')
  //     .attr('stroke', '#33333322')
}

// fetch data from the selected URL
// call the drawViz function to detail the legend and the different layouts
fetch(URL)
  .then(res => res.json())
  .then((json) => {
    drawViz(json);
  });