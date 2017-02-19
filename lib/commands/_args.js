module.exports =
  require('yargs')
    .usage('$0 [args]')
    .option('parse', { alias: 'p', describe: 'Parse the style descriptors and feed to dippers' })
    .help('help')
    .argv;
