#!/usr/bin/env node
const logger = require('./Infra/logger')

const featureDeployer = require('./Infra/feature-deployer')

async function execute () {
  try {
    const commands = await featureDeployer(process.argv)
    if (!commands) return

    logger.colored('info', 'white', '\nExecuted Plan:\n')

    commands.forEach(logger.colored.bind(null, 'info', 'green'))

    logger.info('\n')
  } catch (error) {
    logger.colored('error', 'red', error.stack)
  }
}

execute()
