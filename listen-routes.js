const chokidar = require('chokidar');
const express = require('express');
const app = express();

app.get('/', function(req, res, next) {
  const handler = require('./controller');
  handler(req, res, next);
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
