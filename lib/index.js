var honeyCore = require('honey-core');
var logger = require('./_logger');
var argv =
  require('yargs')
    .usage('$0 [args]')
    .option('parse', { alias: 'p', describe: 'Parse the style descriptors and feed to dippers' })
    .help('help')
    .argv;

var stylus = require('stylus');
var loadDippers = require('./_load-dippers');

if (argv.parse) {

  console.log('\n');
  logger.log('Waking up');

  var config = null,
      userPath = process.cwd();

  // TODO
  // 1. Figure out a way to pass in the CSS to the dipper
  // 2. Figure out what to do with load-dippers.js

  logger.log('user path found: ' + userPath);
  logger.log('Loading ' + logger.ref('.hnyrc') + ' config');

  honeyCore.fileUtil
    .loadConfigFromDisk(userPath)
    .then((userConfig) => {

    logger.log(logger.success('Successfully') + ' loaded config file');
    logger.log('Loading ' + logger.ref('style descriptors'));

    config = Object.assign(userConfig, { userPath: userPath });
    honeyCore.fileUtil.loadDescriptors(userPath, config.input).then((descriptorsArray) => {

      logger.log(logger.success('Successfully') + ' loaded them');

      var description = honeyCore.parser.parse(descriptorsArray);
      var guide = honeyCore.comb.generate(description, config);

      // TODO
      // move this logic to honey.core

      // TODO
      // HACK
      // this is a mother fucking hack, but I can't get stylus
      // to import using webpack in honey-dipper-comb-documentation.
      // this should be there.
      var guideAsCss = '';
      stylus.render('.generated-ui {\n\n' + guide + '\n\n}', function(err, css) {
        if (err) {
          console.log(err);
          return;
        }
        guideAsCss = css;
      });

      var dippers = loadDippers(config.dippers, userPath);
      for (var dipper of dippers) {
        dipper.default({
          description,
          config,
          guide: guideAsCss
        });
      }

      logger.log('Back to sleep');
      console.log('\n');

    });
  });
}
