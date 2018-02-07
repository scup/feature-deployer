const path = require('path')

const deployCommand = require('./commands/deploy')
const deployCommandData = require('./commands/deploy/package.json')
const deployCommandHelp = require('./commands/deploy/deploy.help')
const { deployFixedEnvironmentCommandHelp } = require('./commands/deploy/deploy.help')

const testCommand = require('./commands/test')
const testCommandData = require('./commands/test/package.json')

const packageData = require('../package.json')

const featureDeployerCommander = require('commander')

featureDeployerCommander.version(packageData.version)

function collectValues (value, total) {
  return total.concat(value)
}

featureDeployerCommander
  .option('-p, --project <projectName>', 'The projects you want to deploy', collectValues, [])

featureDeployerCommander
  .command('deploy <environment> [deployDescription|release]')
  .alias('d')
  .description(deployCommandData.deployDescription)
  .action(deployCommand)
  .on('--help', deployCommandHelp)

featureDeployerCommander
  .command('test <branch> <environment>')
  .alias('t')
  .description(testCommandData.deployDescription)
  .action(testCommand)

const fixedDeployEnvironments = {
  rc: {
    branch: 'rc',
    parameter: 'deployDescription'
  },
  prod: {
    branch: 'production',
    parameter: 'release'
  }
}

Object.entries(fixedDeployEnvironments).forEach(function generateFixedEnvironmentsCommands ([alias, environment]) {
  featureDeployerCommander
    .command(`deploy-${environment.branch} [${environment.parameter}]`)
    .alias(`d${alias}`)
    .description(deployCommandData.deployDescription)
    .action(deployCommand.bind(null, environment.branch))
    .on('--help', deployFixedEnvironmentCommandHelp.bind(null, environment.branch))
})

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

const commands = []
featureDeployerCommander.addCommandOnLog = function addCommandOnLog (command) {
  commands.push(command)
}
featureDeployerCommander.now = new Date()
featureDeployerCommander.currentProjectPath = path.basename(process.cwd())

async function featureDeployer (consoleArguments) {
  await featureDeployerCommander.parse(consoleArguments).promise

  return commands
}

featureDeployer.commands = commands

module.exports = featureDeployer

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
