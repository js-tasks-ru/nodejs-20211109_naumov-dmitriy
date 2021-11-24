const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);

    this.options = options;
    this.transmittedBytes = 0;
  }

  _transform(chunk, encoding, callback) {
    this.transmittedBytes += chunk.length;

    if (this.transmittedBytes > this.options.limit) {
      callback(new LimitExceededError());
    } else {
      callback(null, chunk)
    }
  }
}

module.exports = LimitSizeStream;
