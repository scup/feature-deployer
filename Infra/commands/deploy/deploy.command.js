const dependencies = {
  executeDeploy: require('../../../Domain/UseCase/executeDeploy'),
  executeDeployOnProject: require('../../../Domain/UseCase/executeDeployOnProject')
}

module.exports = function deployCommand (environment, deployDescription, commanderOptions, injection) {
  const { executeDeploy, executeDeployOnProject } = Object.assign({}, dependencies, injection)

  const projectPaths = commanderOptions.parent.project

  commanderOptions.parent.promise = projectPaths && projectPaths.length
    ? executeDeployOnProject({ environment, deployDescription, projectPaths })
    : executeDeploy({ environment, deployDescription })
//     console.log('foobar:', options.parent.foobar)
//     console.log('verbose:', options.parent.verbose)
//     var mode = options.setup_mode || "normal"
//     env = env || 'all'
//     console.log('setup for %s env(s) with %s mode in branch %s', env, mode, branch)
}
