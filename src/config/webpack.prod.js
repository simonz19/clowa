const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const terserOptions = require('./terserOptions');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = (cwd, { compress, analyser } = {}) => {
  const config = require('./webpack.core')(cwd, { env: 'production', analyser });
  config.mode('production');
  config.performance.hints(false);
  config.plugin('clean-webpack').use(new CleanWebpackPlugin());

  if (compress === 'none') {
    console.log('> generating webpack config without compress feature...');
    config.output.pathinfo(true);
    config.optimization.namedModules(true).namedChunks(true);
    config.optimization.minimize(false);
  } else {
    config.optimization.minimizer('uglify-js').use(TerserWebpackPlugin, [{ ...terserOptions }]);
    config.optimization.minimizer('uglify-css').use(OptimizeCSSAssetsPlugin);
  }
  return config;
};
