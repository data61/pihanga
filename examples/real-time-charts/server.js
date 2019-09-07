/**
 * Start a web server at PORT whihc serves a Pihanga frontend
 * on '/' and a history of cpu load and memeor availability 
 * measurements at '/metric' which is being periodically queried
 * by the frontend.
 */
const express = require('express');
var os = require('os');

// port to open web server at
const PORT = 8080;

// number of measuremens to keep
const MAX_QUEUE_SIZE = 5 * 60;
// interval between taking measurments
const MEASURE_INTERVAL_MS = 1000;

let coreCount = 0;
let cpuQueue = [];
let memQueue = [];

const last = {};
const cpuKeys = ['user', 'nice', 'sys', 'idle'];

function cpuM(label, ticks, ts) {
  const l = last[label];
  last[label] = {...ticks, ts};
  var res = cpuKeys.reduce((p,k) => {p[k] = 0; return p;},  {});
  if (!l) {
    return res;
  }
  cpuKeys.forEach(k => res[k] = ticks[k] - l[k]);
  const total = 1.0 * cpuKeys.reduce((p,k) => p + res[k], 0);
  cpuKeys.forEach(k => res[k] /= total);
  return res;
}

function measure() {
  const ts = new Date() / 1;
  const cpus = os.cpus().map((e, id) => cpuM(id, e.times, ts))
    .reduce((p, e) => {
      cpuKeys.forEach(k => p[k].push(e[k]));
      return  p;
    },  cpuKeys.reduce((p,k) => {p[k] = []; return p;},  {ts}));
  const memory = {
    ts,
    total: os.totalmem(),
    free: os.freemem()
  };
  return {cpus, memory};
}

function collect() {
  const m = measure(); // prime
  coreCount = m.cpus[cpuKeys[0]].length;

  setInterval(() => {
    const m = measure();
    cpuQueue = trimQueue(cpuQueue);
    cpuQueue.push(m.cpus);
    memQueue = trimQueue(memQueue);
    memQueue.push(m.memory);
  }, MEASURE_INTERVAL_MS);
}

function trimQueue(q, scale = 1) {
  const maxSize = scale * (MAX_QUEUE_SIZE - 1);
  if (q.length < maxSize) {
    return q;
  }
  return q.slice(-1 * maxSize);
}

const app = express();

// memeory is  reported in base 2. This  function returns
// a human readable  version in base 10
function memory2Human(m) {
  const dg = Math.log(m) / Math.log(2);
  const dm = Math.trunc(dg / 10);
  const u = ['', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const v = Math.pow(2, dg - 10 * dm);
  return `${Math.round(v)}${u[dm]}`;
}

function trimQ(queue, after) {
  if (isNaN(after)) {
    return queue;
  }
  return queue.filter(e => e.ts > after);
}

app.use(express.static('build'));

app.get('/metrics', (req, res) => {
  const after = Number(req.query.after);
  const reply = {memory: trimQ(memQueue, after), cpus: trimQ(cpuQueue, after), coreCount};
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(reply, null, 2));
});

collect();
app.listen(PORT, () => console.log(`Server listening on port ${PORT}!`))
