const gitPromisified = require('simple-git/promise')
const path = require('path')

const environment = require('../configuration/environment')

const executeGitCommandForEnvironment = {
  production: executeGitCommand,
  test: noop
}

const baseDirectory = process.cwd()
const gitClient = {
  baseDirectory,
  git: gitPromisified(baseDirectory),
  executeGitCommand: executeGitCommandForEnvironment[environment]
}

const dependencies = {
  gitPromisified,
  path,
  addCommandOnLog: noop,
  isProduction: process.env.NODE_ENV !== 'test'
}

module.exports = {
  changeDirectory (gitDirectory, injection) {
    const { addCommandOnLog, gitPromisified, path, isProduction } = Object.assign({}, dependencies, injection)
    const directoryResolved = path.resolve(gitClient.baseDirectory, gitDirectory)
    addCommandOnLog(`cd ${directoryResolved}`)

    if (isProduction) {
      gitClient.git = gitPromisified(directoryResolved)
      gitClient.executeGitCommand = executeGitCommand
    }
  },

  async pull (remote, branch, injection) {
    const { addCommandOnLog } = Object.assign({}, dependencies, injection)
    addCommandOnLog(`git pull ${remote} ${branch}`)
    await gitClient.executeGitCommand(['pull', remote, branch])
  },

  async push (remote, branchOrTag, injection) {
    const { addCommandOnLog } = Object.assign({}, dependencies, injection)
    addCommandOnLog(`git push ${remote} ${branchOrTag}`)
    await gitClient.executeGitCommand(['push', remote, branchOrTag])
  },

  async checkout (branchOrTag, injection) {
    const { addCommandOnLog } = Object.assign({}, dependencies, injection)
    addCommandOnLog(`git checkout ${branchOrTag}`)
    await gitClient.executeGitCommand(['checkout', branchOrTag])
  },

  async tag (tagDescription, injection) {
    const { addCommandOnLog } = Object.assign({}, dependencies, injection)
    addCommandOnLog(`git tag ${tagDescription}`)
    await gitClient.executeGitCommand(['tag', tagDescription])
  }
}

function executeGitCommand(parameters) {
  return gitClient.git.raw(parameters)
}

function noop () {}
