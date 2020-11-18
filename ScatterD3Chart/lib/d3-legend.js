export const colorLegend = function (selection, {
  plot = {},
  circleSize = 8,
  circleSpacing = 20
}) {
  let groupEnter =selection
    .selectAll("g")
      .data(["setosa", "versicolor", "virginica"])
      .enter().append("g");

  groupEnter
      .attr("transform", (d,i) => { return "translate(" + 0 + ", " + (i * circleSpacing) + ")" })
    .append('circle')
      .attr('fill', d => plot.colorScale(d))
      .attr('r', circleSize)
    .on('mouseover', d => {  })
    .on('mouseout', d => { console.log(d) });
  
  groupEnter
    .append('text')
      .text(d => d)
      .attr('x', -(circleSize + 5))
      .attr('text-anchor', 'end' )
      .attr('y', '0.32em');
  
  return selection;
};