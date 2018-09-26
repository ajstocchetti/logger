const utils = require('./utils');

let extras = {};
function init(opts = {}) {
  // check for truthy in case null is passed in
  if (!opts || typeof opts !== 'object') return;
  Object.keys(opts).forEach(k => extras[k] = opts[k]);
}


function log(severity) {
  return function logger(msg, err, details) {
    const data = {
      ...extras,
      timestamp: new Date(),
      severity,
      msg,
      stack: utils.getStack(1),
      NODE_ENV: process.env.NODE_ENV,
    };

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
