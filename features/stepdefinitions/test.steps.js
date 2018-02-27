const { Then, Given } = require('cucumber')
const { expect } = require('chai')
const gitClient = require('../../Infra/gitClient/gitClient')

const tagsToDelete = {
  qa: ['test_qa_12129_SCARE-1010', 'test_qa_SUFFIX DOES NOT MATTER', 'test_qa_BYE BYE']
}

Given(/^There are tags on previous releases on environment: (.+)$/, function (environment) {
  this.tagsToDelete = tagsToDelete[environment] || []
  this.environment = environment
  gitClient.tags = this.tagsToDelete.length ? this.tagsToDelete : null
})

Then('It downloads the last version of main branch', function switchToMainBranch () {
  expect(this.commandsExecuted.next().value).to.equal('git fetch origin --tags')
  expect(this.commandsExecuted.next().value).to.equal('git fetch origin master:master')
})

Then(/^It switches to last version of branch (.+)$/, function (branchToTest) {
  this.branch = branchToTest
  expect(this.commandsExecuted.next().value).to.equal(`git fetch origin ${branchToTest}:${branchToTest}`)
  expect(this.commandsExecuted.next().value).to.equal(`git checkout ${branchToTest}`)
})

Then('It merges with main branch', function () {
  expect(this.commandsExecuted.next().value).to.equal('git merge master --no-edit')
})

Then('It cleans previous release test tags on same the environment', function () {
  expect(this.commandsExecuted.next().value).to.equal(`git tag -l 'test_${this.environment}_*'`)

  const { tagsToDelete } = this
  for (const tagToDelete of tagsToDelete) {
    expect(this.commandsExecuted.next().value).to.equal(`git tag -d ${tagToDelete}`)
    expect(this.commandsExecuted.next().value).to.equal(`git push origin :${tagToDelete}`)
  }
})

Then('It switches to main branch', function () {
  expect(this.commandsExecuted.next().value).to.equal('git checkout master')
})

Then('It deletes locally the branch', function () {
  expect(this.commandsExecuted.next().value).to.equal(`git branch -D ${this.branch}`)
})

Then(/^It repeats of testing the steps on ([^\s]+)$/, function (projectTwo) {
  this.validateChangeDirectoryToProject(projectTwo)

  expect(this.commandsExecuted.next().value).to.equal('git fetch origin --tags')
  expect(this.commandsExecuted.next().value).to.equal('git fetch origin master:master')
  expect(this.commandsExecuted.next().value).to.equal(`git fetch origin ${this.branch}:${this.branch}`)
  expect(this.commandsExecuted.next().value).to.equal(`git checkout ${this.branch}`)
  expect(this.commandsExecuted.next().value).to.equal('git merge master --no-edit')
  expect(this.commandsExecuted.next().value).to.equal(`git tag -l 'test_${this.environment}_*'`)
  expect(this.commandsExecuted.next().value).to.equal(`git tag ${this.gitTag}`)
  expect(this.commandsExecuted.next().value).to.equal(`git push origin ${this.gitTag}`)
  expect(this.commandsExecuted.next().value).to.equal('git checkout master')
  expect(this.commandsExecuted.next().value).to.equal(`git branch -D ${this.branch}`)
})

Then(/^It repeats of clear test the steps on ([^\s]+)$/, function (projectTwo) {
  this.validateChangeDirectoryToProject(projectTwo)

  expect(this.commandsExecuted.next().value).to.equal('git fetch origin --tags')
  expect(this.commandsExecuted.next().value).to.equal('git fetch origin master:master')
  expect(this.commandsExecuted.next().value).to.equal(`git tag -l 'test_${this.environment}_*'`)
  expect(this.commandsExecuted.next().value).to.equal(`git tag ${this.gitTag}`)
  expect(this.commandsExecuted.next().value).to.equal(`git push origin ${this.gitTag}`)
  expect(this.commandsExecuted.next().value).to.equal('git checkout master')
})
