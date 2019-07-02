const { resolve } = require('path');
const { realpathSync } = require('fs');

function resolveOwn(relativePath) {
  return resolve(__dirname, '..', '..', relativePath);
}

module.exports = function getPaths(cwd) {
  const appRootPath = realpathSync(cwd);

  function resolveApp(relativePath) {
    return resolve(appRootPath, relativePath);
  }

  return {
    appPackageJsonPath: resolveApp('package.json'),
    appNodeModulesPath: resolveApp('node_modules'),
    ownNodeModulesPath: resolveOwn('node_modules'),
    resolveApp,
    resolveOwn,
    appRootPath,
    appConfigPath: resolveApp('.clowarc.js'),
    appClowaPath: resolveApp('.clowa')
  };
};
