#!/usr/bin/env node
const chalk = require('chalk')
const logger = require('./Infra/logger')

const featureDeployer = require('./Infra/feature-deployer')

function logCommand (command) {
  logger.info(chalk.green(command))
}

function logExecutedCommands (commands) {
  if (!commands || !commands.length) return

  logger.info(chalk.white('\nExecuted Plan:\n'))

  commands.forEach(logCommand)

  logger.info('\n')
}

async function execute () {
  try {
    const commands = await featureDeployer(process.argv)

    logExecutedCommands(commands)

    logger.info(chalk.blue('Now, wait the deploy on CI!!!'))
  } catch (error) {
    logger.verbose(chalk.red(error.stack))

    logExecutedCommands(featureDeployer.commands)
  }
}

execute()

process.on('unhandledRejection', function (reason, p) {
  logger.error(chalk.red(reason))
})
