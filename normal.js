const express = require('express');
const app = express();

const controller = require('./controller');

app.get('/', controller);

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
