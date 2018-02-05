const executeDeploy = require('./executeDeploy')

function deployOnProject (projectPath) {
  const { environment, deployDescription } = this
  require('../../Infra/gitClient').changeDirectory(projectPath)
  return executeDeploy({ environment, deployDescription })
}

module.exports = async function executeDeploy ({ environment, deployDescription, projectPaths }) {
  return Promise.all(projectPaths.map(deployOnProject, { environment, deployDescription }))
}
