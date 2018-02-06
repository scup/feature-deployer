const { Given, When, Then } = require('cucumber')
const { useFakeTimers } = require('sinon')
const { expect } = require('chai')

Given('Now is {int}', function (timestamp) {
  this.clock = useFakeTimers(timestamp)
})

When(/^I execute the command feature-deployer (.+)$/, async function (command) {
  this.deployCommand = command.split(' ')
  const featureDeployer = require('../../Infra/feature-deployer')
  const commands = await featureDeployer(['node', 'feature-deployer'].concat(this.deployCommand))

  this.commandsExecuted = commands[Symbol.iterator]()
})

function validateChangeDirectoryToProject (projectPath) {
  const changeDirectoryCommand = this.commandsExecuted.next().value
  expect(changeDirectoryCommand).to.match(/^cd \/.+/)
  expect(changeDirectoryCommand).to.match(new RegExp(`${projectPath}$`))

  this.validateChangeDirectoryToProject = validateChangeDirectoryToProject
}

Then(/^It uses directory of (.+)$/, validateChangeDirectoryToProject)
