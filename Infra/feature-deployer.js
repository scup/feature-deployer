const path = require('path')
const chalk = require('chalk')

const logger = require('./logger')

const deployCommand = require('./commands/deploy')
const deployCommandData = require('./commands/deploy/package.json')
const deployCommandHelp = require('./commands/deploy/deploy.help')
const { deployFixedEnvironmentCommandHelp } = require('./commands/deploy/deploy.help')

const testCommand = require('./commands/test')
const testCommandData = require('./commands/test/package.json')

const clearTestCommand = require('./commands/clearTest')
const clearTestCommandData = require('./commands/clearTest/package.json')

const listReleasesCommand = require('./commands/listReleases')
const listReleasesCommandData = require('./commands/listReleases/package.json')

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

featureDeployerCommander
  .command('clear-test <environment>')
  .alias('ct')
  .description(clearTestCommandData.deployDescription)
  .action(clearTestCommand)

featureDeployerCommander
  .command('list-releases <environment>')
  .alias('lr')
  .description(listReleasesCommandData.deployDescription)
  .action(listReleasesCommand)

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

Object.entries(fixedDeployEnvironments).forEach(function generateffixedEnvironmentsCommands ([alias, environment]) {
  featureDeployerCommander
    .command(`deploy-${environment.branch} [${environment.parameter}]`)
    .alias(`d${alias}`)
    .description(deployCommandData.deployDescription)
    .action(deployCommand.bind(null, environment.branch))
    .on('--help', deployFixedEnvironmentCommandHelp.bind(null, environment.branch))
})

const commands = []
const currentProjectPath = process.cwd()
const currentExecutionPath = currentProjectPath.replace(process.env.HOME, '~')
featureDeployerCommander.addCommandOnLog = function addCommandOnLog (command) {
  commands.push(command)
}
featureDeployerCommander.now = new Date()
featureDeployerCommander.randomSeparator = String.fromCharCode(0x2550 + Math.random() * 48)
featureDeployerCommander.currentProjectPath = path.basename(currentProjectPath)

async function featureDeployer (consoleArguments) {
  logger.info(chalk.white(`\nCurrent directory execution: ${chalk.yellow.bold(currentExecutionPath)}`))
  await featureDeployerCommander.parse(consoleArguments).promise

  return commands
}

featureDeployer.commands = commands

module.exports = featureDeployer
