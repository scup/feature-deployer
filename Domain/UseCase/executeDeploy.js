const chalk = require('chalk')
const gitClient = require('../../Infra/gitClient')

const getNowDateFormatted = require('../getNowDateFormatted')
const logger = require('../../Infra/logger')

const NEEDS_RELEASE_ENVIRONMENTS = ['production']
const DEFAULT_ORIGIN = 'origin'
const MAIN_BRANCH = 'master'
const TAG_SEPARATOR = '_'

function getTagParts ({ environment, deployDescription, now }) {
  const tag = ['release', environment, getNowDateFormatted(now)]

  if (!deployDescription) return tag

  return tag.concat(deployDescription)
}

module.exports = async function executeDeploy (deployOptions, injection) {
  const { environment, deployDescription, currentProjectPath, now } = deployOptions

  logger.info(chalk.white(`\nInitializing deploy on ${chalk.bold.yellow(currentProjectPath)}`))

  logger.info(chalk.white('  · Download last code ⏬'))
  const generatedTagFromRelease = NEEDS_RELEASE_ENVIRONMENTS.includes(environment)

  let tag
  if (generatedTagFromRelease) {
    await gitClient.checkout(MAIN_BRANCH, injection)
    await gitClient.pull(DEFAULT_ORIGIN, MAIN_BRANCH, injection)

    tag = getTagParts({ environment, deployDescription, now }).join(TAG_SEPARATOR)
  } else {
    await gitClient.fetchTags(DEFAULT_ORIGIN, injection)
    await gitClient.checkout(deployDescription, injection)

    const [,, ...oldTagParts] = deployDescription.split(TAG_SEPARATOR)
    tag = ['release', environment, ...oldTagParts]
  }

  await gitClient.tag(tag, injection)
  logger.info(chalk.white('  · Uploading release ✅'))
  await gitClient.push(DEFAULT_ORIGIN, tag, injection)

  logger.info(chalk.white(`  · Done 👍🏾`))
}
