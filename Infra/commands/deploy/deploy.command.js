const executeDeploy = require('../../../Domain/UseCase/executeDeploy')
const executeUseCaseForProjects = require('../../../Domain/UseCase/executeUseCaseForProjects')

module.exports = function deployCommand (environment, deployDescription, commanderOptions) {
  const { addCommandOnLog, project: projectPaths, now, currentProjectPath } = commanderOptions.parent

  const deployUseCase = projectPaths && projectPaths.length ? executeUseCaseForProjects : executeDeploy

  const injection = { addCommandOnLog, useCase: executeDeploy }
  const deployOptions = { currentProjectPath, environment, deployDescription, projectPaths, now }

  commanderOptions.parent.promise = deployUseCase(deployOptions, injection)
}
