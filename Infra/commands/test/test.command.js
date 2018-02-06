// const path = require('path')
//
// const executeDeploy = require('../../../Domain/UseCase/executeDeploy')
// const executeDeployOnProject = require('../../../Domain/UseCase/executeDeployOnProject')

module.exports = function testCommand (branch, environment, commanderOptions) {
  const { addCommandOnLog, project: projectPaths } = commanderOptions.parent

  commanderOptions.parent.promise = Promise.resolve('a')

  // const deployUseCase = projectPaths && projectPaths.length ? executeDeployOnProject : executeDeploy
  //
  // const currentProjectPath = path.basename(process.cwd())
  //
  // const injection = { addCommandOnLog }
  // const deployOptions = { currentProjectPath, environment, deployDescription, projectPaths, now: new Date() }
  //
  // commanderOptions.parent.promise = deployUseCase(deployOptions, injection)
}
