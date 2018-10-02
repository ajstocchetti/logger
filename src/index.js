const utils = require('./utils');

const isObj = p => p && typeof p === 'object';
const makeObj = (o, obj = {}) => isObj(o) ? o : obj;

class logger {
  constructor(opts = {}) {
    this._every = makeObj(opts.every);
    this._provided = {
      timestamp: opts.hasOwnProperty('timestamp') ? opts.timestamp : 'timestamp',
      severity: opts.hasOwnProperty('severity') ? opts.severity : 'severity',
      message: opts.hasOwnProperty('message') ? opts.message : 'msg',
      stack: opts.hasOwnProperty('stack') ? opts.stack : 'stack',
    };
    this._outputs = Array.isArray(opts.outputs) ? opts.outputs : [printJson];
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

    if (this._provided.timestamp) data[this._provided.timestamp] = new Date();
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
      if (typeof output === 'function') {
        try {
          output(data);
        } catch(err) {
          // ?!?!
        }
      }
    });
    return data;
  }
}

function printJson(data) {
  console.log(JSON.stringify(data, null, 2));
}

function printLine(data, keys = ['timestamp', 'severity', 'msg']) {
  const some = [];
  keys.forEach(k => some.push(data[k]));
  console.log(some.join('\t'));
}

module.exports = logger;
