const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = cwd => {
  const config = require('./webpack.core')(cwd);
  config.mode('production');
  config.plugin('clean-webpack').use(new CleanWebpackPlugin());
  return config;
};
