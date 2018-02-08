const { Then } = require('cucumber')
const { expect } = require('chai')

Then(/^Repeat the steps above on ([a-z-]+) with tag ([a-z0-9-_]+)$/, function (projectTwo, gitTag) {
  this.validateChangeDirectoryToProject(projectTwo)

  expect(this.commandsExecuted.next().value).to.equal('git pull origin master')

  expect(this.commandsExecuted.next().value).to.equal(`git tag ${gitTag}`)
  expect(this.commandsExecuted.next().value).to.equal(`git push origin ${this.gitTag}`)
})
