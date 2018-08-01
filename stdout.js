module.exports = function log(data) {
  console.log(`${data.timestamp.toISOString()} ${data.severity} ${data.msg}`);
  console.log('\t', 'stack.file', data.stack.file);
  console.log('\t', 'stack.line', data.stack.line);
  console.log('\t', 'stack.func', data.stack.function);
  if (data.errInfo) {
    console.log('\t', 'err', data.errInfo.err_message);
  }
}
