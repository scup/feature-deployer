#!/usr/bin/env node

const commander = require("commander")
const simpleGit = require("simple-git")(__dirname)

commander
  .version('0.1.0')
  .option('-d, --deploy-feature', 'Deploy feature to Test')
  .option('-a, --approve-feature', 'Approve feature')
  .option('-r, --repprove-feature', 'Repprove feature')
  .parse(process.argv)

if(commander.deployFeature) {
  simpleGit
  .branch(['-lr'], (error, branchs) => {
    console.log('#####', branchs)
  })
  .fetch('origin', commander.deployFeature, (error, fetchResult) => {
    console.log(fetchResult)
  })
}
