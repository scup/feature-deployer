#!/usr/bin/env node

const chalk = require('chalk')
const program = require('commander')

const packageData = require('./package.json')

program
  .version(packageData.version)

program.foobar = '2'

function a (_, t) {
  return t + 1
}

program
  .option('-C, --chdir <path>', 'change the working directory')
  .option('-c, --config <path>', 'set config path. defaults to ./deploy.conf')
  .option('-T, --no-tests', 'ignore test hook', )
  .option('-v, --verbose', 'A value that can be increased', a.bind(program), 0)

program
  .command('setup [b] [env] [bla]')
  .description('run setup commands for all envs')
  .option("-s, --setup_mode [mode]", "Which setup mode to use")
  .action(function(branch, env, bla, options){
    console.log('foobar:', options.parent.foobar)
    console.log('verbose:', options.parent.verbose)
    var mode = options.setup_mode || "normal"
    env = env || 'all'
    console.log('setup for %s env(s) with %s mode in branch %s', env, mode, branch)
  })

program
  .command('exec <cmd>')
  .alias('ex')
  .description('execute the given remote cmd')
  .option("-e, --exec_mode <mode>", "Which exec mode to use")
  .action(function(cmd, options){
    console.log('exec "%s" using %s mode', cmd, options.exec_mode)
  }).on('--help', function() {
    console.log()
    console.log('  Examples:')
    console.log()
    console.log('    $ deploy exec sequential')
    console.log('    $ deploy exec async')
    console.log()
  })

program
  .command('*')
  .action(function(){
    const options = Array.from(arguments).pop()
    // console.log(chalk.red('a'))
    console.log(chalk.keyword('orange')('Yay for orange colored text!'))
    options.parent.help()
  })

module.exports = function (consoleArguments) {
  program.parse(consoleArguments)
}

  // commander
  //   .command('rm <dir>')
  //   .option('-r, --recursive', 'Remove recursively')
  //   .action(function (dir, cmd) {
  //     console.log('remove ' + dir + (cmd.recursive ? ' recursively' : ''))
  //   })
  // commander.parse(process.argv)

// const deployFeature = require('./commands/deploy-feature')
//
// const [feature, maxBranches] = commander.args
//
// const options = {
//   dirname: commander.dirname,
//   feature,
//   approve: commander.approveFeature,
//   repprove: commander.repproveFeature,
//   maxBranches: Number(maxBranches)
// }
//
// if (isNaN(options.maxBranches)) {
//   options.maxBranches = BRANCHES
// }
//
// deployFeature(options)
//   .catch(handleError)
//
// function handleError (error) {
//   console.log(chalk.red('%s'), error)
// }
