
describe('gitClient', function () {
  const { expect } = require('chai')
  const { lorem, system } = require('faker')
  const { mock, assert } = require('sinon')
  const gitClient = require('./gitClient')

  context('workingon a git in a directory', function () {
    beforeEach(function() {
      const gitDirectory = lorem.word()
      const gitFullDirectoryPath = lorem.word()
      const baseDirectory = process.cwd()
      const git = {
        raw: mock('git.raw').resolves()
      }

      const dependencies = {
        isProduction: true,
        gitPromisified: mock('gitPromisified').withExactArgs(gitFullDirectoryPath).returns(git),
        path: {
          resolve: mock('path.resolve').withExactArgs(baseDirectory, gitDirectory).returns(gitFullDirectoryPath)
        }
      }

      Object.assign(this, {
        git,
        remote: lorem.word(),
        branchOrTag: lorem.word(),
        tagDescription: lorem.word()
      }, dependencies)

      gitClient.changeDirectory(gitDirectory, dependencies)
    })

    it('pulls on git', async function () {
      const { remote, branchOrTag, git: { raw } } = this
      await gitClient.pull(remote, branchOrTag)
      assert.calledOnce(raw)
      assert.calledWithExactly(raw, ['pull', remote, branchOrTag])
    })

    it('pushes on git', async function () {
      const { remote, branchOrTag, git: { raw } } = this
      await gitClient.push(remote, branchOrTag)
      assert.calledOnce(raw)
      assert.calledWithExactly(raw, ['push', remote, branchOrTag])
    })

    it('checkouts on git', async function () {
      const { branchOrTag, git: { raw } } = this
      await gitClient.checkout(branchOrTag)
      assert.calledOnce(raw)
      assert.calledWithExactly(raw, ['checkout', branchOrTag])
    })

    it('checkouts on git', async function () {
      const { tagDescription, git: { raw } } = this
      await gitClient.tag(tagDescription)
      assert.calledOnce(raw)
      assert.calledWithExactly(raw, ['tag', tagDescription])
    })

    it('fetch the tags on git', async function () {
      const { remote, git: { raw } } = this
      await gitClient.fetchTags(remote)
      assert.calledOnce(raw)
      assert.calledWithExactly(raw, ['fetch', remote, '--tags'])
    })
  })
})
