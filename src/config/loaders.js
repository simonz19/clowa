const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require('autoprefixer');
const babelOptions = require('./babelOptions');

const DEFAULT_BROWSERS = [
  '>1%',
  'last 4 versions',
  'Firefox ESR',
  'not ie < 9' // React doesn't support IE8 anyway
];

module.exports.miniCSSLoader = (rule, options) => {
  rule
    .use('mini-css')
    .loader(MiniCssExtractPlugin.loader)
    .options({ hmr: false, publicPath: '/', ...options })
    .end();
};

module.exports.styleLoader = (rule, options) => {
  rule
    .use('style-loader')
    .loader(require.resolve('style-loader'))
    .options({ ...options })
    .end();
};

module.exports.cssLoader = (rule, options) => {
  rule
    .use('css-loader')
    .loader(require.resolve('css-loader'))
    .options({
      modules: false,
      ...options
    })
    .end();
};

module.exports.postCSSLoader = (rule, options) => {
  rule
    .use('postcss-loader')
    .loader(require.resolve('postcss-loader'))
    .options({
      plugins: [
        autoprefixer({
          overrideBrowserslist: DEFAULT_BROWSERS
          // flexbox: 'no-2009'
        })
      ],
      ...options
    })
    .end();
};

module.exports.lessLoader = (rule, options) => {
  rule
    .use('less-loader')
    .loader(require.resolve('less-loader'))
    .options({ javascriptEnabled: true, ...options })
    .end();
};

module.exports.fileLoader = (rule, options) => {
  rule
    .use('file-loader')
    .loader(require.resolve('file-loader'))
    .options({ name: 'static/[name].[hash:8].[ext]', ...options })
    .end();
};

module.exports.babelLoader = (rule, options) => {
  rule
    .use('babel-loader')
    .loader(require.resolve('babel-loader'))
    .options({ ...babelOptions({ ...options }) })
    .end();
};
