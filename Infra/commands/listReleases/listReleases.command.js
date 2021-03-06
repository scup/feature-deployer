const listReleases = require('../../../Domain/UseCase/listReleases')
const executeUseCaseForProjects = require('../../../Domain/UseCase/executeUseCaseForProjects')

module.exports = function testCommand (environment, commanderOptions) {
  const { addCommandOnLog, project: projectPaths, currentProjectPath, randomSeparator } = commanderOptions.parent

  const listReleasesUseCase = projectPaths && projectPaths.length ? executeUseCaseForProjects : listReleases

  const injection = { addCommandOnLog, randomSeparator, useCase: listReleases }
  const listReleasesOptions = { currentProjectPath, environment, projectPaths }

  commanderOptions.parent.promise = listReleasesUseCase(listReleasesOptions, injection)
}
