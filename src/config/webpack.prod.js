const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const terserWebpackPlugin = require('terser-webpack-plugin');
const terserOptions = require('./terserOptions');

module.exports = cwd => {
  const { c: compress } = require('yargs-parser')(process.argv.slice(2));
  const config = require('./webpack.core')(cwd);
  config.mode('production');
  config.plugin('clean-webpack').use(new CleanWebpackPlugin());
  if (compress === 'none') {
    console.log('> generating webpack config without compress feature...');
    config.output.pathinfo(true);
    config.optimization.namedModules(true).namedChunks(true);
    config.optimization.minimize(false);
  } else {
    config.optimization.minimizer('uglify').use(terserWebpackPlugin, [{ ...terserOptions }]);
  }
  return config;
};
