const { Then, Given } = require('cucumber')
const { mock } = require('sinon')
const { expect } = require('chai')
const gitClient = require('../../Infra/gitClient/gitClient')
const tagFixture = require('../../Infra/gitClient/tag.fixture')

Given('There are tags on repositories', function () {
  const tags = tagFixture.buildList(2)
  tags[0].tagname = 'release_production_dateNOW'
  tags[1].tagname = 'release_production_dateNOW'
  tags[0].refname = 'refs/tags/release_production_dateNOW'
  tags[1].refname = 'refs/tags/release_production_dateNOW'
  const git = {
    raw: mock('git.raw')
      .atLeast(1)
      .onFirstCall().resolves(tags.map(tagFixture.toGitTag).join('\n'))
      .onSecondCall().resolves([])
  }

  const gitDirectory = process.cwd()

  const dependencies = {
    isProduction: true,
    randomSeparator: '#',
    gitPromisified: mock('gitPromisified').withExactArgs(gitDirectory).returns(git),
    path: {
      resolve: mock('path.resolve').withExactArgs(process.cwd(), 'gitDirectory').returns(gitDirectory)
    }
  }

  Object.assign(this, { git }, dependencies)

  gitClient.changeDirectory('gitDirectory', dependencies)
})

Then('It list tags on that environment of current project', function () {
  expect(this.commandsExecuted.next().value)
    .to.equal('git for-each-ref --sort=-taggerdate --format=%(refname)#%(authordate)#%(authorname)#%(authoremail) --count=100 refs/tags')
})

Then('It list tags on that environment on scup-care-front and scup-care', function () {
  validateChangeDirectoryToProject(this.commandsExecuted.next().value, 'scup-care-front')
  expect(this.commandsExecuted.next().value)
    .to.equal('git for-each-ref --sort=-taggerdate --format=%(refname)#%(authordate)#%(authorname)#%(authoremail) --count=100 refs/tags')

  validateChangeDirectoryToProject(this.commandsExecuted.next().value, 'scup-care-front')
  expect(this.commandsExecuted.next().value)
    .to.equal('git for-each-ref --sort=-taggerdate --format=%(refname)#%(authordate)#%(authorname)#%(authoremail) --count=100 refs/tags')
})

function validateChangeDirectoryToProject (command, projectPath) {
  expect(command).to.match(/^cd \/.+/)
  expect(command).to.match(new RegExp(`${projectPath}$`))
}
