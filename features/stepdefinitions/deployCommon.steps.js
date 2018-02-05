const { Given, When } = require('cucumber')
const { useFakeTimers } = require('sinon')

Given('Now is {int}', function (timestamp) {
  this.clock = useFakeTimers(timestamp)
})

When(/^I execute the command feature-deployer (.+)$/, async function (command) {
  const featureDeployer = require('../../Infra/feature-deployer')
  await featureDeployer(['node', 'feature-deployer'].concat(command.split(' ')))
  this.commandsExecuted = require('../../Infra/gitClient').getExecution()
})
