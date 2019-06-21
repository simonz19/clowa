module.exports = cwd => {
  const config = require('./webpack.core')(cwd);
  config.mode('development');
  config.plugin('hmr').use(require('webpack/lib/HotModuleReplacementPlugin'));
  config.entry('index').prepend(require.resolve('react-dev-utils/webpackHotDevClient'));
  config.entry('index').prepend(require.resolve('react-hot-loader/patch'));
  config.devtool('cheap-module-eval-source-map');
  return config;
};
