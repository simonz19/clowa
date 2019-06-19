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
    appBuildPath: resolveApp('dist'),
    appPublicPath: resolveApp('public'),
    appPackageJsonPath: resolveApp('package.json'),
    appSrcPath: resolveApp('src'),
    appTemplatePath: resolveApp('src/index.ejs'),
    appEntryPath: resolveApp('src/index.js'),
    appNodeModulesPath: resolveApp('node_modules'),
    ownNodeModulesPath: resolveOwn('node_modules'),
    resolveApp,
    resolveOwn,
    appRootPath,
    appConfigPath: resolveApp('.clowarc.js')
  };
};
