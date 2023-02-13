import React, { useRef, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, PolarGrid, Tooltip, Legend, ReferenceLine, Brush,
} from 'recharts';
import useComponentSize from '@rehooks/component-size';
import {
  schemeCategory10, schemeAccent, schemeDark2,
  schemePaired,
  schemePastel1, schemePastel2,
  schemeSet1, schemeSet2, schemeSet3,
  schemeTableau10,  
} from 'd3-scale-chromatic';
import { createLogger } from '@pihanga/core';
import styled from './lineChart.style';

const logger = createLogger('lineChart.component');

const defData = [
  {name: '1', uv: 300, pv: 456},
  {name: '2', uv: -145, pv: 230},
  {name: '3', uv: -100, pv: 345},
  {name: '4', uv: -8, pv: 450},
  {name: '5', uv: 100, pv: 321},
  {name: '6', uv: 9, pv: 235},
  {name: '7', uv: 53, pv: 267},
  {name: '8', uv: 252, pv: -378},
  {name: '9', uv: 79, pv: -210},
  {name: '10', uv: 294, pv: -23},
  {name: '12', uv: 43, pv: 45},
  {name: '13', uv: -74, pv: 90},
  {name: '14', uv: -71, pv: 130},
  {name: '15', uv: -117, pv: 11},
  {name: '16', uv: -186, pv: 107},
  {name: '17', uv: -16, pv: 926},
  {name: '18', uv: -125, pv: 653},
  {name: '19', uv: 222, pv: 366},
  {name: '20', uv: 372, pv: 486},
  {name: '21', uv: 182, pv: 512},
  {name: '22', uv: 164, pv: 302},
  {name: '23', uv: 316, pv: 425},
  {name: '24', uv: 131, pv: 467},
  {name: '25', uv: 291, pv: -190},
  {name: '26', uv: -47, pv: 194},
  {name: '27', uv: -415, pv: 371},
  {name: '28', uv: -182, pv: 376},
  {name: '29', uv: -93, pv: 295},
  {name: '30', uv: -99, pv: 322},
  {name: '31', uv: -52, pv: 246},
  {name: '32', uv: 154, pv: 33},
  {name: '33', uv: 205, pv: 354},
  {name: '34', uv: 70, pv: 258},
  {name: '35', uv: -25, pv: 359},
  {name: '36', uv: -59, pv: 192},
  {name: '37', uv: -63, pv: 464},
  {name: '38', uv: -91, pv: -2},
  {name: '39', uv: -66, pv: 154},
  {name: '40', uv: -50, pv: 186}
];

const defLines = [
  {dataKey: "pv", unit: 'ms', activeDot: { r: 8 }, dot: false},
  {dataKey: "uv"},
//  {dataKey: 'value'},
];


// http://recharts.org/en-US/api/LineChart
const defChartOpts = {
  margin: { top: 5, right: 20, bottom: 15, left: 20 },
};

// http://recharts.org/en-US/api/Line
const defLineOpts = {
  // https://github.com/d3/d3-shape#curves
  type: "natural", // 'basis' | 'basisClosed' | 'basisOpen' | 'linear' | 'linearClosed' | 'natural' | 'monotoneX' | 'monotoneY' | 'monotone' | 'step' | 'stepBefore' | 'stepAfter' | 
};

// cartesian: http://recharts.org/en-US/api/CartesianGrid
// polar: http://recharts.org/en-US/api/PolarGrid
const defGridOpts = {
  enabled: true,
  type: 'cartesian',
  strokeDasharray: "3 3",
};

// http://recharts.org/en-US/api/XAxis
const defXAxisOpts = {
  enabled: true,
  dataKey: 'name',
  padding: { left: 0, right: 0 },
};

// http://recharts.org/en-US/api/yAxis
const defYAxisOpts = {
  enabled: true,
  padding: { top: 0, bottom: 0 },
};

const defTooltipOpts = {
  enabled: true,
};

