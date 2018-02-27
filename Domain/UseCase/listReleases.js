const chalk = require('chalk')
const gitClient = require('../../Infra/gitClient')

const logger = require('../../Infra/logger')

const { getNowDateFormatted } = require('../getTagParts')

module.exports = async function listReleases ({ environment, currentProjectPath }, injection) {
  const tags = await gitClient.detailTags({ filter: new RegExp(`_${environment}_`) }, injection)

  logger.info(chalk.white(`Showing releases on ${chalk.green.bold(currentProjectPath)}:`))

  if (!tags.length) {
    logger.info(chalk.yellow(`  · No release found on environment ${chalk.magenta(environment)}!`))
  }

  tags.forEach(printTag)
  logger.info('')
}

function printTag (tag, index) {
  const latest = index === 0 ? chalk.blue('Latest ') : ''
  const [year, month, day, hour, minute] = getNowDateFormatted(new Date(tag.authordate)).split('-')
  const date = `${day}/${month}/${year} ${hour}:${minute}`

  logger.info(chalk.white(`  · ${latest}Release: ${chalk.yellow.bold(tag.refname)}`))
  logger.info(chalk.white(`    - Author: ${chalk.magenta(`${tag.authorname} ${tag.authoremail}`)}`))
  logger.info(chalk.white(`    - Date: ${chalk.magenta(date)}`))
  logger.info('')
}
