const { existsSync } = require('fs');
const { resolve } = require('path');

module.exports = config => {
  const rcpath = resolve('../config/paths.js');
  if (existsSync(rcpath)) {
    const rc = require(rcpath);
    if (rc && rc.webpackChain && typeof rc.webpackChain === 'function') {
      return rc.webpackChain(config);
    }
  }
  return config;
};
