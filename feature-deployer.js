#!/usr/bin/env node

const chalk = require('chalk')
const commander = require('commander')

const packageData = require('./package.json')

commander
  .version(packageData.version)
  .option('--dirname [name]', 'Set git directory', /^.*$/i, __dirname)
  .option('-d, --deploy-feature', 'Deploy feature to Test')
  .option('-a, --approve-feature', 'Approve feature')
  .option('-r, --repprove-feature', 'Repprove feature')
  .parse(process.argv)

const deployFeature = require('./commands/deploy-feature')

const [feature] = commander.args

const options = {
  dirname: commander.dirname,
  feature,
  approve: commander.approveFeature,
  repprove: commander.repproveFeature
}

deployFeature(options)
  .catch(handleError)

function handleError (error) {
  console.log(chalk.red('%s'), error)
}
