describe('gitClient', function () {
  const { lorem } = require('faker')
  const { expect } = require('chai')
  const { mock, assert } = require('sinon')
  const gitClient = require('./gitClient')

  context('workingon a git in a directory', function () {
    beforeEach(function () {
      const gitDirectory = lorem.word()
      const gitFullDirectoryPath = lorem.word()
      const baseDirectory = process.cwd()
      const git = {
        raw: mock('git.raw').atLeast(1).resolves()
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

    it('fetchs an branch on git', async function () {
      const { remote, branchOrTag, git: { raw } } = this
      await gitClient.fetch(remote, branchOrTag)
      assert.calledOnce(raw)
      assert.calledWithExactly(raw, ['fetch', remote, `${branchOrTag}:${branchOrTag}`])
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

    it('creates a tag on git', async function () {
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

    it('merges with branch on git', async function () {
      const { branchOrTag, git: { raw } } = this
      await gitClient.merge(branchOrTag)
      assert.calledOnce(raw)
      assert.calledWithExactly(raw, ['merge', branchOrTag, '--no-edit'])
    })

    it('fails on merging branch fails', function (done) {
      this.git.raw = mock('git.raw::failing').throws('Error')
      const { branchOrTag, git: { raw } } = this

      gitClient.merge(branchOrTag)
        .then(done.bind(null, 'The call to git.raw failed and the error was not thrown'))
        .catch(() => done())
    })

    it('deletes branch locally ', async function () {
      const { branchOrTag, git: { raw } } = this
      await gitClient.deleteBranchLocally(branchOrTag)
      assert.calledOnce(raw)
      assert.calledWithExactly(raw, ['branch', '-D', branchOrTag])
    })

    it('does not fail when delete branch locally fails', function (done) {
      this.git.raw = mock('git.raw::failing').throws('Error')
      const { branchOrTag, git: { raw } } = this

      gitClient.deleteBranchLocally(branchOrTag)
        .then(done)
        .catch(done.bind(null, 'The call to git.raw failed and it was not skipped'))
    })

    it('deletes the tag on local and on remote on git', async function () {
      const { branchOrTag, remote, git: { raw } } = this
      await gitClient.deleteTag(remote, branchOrTag)
      assert.calledTwice(raw)
      assert.calledWithExactly(raw, ['tag', '-d', branchOrTag])
      assert.calledWithExactly(raw, ['push', remote, `:${branchOrTag}`])
    })

    it('does not fail when delete tag fails', function (done) {
      this.git.raw = mock('git.raw::failing').throws('Error')
      const { branchOrTag, remote, git: { raw } } = this

      gitClient.deleteBranchLocally(remote, branchOrTag)
        .then(done)
        .catch(done.bind(null, 'The call to git.raw failed and it was not skipped'))
    })

    it('list tags filtering by preffix', async function () {
      this.git.tags = mock('git.tags').withExactArgs().resolves({
        all: [
          'non_preffixed',
          'preffixed_correctly',
          'prefixed_wrong',
          'preffixed_right',
          'preffixedalmost_right'
        ]
      })
      const tagsFiltered = await gitClient.listTags({ preffix: 'preffixed_' }, { isProduction: true })
      expect(tagsFiltered).to.deep.equal(['preffixed_correctly', 'preffixed_right'])
    })

    it('returns null when no tags are found with preffix', async function () {
      this.git.tags = mock('git.tags').withExactArgs().resolves({
        all: [
          'non_preffixed',
          'preffixed_correctly',
          'prefixed_wrong',
          'preffixed_right',
          'preffixedalmost_right'
        ]
      })
      const tagsFiltered = await gitClient.listTags({ preffix: 'preffixed_empty_' }, { isProduction: true })
      expect(tagsFiltered).to.equal(null)
    })
  })
})
