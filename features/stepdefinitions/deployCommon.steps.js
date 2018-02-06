const { Given, When } = require('cucumber')
const { useFakeTimers } = require('sinon')

Given('Now is {int}', function (timestamp) {
  this.clock = useFakeTimers(timestamp)
})

When(/^I execute the command feature-deployer (.+)$/, async function (command) {
  this.deployCommand = command.split(' ')
  const featureDeployer = require('../../Infra/feature-deployer')
  const commands = await featureDeployer(['node', 'feature-deployer'].concat(this.deployCommand))

  this.commandsExecuted = commands[Symbol.iterator]()
})
