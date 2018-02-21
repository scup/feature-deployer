#!/usr/bin/env node
const chalk = require('chalk')
const logger = require('./Infra/logger')

const featureDeployer = require('./Infra/feature-deployer')

function logCommand (command, index, array) {
  const color = index === array.length - 1 ? this.errorColor : 'grey'
  logger.info(chalk[color](command))
}

function logExecutedCommands ({ commands, error }) {
  if (!commands || !commands.length) return

  logger.info(chalk.white('\nExecuted Plan:\n'))

  commands.forEach(logCommand, { errorColor: error ? 'red' : 'grey' })

  logger.info('')
}

async function execute () {
  try {
    const commands = await featureDeployer(process.argv)

    logExecutedCommands({ commands, error: false })

    logger.info(chalk.green.bold('✨  Command execute successfully!!!'))
  } catch (error) {
    logExecutedCommands({ commands: featureDeployer.commands, error: true })

    logger.info(chalk.red(`ErrorMessage: ${chalk.red.bold(error.message)}`))
    logger.info('')
    logger.info(chalk.red('❌ ❌ 😭 😭  Unfortunately it did not work 😭 😭 ❌ ❌'))
    logger.verbose(chalk.red(error.stack))
    process.exit(1)
  }
}

execute()

process.on('unhandledRejection', function (reason, p) {
  logger.error(chalk.red(reason))
})
