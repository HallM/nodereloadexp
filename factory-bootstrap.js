const requireFactory = require('./require-factory');

// const spawn = require('cross-spawn');
// const chokidar = require('chokidar');

const express = require('express');
const app = express();

// may or may not pull in cached, depends on production vs not-prod
const run = requireFactory('./factory-bootstrap-router');

// mount everything to /
app.get('/', function(req, res, next) {
  // the factory will provide either a new instance or a re-used production instance
  const handler = run();
  handler(req, res, next);
});

// we absolutely dont attach anything else to express. the run handles that.

// so now start the server.
// changing the port is one of the only things that requires a restart here
app.listen(3000, function() {
  console.log('Example app listening on port 3000!');
});

// just an experiment to run install
// function runinstall() {
//   spawn.sync('npm', ['install'], { stdio: 'inherit' });
// }

// chokidar
//   .watch('package.json')
//   .on('change', runinstall);
