const executeDeploy = require('./executeDeploy')
const gitClient = require('../../Infra/gitClient')

module.exports = async function executeDeployOnProjects (deployOptions, injection) {
  const { environment, deployDescription, projectPaths, now } = deployOptions

  for (const currentProjectPath of projectPaths) {
    gitClient.changeDirectory(currentProjectPath, injection)
    await executeDeploy({ environment, deployDescription, currentProjectPath, now }, injection)
  }
}
