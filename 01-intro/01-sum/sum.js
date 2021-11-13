const isNumber = require('./utils/isNumber');

function sum(a, b) {
  if (!isNumber(a) || !isNumber(b)) {
    throw new TypeError('At least one of the arguments is not a number', 'sum.js');
  }

  return a + b;
}

module.exports = sum;
