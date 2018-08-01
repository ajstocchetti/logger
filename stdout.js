module.exports = function log(data) {
  console.log(`${data.timestamp.toISOString()} ${data.severity} ${data.msg}`);
  console.log('\t', data.stack.function, data.stack.file, data.stack.line);
  if (data.errInfo) {
    console.log('\t', data.errInfo.err_message);
  }
}
