const executeDeploy = require('./executeDeploy')
const gitClient = require('../../Infra/gitClient')

module.exports = async function executeDeployOnProject (deployOptions, injection) {
  const { environment, deployDescription, projectPaths } = deployOptions
  const { addCommandOnLog } = injection

  for (const projectPath of projectPaths) {
    gitClient.changeDirectory(projectPath, addCommandOnLog)
    await executeDeploy({ environment, deployDescription, projectPath }, injection)
  }
}
