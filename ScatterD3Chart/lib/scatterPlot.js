d3.chart("ScatterPlot", {
  initialize: function (props) {
    const {
      margins,
      xValue,
      yValue,
      xLabel,
      yLabel
    } = props;

    this.xValue = xValue;
    this.yValue = yValue;
    this.xScale = d3.scale.linear().nice();
    this.yScale = d3.scale.linear().nice();
    this.colorScale = d3.scale.category10();

    this._margin = margins;
    this._headerHeight = 100;
    this.width(this.base.attr('width') ? (this.base.attr('width') - this._margin.left - this._margin.right) : 200);
    this.height(this.base.attr('height') ? (this.base.attr('height') - this._margin.top - this._margin.bottom - this._headerHeight) : 200);
    this._asideWidth = 0;

    this._duration = 500;
    this._radius = this._radius || 5;

    this.xAxis = d3
      .select("#vis g")
      .insert("g",":first-child")
      .chart("xAxis", {
        parent: this,
        innerHeight: 600,
        tickPadding: 20,
        xLabel,
        tickRange: [1, 7.5, 0.5],
      });
    this.attach("xAxis", this.xAxis);
    this.setXRange();
  
    this.yAxis = d3
      .select("#vis g")
      .insert("g",":first-child")
      .attr(
        "transform",
        "translate( " + this._margin.left + "," + this._headerHeight + ")"
      )
      .chart("yAxis", {
        parent: this,
        innerWidth: 975,
        innerHeight: 600,
        tickPadding: 30,
        yLabel: yLabel,
        tickRange: [0.1, 2.5, 0.1],
      });
    this.attach("yAxis", this.yAxis);
    this.setYRange();

    const circleLayerBase = this.base
      .selectAll('g').data([null]).enter().append("g")
      .classed("circles", true);

    this.layer("circles", circleLayerBase, {
      dataBind: function (data) {
        var chart = this.chart();
        chart.xScale.domain(d3.extent(data, chart.xValue));
        chart.yScale.domain(d3.extent(data, chart.yValue));
        chart.colorScale.domain(data.map( d => d.species ));
        return this.selectAll("circle").data(data);
      },

      insert: function () {
        var chart = this.chart();
        return this.append("circle").attr("r", chart.radius());
      },

      events: {
        enter: function () {
          var chart = this.chart();
          return this.attr("cx", function (d) {
            return chart.xScale(chart.xValue(d));
          }).attr("cy", function (d) {
            return chart.yScale(chart.yValue(d));
          }).attr("fill", function (d) {
            return chart.colorScale(d.species);
          });

        }
      },
    });
  },

  getOriginalData: function (d) {
    return d;
  },

  outerWidth: function () {
    return this._innerWidth + this._margin.left + this._margin.right;
  },

  outerHeight: function () {
    return this._innerHeight + this._margin.top + this._margin.bottom;
  },

  width: function (newWidth) {
    if (arguments.length === 0) {
      return this._innerWidth;
    }

    // only if the width actually changed:
    if (this._innerWidth !== newWidth) {
      var oldWidth = this._innerWidth;
      this._innerWidth = newWidth;
      // set higher container width
      this.base.attr('width', this.outerWidth());
      this.setXRange();
      // trigger a change event
      this.trigger('change:width', newWidth, oldWidth);
    }

    // always return the chart, for chaining magic.
    return this;
  },

  setXRange: function () {
    this.xScale.range([0, this._innerWidth]);
  },

  height: function (newHeight) {
    if (arguments.length === 0) {
      return this._innerHeight;
    }
    this._innerHeight = newHeight;
    if (this._innerHeight !== oldHeight) {
      var oldHeight = this._innerHeight;
      this._innerHeight = newHeight;
      this.base.attr('height', this.outerHeight());
      this.setYRange();
      this.trigger(
        "change:height",
        this._innerHeight - this._headerHeight,
        oldHeight
      );
    }

    return this;
  },

  setYRange: function () {
    this.yScale.range([this._innerHeight - this._headerHeight, 0]);
  },

  margin: function (newMargin) {
    if (arguments.length === 0) {
      return this._margin;
    }

    var oldMargin = this._margin;
    this._margin = newMargin;

    // Update the base
    // this.base.attr('transform', 'translate(' + this._margin.left + ',' + this._headerHeight + ')');
    this.base.attr('width', this.outerWidth() - this._margin.left - this._margin.right);
    this.base.attr('height', this.outerHeight() - this._margin.top - this._margin.bottom - this._headerHeight);

    this.trigger('change:margin', newMargin, oldMargin);

    return this;
  },

  chartWidth: function () {
    return this.width() - this._asideWidth;
  },

  chartHeight: function () {
    return this.height() - this._headerHeight;
  },

  asideWidth: function (newAsideWidth) {
    if (arguments.length === 0) {
      return this._asideWidth;
    }

    var oldAsideWidth = this._asideWidth;
    this._asideWidth = newAsideWidth;

    this.trigger('change:asideWidth', newAsideWidth, oldAsideWidth);

    return this;
  },

  duration: function () {
    return this._duration;
  },

  color: function () {
    return this._color;
  },

  attributeSummary: function () {
    console.log("Height: (inner)", this.height());
    console.log("Width: (inner)", this.width());
    console.log("Margins:", this.margin());
    console.log("Outer Height:", this.outerHeight());
    console.log("Outer Width:", this.outerWidth());
    console.log("Chart Height:", this.chartHeight());
    console.log("Chart Width:", this.chartWidth());
    console.log("Header Height:", this.headerHeight());
    console.log("Aside Width:", this.asideWidth());
    console.log("Scale Domain X:", this.xScale.domain());
    console.log("Scale Domain Y:", this.yScale.domain());
    console.log("Scale range X:", this.xScale.range());
    console.log("Scale range Y:", this.yScale.range());
  },
  /**
    chart.colors(*colors*)
  
    Sets the range of colors used to paint the bars. *colors* can either be a
    single color (which will apply to all bars) or an array.
  */
  colors: function (newColors) {
    if (arguments.length === 0) {
      return this._color.range();
    }

    newColors = (typeof newColors === 'string') ? [newColors] : newColors;
    this._color.range(newColors);

    return this;
  },

  headerHeight: function (newHeight) {
    if (arguments.length === 0) {
      return this._headerHeight;
    }
    this._headerHeight = newHeight;
    return this;
  },

  radius: function (newRadius) {
    if (arguments.length === 0) {
      return this._radius;
    }
    this._radius = newRadius;
    return this;
  },

  addTitle: function (title, yPadding) {
    d3.select(".header")
      .append("g")
      .classed("title-group", true)
      .attr("transform", "translate(" + (this.outerWidth() / 2)  + "," + yPadding * 2 + ")")
      .append("text")
      .text(title);
    return this;
  },

  addSubtitle: function (subtitle, yPadding) {
    d3.select(".header")
      .append("g")
      .classed("subtitle-group", true)
      .attr("transform", "translate(" + (this.outerWidth() / 2) + "," + yPadding * 2 + ")")
      .append("text")
      .text(subtitle);
    return this;
  },

  // addLegend: function (data) {
  //   var chart = this;
  //   d3.select("#vis g")
  //     .append("g")
  //     .attr("class", "legendG")
  //     .attr("transform", "translate(700,30)")
  //     .style("font-size", "12px")
  //     .call(colorLegend, { plot: chart, circleSize: 8, circleSpacing: 20 });
  //   return this;
  // },
});