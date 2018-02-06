const { Then } = require('cucumber')
const { expect } = require('chai')

Then(/^Repeat the steps above on ([a-z-]+) with tag ([a-z0-9_]+)$/, function (projectTwo, gitTag) {
  this.validateChangeDirectoryToProject(projectTwo)

  expect(this.commandsExecuted.next().value).to.equal('git fetch origin master:master')
  expect(this.commandsExecuted.next().value).to.equal('git checkout master')

  expect(this.commandsExecuted.next().value).to.equal(`git tag ${gitTag}`)
  expect(this.commandsExecuted.next().value).to.equal(`git push origin ${this.gitTag}`)
})
