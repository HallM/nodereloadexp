const vm = require('vm');
const Module = require('module');
const path = require('path');
const freshy = require('freshy');

const express = require('express');
const app = express();

app.use('/', runInVm('./vm-bootstrap-router'));

app.listen(3000, function() {
  console.log('Example app listening on port 3000!');
});

function runInVm(path) {
  var currentdir = process.cwd();
  // the filename really didn't matter, this file doesnt even exist
  var filename = currentdir + '/routerunner.js';
  var mod = new Module(filename);

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

    // this method at least allowed the file to always be reloaded and executed immediately as we needed
    vm.runInNewContext('(freshy.freshy("' + path + '"))(req, res, next)', context, path);
  }
}
