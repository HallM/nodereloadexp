const vm = require('vm');
const loader = require('./fresh-loader');

const express = require('express');
const app = express();

// the only difference between this and routes is here we load another router
// which loads the route we want
app.use('/', function(req, res, next) {
  const handler = loader('./fresh-bootstrap-router');
  handler(req, res, next);
});

app.listen(3000, function() {
  console.log('Example app listening on port 3000!');
});
