const { Then } = require('cucumber')
const { expect } = require('chai')

Then('It switches to last version of main branch', function switchToMainBranch () {
  expect(this.commandsExecuted.next().value).to.equal('git pull origin master')
})

Then(/^It creates the tag (.+)$/, function (gitTag) {
  this.gitTag = gitTag
  expect(this.commandsExecuted.next().value).to.equal(`git tag ${gitTag}`)
})

Then('It uploads the created tag to server', function () {
  expect(this.commandsExecuted.next().value).to.equal(`git push origin ${this.gitTag}`)
})

Then('It switches to the tag release', function () {
  const lastRcGitTag = this.deployCommand.pop()
  expect(this.commandsExecuted.next().value).to.equal(`git fetch origin --tags`)
  expect(this.commandsExecuted.next().value).to.equal(`git checkout ${lastRcGitTag}`)
})
