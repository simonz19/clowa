// 引入插件
// const HTMLWebpackPlugin = require('html-webpack-plugin');
// 抽取 css
const ExtractTextPlugin = require('extract-text-webpack-plugin');
// 引入 webpack
const webpack = require('webpack');
// 引入多页面文件列表
const {
  jsFileName,
  assetsFileName,
  cssFileName,
  cssPublicPath,
} = require('./config');

module.exports = (appConfig, cwd) => {
  const paths = require('../utils/getPaths')(cwd);
  const { entry, htmlPlugin } = require('../utils/getAppConfig')(
    appConfig,
    cwd
  ); // 配置文件
  return {
    entry,
    output: {
      filename: jsFileName,
      path: paths.appBuild,
    },
    resolve: {
      modules: [paths.ownNodeModules, paths.appNodeModules, 'node_modules'],
    },
    resolveLoader: {
      modules: [paths.ownNodeModules, paths.appNodeModules],
      moduleExtensions: ['-loader'],
    },

    // 加载器
    module: {
      rules: [
        {
          // 对 css 后缀名进行处理
          test: /\.(css|less)$/,
          // 不处理 node_modules 文件中的 css 文件
          exclude: /node_modules/,
          // 抽取 css 文件到单独的文件夹
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            // 设置 css 的 publicPath
            publicPath: cssPublicPath,
            use: [
              {
                loader: 'css-loader',
                options: {
                  // 开启 css 压缩
                  minimize: true,
                  // modules: true, // 是否开启css-module
                },
              },
              // {
              //   loader: 'postcss-loader',
              // },
              {
                loader: 'less-loader', // compiles Less to CSS
              },
            ],
          }),
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              // presets: ['env'],
            },
          },
        },
        {
          test: /\.(png|svg|jpg|gif)$/,
          use: {
            loader: 'file-loader',
            options: {
              // 打包生成图片的名字
              name: assetsFileName,
              // // 图片的生成路径
              // outputPath: assetsOutputPath,
            },
          },
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          use: ['file-loader'],
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        // $: require('jquery'),
      }),
      // 将 css 抽取到某个文件夹
      new ExtractTextPlugin(cssFileName),
      // 自动生成 HTML 插件
      ...htmlPlugin,
    ],
  };
};
