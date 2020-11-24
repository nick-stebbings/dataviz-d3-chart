import "./styles.less";

import * as d3 from "d3";
import {
  loadAndRenderData
} from "./dataLoader.js";
import * as fc from "d3fc";

loadAndRenderData(d3, fc);
