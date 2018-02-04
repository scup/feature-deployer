const { Given, When, Then } = require('cucumber')
const { useFakeTimers } = require('sinon')
const { expect } = require('chai')

const featureDeployer = require('../../Infra/feature-deployer')
const { getExecution } = require('../../Infra/gitClient')

Given('Now is {int}', function (timestamp) {
  this.clock = useFakeTimers(timestamp)
})

async function executeCommandStep (command) {
  await featureDeployer(['node', 'feature-deployer'].concat(command.split(' ')))
  this.commandsExecuted = getExecution()
}

When(/^I execute the command (deploy[\s-][^\s]+) to deploy$/, executeCommandStep)
When(/^I execute the command (deploy[\s-][^\s]+ [^\s]+) to deploy$/, executeCommandStep) // with description argument

Then('It switches to main branch', function () {
  expect(this.commandsExecuted.next().value).to.equal('git checkout master')
})

Then('It downloads the last version of the code', function () {
  expect(this.commandsExecuted.next().value).to.equal('git pull origin master')
})

Then(/^Create the tag (.+)$/, function (gitTag, callback) {
  // console.log('#'.repeat(80))
  // console.log(gitTag)
  // console.log('#'.repeat(80))
  callback(null, 'pending')
})

Then('Upload the created tag to server', function (callback) {
  callback(null, 'pending')
})
// deploy rc
// deploy rc description
// deploy-rc
// deploy staging
// deploy-prod description

// Given(/^the branch ([^\s]+)$/, function(branch) {
//   console.log(branch)
//   // callback(null, 'pending')
// })
//
// Given('the directory is set to dirname', function() {
//
// })
//
// When('I deploy the feature', function () {
//
// })

// function createGit() {
//   const remote = {
//     refs: {
//       fetch: 'fetch'
//     }
//   }
//
//   return {
//     raw: () => Promise.resolve(),
//     fetch: () => Promise.resolve(),
//     checkout: () => Promise.resolve(),
//     pull: () => Promise.resolve(),
//     branch: () => Promise.resolve({ all: [] }),
//     push: () => Promise.resolve(),
//     checkoutBranch: () => Promise.resolve(),
//     getRemotes: () => Promise.resolve([ remote ])
//   }
// }
//
// function createChalk() {
//   const chalk = {
//     yellow: spy(),
//     green: spy()
//   }
//   chalk.bold = chalk
//
//   return chalk
// }
//
// function prepareDeploy(test) {
//   test.git = createGit()
//   test.chalk = createChalk()
//
//   test.injection = {
//     gitPromissified: () => test.git,
//     chalk: test.chalk,
//     log: () => ({})
//   }
// }

// Given('there is a feature {string}', (feature) => {
//   this.options = { feature }
// })
//
// Given('the directory is set to {string}', (dirname) => {
//   this.options.dirname = dirname
// })
//
// When('I deploy the feature', () => {
//   prepareDeploy(this)
//
//   return deployFeature(this.options, this.injection)
// })
//
// When('I approve the feature', () => {
//   prepareDeploy(this)
//
//   this.options.approve = true
//
//   return deployFeature(this.options, this.injection)
// })
//
// Then('the QA branch becomes {string}', (qaBranch) => {
//   expect(this.chalk.green.args[2][0]).to.equal(qaBranch)
// })
//
// Then('the feature is not sent to RC', () => {
//   expect(this.chalk.green.args[4][0]).to.not.equal('https://bitbucket.org/fetch/pull-requests/new?source=SCARY&t=1')
// })
//
// Then('the feature is not repproved', () => {
//   expect(this.chalk.green.args[4][0]).to.not.equal('REPROVED')
// })
//
// Then('a link is created to RC', () => {
//   expect(this.chalk.green.args[4][0]).to.equal('https://bitbucket.org/fetch/pull-requests/new?source=SCARY&t=1')
//  })
