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
When(/^I execute the command (deploy[\s-][^\s]+ [^\s]+) to deploy$/, executeCommandStep) // with deploy description argument

Then('It switches to main branch', function () {
  expect(this.commandsExecuted.next().value).to.equal('git checkout master')
})

Then('It downloads the last version of the code', function () {
  expect(this.commandsExecuted.next().value).to.equal('git pull origin master')
})

Then(/^Create the tag (.+)$/, function (gitTag) {
  this.gitTag = gitTag
  expect(this.commandsExecuted.next().value).to.equal(`git tag ${gitTag}`)
})

Then('Upload the created tag to server', function () {
  expect(this.commandsExecuted.next().value).to.equal(`git push origin ${this.gitTag}`)
})
