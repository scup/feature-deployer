const { Then } = require('cucumber')
const { expect } = require('chai')

Then('It downloads the last version of main branch', function switchToMainBranch (callback) {
  expect(this.commandsExecuted.next().value).to.equal('git fetch origin master:master')
})

Then('It switches to last version of branch', function () {
  const [branch] = this.deployCommand()
  this.branch = branch
  expect(this.commandsExecuted.next().value).to.equal(`git fetch ${branch}:${branch}`)
  expect(this.commandsExecuted.next().value).to.equal(`git checkout ${branch}`)
})

Then('It merges with main branch', function (callback) {
  expect(this.commandsExecuted.next().value).to.equal('git merge master')
})

Then('It switches to main branch', function () {
  expect(this.commandsExecuted.next().value).to.equal('git checkout master')
})

Then('It deletes locally the branch', function () {
  expect(this.commandsExecuted.next().value).to.equal(`git branch -d ${this.branch}`)
})

Then(/^It repeats of testing the steps on (.+)$/, function (projectTwo) {
  this.validateChangeDirectoryToProject(projectTwo)

  expect(this.commandsExecuted.next().value).to.equal(`git fetch ${this.branch}:${this.branch}`)
  expect(this.commandsExecuted.next().value).to.equal(`git checkout ${this.branch}`)
  expect(this.commandsExecuted.next().value).to.equal('git merge master')
  expect(this.commandsExecuted.next().value).to.equal('git checkout master')
  expect(this.commandsExecuted.next().value).to.equal(`git branch -d ${this.branch}`)
})
