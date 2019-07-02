const { existsSync } = require('fs');
const { resolve } = require('path');
const routerGenerator = require('../utils/routerGenerator');

const mergeHooks = (...hookGroups) => {
  const result = {};
  hookGroups.forEach(hooks => {
    Object.keys(hooks).forEach(key => {
      if (hooks[key] instanceof Array && hooks[key].length > 0) {
        result[key] = [...(result[key] || []), ...hooks[key]].filter(item => !!item);
      }
    });
  });
  return result;
};

module.exports = (compiler, cwd) => {
  const { appConfigPath, appClowaPath } = require('../config/paths')(cwd);
  const { hooks = {}, routerConfig } = existsSync(appConfigPath) ? require(appConfigPath) : {};

  const defaultHooks = {
    beforeRun: [
      routerConfig
        ? routerGenerator({
          config: routerConfig,
          dist: resolve(appClowaPath, 'routers.js')
        })
        : undefined
    ]
  };

  const mergedHooks = mergeHooks(hooks, defaultHooks);
  Object.keys(mergedHooks).forEach(key => {
    if (mergedHooks[key] instanceof Array && mergedHooks[key].length > 0) {
      if (compiler.hooks[key]) {
        compiler.hooks[key].tap(`clowa dev ${key}`, (...args) => {
          mergedHooks[key].forEach(hook => {
            if (hook && typeof hook === 'function') hook(...args);
          });
        });
      }
    }
  });
};
