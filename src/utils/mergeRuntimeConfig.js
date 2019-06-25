const { existsSync } = require('fs');
const paths = require('../config/paths.js');

module.exports = (config, cwd) => {
  const { appConfigPath } = paths(cwd);
  if (existsSync(appConfigPath)) {
    const rc = require(appConfigPath);
    if (rc && rc.webpackChain && typeof rc.webpackChain === 'function') {
      return rc.webpackChain(config);
    }
  }
  return config;
};
