const executeDeploy = require('./executeDeploy')
const gitClient = require('../../Infra/gitClient')

module.exports = async function executeDeployOnProject (deployOptions, injection) {
  const { environment, deployDescription, projectPaths } = deployOptions

  for (const currentProjectPath of projectPaths) {
    gitClient.changeDirectory(currentProjectPath, injection)
    await executeDeploy({ environment, deployDescription, currentProjectPath }, injection)
  }
}
