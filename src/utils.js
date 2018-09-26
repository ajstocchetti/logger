module.exports = {
  getStack,
  parseError,
};

function parseError(err) {
  return {
    message: err.message,
    name: err.stack.split(':')[0],
    line: (err.stack.split('\n')[1]).split(':')[1],
    stack: err.stack,
  };
}

function _getStack(belowFn) {
  // source: https://github.com/felixge/node-stack-trace
  var oldLimit = Error.stackTraceLimit;
  Error.stackTraceLimit = Infinity;

  var dummyObject = {};

  var v8Handler = Error.prepareStackTrace;
  Error.prepareStackTrace = function(dummyObject, v8StackTrace) {
    return v8StackTrace;
  };
  Error.captureStackTrace(dummyObject, belowFn || getStack);

  var v8StackTrace = dummyObject.stack;
  Error.prepareStackTrace = v8Handler;
  Error.stackTraceLimit = oldLimit;

  return v8StackTrace;
};

function getStack(level) {
  const trace = _getStack();
  const src = {};
  if (level < trace.length) {
    const frame = trace[level];
    src.file = frame.getFileName();
    src.line = frame.getLineNumber();
    src.function = frame.getFunctionName();
  }
  return src;
}
