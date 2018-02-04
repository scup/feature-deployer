module.exports = async function executeDeploy ({ environment, deployDescription }) {
  require('../../Infra/gitClient').checkout('master')
  require('../../Infra/gitClient').pull('origin', 'master')
//     console.log('foobar:', options.parent.foobar)
//     console.log('verbose:', options.parent.verbose)
//     var mode = options.setup_mode || "normal"
//     env = env || 'all'
//     console.log('setup for %s env(s) with %s mode in branch %s', env, mode, branch)
}
