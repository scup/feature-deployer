const { After } = require('cucumber')
const { expect } = require('chai')

After(function cleanFakeClock () {
  this.clock && this.clock.restore()

  delete require.cache[require.resolve('../../Infra/gitClient/gitClient')]
  delete require.cache[require.resolve('../../Infra/feature-deployer')]
  delete require.cache[require.resolve('commander')]

  expect(this.commandsExecuted.next().value).to.equal(undefined)
})
