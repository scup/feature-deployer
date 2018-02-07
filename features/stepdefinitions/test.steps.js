const { Then } = require('cucumber')
const { expect } = require('chai')

Then(/^It switches to last version of branch (.+)$/, function (branchToTest) {
  this.branch = branchToTest
  expect(this.commandsExecuted.next().value).to.equal(`git fetch origin ${branchToTest}:${branchToTest}`)
  expect(this.commandsExecuted.next().value).to.equal(`git checkout ${branchToTest}`)
})

Then('It downloads the last version of main branch', function switchToMainBranch () {
  expect(this.commandsExecuted.next().value).to.equal(`git branch -D master`)
  expect(this.commandsExecuted.next().value).to.equal('git fetch origin master:master')
})

Then('It merges with main branch', function () {
  expect(this.commandsExecuted.next().value).to.equal('git merge master --no-edit')
})

Then('It switches to main branch', function () {
  expect(this.commandsExecuted.next().value).to.equal('git checkout master')
})

Then('It deletes locally the branch', function () {
  expect(this.commandsExecuted.next().value).to.equal(`git branch -D ${this.branch}`)
})

Then(/^It repeats of testing the steps on (.+)$/, function (projectTwo) {
  this.validateChangeDirectoryToProject(projectTwo)

  expect(this.commandsExecuted.next().value).to.equal(`git fetch ${this.branch}:${this.branch}`)
  expect(this.commandsExecuted.next().value).to.equal(`git checkout ${this.branch}`)
  expect(this.commandsExecuted.next().value).to.equal(`git branch -d master`)
  expect(this.commandsExecuted.next().value).to.equal('git fetch origin master:master')
  expect(this.commandsExecuted.next().value).to.equal('git merge master --no-edit')
  expect(this.commandsExecuted.next().value).to.equal('git checkout master')
  expect(this.commandsExecuted.next().value).to.equal(`git branch -d ${this.branch}`)
})
