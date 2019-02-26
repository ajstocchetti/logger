const utils = require('./utils');

const isObj = p => p && typeof p === 'object';
const makeObj = (o, obj = {}) => isObj(o) ? o : obj;
const isFunc = f => typeof f === 'function';

const default_ts = () => new Date().toISOString();

function validOptString(opts, key, fallback) {
  if (opts.hasOwnProperty(key)) {
    if (!opts[key]) return false;
    else if (typeof opts[key] === 'string') return opts[key];
  }
  return fallback;
}
function validFunc(func, fallback) {
  return func && typeof func === 'function' ? func : fallback;
}

class logger {
  constructor(opts = {}) {
    this._every = makeObj(opts.every);
    this._provided = {
      timestamp: validOptString(opts, 'timestamp', 'timestamp'),
      ts_func: validFunc(opts.ts_function, default_ts),
      severity: validOptString(opts, 'severity', 'severity'),
      message: validOptString(opts, 'message', 'msg'),
      stack: validOptString(opts, 'stack', 'stack'),
    };

    const outs = Array.isArray(opts.outputs) ? opts.outputs : [opts.outputs];
    this._outputs = outs.filter(isFunc);
  }

  log(severity, msg, err, details) {
    return this.logReal(severity, msg, err, details);
  }
  trace(msg, err, details) {
    return this.logReal('trace', msg, err, details);
  }
  debug(msg, err, details) {
    return this.logReal('debug', msg, err, details);
  }
  info(msg, err, details) {
    return this.logReal('info', msg, err, details);
  }
  warn(msg, err, details) {
    return this.logReal('warn', msg, err, details);
  }
  error(msg, err, details) {
    return this.logReal('error', msg, err, details);
  }
  fatal(msg, err, details) {
    return this.logReal('fatal', msg, err, details);
  }

  logReal(sev, msg, err, details) {
    let data = {};
    Object.keys(this._every).forEach(key => {
      const val = this._every[key];
      data[key] = (typeof val === 'function') ? val() : val;
    });

    if (isObj(details)) data = {...data, ...details };

    if (this._provided.timestamp) {
      try {
        data[this._provided.timestamp] = this._provided.ts_func();
      } catch (err) {
        // should ts be set to default on failure?
        // data[this._provided.timestamp] = default_ts();
      }
    }
    if (this._provided.severity) data[this._provided.severity] = sev;
    if (this._provided.message) data[this._provided.message] = msg;
    if (this._provided.stack) data[this._provided.stack] = utils.getStack(2);

    if (err) {
      if (err instanceof Error) {
        data.error_info = utils.parseError(err);
      } else {
        data.error_info = utils.parseError(new Error(err));
      }
    }

    this._outputs.forEach(output => {
      try { output(data); }
      catch(err) { /* ?!?! */ }
    });
    return data;
  }
}

// function printJson(data) {
//   console.log(JSON.stringify(data, null, 2));
// }
//
// function printLine(data, keys = ['timestamp', 'severity', 'msg']) {
//   const some = [];
//   keys.forEach(k => some.push(data[k]));
//   console.log(some.join('\t'));
// }

module.exports = logger;
