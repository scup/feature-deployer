const { Before, After } = require('cucumber')
const { expect } = require('chai')
const { stub } = require('sinon')

Before(function () {
  stub(Math, 'random').callsFake(function () {
    return -198.27083333333334
  })
})

After(function cleanFakeClock () {
  this.clock && this.clock.restore()
  Math.random.restore()

  delete require.cache[require.resolve('../../Infra/gitClient/gitClient')]
  delete require.cache[require.resolve('../../Infra/feature-deployer')]
  delete require.cache[require.resolve('commander')]

  expect(this.commandsExecuted.next().value).to.equal(undefined)
})
