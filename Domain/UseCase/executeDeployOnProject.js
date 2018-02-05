const executeDeploy = require('./executeDeploy')

async function deployOnProject (projectPath) {
  const { environment, deployDescription } = this
  require('../../Infra/gitClient').changeDirectory(projectPath)
  return executeDeploy({ environment, deployDescription, projectPath })
}

module.exports = async function executeDeploy ({ environment, deployDescription, projectPaths }) {
  await Promise.all(projectPaths.map(deployOnProject, { environment, deployDescription }))
  return Array.from(require('../../Infra/gitClient').getExecution())
}
