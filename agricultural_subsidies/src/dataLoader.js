function row([year, amount]) {
  return {
    year: new Date(year.slice(1)),
    amount: +amount
  };
}

function transform(data) {
  return Object.entries(data[0])
    .slice(1)
    .map(row);
}

export const loadAndRenderData = function (d3, fc) {
  d3.csv("subsidies.csv").then(function (data) {
    data = transform(data);
    data.crosshair = [];
    const container = document.querySelector("div");

    const formatAmount = d3.format(",.2r");

    const x = (d, i) => d.year;
    const y = (d, i) => d.amount;
    const xScale = d3.scaleTime();
    const yScale = d3.scaleLinear();
    const xExtent = fc
      .extentTime()
      .include([new Date("1999-12-31")])
      .accessors([x]);
    const yExtent = fc.extentLinear().include([0]).accessors([y]);
    const years = data.map(x);

    const lineSeries = fc.seriesSvgLine().mainValue(y).crossValue(x);

    const areaSeries = fc.seriesSvgArea().baseValue(0).mainValue(y).crossValue(x);

    const gridlines = fc.annotationSvgGridline().yTicks(5).xTicks(0);

    const point = fc
      .seriesSvgPoint()
      .crossValue(x)
      .mainValue(y)
      .size(25)
      .decorate((selection) => {
        selection.enter().append("text");
        selection.select("text").text(y);
      });

    const multi = fc
      .seriesSvgMulti()
      .series([gridlines, areaSeries, lineSeries, point])
      .mapping((data, index, series) => {
        switch (series[index]) {
          case point:
            return data.crosshair;
          default:
            return data;
        }
      });

    const pointer = fc.pointer().on("point", (event) => {
      data.crosshair = event.map(({
        x: xVal
      }) => {
        const bisectDate = d3.bisector(function (d) {
          return d.year;
        }).left;
        const closestIndex = bisectDate(data, xScale.invert(xVal));
        return data[closestIndex];
      });
      render();
    });

    const chart = fc
      .chartCartesian(xScale, yScale)
      .yOrient("left")
      .xDomain(xExtent(data))
      .xTicks(data.map(x).length)
      .xLabel("Year")
      .yDomain(yExtent(data))
      .yLabel("Million Euros")
      .yTickFormat(formatAmount)
      .svgPlotArea(multi);

    const render = function () {
      d3.select(container).datum(data).call(chart);
      d3.select("#chart-element .plot-area").call(pointer);
    }

    render();
  })
}