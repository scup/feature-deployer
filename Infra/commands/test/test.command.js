// const executeDeploy = require('../../../Domain/UseCase/executeDeploy')
// const executeDeployOnProject = require('../../../Domain/UseCase/executeDeployOnProject')

module.exports = function testCommand (branch, environment, commanderOptions) {
  // const { addCommandOnLog, project: projectPaths, now, currentProjectPath } = commanderOptions.parent

  // const deployUseCase = projectPaths && projectPaths.length ? executeDeployOnProjects : executeDeploy

  // const injection = { addCommandOnLog }
  // const deployOptions = { currentProjectPath, environment, deployDescription, projectPaths, now }

  commanderOptions.parent.promise = Promise.resolve('a')
}
