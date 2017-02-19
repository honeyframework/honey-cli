const path = require('path');
const honeyCore = require('honey-core');
const stylus = require('stylus');
const loadDippers = require('../load-dippers');
const logger = require('../logger');

module.exports = function() {

  console.log('\n');
  logger.log(logger.honey('Waking up...'));

  var config = null,
      userPath = process.cwd();

  logger.log(`User path found: ${logger.ref(userPath)}`);
  logger.log(`Loading ${logger.ref('.hnyrc')} config...`);

  honeyCore
    .fileUtil
    .loadConfigFromDisk(userPath)
    .then((userConfig) => {

      logger.log(`${logger.success('Successfully')} loaded config file`);

      config = Object.assign(userConfig, { userPath: userPath });

      logger.log(`Loading ${logger.ref('style descriptors')} from ${logger.ref(path.resolve(userPath, config.input))}`);

      honeyCore
        .fileUtil
        .loadDescriptors(userPath, config.input)
        .then((descriptorsArray) => {

          logger.log(logger.success('Successfully') + ` loaded them, found ${logger.ref(descriptorsArray.length)} descriptors`);

          logger.log('Parsing descriptors...');
          const description = honeyCore.parser.parse(descriptorsArray);

          logger.log(`Generating assets to ${logger.ref(userPath)}`)
          const guide = honeyCore.comb.generate(description, config);

          // HACK
          // https://github.com/honeyframework/honey-cli/issues/1

          var guideAsCss = '';
          stylus.render('.generated-ui {\n\n' + guide + '\n\n}', function(err, css) {
            if (err) {
              console.log(err);
              return;
            }
            guideAsCss = css;
          });

          // HACK

          const dippers = loadDippers(config.dippers, userPath);
          for (var dipper of dippers) {
            dipper.default({
              description,
              config,
              guide: guideAsCss
            });
          }

        })
        .catch((exception) => {
          logger.log(logger.error('There was a problem loading the descriptors'));
          logger.logError(exception);
        });
  })
  .catch((exception) => {
    logger.log(logger.error('There was a problem loading the config file'));
    logger.logError(exception);
  });

}
