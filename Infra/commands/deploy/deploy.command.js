const executeDeploy = require('../../../Domain/UseCase/executeDeploy')
const executeDeployOnProject = require('../../../Domain/UseCase/executeDeployOnProject')

module.exports = function deployCommand (environment, deployDescription, commanderOptions) {
  const projectPaths = commanderOptions.parent.project

  const deployUseCase = projectPaths && projectPaths.length ? executeDeployOnProject : executeDeploy

  const projectPath = require('path').basename(process.cwd())

  commanderOptions.parent.promise = deployUseCase({ environment, deployDescription, projectPaths, projectPath })
}
