const { existsSync } = require('fs');
const chalk = require('react-dev-utils/chalk');
const { isAbsolute } = require('path');
const Config = require('webpack-chain');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackBar = require('webpackbar');
const {
  miniCSSLoader,
  cssLoader,
  postCSSLoader,
  lessLoader,
  fileLoader,
  babelLoader
} = require('./loaders');

const DEFAULT_SRC_DIR = 'src';
const DEFAULT_DIST_DIR = 'dist';

module.exports = cwd => {
  const isDev = process.env.NODE_ENV === 'development';
  const {
    resolveApp, appNodeModulesPath, ownNodeModulesPath, appConfigPath
  } = require('./paths')(
    cwd
  );

  const {
    lessLoaderOptions,
    entry: rcEntry,
    srcDir = DEFAULT_SRC_DIR,
    distDir = DEFAULT_DIST_DIR,
    extralBabelPlugins,
    extralBabelPresets
  } = existsSync(appConfigPath) ? require(appConfigPath) : {};

  const DEFAULT_ENTRY = `${srcDir}/index.js`;
  const DEFAULT_TEMPLATE = `${srcDir}/index.ejs`;

  const config = new Config();

  const entry = () => {
    if (typeof rcEntry === 'string' || rcEntry instanceof Array) {
      config.merge({
        entry: { index: rcEntry }
      });
    } else if (rcEntry instanceof Object) {
      config.merge({
        entry: { ...rcEntry }
      });
    } else if (existsSync(resolveApp(DEFAULT_ENTRY))) {
      config
        .entry('index')
        .add(resolveApp(DEFAULT_ENTRY))
        .end();
    } else {
      console.log(
        chalk.red(
          `no entry found, please configure in .clowarc.js or create a index.js inside your ${srcDir} folder`
        )
      );
      process.exit(1);
    }
  };

  const output = () => {
    config.output
      .path(isAbsolute(distDir) ? distDir : resolveApp(distDir))
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
      .alias.set('@', resolveApp(srcDir))
      .end();
  };

  const loaders = () => {
    let rule = config.module.rule('pic').test(/\.(png|svg|jpg|gif|jpeg)$/);
    fileLoader(rule);

    rule = config.module
      .rule('babel')
      .test(/\.(js|jsx)$/)
      .exclude.add(/node_modules/)
      .end();
    babelLoader(rule, { extralBabelPlugins, extralBabelPresets });

    rule = config.module
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
    lessLoader(rule, { ...lessLoaderOptions });

    rule = config.module
      .rule('style_node_modules')
      .test(/\.(css|less)$/)
      .include.add(/node_modules/)
      .end();
    miniCSSLoader(rule);
    cssLoader(rule);
    postCSSLoader(rule);
    lessLoader(rule, { ...lessLoaderOptions });
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
