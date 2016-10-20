const express = require('express');
const loader = require('./fresh-loader');
const app = express.Router();

// this file is reloaded anyway, so the following require will be reloaded too
app.get('/', loader('./controller'));

module.exports = app;
