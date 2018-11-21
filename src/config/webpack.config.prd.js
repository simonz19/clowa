// 引入基础配置
const webpackBase = require('./webpack.config.base');
// 引入 webpack-merge 插件
const webpackMerge = require('webpack-merge');
// 引入 webpack
const webpack = require('webpack');
// 清理 dist 文件夹
const CleanWebpackPlugin = require('clean-webpack-plugin');

// 合并配置文件
module.exports = (appConfig, cwd) => {
  const paths = require('./paths')(cwd);
  return webpackMerge(webpackBase(appConfig, cwd), {
    plugins: [
      // 自动清理 dist 文件夹
      new CleanWebpackPlugin([`${paths.appBuild}/*`], {
        root: cwd, //根目录
        verbose: true, //开启在控制台输出信息
        dry: false, //启用删除文件
      }),
      // 代码压缩
      new webpack.optimize.UglifyJsPlugin({
        // 开启 sourceMap
        sourceMap: false,
      }),
      // 提取公共 JavaScript 代码
      new webpack.optimize.CommonsChunkPlugin({
        // chunk 名为 commons
        name: 'commons',
        filename: '[name].js',
      }),
    ],
  });
};
