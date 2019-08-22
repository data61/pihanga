const express = require('express');
const Promise = require('promise');
const exec = require('child_process').exec;
var path = require('path');

const externalProc = './wrapper.sh';

const app = express();
const port = 8080;

app.use(express.static('build'));

const mockResult = {
  '44444': {count: 2, banks: 3},
  default: {count: 0, banks: 3},
}

app.get('/passport/:id', function(req, res) {
  mockStuff(req.params.id).then(function(result) {
    console.log(">>> res >>", result);
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(result, null, 3));
  }, err => {
    console.log(err);
  });
});

const mockStuff = (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const r = mockResult[id] || mockResult.default;
      r.id = id;
      resolve(r);
    }, 3000);
  });
}

const doStuff = (id) => {
  var dir = path.resolve(process.cwd());
  return new Promise((resolve, reject) => {
    exec(`${externalProc} 2 3 ${id}`, {cwd: dir}, (error, stdout, stderr) => {
      console.log(">>> DO STUFF >>", error, stdout, stderr);
      //const a = stdout.trim().split(' ');
      //const r = {id: id, count: a[0], banks: a[1]};
      const r = JSON.parse(stdout)
      resolve(r);
    });
  });
}

app.listen(port, () => console.log(`Server listening on port ${port}!`))
