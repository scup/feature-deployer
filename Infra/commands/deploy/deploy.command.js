const path = require('path')

const executeDeploy = require('../../../Domain/UseCase/executeDeploy')
const executeDeployOnProject = require('../../../Domain/UseCase/executeDeployOnProject')

module.exports = function deployCommand (environment, deployDescription, commanderOptions) {
  const { addCommandOnLog, project: projectPaths } = commanderOptions.parent

  const deployUseCase = projectPaths && projectPaths.length ? executeDeployOnProject : executeDeploy

  const currentProjectPath = path.basename(process.cwd())

  const injection = { addCommandOnLog }
  const deployOptions = { currentProjectPath, environment, deployDescription, projectPaths, now: new Date() }

  commanderOptions.parent.promise = deployUseCase(deployOptions, injection)
}
