const express = require('express');
const FileSystem = require('fs');
const Path = require('path');

const app = express();
const port = 8080;

const workDir = Path.resolve(process.cwd());


app.get('/', function(req, res) {
  const libs = findLibs();
  const html = page(...libs);
  res.setHeader('Content-Type', 'text/html');
  res.end(html);
});

const page = (coreLibs, extLibs) =>  {
  const mf = f => `<script type="text/javascript" src="${f}"></script>`
  const core = coreLibs.map(mf);
  const ext = extLibs.map(mf);
  return `
<!doctype html>
<html lang="en" style="height: 100%">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="shortcut icon" href="/static/core/favicon.ico">
    <title>Micro Service Demo</title>
  </head>
  <body style="height: 100%; margin: 0" >
    <div id="root" style="height: 100%"></div>
    <!-- Rendezvous point for extensions -->
    <script type="text/javascript">
      var Pihanga = {
        BootstrapInit: [],
        Core: {},
        UI: {}
      };
    </script>
    ${ext.join("\n    ")}
    ${core.join("\n    ")}
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
  </body>
</html>
`;
};

const readDirRec = (dir) => {
  const absDir = Path.join(workDir, dir);
  if (FileSystem.statSync(absDir).isDirectory()) {
    if (dir.endsWith('node_modules')) {
      return [];
    } else {
      return Array.prototype.concat(...FileSystem.readdirSync(absDir).map(f => {
        return readDirRec(Path.join(dir, f));
      }));
    }
  } else {
    return dir;
  }
}

const findLibs = () => {
  const p = /\/build\/.*\.js$/;
  const pEx = /core\/build\/[^\/]*$/; // remove workbox & cache support
  const all = readDirRec('.')
    .filter(s => p.test(s))
    .filter(s => !pEx.test(s))
    .map(f => f.replace('/build/', '/'))
    .map(f => '/static/' + f)
    ;

  console.log(all);

  const p2 = /\/core\//;
  const sepF = (a, f) => { a[p2.test(f) ? 0 : 1].push(f); return a; };
  return all.reduce(sepF, [[], []]);
}

const findBuildDirs = (dir) => {
  const absDir = Path.join(workDir, dir);
  if (FileSystem.statSync(absDir).isDirectory()) {
    if (dir.endsWith('node_modules')) {
      return [];
    } else if (dir.endsWith('build')) {
      return [dir];
    } else {
      return Array.prototype.concat(...FileSystem.readdirSync(absDir).map(f => {
        return findBuildDirs(Path.join(dir, f));
      }));
    }
  } else {
    return [];
  }
}

const buildDirs = findBuildDirs('.');
buildDirs.forEach(d => {
  const p = '/static/' + d.replace(/\/build$/, '');
  app.use(p, express.static(d));
});

findLibs();

app.listen(port, () => console.log(`Server listening on port ${port}!`))
