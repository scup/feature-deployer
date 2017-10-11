#!/usr/bin/env node

const chalk = require('chalk')
const commander = require('commander')

const packageData = require('./package.json')

commander
  .version(packageData.version)
  .option('--dirname [name]', 'Set git directory', /^.*$/i, __dirname)
  .option('-d, --deploy-feature [name]', 'Deploy feature to Test')
  .option('-a, --approve-feature [name]', 'Approve feature')
  .option('-r, --repprove-feature [name]', 'Repprove feature')
  .parse(process.argv)

const deployFeature = require('./commands/deploy-feature')

if (commander.deployFeature) {
  deployFeature(commander.dirname, commander.deployFeature)
    .catch(handleError)
}

if (commander.approveFeature) {
  deployFeature(commander.dirname, commander.approveFeature, true)
    .catch(handleError)
}

if (commander.repproveFeature) {
  deployFeature(commander.dirname, commander.repproveFeature, false, true)
    .catch(handleError)
}

function handleError (error) {
  console.log(chalk.red('%s'), error)
}
