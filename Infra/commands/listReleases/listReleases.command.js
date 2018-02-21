const listReleases = require('../../../Domain/UseCase/listReleases')
const executeUseCaseForProjects = require('../../../Domain/UseCase/executeUseCaseForProjects')

module.exports = function testCommand (environment, count, commanderOptions) {
  const { addCommandOnLog, project: projectPaths, currentProjectPath } = commanderOptions.parent

  const listReleasesUseCase = projectPaths && projectPaths.length ? executeUseCaseForProjects : listReleases

  const injection = { addCommandOnLog, useCase: listReleases }
  const listReleasesOptions = { currentProjectPath, environment, count , projectPaths }

  commanderOptions.parent.promise = listReleasesUseCase(listReleasesOptions, injection)
}
