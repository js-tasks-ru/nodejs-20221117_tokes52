const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this._remainingData = null;
  }

  _transform(chunk, encoding, callback) {
    const lines = chunk.toString().split(os.EOL);

    if (this._remainingData) {
      lines[0] = this._remainingData + lines[0];
    }

    [this._remainingData] = lines.splice(lines.length - 1, 1);

    lines.forEach((line) => {
      this.push(line);
    });

    callback();
  }

  _flush(callback) {
    if (this._remainingData) {
      this.push(this._remainingData);
    }
    callback();
  }
}

module.exports = LineSplitStream;
