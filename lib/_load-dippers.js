/**
 * @param {Array} dippers
 */

var resolve = require('resolve');
module.exports = function(dippers, userPath) {
  return dippers.map(function(dipperConfig) {
    var dipperModulePath = resolve.sync('honey-dipper-' + dipperConfig.name, { basedir: userPath });
    return require(dipperModulePath);
  });
};;
