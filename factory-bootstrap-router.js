const requireFactory = require('./require-factory');

const express = require('express');
const app = express.Router();

app.get('/', makeRoute('./controller'));

function makeRoute(fileurl) {
  const getcontroller = requireFactory(fileurl);

  return function(req, res, next) {
    // this method still requires the controller itself to use the factory as well
    // since all requires are not overridden
    const handler = getcontroller();
    handler(req, res, next);
  };
}

module.exports = app;
