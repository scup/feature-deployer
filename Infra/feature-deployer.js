// const chalk = require('chalk')
const featureDeployerCommander = require('commander')
const deployCommand = require('./commands/deploy')
const deployCommandHelp = require('./commands/deploy/deploy.help')
const { deployFixedEnvironmentCommandHelp } = require('./commands/deploy/deploy.help')
const deployCommandData = require('./commands/deploy/package.json')
const packageData = require('../package.json')

featureDeployerCommander.version(packageData.version)

featureDeployerCommander
  .command('deploy <environment> [deployDescription]')
  .alias('d')
  .description(deployCommandData.deployDescription)
  .action(deployCommand)
  .on('--help', deployCommandHelp)

const fixedDeployEnvironments = ['rc', 'prod']

fixedDeployEnvironments.forEach(function generateFixedEnvironmentsCommands (environment) {
  featureDeployerCommander
    .command(`deploy-${environment} [deployDescription]`)
    .alias(`d${environment}`)
    .description(deployCommandData.deployDescription)
    .action(deployCommand.bind(null, environment))
    .on('--help', deployFixedEnvironmentCommandHelp.bind(null, environment))
})

// function a (c, t) {
//   console.log(c)
//   return t.concat(c)
// }

// featureDeployerCommander
//   .option('-v, --verbose [a]', 'A value that can be increased', a.bind(featureDeployerCommander), [])
//   .option('-v, --verbose <a>', 'A value that can be increased', a.bind(featureDeployerCommander), [])

// featureDeployerCommander
//   .command('*')
//   .action(function(){
//     const options = Array.from(arguments).pop()
//     // console.log(chalk.red('a'))
//     console.log(chalk.keyword('orange')('Yay for orange colored text!'))
//     options.parent.help()
//   })

module.exports = function (consoleArguments) {
  const execution = featureDeployerCommander.parse(consoleArguments)

  return execution.promise
}

// const options = {
//   dirname: commander.dirname,
//   feature,
//   approve: commander.approveFeature,
//   repprove: commander.repproveFeature,
//   maxBranches: Number(maxBranches)
// }

// deployFeature(options)
//   .catch(handleError)

// function handleError (error) {
//   console.log(chalk.red('%s'), error)
// }
