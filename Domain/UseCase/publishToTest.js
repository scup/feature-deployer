const chalk = require('chalk')
const gitClient = require('../../Infra/gitClient')

const getTagParts = require('../getTagParts')
const logger = require('../../Infra/logger')

const { DEFAULT_ORIGIN, MAIN_BRANCH, TAG_SEPARATOR, TEST_RELEASE_PREFIX } = require('./gitDefaultConfiguration')

module.exports = async function publishToTest (publishToTestOptions, injection) {
  const { branch, environment, currentProjectPath, now } = publishToTestOptions

  logger.info(chalk.white(`\nInitializing test release on ${chalk.bold.yellow(currentProjectPath)}`))

  logger.info(chalk.white(`  · Download last code of ${chalk.blue(branch)} ⏬`))
  await gitClient.fetch(DEFAULT_ORIGIN, branch, injection)

  await gitClient.checkout(branch, injection)

  logger.info(chalk.white(`  · Download last code of ${chalk.blue(MAIN_BRANCH)} ⏬`))
  await gitClient.deleteBranchLocally(MAIN_BRANCH, injection)
  await gitClient.fetch(DEFAULT_ORIGIN, MAIN_BRANCH, injection)

  logger.info(chalk.white(`  · Merging with master of ${chalk.blue(branch)} ⏬`))
  await gitClient.merge(MAIN_BRANCH, injection)

  logger.info(chalk.white(`  · Nice! no conflicts, creating and uploading test release ✅`))
  const tagParts = getTagParts({ environment, prefix: TEST_RELEASE_PREFIX, now, suffix: branch })
  const tag = tagParts.join(TAG_SEPARATOR)

  await gitClient.tag(tag, injection)
  await gitClient.push(DEFAULT_ORIGIN, tag, injection)
  await gitClient.checkout(MAIN_BRANCH, injection)
  await gitClient.deleteBranchLocally(branch, injection)

  logger.info(chalk.white(`  · Done 👍🏾 , the release ${chalk.bold.yellow(tag)} is published!`))
}
