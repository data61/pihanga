import { backendGET, update, registerActions } from '@pihanga/core';
import moment from 'moment';

export const ACTION_TYPES = registerActions('APP', ['METRICS_GET', 'METRICS_FAILED', 'METRICS_UPDATE']);

const METRICS_URL = '/metrics';
const UPDATE_INTERVAL_MS = 2000;
const MAX_HISTORY = 200; // number of measurements to keep
const CPU_METRICS = ['sys', 'user'];

export const getMetrics = (after  = 0)  => {
  const url = `${METRICS_URL}?after=${after}`;
  backendGET(url, 
    ACTION_TYPES.METRICS_GET, 
    ACTION_TYPES.METRICS_UPDATE,
    ACTION_TYPES.METRICS_FAILED)();
}

function onInit(state) {
  setTimeout(() => getMetrics(), 0);
  const m = {metrics: {coreCount: 0, cpus: [], memory: []}};
  return update(state, [], m);
}

function onMetricsUpdate(state, action) {
  const cm = state.metrics;
  const reply = action.reply;
  const coreCount = reply.coreCount;
  const cpus = trim(cm.cpus, processCPUs(reply));
  const memory = trim(cm.memory, processMemory(reply));
  const metrics = {coreCount, cpus, memory};
  const lastTS = memory.length > 0 ? memory[memory.length - 1].ts : 0;
  setTimeout(() => getMetrics(lastTS), UPDATE_INTERVAL_MS);
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

export function init(register) {
  register.reducer(ACTION_TYPES.METRICS_UPDATE, onMetricsUpdate);
  register.reducer('@@INIT',  onInit);
}