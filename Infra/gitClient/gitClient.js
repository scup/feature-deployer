const gitPromisified = require('simple-git/promise')
const path = require('path')

const environment = require('../configuration/environment')

const dependencies = {
  gitPromisified,
  path,
  addCommandOnLog: noop,
  isProduction: process.env.NODE_ENV !== 'test'
}

const executeGitCommandForEnvironment = {
  production: executeGitCommand,
  test: noop
}

const baseDirectory = process.cwd()
const gitClient = {
  baseDirectory,
  git: gitPromisified(baseDirectory),
  executeGitCommand: executeGitCommandForEnvironment[environment],
  async applyGitCommand (gitParameters, { dontFail }, injection) {
    const { addCommandOnLog } = Object.assign({}, dependencies, injection)

    addCommandOnLog(`git ${gitParameters.join(' ')}`)

    try {
      return gitClient.executeGitCommand(gitParameters)
    } catch (error) {
      if (!dontFail) {
        return Promise.reject(error)
      }
    }
  }
}

const gitClientApi = {
  changeDirectory (gitDirectory, injection) {
    const { addCommandOnLog, gitPromisified, path, isProduction } = Object.assign({}, dependencies, injection)
    const directoryResolved = path.resolve(gitClient.baseDirectory, gitDirectory)
    addCommandOnLog(`cd ${directoryResolved}`)

    if (isProduction) {
      gitClient.git = gitPromisified(directoryResolved)
      gitClient.executeGitCommand = executeGitCommand
    }
  },

  async fetch (remote, branch, injection) {
    const fetchBranch = `${branch}:${branch}`
    return gitClient.applyGitCommand(['fetch', remote, fetchBranch], {}, injection)
  },

  async push (remote, branchOrTag, injection) {
    return gitClient.applyGitCommand(['push', remote, branchOrTag], {}, injection)
  },

  async checkout (branchOrTag, injection) {
    return gitClient.applyGitCommand(['checkout', branchOrTag], {}, injection)
  },

  async tag (tagDescription, injection) {
    return gitClient.applyGitCommand(['tag', tagDescription], {}, injection)
  },

  async fetchTags (remote, injection) {
    return gitClient.applyGitCommand(['fetch', remote, '--tags'], {}, injection)
  },

  async merge (branch, injection) {
    return gitClient.applyGitCommand(['merge', branch, '--no-edit'], {}, injection)
  },

  async deleteBranchLocally (branch, injection) {
    return gitClient.applyGitCommand(['branch', '-D', branch], { dontFail: true }, injection)
  },

  async listTags ({ preffix }, injection) {
    const { isProduction, addCommandOnLog } = Object.assign({}, dependencies, injection)

    addCommandOnLog(`git tag -l '${preffix}*'`)

    if (!isProduction) return gitClientApi.tags

    const { all } = await gitClient.git.tags()
    const tags = all.filter(filterByPreffix, { preffix })
    return tags.length ? tags : null
  },

  async deleteTag (origin, tagToDelete, injection) {
    await gitClient.applyGitCommand(['tag', '-d', `${tagToDelete}`], { dontFail: true }, injection)
    await gitClient.applyGitCommand(['push', origin, `:${tagToDelete}`], { dontFail: true }, injection)
  }
}

module.exports = gitClientApi

function filterByPreffix (tag) {
  return tag.startsWith(this.preffix)
}

function executeGitCommand (parameters) {
  return gitClient.git.raw(parameters)
}

function noop () {}
