// Derived from https://github.com/csabapalfi/hapi-good-datadog/blob/master/index.js
//
// MIT licensed: https://github.com/csabapalfi/hapi-good-datadog/blob/master/package.json#L5

'use strict';

const Stream = require('stream');

module.exports = class GoodStream extends Stream.Writable {
  constructor(config) {
    super({ objectMode: true });

    this.listeners = config.listeners || {};
  }

  _write(data, enc, callback) {
    const { event } = data;
    const { [event]: listener } = this.listeners;

    if (listener) {
      listener(data);
    }

    callback(null);
  }
};
