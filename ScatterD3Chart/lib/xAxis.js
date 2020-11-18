/*
  The axis component
*/
d3.chart("xAxis", {
  initialize: function (options) {
    let component = this;
    let { parent, innerHeight, tickPadding, xLabel, tickRange } = options;
    let chart = parent;
  
    this._name = "xAxis";
    this.xScale = chart.xScale;

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

    this._xAxis = d3.svg
      .axis()
        .tickValues(d3.range(...tickRange))
        .tickSize(-innerHeight)
        .tickPadding(tickPadding)
      .scale(chart.xScale)
        .orient("bottom");
    // .tickFormat(this._customTimeFormat)
    this._rotation = 0;

    this.base
      .classed("xAxisG axis-group", true)
      .attr("transform", "translate(" + chart._margin.left + "," + (chart._innerHeight - chart._headerHeight + chart._margin.top) + ")")
    .append("text")
      .attr("y", 50)
      .attr("x", 400)
      .classed('label', true)
      .text(xLabel);

    chart.on("change:height", function (newHeight) {
      component.base.attr("transform", "translate(" + chart._margin.left + "," + (chart._innerHeight - chart._headerHeight + chart._margin.top) + ")");
    });

    this.layer("axis", component.base, {
      dataBind: function (data) {
        return this.selectAll("g").data([data]);
      },

      insert: function () {
        return this.append("g");
      },

      events: {
        "merge:transition": function () {
          var transformString = "translate(0, 0)";
          if (component.rotation()) {
            transformString += "rotate(" + component.rotation() + ")";
          }

          this//.duration(chart.duration())
            .call(component._xAxis)
            .selectAll("text")
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
