const { existsSync } = require('fs');
const Config = require('webpack-chain');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const babelOptions = require('../utils/getBabelOptions')();
const WebpackBar = require('webpackbar');
const autoprefixer = require('autoprefixer');

const DEFAULT_BROWSERS = [
  '>1%',
  'last 4 versions',
  'Firefox ESR',
  'not ie < 9' // React doesn't support IE8 anyway
];

const DEFAULT_ENTRY = './src/index.js';
const DEFAULT_TEMPLATE = './src/index.ejs';

module.exports = cwd => {
  const { resolveApp, appNodeModulesPath, ownNodeModulesPath } = require('../utils/getPaths')(cwd);
  const config = new Config();

  const entry = () => {
    if (existsSync(resolveApp(DEFAULT_ENTRY))) {
      config
        .entry('index')
        .add(DEFAULT_ENTRY)
        .end();
    }
  };

  const output = () => {
    config.output
      .path(resolveApp('dist'))
      .publicPath('/')
      .filename('[name].[hash:8].js')
      .chunkFilename('[name].[hash:8].chunk.js')
      .end();
  };

  const resolve = () => {
    config.resolve.extensions
      .add('.js')
      .prepend('.json')
      .end()
      .modules.add(ownNodeModulesPath)
      .add(appNodeModulesPath)
      .end()
      .alias.set('@', resolveApp('src'))
      .end();
  };

  const loaders = () => {
    config.module
      .rule('pic')
      .test(/\.(png|svg|jpg|gif|jpeg)$/)
      .use('file-loader')
      .loader(require.resolve('file-loader'))
      .options({ name: 'static/[name].[hash:8].[ext]' })
      .end();

    config.module
      .rule('babel')
      .test(/\.(js|jsx)$/)
      .exclude.add(/node_modules/)
      .end()
      .use('babel-loader')
      .loader(require.resolve('babel-loader'))
      .options({ ...babelOptions }) // eslint-disable-line
      .end();

    config.module
      .rule('style')
      .test(/\.(css|less)$/)
      .exclude.add(/node_modules/)
      .end()
      .use('mini-css')
      .loader(MiniCssExtractPlugin.loader)
      .options({ hmr: process.env.NODE_ENV === 'development' })
      .end()
      .use('css-loader')
      .loader(require.resolve('css-loader'))
      .options({ modules: true })
      .end()
      .use('postcss-loader')
      .loader(require.resolve('postcss-loader'))
      .options({
        plugins: [
          autoprefixer({
            overrideBrowserslist: DEFAULT_BROWSERS,
            flexbox: 'no-2009'
          })
        ]
      })
      .end()
      .use('less-loader')
      .loader(require.resolve('less-loader'))
      .end();
  };

  const plugins = () => {
    config.plugin('mini-css').use(MiniCssExtractPlugin, [
      {
        filename: '[name].[contenthash:8].css',
        chunkFilename: '[name].[contenthash:8].chunk.css'
      }
    ]);

    config.plugin('webpack-bar').use(WebpackBar);

    if (existsSync(resolveApp(DEFAULT_TEMPLATE))) {
      config.plugin('html-webpack').use(HtmlWebpackPlugin, [
        {
          filename: 'index.html',
          template: resolveApp(DEFAULT_TEMPLATE)
        }
      ]);
    }
  };

  entry();
  output();
  resolve();
  loaders();
  plugins();
  return config;
};
