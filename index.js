const util = require('util');
const utils = require('./utils');

const sevs = [
  'trace',
  'debug',
  'info',
  'warn',
  'error',
  'fatal',
];

function log(severity) {
  return function logger(msg, err, other) {
    const data = {
      timestamp: new Date(),
      severity,
      msg,
      stack: utils.getStack(1),
      NODE_ENV: process.env.NODE_ENV,
    };

    if (err) {
      if (err instanceof Error) {
        data.errInfo = utils.parseError(err);
      } else {
        data.errInfo = utils.parseError(new Error(err));
      }
    }

    console.log(require('util').inspect(data, { depth: null }));
    console.log('\n\n');
    return data;
  };
}

function getStack(level) {
    const trace = stackTrace.get();
    const src = {};
    if (level < trace.length) {
        const frame = trace[level];
        src.file = frame.getFileName();
        src.line = frame.getLineNumber();
        src.function = frame.getFunctionName();
    }
    return src;
}

module.exports = sevs.reduce((acc, curr) => {
  acc[curr] = log(curr);
  return acc;
}, {});
