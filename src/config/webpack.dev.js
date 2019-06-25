module.exports = cwd => {
  const config = require('./webpack.core')(cwd, { env: 'development' });
  config.mode('development');
  config.plugin('hmr').use(require('webpack/lib/HotModuleReplacementPlugin'));
  config.devtool('cheap-module-eval-source-map');
  config.entryPoints.store.forEach((value, key) => {
    config.entry(key).prepend(require.resolve('react-dev-utils/webpackHotDevClient'));
    config.entry(key).prepend(require.resolve('react-hot-loader/patch'));
  });
  return config;
};
