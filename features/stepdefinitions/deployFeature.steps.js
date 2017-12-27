const { Given, When, Then } = require('cucumber')
const { spy } = require('sinon')
const { expect } = require('chai')

const deployFeature = require('../../commands/deploy-feature')

function createGit() {
  return {
    raw: () => Promise.resolve(),
    fetch: () => Promise.resolve(),
    checkout: () => Promise.resolve(),
    pull: () => Promise.resolve(),
    branch: () => Promise.resolve({ all: [] }),
    push: () => Promise.resolve(),
    checkoutBranch: () => Promise.resolve(),
    getRemotes: () => Promise.resolve([ { refs: [] } ])
  }
}

function createChalk() {
  const chalk = {
    yellow: spy(),
    green: spy()
  }
  chalk.bold = chalk

  return chalk
}

Given('there is a feature {string}', (feature) => {
  this.options = { feature }
})

Given('the directory is set to {string}', (dirname) => {
  this.options.dirname = dirname
});

When('I deploy the feature', () => {
  this.git = createGit()
  this.chalk = createChalk()

  this.injection = {
    gitPromissified: () => this.git,
    chalk: this.chalk,
    log: () => ({})
  }

  return deployFeature(this.options, this.injection)
})

Then('the QA branch becomes {string}', (qaBranch) => {
  expect(this.chalk.green.args[2][0]).to.equal(qaBranch)
})

Then('the feature is not sent to RC', () => {
  //  TODO: get URL
  expect(this.chalk.green.args[4][0]).to.not.equal('url')
})

Then('the feature is not repproved', () => {
  expect(this.chalk.green.args[4][0]).to.not.equal('REPROVED')
})
