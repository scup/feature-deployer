const chalk = require('chalk')
const gitClient = require('../../Infra/gitClient')

const getNowDateFormatted = require('../getNowDateFormatted')
const logger = require('../../Infra/logger')

function getTagParts ({ environment, deployDescription }) {
  const tag = ['release', environment, getNowDateFormatted()]

  if (!deployDescription) return tag

  return tag.concat(deployDescription)
}

module.exports = async function executeDeploy (deployOptions, injection) {
  const { environment, deployDescription, currentProjectPath } = deployOptions

  logger.info(chalk.white(`\nInitializing deploy on ${chalk.bold.yellow(currentProjectPath)}`))

  await gitClient.checkout('master', injection)
  logger.info(chalk.white('  · Download last code ⏬'))
  await gitClient.pull('origin', 'master', injection)

  const tag = getTagParts({ environment, deployDescription }).join('_')

  await gitClient.tag(tag, injection)
  logger.info(chalk.white('  · Uploading release ✅'))
  await gitClient.push('origin', tag, injection)

  logger.info(chalk.white(`  · Done 👍🏾`))
}
