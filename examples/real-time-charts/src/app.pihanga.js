import moment from 'moment';

/**
 * Register a meta card which wraps a card of type `innerCardType`
 * into a titled 'MuiCard'.
 * 
 * @param {*} register 
 */
export function init(register) {
  // x axis is time in `h:mm:ss` format.
  const xAxisFormatter = (ts) => moment(ts).format("h:mm:ss");
  const xAxisOpts = {dataKey: 'ts', domain: ['dataMin', 'dataMax'], type: 'number', tickFormatter: xAxisFormatter};

  register.metaCard('WrappedCard', (name, defs) => {
    const { 
      cardType, title, 
      yLabel, metricsType, maxY = 100,
      ...inner
    } = defs;
    const innerName = `${name}-inner`;
    const h = {};
    h[name] = {
      cardType: 'MuiCard',
      title,
      contentCard: innerName,
    }
    h[innerName] = {
      cardType: 'ReLineChart',
      data: s => s.metrics[metricsType],
      xAxisOpts,
      yAxisOpts: {domain: [0, maxY], label: {value: yLabel, angle: -90, position: 'insideLeft'}},
      tooltipOpts: {labelFormatter: ts => `Time: ${xAxisFormatter(ts)}`},
      height: 300,
      ...inner,
    }
    return h;
  });
}

function lineChart(name, dataKey, unit) {
  return {name, dataKey, type: 'linear', unit, dot: false, isAnimationActive: false};
}

const page = {
  page: {
    cardType: 'PiPageR1',
    contentCard: 'graphs',
    title: 'Realtime Charts',
    //titleIcon: 'rotate_right',
    footer: {copyright: 'The Pihanga Team'}
  },

  graphs: {
    cardType: 'PiGrid',
    spacing: 3,
    content: ['cpuGraph', 'memoryGraph', ],
  }, 

  cpuGraph: {
    cardType: 'WrappedCard',
    title: 'CPU User',
    yLabel: '%',
    metricsType: 'cpus',
    lines: (s) => {
      const cores = s.metrics.coreCount;  // one line per core
      return Array.apply(null, Array(cores)).map((_, i) => {
        return lineChart(`CPU ${i}`, `user${i}`, '%');
      });
    },
  },

  memoryGraph: {
    cardType: 'WrappedCard',
    title: 'Memory',
    yLabel: '%',
    metricsType: 'memory',
    maxY: 'auto',
    lines: [
      lineChart('Free Memory', 'freePercent', '%'),
    ],
  }
};

export default { ...page,  };
