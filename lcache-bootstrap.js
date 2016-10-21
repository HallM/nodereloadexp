const chokidar = require('chokidar');
const express = require('express');
const app = express();

const requireApp = requireFactory('./lcache-bootstrap-router');

app.use('/', function(req, res, next) {
  requireApp()(req, res, next);
});

app.listen(3000, function() {
  console.log('Example app listening on port 3000!');
});

const basePath = process.cwd() + '/';
function clearCacheFor(file) {
  delete require.cache[basePath + file];
}

chokidar
  .watch('**/*.js', {
    ignored: 'node_modules',
    ignoreInitial: true,
    followSymlinks: false
  })
  .on('change', clearCacheFor);

function requireFactory(modPath) {
  const resolved = require.resolve(modPath);

  return function() {
    return require(resolved);
  }
}
