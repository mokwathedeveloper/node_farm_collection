const util = require('util');

// Replace util._extend with Object.assign
if (util._extend) {
  util._extend = function(dest, src) {
    return Object.assign(dest, src);
  };
}

module.exports = util;
