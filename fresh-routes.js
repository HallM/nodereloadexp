const vm = require('vm');
const express = require('express');
const loader = require('./fresh-loader');
const app = express();

// we have to force reload by calling require each time
app.get('/', function(req, res, next) {
  const handler = loader('./controller');
  handler(req, res, next);
});

app.listen(3000, function() {
  console.log('Example app listening on port 3000!');
});
