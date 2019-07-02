const { existsSync } = require('fs');
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

module.exports = (cwd, { env, analyser }) => {
  const isDev = env === 'development';
  const {
    resolveApp,
    appNodeModulesPath,
    ownNodeModulesPath,
    appConfigPath,
    appSrcPath,
    appDistPath
  } = require('./paths')(cwd);

  const {
    lessLoaderOptions,
    entry: rcEntry,
    extralBabelPlugins,
    extralBabelPresets,
    extralBabelIncludes
  } = existsSync(appConfigPath) ? require(appConfigPath) : {};

  const DEFAULT_ENTRY = `${appSrcPath}/index.js`;
  const DEFAULT_TEMPLATE = `${appSrcPath}/index.ejs`;

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
      throw new Error(
        `no entry found, please configure in .clowarc.js or create a index.js inside your ${appSrcPath} folder`
      );
    }
  };

  const output = () => {
    config.output
      .path(appDistPath)
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
      .modules.add(appNodeModulesPath)
      .add(ownNodeModulesPath)
      .end()
      .alias.set('@', resolveApp(appSrcPath))
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

    if (extralBabelIncludes && extralBabelIncludes instanceof Array) {
      extralBabelIncludes.forEach((pattern, index) => {
        rule = config.module
          .rule(`babel_extral_${index}`)
          .test(/\.(js|jsx)$/)
          .inlcude.add(pattern)
          .end();
        babelLoader(rule, { extralBabelPlugins, extralBabelPresets });
      });
    }

    rule = config.module.rule('style').test(/\.(css|less)$/);
    let one = rule
      .oneOf('self')
      .exclude.add(/node_modules/)
      .end();
    miniCSSLoader(one, { hmr: !!isDev });
    cssLoader(one, {
      modules: {
        mode: 'local',
        localIdentName: '[local]__[hash:base64:5]'
      }
    });
    postCSSLoader(one);
    lessLoader(one, { ...lessLoaderOptions });
    one = rule
      .oneOf('node_modules')
      .include.add(/node_modules/)
      .end();
    miniCSSLoader(one);
    cssLoader(one);
    postCSSLoader(one);
    lessLoader(one, { ...lessLoaderOptions });
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

    if (analyser) {
      config
        .plugin('bundle-analyzer')
        .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin, [
          {
            analyzerMode: 'static'
          }
        ]);
    }
  };

  const optimize = () => {
    const commons = config.entryPoints.store.size > 1
      ? {
        // commons: {
        //   name: 'commons',
        //   chunks: 'initial',
        //   minChunks: 2
        // }
      }
      : {};
    config.optimization.splitChunks({
      chunks: 'all', // three valid values: all, async, initial
      name: '_vendors', // the name of splited chunks, if matches an entry name, the entry point will be removed
      cacheGroups: { ...commons }
    });
  };

  entry();
  output();
  resolve();
  loaders();
  plugins();
  optimize();
  return config;
};
