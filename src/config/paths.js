const { resolve } = require('path');
const { realpathSync, existsSync } = require('fs');

function resolveOwn(relativePath) {
  return resolve(__dirname, '..', '..', relativePath);
}

const DEFAULT_SRC_DIR = 'src';
const DEFAULT_DIST_DIR = 'dist';

module.exports = function getPaths(cwd) {
  const appRootPath = realpathSync(cwd);

  function resolveApp(...relativePath) {
    return resolve(appRootPath, ...relativePath);
  }

  const appConfigPath = resolveApp('.clowarc.js');

  const { srcDir = DEFAULT_SRC_DIR, distDir = DEFAULT_DIST_DIR } = existsSync(appConfigPath)
    ? require(appConfigPath)
    : {};

  return {
    appPackageJsonPath: resolveApp('package.json'),
    appNodeModulesPath: resolveApp('node_modules'),
    ownNodeModulesPath: resolveOwn('node_modules'),
    resolveApp,
    resolveOwn,
    appRootPath,
    appConfigPath,
    appClowaPath: resolveApp(srcDir, '.clowa'),
    appSrcPath: resolveApp(srcDir),
    appDistPath: resolveApp(distDir)
  };
};
