const dependencies = {
  executeDeploy: require('../../../Domain/UseCase/executeDeploy')
}

module.exports = function deployCommand (environment, deployDescription, commanderOptions, injection) {
  const { executeDeploy } = Object.assign({}, dependencies, injection)

  commanderOptions.parent.promise = executeDeploy({ environment, deployDescription })
//     console.log('foobar:', options.parent.foobar)
//     console.log('verbose:', options.parent.verbose)
//     var mode = options.setup_mode || "normal"
//     env = env || 'all'
//     console.log('setup for %s env(s) with %s mode in branch %s', env, mode, branch)
}
