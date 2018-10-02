const utils = require('./utils');

let extras = {};
const options = {
  ts: true,
  tsKey: 'timestamp',
  stack: true,
};

const isObj = p => p && typeof p === 'object';

function init(statics = {}, opts = {}) {
  if (!isObj(opts)) opts = {};
  options.ts = !opts.skipTs;
  options.tsKey = opts.tsKey || 'timestamp';
  options.stack = !opts.skipStack;

  if (isObj(statics)) {
    Object.keys(statics).forEach(k => extras[k] = statics[k]);
  }
}


function log(severity) {
  return function logger(msg, err, details) {
    const data = {
      ...extras,
      severity,
      msg,
      NODE_ENV: process.env.NODE_ENV,
    };
    if (options.ts) {
      data[options.tsKey] = new Date();
    }
    if (options.stack) data.stack = utils.getStack(1);

    if (err) {
      if (err instanceof Error) {
        data.error_info = utils.parseError(err);
      } else {
        data.error_info = utils.parseError(new Error(err));
      }
    }

    if (details) data.details = details;

    print(data);
    return data;
  };
}

function print(data) {
  console.log(JSON.stringify(data, null, 2));
}

module.exports = {
  init,
  trace: log('trace'),
  debug: log('debug'),
  info: log('info'),
  warn: log('warn'),
  error: log('error'),
  fatal: log('fatal'),
};
