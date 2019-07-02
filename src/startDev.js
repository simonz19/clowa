const WebpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
const openBrowser = require('react-dev-utils/openBrowser');
const chalk = require('react-dev-utils/chalk');
const setupHooks = require('./utils/setupHooks');
const printWebpackErrors = require('./utils/printWebpackErrors');
const { choosePort } = require('react-dev-utils/WebpackDevServerUtils');
const args = require('yargs-parser')(process.argv.slice(2));
const {
  o: openBrowserv, h: hostv = 'localhost', p: portv = 8000, P: protocolv = 'http'
} = args;

module.exports = config => {
  let compiler;
  function setupCompiler(host, port, protocol) {
    try {
      compiler = webpack(config);
    } catch (e) {
      console.log(e);
    }

    let isFirstCompile = true;
    compiler.hooks.done.tap('clowa dev', stats => {
      if (stats.hasErrors() || stats.hasWarnings()) {
        printWebpackErrors(stats);
        if (stats.hasErrors() && isFirstCompile) process.exit(1);
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
    setupHooks(compiler, process.cwd());
  }

  function runDevServer(host, port, protocol) {
    const devServer = new WebpackDevServer(compiler, {
      disableHostCheck: true,
      compress: true,
      historyApiFallback: true,
      clientLogLevel: 'none',
      contentBase: false,
      hot: true,
      publicPath: '/',
      quiet: true,
      watchOptions: {
        ignored: ['**/node_modules', '**/.clowa']
      },
      https: protocol === 'https',
      host
    });

    devServer.listen(port, 'localhost', err => {
      if (err) {
        return;
      }
      if (openBrowserv) {
        openBrowser(`${protocol}://${host}:${port}/`);
      }
    });
  }

  function run(port) {
    setupCompiler(hostv, port, protocolv);
    runDevServer(hostv, port, protocolv);
  }

  choosePort(hostv, portv).then(port => {
    if (port === null) {
      return;
    }
    run(port);
  });
};
