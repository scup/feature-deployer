const getNowDateFormatted = require('../getNowDateFormatted')
const logger = require('../../Infra/logger')

function getTagParts ({ environment, deployDescription }) {
  const tag = ['release', environment, getNowDateFormatted()]

  if (!deployDescription) return tag

  return tag.concat(deployDescription)
}

module.exports = async function executeDeploy ({ environment, deployDescription, projectPath }) {
  logger.colored('info', 'white', `\nInitializing deploy on ${projectPath}\n`)
  const gitClient = require('../../Infra/gitClient')

  gitClient.checkout('master')
  gitClient.pull('origin', 'master')

  const tag = getTagParts({ environment, deployDescription }).join('_')

  gitClient.tag(tag)
  gitClient.push('origin', tag)

  return Array.from(gitClient.getExecution())
}
