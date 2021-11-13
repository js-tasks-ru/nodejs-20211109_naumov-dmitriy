function isNumber(value) {
  return typeof value === 'number' &&
    value === value &&
    value !== Infinity && value !== -Infinity;
}

module.exports = isNumber;
