module.exports = () => ({
  babelrc: false,
  cacheDirectory: true,
  presets: [require.resolve('@babel/preset-env'), require.resolve('@babel/preset-react')],
  plugins: [
    require.resolve('@babel/plugin-syntax-dynamic-import'),
    [require.resolve('@babel/plugin-proposal-decorators'), { legacy: true }],
    require.resolve('@babel/plugin-proposal-class-properties', { loose: true }),
    require.resolve('@babel/plugin-transform-runtime')
  ],
  env: {
    development: {
      plugins: [require.resolve('react-hot-loader/babel')]
    }
  }
});
