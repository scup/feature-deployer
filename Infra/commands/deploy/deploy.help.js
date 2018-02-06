const chalk = require('chalk')
const getNowDateFormatted = require('../../../Domain/getNowDateFormatted')

function deployFixedEnvironmentCommandHelp (fixedEnvironment) {
  const now = new Date()
  console.log('')
  console.log('  Examples:')
  console.log()
  console.log(`    $ feature-deployer deploy-${fixedEnvironment}`)
  console.log(chalk.green(`      -- It would generate a release called release_${fixedEnvironment}_${getNowDateFormatted(now)}`))
  console.log(`    $ feature-deployer deploy-${fixedEnvironment} onboarding`)
  console.log(chalk.green(`      -- It would generate a release called release_${fixedEnvironment}_${getNowDateFormatted(now)}_onboarding`))
  console.log()
}

function deployHelp () {
  console.log('')
  console.log('  Examples:')
  console.log('   if the deploy is to production specify the whole tag')
  console.log()
  console.log('    $ feature-deployer deploy rc onboarding')
  console.log(chalk.green(`      -- It would generate a release called release_rc_${getNowDateFormatted()}_onboarding`))
  console.log()
  console.log('    $ feature-deployer deploy staging')
  console.log(chalk.green(`      -- It would generate a release called release_staging_${getNowDateFormatted()}`))
  console.log(chalk.yellow(`      -- 🔔  the environment parameter depends on the CI`))
  console.log()
}

deployHelp.deployFixedEnvironmentCommandHelp = deployFixedEnvironmentCommandHelp

module.exports = deployHelp
