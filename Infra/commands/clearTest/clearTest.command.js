const testCommand = require('../test/test.command')
const executeUseCaseForProjects = require('../../../Domain/UseCase/executeUseCaseForProjects')

module.exports = function clearTestCommand (environment, commanderOptions) {
  testCommand(environment, null, commanderOptions)
}
