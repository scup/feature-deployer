const chalk = require('chalk')
const gitClient = require('../../Infra/gitClient')

const getTagParts = require('../getTagParts')
const logger = require('../../Infra/logger')

const { NEEDS_RELEASE_ENVIRONMENTS, DEFAULT_ORIGIN, MAIN_BRANCH, TAG_SEPARATOR, RELEASE_PReffix } = require('./gitDefaultConfiguration')

async function switchToTag (environment, deployDescription, now, injection) {
  await gitClient.fetchTags(DEFAULT_ORIGIN, injection)
  await gitClient.checkout(deployDescription, injection)

  const [,,, ...oldTagParts] = deployDescription.split(TAG_SEPARATOR)
  return ['release', environment, getTagParts.getNowDateFormatted(now), ...oldTagParts]
}

async function switchToMainBranch ({ environment, deployDescription, now }, injection) {
  await gitClient.download(DEFAULT_ORIGIN, MAIN_BRANCH, injection)
  await gitClient.checkout(MAIN_BRANCH, injection)

  return getTagParts({ preffix: RELEASE_PReffix, environment, suffix: deployDescription, now })
}

module.exports = async function executeDeploy (deployOptions, injection) {
  const { environment, deployDescription, currentProjectPath, now } = deployOptions
  const needsRelease = NEEDS_RELEASE_ENVIRONMENTS.includes(environment)

  if (needsRelease && !deployDescription) {
    throw new Error('When executing deploy on production the release should be passed')
  }

  logger.info(chalk.white(`\nInitializing deploy on ${chalk.yellow.bold(currentProjectPath)}`))

  logger.info(chalk.white('  · Download last code ⏬'))

  const tagParts = await (
    needsRelease
      ? switchToTag(environment, deployDescription, now, injection)
      : switchToMainBranch({ environment, deployDescription, now }, injection)
  )

  const tag = tagParts.join(TAG_SEPARATOR)

  await gitClient.tag(tag, injection)
  logger.info(chalk.white('  · Uploading release ✅'))
  await gitClient.push(DEFAULT_ORIGIN, tag, injection)

  logger.info(chalk.white(`  · Done 👍🏾 , the release ${chalk.yellow.bold(tag)} is published!`))
}
