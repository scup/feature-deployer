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

async function switchToTag (environment, deployDescription, injection) {
  await gitClient.fetchTags(DEFAULT_ORIGIN, injection)
  await gitClient.checkout(deployDescription, injection)

  const [,, ...oldTagParts] = deployDescription.split(TAG_SEPARATOR)
  return ['release', environment, ...oldTagParts]
}

async function switchToMainBranch ({ environment, deployDescription, now }, injection) {
  await gitClient.fetch(DEFAULT_ORIGIN, MAIN_BRANCH, injection)
  await gitClient.checkout(MAIN_BRANCH, injection)

  return getTagParts({ environment, deployDescription, now })
}

module.exports = async function executeDeploy (deployOptions, injection) {
  const { environment, deployDescription, currentProjectPath, now } = deployOptions

  logger.info(chalk.white(`\nInitializing deploy on ${chalk.bold.yellow(currentProjectPath)}`))

  logger.info(chalk.white('  · Download last code ⏬'))

  const generatedTagFromRelease = NEEDS_RELEASE_ENVIRONMENTS.includes(environment)
  const tagParts = await (
    generatedTagFromRelease
      ? switchToTag(environment, deployDescription, injection)
      : switchToMainBranch({ environment, deployDescription, now }, injection)
  )

  const tag = tagParts.join(TAG_SEPARATOR)

  await gitClient.tag(tag, injection)
  logger.info(chalk.white('  · Uploading release ✅'))
  await gitClient.push(DEFAULT_ORIGIN, tag, injection)

  logger.info(chalk.white(`  · Done 👍🏾 , the release ${chalk.bold.yellow(tag)} is published!`))
}
