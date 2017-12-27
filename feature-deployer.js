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

if (commander.deployFeature) {
  deployFeature(commander.dirname, feature)
    .catch(handleError)
}

if (commander.approveFeature) {
  deployFeature(commander.dirname, feature, true)
    .catch(handleError)
}

if (commander.repproveFeature) {
  deployFeature(commander.dirname, feature, false, true)
    .catch(handleError)
}

function handleError (error) {
  console.log(chalk.red('%s'), error)
}
