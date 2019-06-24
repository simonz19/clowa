const { existsSync } = require('fs');
const Config = require('webpack-chain');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const babelOptions = require('../utils/getBabelOptions')();
const WebpackBar = require('webpackbar');
const {
  miniCSSLoader, cssLoader, postCSSLoader, lessLoader
} = require('../loaders');

const DEFAULT_ENTRY = './src/index.js';
const DEFAULT_TEMPLATE = './src/index.ejs';

module.exports = cwd => {
  const isDev = process.env.NODE_ENV === 'development';
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

    let rule = config.module
      .rule('style')
      .test(/\.(css|less)$/)
      .exclude.add(/node_modules/)
      .end();
    miniCSSLoader(rule, { hmr: !!isDev });
    cssLoader(rule, {
      modules: {
        mode: 'local',
        localIdentName: '[local]__[hash:base64:5]'
      }
    });
    postCSSLoader(rule);
    lessLoader(rule);

    rule = config.module
      .rule('style_node_modules')
      .test(/\.(css|less)$/)
      .include.add(/node_modules/)
      .end();
    miniCSSLoader(rule);
    cssLoader(rule);
    postCSSLoader(rule);
    lessLoader(rule);
  };

  const plugins = () => {
    // filename with hash will cause css hmr invalid
    const hash = isDev ? '' : '.[contenthash:8]';
    config.plugin('mini-css').use(MiniCssExtractPlugin, [
      {
        filename: `[name]${hash}.css`,
        chunkFilename: `[name]${hash}.chunk.css`
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
