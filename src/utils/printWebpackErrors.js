const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
const chalk = require('chalk');

module.exports = stats => {
  const json = stats.toJson({}, true);
  const messages = formatWebpackMessages(json);

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
  }
};
