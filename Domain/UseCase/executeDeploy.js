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
  const { addCommandOnLog } = injection

  logger.colored('info', 'white', `\nInitializing deploy on ${currentProjectPath}\n`)

  await gitClient.checkout('master', addCommandOnLog)
  await gitClient.pull('origin', 'master', addCommandOnLog)

  const tag = getTagParts({ environment, deployDescription }).join('_')

  await gitClient.tag(tag, addCommandOnLog)
  await gitClient.push('origin', tag, addCommandOnLog)
}
