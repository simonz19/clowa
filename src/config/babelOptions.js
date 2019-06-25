module.exports = ({ extralBabelPresets, extralBabelPlugins } = {}) => ({
  babelrc: false,
  cacheDirectory: true,
  presets: [
    require.resolve('@babel/preset-env'),
    require.resolve('@babel/preset-react'),
    ...extralBabelPresets
  ],
  plugins: [
    require.resolve('@babel/plugin-syntax-dynamic-import'),
    [require.resolve('@babel/plugin-proposal-decorators'), { legacy: true }],
    [require.resolve('@babel/plugin-proposal-class-properties'), { loose: true }],
    require.resolve('@babel/plugin-transform-runtime'),
    ...extralBabelPlugins
  ],
  env: {
    development: {
      plugins: [require.resolve('react-hot-loader/babel')]
    }
  }
});
