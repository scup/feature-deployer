#!/usr/bin/env node

const commander = require("commander")
const simpleGit = require("simple-git")(__dirname)

program
  .version('0.1.0')
  .option('-df, --deploy-feature', 'Deploy feature to Test')
  .option('-af, --approve-feature', 'Approve feature')
  .option('-rf, --repprove-feature', 'Repprove feature')
  .parse(process.argv)

if(program.deployFeature) {
  simpleGit
  .branch(['-lr'], (branchs) => {
    console.log(branchs)
  })
  .fetch('origin', program.deployFeature, (fetchResult) => {
    console.log(fetchResult)
  })
}
