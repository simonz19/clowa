const getPaths = require('../config/paths');
const cwd = process.cwd();
const paths = getPaths(cwd);
const appConfig = require(paths.appConfig);

/** 获得app配置的entry */
const getEntry = () => {
  let entry = appConfig.entry;
  if (entry instanceof String) {
    entry = { index: entry };
  }
  const nEntry = {};
  if (entry instanceof Object) {
    for (let key in entry) {
      if ({}.hasOwnProperty.call(entry, key)) {
        nEntry[key] = paths.resolveApp(entry[key]);
      }
    }
  }
  return nEntry;
};

module.exports = {
  getEntry,
};
