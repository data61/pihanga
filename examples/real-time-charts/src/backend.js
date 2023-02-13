//import { backendGET, update, registerActions } from '@pihanga/core';
import { update } from '@pihanga/core';
import moment from 'moment';
import { registerPeriodicGET } from '@pihanga/core';

// export const ACTION_TYPES = registerActions('APP', ['METRICS_GET', 'METRICS_FAILED', 'METRICS_UPDATE']);

const METRICS_URL = '/metrics?after=:after';
const UPDATE_INTERVAL_MS = 2000;
const MAX_HISTORY = 200; // number of measurements to keep
const CPU_METRICS = ['sys', 'user'];

export function init(register) {

  registerPeriodicGET({
    name: 'getMetrics',
    url: METRICS_URL,
    intervalMS: UPDATE_INTERVAL_MS,

    start: '@@INIT',
    init: (state) => {
      const m = {metrics: {coreCount: 0, cpus: [], memory: []}};
      return update(state, [], m);    
    },

    request: (state) => {
      const memory = state.metrics.memory;
      const lastTS = memory.length > 0 ? memory[memory.length - 1].ts : 0;
      return {after: lastTS};
    },
    reply: onMetricsUpdate,
  });

}

function onMetricsUpdate(state, reply) {
  const cm = state.metrics;
  const coreCount = reply.coreCount;
  const cpus = trim(cm.cpus, processCPUs(reply));
  const memory = trim(cm.memory, processMemory(reply));
  const metrics = {coreCount, cpus, memory};
  return update(state, ['metrics'], metrics);
}

function processCPUs(reply) {
  return reply.cpus.map(flattenCpuMetric);
}

function flattenCpuMetric(m) {
  let r = {ts: m.ts};
  CPU_METRICS.forEach(k => {
    m[k].forEach((v, i) => r[k + i] = Math.round(100 * v));
  });
  return r;
}

function processMemory(reply) {
  return reply.memory.map(e => ({
    x: moment(e.ts).format("h:mm:ss"),
    freePercent: Math.round(1000 * e.free / e.total) / 10,
    ...e,
  }));
}

function trim(a1, a2) {
  return Array.prototype.concat(a1, a2).slice(-1 * MAX_HISTORY);
}

