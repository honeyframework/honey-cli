var chalk = require('chalk');

module.exports = {

  log: function(logMessage) {
    var lib = chalk.yellow.bold('[Honey]');
    console.log(lib, logMessage);
  },

  logError: function(error) {
    console.log('\n', error, '\n');
  },

  success: function(successMessage) {
    return chalk.green.bold(successMessage);
  },

  error: function(errorMessage) {
    return chalk.red.bold(errorMessage);
  },

  ref: function(reference) {
    return chalk.magenta.bold(reference);
  },

  honey: function(reference) {
    return chalk.yellow.bold(reference);
  }

};
