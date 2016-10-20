const express = require('express');
const app = express.Router();

// we specifically allow this one to be freshly required
app.get('/', require('./controller'));

module.exports = app;