const defLegendOpts = {
  enabled: true,
  layout: 'horizontal', // 'horizontal' | 'vertical'
  iconSize: 14,
  iconType: 'square', // 'line' | 'square' | 'rect' | 'circle' | 'cross' | 'diamond' | 'star' | 'triangle' | 'wye'
  verticalAlign: 'top', // 'top', 'middle', 'bottom'
  align: 'right', // 'left', 'center', 'right'
  margin: { top: 100, left: 0, right: 0, bottom: 0 },
};

const defBrushOpts = {
  enabled: false,
  dataKey: 'name',
  height: 30,
  stroke: '#8884d8',
};

// https://github.com/d3/d3-scale-chromatic
const colorSchemes = {
  'category10': schemeCategory10,
  'accent': schemeAccent,
  'dark2': schemeDark2,
  'paired': schemePaired,
  'pastel1': schemePastel1,
  'pastel2': schemePastel2,
  'set1': schemeSet1,
  'set2': schemeSet2,
  'set3': schemeSet3,
  'tableau10': schemeTableau10,
};

const defColorScheme = Object.keys(colorSchemes)[0];

function getColorScheme(name) {
  let s = colorSchemes[name];
  if (!s) {
    logger.warn(`Unknown color scheme '${name}', defaulting to '${defColorScheme}'`);
    s = colorSchemes[defColorScheme];
  }
  return s;
}

export const LineChartComp = styled(({
  data = defData,
  lines = defLines,
  width = 1.0, // less than 1, considered fraction
  height = 300,
  colorScheme = defColorScheme,
  chartOpts = {},
  gridOpts = {},
  xAxisOpts = {},
  yAxisOpts = {},
  tooltipOpts = {},
  legendOpts = {},
  brushOpts = {},
  classes,
}) => {
  const ref = useRef(null);
  if (width <= 1) {
    let size = useComponentSize(ref);
    width = size.width * (width < 1 ? width : 1);
  }
  const colors = getColorScheme(colorScheme);

  function addLine(lineOpts, id) {
    let {dataKey, stroke, ...opts} = {...defLineOpts, ...lineOpts};
    if (! stroke) {
      stroke = colors[id % colors.length];
    }
    return (<Line key={id} dataKey={dataKey} stroke={stroke} {...opts} />);
  }

  function addGrid() {
    const {enabled, type, ...opts} = {...defGridOpts, ...gridOpts};
    if (enabled) {
      switch(type) {
        case 'cartesian':
          return (<CartesianGrid {...opts} />);
        case 'polar':
          return (<PolarGrid {...opts} />);
        default:
          console.error(`Unknown grid type '${type}'.`);
      }
    } else {
      return null;
    }
  }

  function addXAxis() {
    const {enabled, ...opts} = {...defXAxisOpts, ...xAxisOpts};
    if (enabled) {
      return (<XAxis {...opts} />);
    } else {
      return null;
    }
  }

  function addYAxis() {
    const {enabled, ...opts} = {...defYAxisOpts, ...yAxisOpts};
    if (enabled) {
      return (<YAxis {...opts} />);
    } else {
      return null;
    }
  }

  function addTooltip() {
    const {enabled, ...opts} = {...defTooltipOpts, ...tooltipOpts};
    if (enabled) {
      return (<Tooltip {...opts} />);
    } else {
      return null;
    }
  }

  function addLegend() {
    const {enabled, ...opts} = {...defLegendOpts, ...legendOpts};
    if (enabled) {
      return (<Legend {...opts} />);
    } else {
      return null;
    }
  }

  function addBrush() {
    const {enabled, ...opts} = {...defBrushOpts, ...brushOpts};
    if (enabled) {
      return (<Brush {...opts} />);
    } else {
      return null;
    }
  }

  return (
    <div ref={ref} className={classes.outer} style={{height}}>
      <div  className={classes.inner} style={{height}}>
        <LineChart width={width} height={height} data={data} {...defChartOpts} {...chartOpts }>
          {addGrid()}
          {addXAxis()}
          {addYAxis()}
          {addTooltip()}
          {addLegend()}
          {addBrush()}
          {lines.map(addLine)}
        </LineChart>
      </div>
    </div>
  );
});

