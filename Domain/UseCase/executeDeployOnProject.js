const executeDeploy = require('./executeDeploy')
const gitClient = require('../../Infra/gitClient')

module.exports = async function executeDeployOnProject (deployOptions, injection) {
  const { environment, deployDescription, projectPaths } = deployOptions
  const { addCommandOnLog } = injection

  for (const currentProjectPath of projectPaths) {
    gitClient.changeDirectory(currentProjectPath, addCommandOnLog)
    await executeDeploy({ environment, deployDescription, currentProjectPath }, injection)
  }
}
