const testCommand = require('../test/test.command')

module.exports = function clearTestCommand (environment, commanderOptions) {
  testCommand(null, environment, commanderOptions)
}
