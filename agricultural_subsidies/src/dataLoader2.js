const groups = ['Involving COVID', 'Not Involving COVID', '5YA'];
const ages = [
  "0-19",
  "20-29",
  "30-39",
  "40-49",
  "50-59",
  "60-69",
  "70-79",
  "80-89",
  "90+",
];
function row(rowData) {
  return {
    "Age": rowData["Age"],
    "Not Involving COVID": +rowData[" Deaths not involving COVID-19"],
    "Involving COVID": +rowData[" Deaths involving COVID-19"],
    "5YA": +rowData["Five-year average"],
    // "Sex": rowData["Sex"]
  };
}

export const loadAndRenderData = function (d3, fc) {
  d3.tsv("covid-deaths-by-age-in-private-residences.csv", row).then(function (
    data
  ) {
    function transform(data) {
      data.columns = groups;
      const grouper = fc.group().orient("horizontal");
      return grouper.key("Age")(data);
    }
    const container = document.querySelector("d3fc-svg");
    const series = transform(data);
    console.log(series);
    const xScale = d3
      .scaleBand()
      .domain(ages)
      .paddingInner(0.2)
      .paddingOuter(0.1);

    const yExtent = fc
      .extentLinear()
      .accessors([(a) => a.map((d) => d[1])])
      .include([0]);
    const yScale = d3.scaleLinear().domain(yExtent(series));

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const groupedSeries = fc.seriesSvgBar();
    const groupedBar = fc
      .seriesSvgGrouped(groupedSeries)
      .xScale(xScale)
      .yScale(yScale)
      .align("left")
      .crossValue((d) => d[0])
      .mainValue((d) => d[1])
      .decorate((sel, _, index) => {
        sel
          .enter()
          .select("path")
          .attr("fill", () => color(index));
      });
    // const barSeries = fc
    //   .seriesSvgBar()
    //   .xScale(xScale)
    //   .yScale(yScale)
    //   .crossValue((d) => d.data["Age"])
    //   .mainValue((d) => d[1])
    //   .baseValue((d) => d[0])
    //   .decorate((sel, _, index) => {
    //     sel.selectAll("path").attr("fill", color(index));
    //   });

    // const join = fc.dataJoin("g", "series");

d3.select(container)
  .on("draw", () => {
    d3.select(container)
      .select("svg")
      .datum(series)
      .call(fc.autoBandwidth(groupedBar));
  })
  .on("measure", (event) => {
    const { width, height } = event.detail;
    xScale.range([0, width]);
    yScale.range([height, 0]);
  });

    // container.requestRedraw();
  });
}