const Webpack = require('webpack');

module.exports = cwd => {
  const config = require('./webpack.core')(cwd);
  config.mode('development');
  config.plugin('hmr').use(Webpack.HotModuleReplacementPlugin);
  config.entry('index').prepend(require.resolve('react-hot-loader/patch'));
  config.entry('index').prepend(require.resolve('react-dev-utils/webpackHotDevClient'));
  config.devtool('cheap-module-eval-source-map');
  return config;
};
