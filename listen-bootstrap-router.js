const express = require('express');
const app = express.Router();

app.get('/', function(req, res, next) {
  // we have to do it this way in case controller would have been reloaded
  require('./controller')(req, res, next);
});

module.exports = app;
