const express = require('express');
const app = express.Router();

const requireController = requireFactory('./controller');

app.get('/', function(req, res, next) {
  // we have to do it this way in case controller would have been reloaded
  requireController()(req, res, next);
});

module.exports = app;

function requireFactory(modPath) {
  const resolved = require.resolve(modPath);

  return function() {
    return require(resolved);
  }
}
