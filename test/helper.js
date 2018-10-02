function stackTestFunc(logger, sev, msg, err, details) {
  return logger.log(sev, msg, err, details);
  // IMPORTANT!
  // this needs to stay on line 2 for tests to pass
}


module.exports = {
  stackTestFunc,
};
