const chalk = require('chalk')
const gitClient = require('../../Infra/gitClient')

const getTagParts = require('../getTagParts')
const logger = require('../../Infra/logger')

const { NEEDS_RELEASE_ENVIRONMENTS, DEFAULT_ORIGIN, MAIN_BRANCH, TAG_SEPARATOR, RELEASE_PREFIX } = require('./gitDefaultConfiguration')

async function switchToTag (environment, deployDescription, injection) {
  await gitClient.fetchTags(DEFAULT_ORIGIN, injection)
  await gitClient.checkout(deployDescription, injection)

  const [,, ...oldTagParts] = deployDescription.split(TAG_SEPARATOR)
  return ['release', environment, ...oldTagParts]
}

async function switchToMainBranch ({ environment, deployDescription, now }, injection) {
  await gitClient.fetch(DEFAULT_ORIGIN, MAIN_BRANCH, injection)
  await gitClient.checkout(MAIN_BRANCH, injection)

  return getTagParts({ prefix: RELEASE_PREFIX, environment, suffix: deployDescription, now })
}

module.exports = async function executeDeploy (deployOptions, injection) {
  const { environment, deployDescription, currentProjectPath, now } = deployOptions
  const needsRelease = NEEDS_RELEASE_ENVIRONMENTS.includes(environment)

  if (needsRelease && !deployDescription) {
    throw new Error('When executing deploy on production the release should be passed')
  }

  logger.info(chalk.white(`\nInitializing deploy on ${chalk.bold.yellow(currentProjectPath)}`))

  logger.info(chalk.white('  · Download last code ⏬'))

  const tagParts = await (
    needsRelease
      ? switchToTag(environment, deployDescription, injection)
      : switchToMainBranch({ environment, deployDescription, now }, injection)
  )

  const tag = tagParts.join(TAG_SEPARATOR)

  await gitClient.tag(tag, injection)
  logger.info(chalk.white('  · Uploading release ✅'))
  await gitClient.push(DEFAULT_ORIGIN, tag, injection)

  logger.info(chalk.white(`  · Done 👍🏾 , the release ${chalk.bold.yellow(tag)} is published!`))
}
