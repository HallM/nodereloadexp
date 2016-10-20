const express = require('express');
const freshy = require('freshy');
const app = express.Router();

// vm uses the same from require-hook, so it just works
app.get('/', freshy.freshy('./controller'));

module.exports = app;
