const WebpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
const openBrowser = require('react-dev-utils/openBrowser');
const clearConsole = require('react-dev-utils/clearConsole');
const chalk = require('chalk');
const getPaths = require('./config/paths');
const cwd = process.cwd();

const paths = getPaths(cwd);
const isInteractive = process.stdout.isTTY;
const config = require('./config/webpack.config.dev');
let compiler;

function clearConsoleWrapped() {
  if (process.env.CLEAR_CONSOLE !== 'none') {
    clearConsole();
  }
}

function setupCompiler(host, port, protocol) {
  try {
    compiler = webpack(config);
  } catch (e) {
    console.log(e);
  }

  compiler.plugin('invalid', () => {
    if (isInteractive) {
      clearConsoleWrapped();
    }
    console.log('Compiling...');
  });

  let isFirstCompile = true;
  compiler.plugin('done', stats => {
    if (isInteractive) {
      clearConsoleWrapped();
    }
    const json = stats.toJson({}, true);
    const messages = formatWebpackMessages(json);
    const isSuccessful = !messages.errors.length && !messages.warnings.length;
    const showInstructions = isSuccessful && isFirstCompile;

    if (isSuccessful) {
      if (stats.stats) {
        console.log(chalk.green('Compiled successfully'));
      } else {
        console.log(
          chalk.green(
            `Compiled successfully in ${(json.time / 1000).toFixed(1)}s!`
          )
        );
      }
    }

    if (showInstructions) {
      console.log();
      console.log('The app is running at:');
      console.log();
      console.log(`  ${chalk.cyan(`${protocol}://${host}:${port}/`)}`);
      console.log();
      console.log('Note that the development build is not optimized.');
      console.log(
        `To create a production build, use ${chalk.cyan('npm run build')}.`
      );
      console.log();
      isFirstCompile = false;
    }

    // If errors exist, only show errors.
    if (messages.errors.length) {
      console.log(chalk.red('Failed to compile.'));
      console.log();
      messages.errors.forEach(message => {
        console.log(message);
        console.log();
      });

      // Show warnings if no errors were found.
    } else if (messages.warnings.length) {
      console.log(chalk.yellow('Compiled with warnings.'));
      console.log();
      messages.warnings.forEach(message => {
        console.log(message);
        console.log();
      });
      // Teach some ESLint tricks.
      console.log('You may use special comments to disable some warnings.');
      console.log(
        `Use ${chalk.yellow(
          '// eslint-disable-next-line'
        )} to ignore the next line.`
      );
      console.log(
        `Use ${chalk.yellow(
          '/* eslint-disable */'
        )} to ignore all warnings in a file.`
      );
      console.log();
    }
  });
}

function runDevServer(host, port, protocol) {
  const devServer = new WebpackDevServer(compiler, {
    disableHostCheck: true,
    compress: true,
    clientLogLevel: 'none',
    contentBase: paths.appPublic,
    hot: true,
    publicPath: '/',
    quiet: true,
    watchOptions: {
      ignored: /node_modules/,
    },
    https: protocol === 'https',
    host,
    // proxy: rcConfig.proxy,
  });

  clearConsoleWrapped();
  devServer.listen(port, '0.0.0.0', err => {
    if (err) {
      return;
    }

    // process.send('READY');

    if (isInteractive) {
      clearConsoleWrapped();
    }

    console.log(chalk.cyan('Starting the development server...'));
    openBrowser(`${protocol}://${host}:${port}/`);
  });
}

function run(port) {
  const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
  const host = process.env.HOST || 'localhost';
  setupCompiler(host, port, protocol);
  // compiler.run();
  runDevServer(host, port, protocol);
}
run(8000);
