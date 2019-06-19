const webpack = require('webpack');
const { printFileSizesAfterBuild } = require('react-dev-utils/FileSizeReporter');
const printWebpackErrors = require('./utils/printWebpackErrors');

// These sizes are pretty large. We'll warn for bundles exceeding them.
const WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024;
const WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024;

module.exports = config => {
  console.log('build start');
  webpack(config, (err, stats) => {
    if (stats.hasErrors()) {
      printWebpackErrors(stats);
      process.exit(1);
    }

    console.log('build done');
    console.log('File sizes after gzip:\n');
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
