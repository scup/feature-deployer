const chalk = require('chalk')
const gitClient = require('../../Infra/gitClient')

const logger = require('../../Infra/logger')

module.exports = async function listReleases ({ environment, currentProjectPath }, injection) {
  const tags = await gitClient.detailTags({ filter: new RegExp(`_${environment}_`) }, injection)

  logger.info(chalk.blue(require('util').inspect(tags.reverse(), { depth: null })))
}
