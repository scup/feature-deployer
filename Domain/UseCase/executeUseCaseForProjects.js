const gitClient = require('../../Infra/gitClient')

module.exports = async function executeUseCaseForProjects (deployOptions, injection) {
  const { projectPaths } = deployOptions
  const { useCase } = injection

  for (const currentProjectPath of projectPaths) {
    gitClient.changeDirectory(currentProjectPath, injection)
    await useCase(Object.assign({}, deployOptions, { currentProjectPath }), injection)
  }
}
