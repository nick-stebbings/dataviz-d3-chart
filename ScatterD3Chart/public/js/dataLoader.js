import { csv } from "d3";

const row = d => {
        d.petalLength = +d.petalLength;
        d.petalWidth = +d.petalWidth;
        d.sepalLength = +d.sepalLength;
        d.sepalWidth = +d.sepalWidth;
        return d;
      };

export const loadAndProcessData = function(chart) {
  csv("vendor/iris.csv", row, function(err, rows) {
    chart.draw(rows);
  });
  }