const webpack = require('webpack');
const { printFileSizesAfterBuild } = require('react-dev-utils/FileSizeReporter');
const printWebpackErrors = require('./utils/printWebpackErrors');
const chalk = require('react-dev-utils/chalk');

// These sizes are pretty large. We'll warn for bundles exceeding them.
const WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024;
const WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024;

module.exports = config => {
  webpack(config, (err, stats) => {
    if (stats.hasErrors()) {
      printWebpackErrors(stats);
      process.exit(1);
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
