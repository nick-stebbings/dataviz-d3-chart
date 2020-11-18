/*
  The axis component
*/
d3.chart("yAxis", {
  initialize: function (options) {
    let component = this;
    let { parent, innerWidth, innerHeight, tickPadding, yLabel, tickRange } = options;
    let chart = parent;
    this._name = "yAxis";
    this.yScale = chart.yScale;

    this._customTimeFormat = d3.time.format.multi([
      [
        ".%L",
        function (d) {
          return d.getMilliseconds();
        },
      ],
      [
        ":%S",
        function (d) {
          return d.getSeconds();
        },
      ],
      [
        "%-I:%M",
        function (d) {
          return d.getMinutes();
        },
      ],
      [
        "%-I %p",
        function (d) {
          return d.getHours();
        },
      ],
      [
        "%a %-d",
        function (d) {
          return d.getDay() && d.getDate() != 1;
        },
      ],
      [
        "%b %-d",
        function (d) {
          return d.getDate() != 1;
        },
      ],
      [
        "%B",
        function (d) {
          return d.getMonth();
        },
      ],
      [
        "%Y",
        function () {
          return true;
        },
      ],
    ]);
    this._yAxis = d3.svg
      .axis()
      .tickValues(d3.range(...tickRange))
      .tickSize(-innerWidth)
      .tickPadding(tickPadding)
      .scale(chart.yScale)
      .orient("left");
    // .tickFormat(this._customTimeFormat)
    this._rotation = 0;

    this.base
        .classed("yAxisG axis-group", true)
        .attr("transform", "translate(" + chart._margin.left + ", " + chart._margin.top + ")")
      .append("text")
        .attr('dx', -(innerHeight / 2))
        .attr('dy', -(2 * tickPadding))
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .classed('label', true)
        .text(yLabel);

    chart.on("change:height", function (newHeight) {
      component.base.attr(
        "transform",
        "translate(" + chart._margin.left + ", " + chart._margin.top + ")"
      );
    });

    this.layer("yAxis", component.base, {
      dataBind: function (data) {
        return this.selectAll("g").data([data]);
      },

      insert: function () {
        return this.append("g");
      },

      events: {
        "merge:transition": function () {
          var transformString = "translate(0, 0)"
          if (component.rotation()) {
            transformString += "rotate(" + component.rotation() + ")";
          }

          this.call(component._yAxis) //.duration(chart.duration())
            .selectAll("text")
            .attr("y", 0)
            .attr("dy", "0.32em")
            // .attr("transform", transformString)
            .style("text-anchor", component.rotation() ? "start" : "middle");
        },

      },
    });
  },

  /*
   * chart.rotation(*degrees*)
   *
   * Sets the rotation of the labels.
   */
  rotation: function (degrees) {
    if (arguments.length === 0) {
      return this._rotation;
    }

    this._rotation = degrees;

    return this;
  },

  /*
   * chart.hide(*boolean*)
   *
   * Determines whether the component is visible
   */
  hide: function (bool) {
    if (arguments.length === 0) {
      return this.base.attr("display") == "none";
    }

    if (bool) {
      this.base.attr("display", "none");
    } else {
      this.base.attr("display", "initial");
    }

    return this;
  },

  /*
   * chart.hideTicks(*bool*)
   *
   * Determines whether tick marks are shown.
   */
  hideTicks: function (bool) {
    if (arguments.length === 0) {
      return this;
    }

    if (bool) {
      this._xAxis.tickSize(0);
    }
    //else {//this.xAxis.tickFormat(');}

    return this;
  },

  /*
   * chart.ticks(*integer*)
   *
   * Sets the number of ticks.
   */
  ticks: function (_) {
    if (arguments.length === 0) {
      return this._xAxis.ticks();
    }

    this._xAxis.ticks(_);

    return this;
  },
});
