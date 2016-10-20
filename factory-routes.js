const requireFactory = require('./require-factory');
const express = require('express');
const app = express();

const getcontroller = requireFactory('./controller');

app.get('/', function(req, res, next) {
  const handler = getcontroller();
  handler(req, res, next);
});

app.listen(3000, function() {
  console.log('Example app listening on port 3000!');
});
