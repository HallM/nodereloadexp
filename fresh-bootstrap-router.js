const express = require('express');
const freshy = require('freshy');
const app = express.Router();

// this file is reloaded anyway, so the following require will be reloaded too
app.get('/', freshy.freshy('./controller'));

module.exports = app;
