const { After } = require('cucumber')

After(function cleanFakeClock () {
  this.clock && this.clock.restore()
})
