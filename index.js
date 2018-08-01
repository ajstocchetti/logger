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
    const stack = utils.getStack(1);
    let errInfo = null;
    if (err) {
      if (err instanceof Error) {
        errInfo = utils.parseError(err);
      } else {
        errInfo = utils.parseError(new Error(err));
      }
    }
    const data = {
      severity,
      msg,
      stack,
      errInfo,
    };
    console.log(require('util').inspect(data, { depth: null }));
    console.log('\n\n');
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
