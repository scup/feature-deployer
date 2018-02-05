const { Then } = require('cucumber')
const { expect } = require('chai')

function validateChangeDirectoryToProject (projectPath) {
  const changeDirectoryCommand = this.commandsExecuted.next().value
  expect(changeDirectoryCommand).to.match(/^cd \/.+/)
  expect(changeDirectoryCommand).to.match(new RegExp(`${projectPath}$`))
}

Then(/^It uses directory of (.+)$/, validateChangeDirectoryToProject)

Then(/^Repeat the steps above on ([a-z-]+) with tag ([a-z0-9_]+)$/, function (projectTwo, gitTag) {
  validateChangeDirectoryToProject.call(this, projectTwo)

  expect(this.commandsExecuted.next().value).to.equal('git checkout master -f')
  expect(this.commandsExecuted.next().value).to.equal('git pull origin master')

  expect(this.commandsExecuted.next().value).to.equal(`git tag ${gitTag}`)
  expect(this.commandsExecuted.next().value).to.equal(`git push origin ${this.gitTag}`)
})
