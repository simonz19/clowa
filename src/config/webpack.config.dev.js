// 引入基础配置文件
const webpackBase = require('./webpack.config.base');
// 引入 webpack-merge 插件
const webpackMerge = require('webpack-merge');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

// 合并配置文件
module.exports = (appConfig, cwd) => {
  return webpackMerge(webpackBase(appConfig, cwd), {
    // 开启source-map
    devtool: 'cheap-module-source-map',
    plugins:[
      new ProgressBarPlugin({summary: false}),
    ],
  });
};
