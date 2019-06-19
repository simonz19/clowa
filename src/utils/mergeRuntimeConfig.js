const { existsSync } = require('fs');
const { resolve } = require('path');

const rcname = '.clowarc.js';

module.exports = (config, cwd = process.cwd()) => {
  const rcpath = resolve(cwd, rcname);
  if (existsSync(rcpath)) {
    return require(rcpath)(config);
  }
  return config;
};
