const publishToTest = require('../../../Domain/UseCase/publishToTest')
const executeUseCaseForProjects = require('../../../Domain/UseCase/executeUseCaseForProjects')

module.exports = function testCommand (branch, environment, commanderOptions) {
  const { addCommandOnLog, project: projectPaths, now, currentProjectPath } = commanderOptions.parent


  const publishToTestUseCase = projectPaths && projectPaths.length ? executeUseCaseForProjects : publishToTest

  const injection = { addCommandOnLog, useCase: publishToTest }
  const publishToTestOptions = { currentProjectPath, branch, environment, projectPaths, now }

  commanderOptions.parent.promise = publishToTestUseCase(publishToTestOptions, injection)
}
