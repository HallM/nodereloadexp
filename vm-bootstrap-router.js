const express = require('express');
const loader = require('./fresh-loader');
const app = express.Router();

// vm uses the same from require-hook, so it just works
app.get('/', loader('./controller'));

module.exports = app;
