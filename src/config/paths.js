const { resolve } = require('path');
const { realpathSync } = require('fs');

function resolveOwn(relativePath) {
  return resolve(__dirname, relativePath);
}

module.exports = function getPaths(cwd) {
  const appDirectory = realpathSync(cwd);

  function resolveApp(relativePath) {
    return resolve(appDirectory, relativePath);
  }

  return {
    appBuild: resolveApp('dist'),
    appPublic: resolveApp('public'),
    appPackageJson: resolveApp('package.json'),
    appSrc: resolveApp('src'),
    appNodeModules: resolveApp('node_modules'),
    ownNodeModules: resolveOwn('../../node_modules'),
    // appBabelCache: resolveApp('node_modules/.cache/babel-loader'),
    resolveApp,
    appDirectory,
    appConfig: resolveApp('.clowarc.js'),
  };
};
