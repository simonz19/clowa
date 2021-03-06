const webpack = require('webpack');
const setupHooks = require('./utils/setupHooks');
const { printFileSizesAfterBuild } = require('react-dev-utils/FileSizeReporter');
const printWebpackErrors = require('./utils/printWebpackErrors');
const chalk = require('react-dev-utils/chalk');

// These sizes are pretty large. We'll warn for bundles exceeding them.
const WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024;
const WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024;

module.exports = config => {
  const compiler = webpack(config);
  setupHooks(compiler, process.cwd());
  compiler.run((err, stats) => {
    if (stats.hasErrors() || stats.hasWarnings()) {
      printWebpackErrors(stats);
      if (stats.hasErrors()) process.exit(1);
    }

    console.log(chalk.green('√ File sizes after gzip:\n'));
    printFileSizesAfterBuild(
      stats,
      {
        root: config.output.path,
        sizes: {}
      },
      config.output.path,
      WARN_AFTER_BUNDLE_GZIP_SIZE,
      WARN_AFTER_CHUNK_GZIP_SIZE
    );
    console.log();
  });
};
