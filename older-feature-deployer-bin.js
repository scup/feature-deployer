#!/usr/bin/env node

const chalk = require('chalk')
const commander = require('commander')

const packageData = require('./package.json')

const BRANCHES = process.env.FEATURES_UNDER_TEST || 3

commander
  .version(packageData.version)
  .option('--dirname [name]', 'Set git directory', /^.*$/i, __dirname)
  .option('-d, --deploy-feature', 'Deploy feature to Test')
  .option('-a, --approve-feature', 'Approve feature')
  .option('-r, --repprove-feature', 'Repprove feature')
  .parse(process.argv)

const deployFeature = require('./Infra/commands/deploy-feature')

const [feature, maxBranches] = commander.args

const options = {
  dirname: commander.dirname,
  feature,
  approve: commander.approveFeature,
  repprove: commander.repproveFeature,
  maxBranches: Number(maxBranches)
}

if (isNaN(options.maxBranches)) {
  options.maxBranches = BRANCHES
}

deployFeature(options)
  .catch(handleError)

function handleError (error) {
  console.log(chalk.red('%s'), error)
}
