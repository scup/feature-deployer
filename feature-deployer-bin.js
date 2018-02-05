#!/usr/bin/env node
const chalk = require('chalk')
const logger = require('./Infra/logger')

const featureDeployer = require('./Infra/feature-deployer')

function logCommand (command) {
  logger.info(chalk.green(command))
}

async function execute () {
  try {
    const commands = await featureDeployer(process.argv)

    if (!commands || !commands.length) return

    logger.info(chalk.white('\nExecuted Plan:\n'))

    commands.forEach(logCommand)

    logger.info(chalk.blue('\nNow, wait the deploy on CI!!!'))
  } catch (error) {
    logger.error(chalk.red(error.stack))
  }
}

execute()
