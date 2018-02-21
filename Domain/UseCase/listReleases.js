const chalk = require('chalk')
const gitClient = require('../../Infra/gitClient')

const logger = require('../../Infra/logger')

module.exports = async function listReleases ({ environment, currentProjectPath }, injection) {
  const tags = await gitClient.detailTags({ filter: new RegExp(`_${environment}_`) }, injection)

  logger.info(chalk.white(`Showing releases on ${chalk.green.bold(currentProjectPath)}:`))

  if (!tags.length) {
    logger.info(chalk.yellow('  · No tags here!'))
  }

  tags.forEach(printTag)

  logger.info('\n')
}

function printTag (tag) {
  logger.info(chalk.blue(require('util').inspect(tag, { depth: null })))
}
