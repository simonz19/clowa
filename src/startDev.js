const WebpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
const openBrowser = require('react-dev-utils/openBrowser');
const chalk = require('chalk');
const cwd = process.cwd();
const { appPublicPath } = require('./utils/getPaths')(cwd);
const printWebpackErrors = require('./utils/printWebpackErrors');

module.exports = config => {
  let compiler;
  function setupCompiler(host, port, protocol) {
    try {
      compiler = webpack(config);
    } catch (e) {
      console.log(e);
    }

    let isFirstCompile = true;
    compiler.plugin('done', stats => {
      if (stats.hasErrors() || stats.hasWarnings()) {
        printWebpackErrors(stats);
      } else if (isFirstCompile) {
        console.log();
        console.log('The app is running at:');
        console.log();
        console.log(`  ${chalk.cyan(`${protocol}://${host}:${port}/`)}`);
        console.log();
        console.log('Note that the development build is not optimized.');
        console.log(`To create a production build, use ${chalk.cyan('clowa build')}.`);
        console.log();
        isFirstCompile = false;
      }
    });
  }

  function runDevServer(host, port, protocol) {
    const devServer = new WebpackDevServer(compiler, {
      disableHostCheck: true,
      compress: true,
      clientLogLevel: 'none',
      contentBase: appPublicPath,
      hot: true,
      publicPath: '/',
      quiet: true,
      watchOptions: {
        ignored: /node_modules/
      },
      https: protocol === 'https',
      host
    });

    devServer.listen(port, '0.0.0.0', err => {
      if (err) {
        return;
      }
      openBrowser(`${protocol}://${host}:${port}/`);
    });
  }

  function run(port) {
    const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
    const host = process.env.HOST || 'localhost';
    setupCompiler(host, port, protocol);
    runDevServer(host, port, protocol);
  }

  run(8001);
};
