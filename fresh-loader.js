const freshy = require('freshy');

module.exports = (process.env.NODE_ENV === 'production') ? require : freshy.freshy;
