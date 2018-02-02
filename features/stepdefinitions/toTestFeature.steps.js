const { Given, When, Then } = require('cucumber')
// const { spy } = require('sinon')
// const { expect } = require('chai')

const deployFeature = require('commands/deploy-feature')

Given(/^the branch ([^\s]+)$/, function(branch) {
  console.log(branch)
  // callback(null, 'pending')
})

Given('the directory is set to dirname', function() {

})

When('I deploy the feature', function () {

})

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
