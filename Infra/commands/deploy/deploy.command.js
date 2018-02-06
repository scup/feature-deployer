const executeDeploy = require('../../../Domain/UseCase/executeDeploy')
const executeDeployOnProjects = require('../../../Domain/UseCase/executeDeployOnProjects')

module.exports = function deployCommand (environment, deployDescription, commanderOptions) {
  const { addCommandOnLog, project: projectPaths, now, currentProjectPath } = commanderOptions.parent

  const deployUseCase = projectPaths && projectPaths.length ? executeDeployOnProjects : executeDeploy

  const injection = { addCommandOnLog }
  const deployOptions = { currentProjectPath, environment, deployDescription, projectPaths, now }

  commanderOptions.parent.promise = deployUseCase(deployOptions, injection)
}
