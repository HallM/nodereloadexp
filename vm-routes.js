const vm = require('vm');
const Module = require('module');
const path = require('path');
const freshy = require('freshy');

const express = require('express');
const app = express();

app.get('/', runInVm('./controller'));

app.listen(3000, function() {
  console.log('Example app listening on port 3000!');
});

function runInVm(path) {
  var currentdir = process.cwd();
  // the filename really didn't matter, this file doesnt even exist
  var filename = currentdir + '/routerunner.js';
  var mod = new Module(filename);

  // quite oddly, making this vm.Script was a measurable decrease in performance...
  // left here just for evidence of the experiment
  // var runnable = new vm.Script('(require("' + path + '"))(req, res, next)');

  return function(req, res, next) {
    const context = {
      module: mod,
      __filename: filename,
      __dirname: currentdir,

      freshy: freshy,

      req: req,
      res: res,
      next: next
    };

    // further evidence of the vm.Script experiment
    // runnable.runInNewContext(context);

    // this method at least allowed the file to always be reloaded and executed immediately as we needed
    vm.runInNewContext('(freshy.freshy("' + path + '"))(req, res, next)', context, path);

    // a failed experiment was to load the module directly, but wrap it in a way to control it.
    // var data = ['var module = {};', fs.readFileSync(path), ';\n'].join('');
    // vm.runInNewContext(data, context, path);
  }
}
