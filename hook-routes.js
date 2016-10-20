const vm = require('vm');
const Module = require('module');
const originalRequire = Module.prototype.require;
const path = require('path');

const express = require('express');
const app = express();

// we add our hook in for non-production only
if (process.env.NODE_ENV !== 'production') {
  Module.prototype.require = function(moduleToRequire) {
    const resolvedPath = Module._resolveFilename(moduleToRequire, this);
    delete require.cache[resolvedPath];
    return originalRequire.apply(this, arguments);
  };
}

// we have to force reload by calling require each time
app.get('/', function(req, res, next) {
  const handler = require('./controller');
  handler(req, res, next);
});

app.listen(3000, function() {
  console.log('Example app listening on port 3000!');
});
